const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PackageModel = require("../../models/packages");
const User = require("../../models/user");
const Txn = require("../../models/transaction");
const SiteConfig = require("../../models/siteconfig");
const SkillModel = require("../../models/lmsskill");
const LearningPathModel = require("../../models/learningpath");
const PurchaseModules = require("../../models/purchasemodules");
const OrderModel = require("../../models/rewarsdorder");
const ProductModel = require("../../models/products");
const GoalModel = require("../../models/goals");
const LevelModel = require("../../models/levels");
const PlanModel = require("../../models/plans");
const sendEmail = require("../../Mail/emailSender");
const JobModel = require("../../models/jobs");

class Checkout {

    async createpayment(req, res){

        try {

            const { key } = req.params;
            const { type, job_paid, job_boost } = req.query;
            const userId = req.user.userId;
            const user = await User.findOne({_id:userId});

            if(type === 'subscription'){

                const getPlan = await PlanModel.findById(key);

                if(getPlan){

                    if(getPlan.plan_price > 0){

                        if(user.subscription_status && user.subscription_id){

                            const subscription = await stripe.subscriptions.retrieve(
                                user.subscription_id
                            );

                            if(subscription){

                                let PriceId;

                                const priceList = await stripe.prices.list({
                                    limit: 100,
                                });

                                const match = priceList.data.find(
                                    (p) => p.unit_amount === (getPlan.plan_price * 100)
                                );

                                if (match) {
                                    PriceId = match.id;
                                } else {
                                    // Create product or handle not found
                                    const price = await stripe.prices.create({
                                        currency: 'usd',
                                        unit_amount: (getPlan.plan_price*100),
                                        recurring: {
                                          interval: 'month',
                                        },
                                        product_data: {
                                          name: getPlan.plan_name,
                                          //description: `$${getPlan.plan_price}/per month subscription of ${getPlan.plan_name} for convenient transfers.`
                                        },
                                    });

                                    PriceId = price.id;
                                }

                                const update_subscription = await stripe.subscriptions.update(
                                    subscription.id,
                                    {
                                        cancel_at_period_end:false,
                                        proration_behavior: 'none', // This can be set to 'none' to avoid prorations create_prorations
                                        items: [
                                            {
                                                id: subscription.items.data?.[0].id,
                                                price: PriceId
                                            },
                                        ],
                                    }
                                );

                                user.subscription_status = true;
                                user.plan_id = getPlan._id;
                                user.plan_key = getPlan.plan_key;

                                await user.save();

                                const updatedUser = await User.findById(user._id).populate('plan_id','plan_analytics plan_boosted plan_job plan_key plan_matches plan_name').lean(); // lean() = plain JS object

                                updatedUser.profile_image =  process.env.MEDIA_URL+'avtar/'+(updatedUser.profile_image?updatedUser.profile_image:'default-user.png');
                                updatedUser.company_logo = process.env.MEDIA_URL+'avtar/'+(updatedUser.company_logo?updatedUser.company_logo:'default-user.png');

                                await handleJobs(updatedUser);

                                return res.status(200).json({status: true, data: updatedUser, subscribed:true, message: 'Your subscription updated successfully.'});
                            }

                        }else{

                            const payload = {
                                ui_mode: 'embedded',
                                line_items: [
                                    {
                                        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                                        price_data: {
                                            currency:'usd',
                                            product_data:{
                                                name:getPlan.plan_name,
                                                description: `$${getPlan.plan_price}/per month subscription of ${getPlan.plan_name} for convenient transfers.`,
                                                //images:[`${process.env.MEDIA_URL}package/${getPlan.package_image}`]
                                            },
                                            unit_amount:(getPlan.plan_price*100),
                                            recurring:{
                                                interval: "month"
                                            },

                                        },
                                        //price:(getPlan.plan_price*100),
                                        quantity: 1,
                                    },
                                ],
                                mode: 'subscription',
                                metadata: {
                                    plan_id: key,
                                    user: userId,
                                    type: "subscription"
                                },
                                return_url: `${process.env.REACTAPP_URL2}/checkout-respose?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
                            }

                            if(user.customer_id){
                                payload.customer = user.customer_id;
                            }else{
                                payload.customer_email =  user?.email;
                            }

                            const session = await stripe.checkout.sessions.create(payload);

                            return res.status(200).json({status: true, key: session.client_secret});

                        }

                    }else{

                        let subscriptionId = user.subscription_id;

                        user.subscription_status = true;
                        user.plan_id = getPlan._id;
                        user.plan_key = getPlan.plan_key;
                        user.subscription_id = '';

                        await user.save();

                        if(user && subscriptionId){
                            try {
                                await stripe.subscriptions.cancel(subscriptionId);
                            } catch (error) {
                                console.log(error.message);
                            }
                        }

                        const updatedUser = await User.findById(user._id).populate('plan_id','plan_analytics plan_boosted plan_job plan_key plan_matches plan_name').lean(); // lean() = plain JS object

                        updatedUser.profile_image =  process.env.MEDIA_URL+'avtar/'+(updatedUser.profile_image?updatedUser.profile_image:'default-user.png');
                        updatedUser.company_logo = process.env.MEDIA_URL+'avtar/'+(updatedUser.company_logo?updatedUser.company_logo:'default-user.png');

                        await handleJobs(updatedUser);

                        return res.status(200).json({status: true, data: updatedUser, subscribed:true, message:'You have successfully subscribed.'});
                    }

                }else{
                    return res.status(200).json({status: false, message: 'Invalid plan request.'});
                }

            }else if(type === 'job'){

                const getJob = await JobModel.findById(key);

                if(getJob){

                    const siteConfigs = await SiteConfig.find(
                        {config_key:{$in:['job_post_price','job_boost_price']}},
                        'config_key config_type config_name config_value'
                    )
                    .then(result => {
                        const configMap = {};
                        result.forEach(value => {
                            configMap[value.config_key] = value.config_value;
                        });
                        return configMap;
                    });


                    let price = 0;
                    let description = '';


                    if (job_paid === 'true') {
                      price += Number(siteConfigs.job_post_price);
                      description += `Job Post Charge: $${siteConfigs.job_post_price}. `;
                    }

                    if (job_boost === 'true') {
                      price += Number(siteConfigs.job_boost_price);
                      description += `Job Boost Charge: $${siteConfigs.job_boost_price}. `;
                    }

                    const payload  = {
                        ui_mode: 'embedded',
                        line_items: [
                        {
                            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                            price_data: {
                                currency:'usd',
                                product_data:{
                                    name: `Job Post: ${getJob.job_position}`,
                                    description: description
                                },
                                unit_amount:(price*100)
                            },
                            quantity: 1,
                        },
                        ],
                        mode: 'payment',
                        metadata: {
                            job_id: key,
                            user: userId,
                            type: "job",
                            job_paid,
                            job_boost
                        },
                        return_url: `${process.env.REACTAPP_URL2}/checkout-respose?type=${type}&session_id={CHECKOUT_SESSION_ID}`,
                    }

                    if(user.customer_id){
                        payload.customer = user.customer_id;
                    }else{
                        payload.customer_email =  user?.email;
                    }

                    const session = await stripe.checkout.sessions.create(payload);

                    return res.status(200).json({status: true, key: session.client_secret});
                }else{
                    return res.status(200).json({status: false, message: 'This job is not exist or this job is already paid.'});
                }

            }else{

                const getPlan = await PackageModel.findById(key);

                if(getPlan.package_status){

                    const payload  = {
                        ui_mode: 'embedded',
                        line_items: [
                        {
                            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                            price_data: {
                                currency:'usd',
                                product_data:{
                                    name:getPlan.package_name,
                                    description: `${getPlan.package_credits} credits included with the ${getPlan.package_name} package for convenient transfers.`,
                                    images:[`${process.env.MEDIA_URL}package/${getPlan.package_image}`]
                                },
                                unit_amount:(getPlan.package_price*100)
                            },
                            quantity: 1,
                        },
                        ],
                        mode: 'payment',
                        metadata: {
                            package_id: key,
                            user: userId,
                            type: "credits"
                        },
                        return_url: `${process.env.REACTAPP_URL2}/checkout-respose?session_id={CHECKOUT_SESSION_ID}`,
                    }

                    if(user.customer_id){
                        payload.customer = user.customer_id;
                    }else{
                        payload.customer_email =  user?.email;
                    }

                    const session = await stripe.checkout.sessions.create(payload);

                    return res.status(200).json({status: true, key: session.client_secret});
                }else{

                    return res.status(200).json({status: false, message: 'This package is currently unavailable. Please check back later or contact support if the issue persists.'});
                }
            }

        } catch (error) {
            console.log(error.message);
            return res.status(200).json({status: false, message: 'Invalid request!!'});
        }
    }

    async checkoutresponse(req, res){
        try {
            const { key } = req.params;

            const userId = req.user.userId;
            const session = await stripe.checkout.sessions.retrieve(key);

            const user = await User.findOne({_id:userId},'user_credit first_name last_name email');

            const metadata = session.metadata;
            let jobcredited_by;
            if(session.status === 'complete' && session.payment_status === 'paid'){

                const isCheck = await Txn.findOne({session_id:session.id});

                let message = "";
                switch (metadata.type) {

                    case 'credits':
                        {
                            const getPlan = await PackageModel.findById(session.metadata.package_id);

                            if(!isCheck){

                                const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

                                await Txn.create({
                                    packages:getPlan._id,
                                    user:userId,
                                    description: 'Credit Purchase',
                                    amount: getPlan.package_price,
                                    credit: getPlan.package_credits,
                                    type:'credit',
                                    session_id:session.id,
                                    payment_intent: session.payment_intent,
                                    charge_id: paymentIntent.latest_charge
                                });

                                await User.findOneAndUpdate(
                                    {_id:user._id},
                                    {$set: {user_credit:(parseFloat(user.user_credit||0) + parseFloat(getPlan.package_credits))}},
                                    {new: true}
                                );
                            }

                            message = 'Your wallet has been successfully credited.';
                        }
                    break;

                    case 'subscription':
                        {
                            const getPlan = await PlanModel.findById(metadata.plan_id);

                            if(!isCheck){

                                const invoice = await stripe.invoices.retrieve(session.invoice);

                                const paymentIntent = await stripe.paymentIntents.retrieve(invoice.payment_intent);

                                await Txn.create({
                                    plan:getPlan._id,
                                    user:userId,
                                    description: 'Subscription Purchase ('+getPlan.plan_name+') ',
                                    amount: getPlan.plan_price,
                                    credit: getPlan.plan_price,
                                    type:'debit',
                                    session_id:session.id,
                                    payment_intent: invoice.payment_intent,
                                    charge_id: paymentIntent.latest_charge,
                                    invoice_pdf: invoice.hosted_invoice_url
                                });

                                const now = new Date();
                                const nextMonth = new Date(now.setMonth(now.getMonth() + 1));

                                await User.findOneAndUpdate(
                                    {_id:user._id},
                                    {$set: {
                                        subscription_status:true,
                                        subscription_date:new Date,
                                        subscription_next_payment_date: nextMonth,
                                        subscription_id: session.subscription,
                                        customer_id: session.customer,
                                        plan_id: getPlan._id,
                                        plan_key:getPlan.plan_key,

                                    }},
                                    {new: true}
                                );


                                await sendEmail({
                                    name: `${user.first_name} ${user.last_name}`,
                                    email: user.email,
                                    message : `
                                        Thank you for purchasing a subscription plan on My First Job. Your account has been successfully upgraded, and all features are associated with your plan is now available.
                                        <br/>
                                        <br/>
                                        You can view or download your payment receipt using the link below:
                                        <br/>
                                        <br/>
                                        👉 <a href="${invoice.hosted_invoice_url}" traget="_blank">View Receipt</a>
                                        <br/>
                                        <br/>
                                        If you have any questions or need assistance, feel free to reach out to our support team.
                                        <br/>
                                        <br/>
                                        Best,
                                        <br/>
                                        The MyFirstJob Team
                                    `,
                                    key: "notification_email",
                                    subject:"Thank You for Your Purchase – Plan Activated"
                                });

                            }

                            message = 'You have successfully subscribed.';
                        }
                    break;

                    case 'job':
                        {
                            const getJob = await JobModel.findById(metadata.job_id);

                            jobcredited_by = getJob.credited_by;

                            if(!isCheck){

                                const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

                                const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);

                                const siteConfigs = await SiteConfig.find(
                                    {config_key:{$in:['job_post_price','job_boost_price']}},
                                    'config_key config_type config_name config_value'
                                )
                                .then(result => {
                                    const configMap = {};
                                    result.forEach(value => {
                                        configMap[value.config_key] = value.config_value;
                                    });
                                    return configMap;
                                });

                                let mailSubject;
                                let mailMessage;

                                if(metadata.job_paid === 'true'){

                                    await Txn.create({
                                        job:getJob._id,
                                        user:userId,
                                        description: 'Post Job: ('+getJob.job_position+') ',
                                        amount: siteConfigs.job_post_price,
                                        credit: siteConfigs.job_post_price,
                                        type:'debit',
                                        session_id:session.id,
                                        payment_intent: session.payment_intent,
                                        charge_id: paymentIntent.latest_charge,
                                        invoice_pdf: charge.receipt_url

                                    });

                                    getJob.paid_job = true;

                                    mailSubject = "Your ("+getJob.job_position+") Job Post Is Live – Payment Received";

                                    mailMessage = `

                                        Thank you for posting your (${getJob.job_position}) job on My First Job! Your job has been successfully published.
                                        <br/>
                                        <br/>
                                        🧾 You can view your payment receipt here:
                                        <br/>
                                        👉 <a href="${charge.receipt_url}" traget="_blank">View Receipt</a>
                                        <br/>
                                        <br/>
                                        If you have any questions, feel free to reach out. We're happy to help!
                                        <br/>
                                        <br/>
                                        Best,
                                        <br/>
                                        The MyFirstJob Team
                                    `;

                                    getJob.job_status = true;
                                }

                                if(metadata.job_boost === 'true'){

                                    await Txn.create({
                                        job:getJob._id,
                                        user:userId,
                                        description: ' Job Boost Service: ('+getJob.job_position+') ',
                                        amount: siteConfigs.job_boost_price,
                                        credit: siteConfigs.job_boost_price,
                                        type:'debit',
                                        session_id:session.id,
                                        payment_intent: session.payment_intent,
                                        charge_id: paymentIntent.latest_charge,
                                        invoice_pdf: charge.receipt_url
                                    });

                                    getJob.job_boost = true;

                                    mailSubject = "Your ("+getJob.job_position+") Job  Has Been Boosted Successfully";

                                    mailMessage = `

                                        Thanks for boosting your (${getJob.job_position}) job post on My First Job! Your job is now featured at the top for maximum visibility.
                                        <br/>
                                        <br/>
                                        🧾 You can view your payment receipt here:
                                        <br/>
                                        👉 <a href="${charge.receipt_url}" traget="_blank">View Receipt</a>
                                        <br/>
                                        <br/>
                                        We appreciate your trust in us. If you need any help, just let us know!
                                        <br/>
                                        <br/>
                                        Best,
                                        <br/>
                                        The MyFirstJob Team
                                    `;
                                }

                                await getJob.save();

                                if(metadata.job_paid === 'true' && metadata.job_boost === 'true'){

                                    mailSubject = "Your ("+getJob.job_position+") Job Post Is Live and Featured!";

                                    mailMessage = `
                                        Thank you for posting your (${getJob.job_position}) job on My First Job and choosing to boost it for extra visibility! Your job is now live and featured at the top to attract more candidates.
                                        <br/>
                                        <br/>
                                        🧾 You can view your payment receipt here:
                                        <br/>
                                        👉 <a href="${charge.receipt_url}" traget="_blank">View Receipt</a>
                                        <br/>
                                        <br/>
                                        We’re excited to help you find the right talent. If you have any questions, feel free to reach out!
                                        <br/>
                                        <br/>
                                        Best,
                                        <br/>
                                        The MyFirstJob Team
                                    `;
                                }

                                await sendEmail({
                                    name: `${user.first_name} ${user.last_name}`,
                                    email: user.email,
                                    message : mailMessage,
                                    key: "notification_email",
                                    subject: mailSubject
                                });

                            }

                            message = 'You job successfully posted.';
                        }
                    break;

                }

                let updatedUser = await User.findById(user._id).populate('plan_id','plan_analytics plan_boosted plan_job plan_key plan_matches plan_name').lean(); // lean() = plain JS object
                updatedUser.profile_image =  process.env.MEDIA_URL+'avtar/'+(updatedUser.profile_image?updatedUser.profile_image:'default-user.png');
                updatedUser.company_logo = process.env.MEDIA_URL+'avtar/'+(updatedUser.company_logo?updatedUser.company_logo:'default-user.png');

                if(metadata.type === 'subscription'){
                    await handleJobs(updatedUser);
                }

                res.send({
                    status: true,
                    checkout_status: session.status,
                    message: message,
                    type: metadata.type,
                    data: updatedUser,
                    //data:session
                });

            }else{
                console.log(session);
                const updatedUser = await User.findById(user._id).populate('plan_id','plan_analytics plan_boosted plan_job plan_key plan_matches plan_name').lean(); // lean() = plain JS object
                updatedUser.profile_image =  process.env.MEDIA_URL+'avtar/'+(updatedUser.profile_image?updatedUser.profile_image:'default-user.png');
                updatedUser.company_logo = process.env.MEDIA_URL+'avtar/'+(updatedUser.company_logo?updatedUser.company_logo:'default-user.png');

                if(session.status === 'complete'){

                    let message = ""
                    switch (metadata.type) {
                        case 'credits':
                            message = 'Your checkout has been completed, please wait for your payment confirmation. After the payment has been completed we will transfer your credit to your account.';
                        break;

                        case 'subscription':
                            message = 'Your checkout has been completed, please wait for your payment confirmation. After the payment has been completed we will setup your subscription to your account.';
                        break;

                        case 'job':
                            message = 'Your checkout has been completed, please wait for your payment confirmation. After the payment has been completed we will setup your job.';
                        break;
                    }


                    res.send({
                        status: true,
                        checkout_status: session.status,
                        message: message,
                        type: metadata.type,
                        data: updatedUser,
                    });

                }else{
                    res.send({
                        status: false,
                        checkout_status: session.status,
                        type: metadata.type,
                        data: updatedUser,
                    });
                }
            }
        } catch (error) {
            return res.status(200).json({status: false, message: error.message});
        }
    }

    async cancelsubscription(req, res){
        try {
            const { key } = req.params;

            const userId = req.user.userId;

            const user = await User.findOne({_id:userId},'subscription_status subscription_id plan_id');

            if(user){

                if(user.subscription_status){
                    const subscriptionId = user.subscription_id;

                    user.subscription_status = false;
                    user.subscription_id = '';
                    const isUpdate = await user.save();

                    if(isUpdate && subscriptionId){
                        try {
                            const subscription = await stripe.subscriptions.cancel(subscriptionId);
                        } catch (error) {
                            console.log(error.message);
                        }
                    }

                    const updatedUser = await User.findById(user._id).lean(); // lean() = plain JS object

                    updatedUser.profile_image =  process.env.MEDIA_URL+'avtar/'+(updatedUser.profile_image?updatedUser.profile_image:'default-user.png');
                    updatedUser.company_logo = process.env.MEDIA_URL+'avtar/'+(updatedUser.company_logo?updatedUser.company_logo:'default-user.png');

                    await handleJobs(updatedUser);

                    return res.status(200).json({status: true, message:'Your plan has been successfully cancelled.', data:updatedUser });
                }else{
                    return res.status(200).json({status: false, message:`You don't have any active plan.`});
                }
            }else{
                return res.status(200).json({status: false, message: 'Invalid user request!!'});
            }


        } catch (error) {
            return res.status(200).json({status: false, message: error.message});
        }
    }

    async gettxn(req, res) {

        try {
            const {user:id} = req.query;

            const userId = id?id:req.user.userId;

            const user = await User.findOne({_id:userId},'user_credit');
            const txn = await Txn.find({user:userId}).sort({createdAt:-1});

            return res.status(200).json({status: true, data: txn, credits:user.user_credit });

        } catch (error) {
            return res.status(200).json({status: false, message: error.message});
        }

    }

    async assgincredits(req, res) {
        try {

            const userId = req.user.userId;
            const { teenager, credits } = req.body;

            const parent = await User.findOne({_id:userId},'user_credit first_name last_name');
            const teen = await User.findOne({_id:teenager, parents_id:userId});

            if(teen){

                if(parent.user_credit >= credits){
                    await Txn.create({
                        user:parent._id,
                        description: `Transfer to teen (${teen.first_name} ${teen.last_name})`,
                        credit: credits,
                        type:'debit'
                    });

                    await Txn.create({
                        user:teen._id,
                        description: `Transfer by parent (${parent.first_name} ${parent.last_name})`,
                        credit: credits,
                        type:'credit'
                    });

                    await User.findOneAndUpdate(
                        {_id:teen._id},
                        {$set: {user_credit:(parseFloat(teen.user_credit||0) + parseFloat(credits))}},
                        {new: true}
                    );

                    await User.findOneAndUpdate(
                        {_id:parent._id},
                        {$set: {user_credit:(parseFloat(parent.user_credit||0) - parseFloat(credits))}},
                        {new: true}
                    );


                    sendNotification({
                        from: parent._id,
                        to: teen._id,
                        message: `You have received ${credits} credits from your parent (${parent.first_name} ${parent.last_name}).`,
                        key: 'recevie_credit_from_parent',
                        extra: { }
                    });

                    return res.status(200).json({status: true, message: "Credit transfer successfully completed."});

                }else{
                    return res.status(200).json({status: false, message: "You have insufficient credit."});
                }

            }else{
                return res.status(200).json({status: false, message: "The teen you have selected is not linked to your account. Please check again."});
            }

        } catch (error) {
            return res.status(200).json({status: false, message: 'Invalid request!!'});
        }
    }

    async webhookresponse(req, res){

        try {

            const { type, data }  = req.body;
            // Handle the event
            switch (type) {

                case 'checkout.session.completed':
                case 'checkout.session.async_payment_succeeded':
                    {
                        var session = data.object;

                        const metadata = session.metadata;

                        // Then define and call a function to handle the event checkout.session.async_payment_succeeded
                        const user = await User.findOne({_id:session.metadata.user},'user_credit first_name last_name email');

                        if(metadata.type === 'credits'){
                            const getPlan = await PackageModel.findById(session.metadata.package_id);

                            if(user && getPlan){

                                const isCheck = await Txn.findOne({session_id:session.id});

                                if(!isCheck){

                                    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

                                    await Txn.create({
                                        packages:getPlan._id,
                                        user:user._id,
                                        description: 'Credit Purchase',
                                        amount: getPlan.package_price,
                                        credit: getPlan.package_credits,
                                        type:'credit',
                                        session_id:session.id,
                                        payment_intent: session.payment_intent,
                                        charge_id: paymentIntent.latest_charge
                                    });

                                    await User.findOneAndUpdate(
                                        {_id:user._id},
                                        {$set: {user_credit:(parseFloat(user.user_credit||0) + parseFloat(getPlan.package_credits))}},
                                        {new: true}
                                    );
                                }

                                return res.status(200).json({status: true, message:'Webhook Ok: 200'});

                            }else{
                                return res.status(200).json({status: false, message:'Invalid user request'});
                            }
                        }

                        if(metadata.type === 'subscription'){

                            const getPlan = await PlanModel.findById(metadata.plan_id);


                            if(user && getPlan){
                                const isCheck = await Txn.findOne({session_id:session.id});

                                if(!isCheck){

                                    const invoice = await stripe.invoices.retrieve(session.invoice);

                                    const paymentIntent = await stripe.paymentIntents.retrieve(invoice.payment_intent);

                                    await Txn.create({
                                        plan:getPlan._id,
                                        user:user._id,
                                        description: 'Subscription Purchase ('+getPlan.plan_name+') ',
                                        amount: getPlan.plan_price,
                                        credit: getPlan.plan_price,
                                        type:'debit',
                                        session_id:session.id,
                                        payment_intent: invoice.payment_intent,
                                        charge_id: paymentIntent.latest_charge,
                                        invoice_pdf: invoice.hosted_invoice_url
                                    });

                                    const now = new Date();
                                    const nextMonth = new Date(now.setMonth(now.getMonth() + 1));

                                    await User.findOneAndUpdate(
                                        {_id:user._id},
                                        {$set: {
                                            subscription_status:true,
                                            subscription_date:new Date,
                                            subscription_next_payment_date: nextMonth,
                                            subscription_id: session.subscription,
                                            customer_id: session.customer,
                                            plan_id: getPlan._id,
                                            plan_key:getPlan.plan_key
                                        }},
                                        {new: true}
                                    );


                                    await sendEmail({
                                        name: `${user.first_name} ${user.last_name}`,
                                        email: user.email,
                                        message : `
                                            Thank you for purchasing a subscription plan on My First Job. Your account has been successfully upgraded, and all features are associated with your plan is now available.
                                            <br/>
                                            <br/>
                                            You can view or download your payment receipt using the link below:
                                            <br/>
                                            <br/>
                                            👉 <a href="${invoice.hosted_invoice_url}" traget="_blank">View Receipt</a>
                                            <br/>
                                            <br/>
                                            If you have any questions or need assistance, feel free to reach out to our support team.
                                            <br/>
                                            <br/>
                                            Best,
                                            <br/>
                                            The MyFirstJob Team
                                        `,
                                        key: "notification_email",
                                        subject:"Thank You for Your Purchase – Plan Activated"
                                    });

                                    const updatedUser = await User.findById(user._id).populate('plan_id','plan_analytics plan_boosted plan_job plan_key plan_matches plan_name').lean(); // lean() = plain JS object
                                    await handleJobs(updatedUser);

                                    return res.status(200).json({status: true, message:'Webhook Ok: 200'});
                                }


                            }else{
                                return res.status(200).json({status: false, message:'Invalid user request'});
                            }
                        }

                        return res.status(200).json({status: true, message:'Webhook Ok: 200'});
                    }

                break;

                case 'payment_intent.succeeded':
                    {
                        var session = data.object;

                        const metadata = session.metadata;

                        const user = await User.findOne({_id:session.metadata.user},'user_credit');

                        if(metadata.type === 'credits'){
                            const getPlan = await PackageModel.findById(session.metadata.package_id);

                            if(user && getPlan){

                                const isCheck = await Txn.findOne({payment_intent:session.id});

                                if(!isCheck){

                                    await Txn.create({
                                        packages:getPlan._id,
                                        user:user._id,
                                        description: 'Credit Purchase',
                                        amount: getPlan.package_price,
                                        credit: getPlan.package_credits,
                                        type:'credit',
                                        session_id:session.id,
                                        payment_intent: session.id,
                                        charge_id: session.latest_charge
                                    });

                                    await User.findOneAndUpdate(
                                        {_id:user._id},
                                        {$set: {user_credit:(parseFloat(user.user_credit||0) + parseFloat(getPlan.package_credits))}},
                                        {new: true}
                                    );
                                }

                                return res.status(200).json({status: true, message:'Webhook Ok: 200'});

                            }else{
                                return res.status(200).json({status: false, message:'Invalid user request'});
                            }
                        }

                        if(metadata.type === 'subscription'){

                            const getPlan = await PlanModel.findById(metadata.plan_id);

                            if(user && getPlan){

                                const isCheck = await Txn.findOne({payment_intent:session.id});

                                if(!isCheck){

                                    await Txn.create({
                                        plan:getPlan._id,
                                        user:user._id,
                                        description: 'Subscription Purchase ('+getPlan.plan_name+') ',
                                        amount: getPlan.plan_price,
                                        credit: getPlan.plan_price,
                                        type:'debit',
                                        session_id:session.id,
                                        payment_intent: session.id,
                                        charge_id: session.latest_charge
                                    });

                                    await User.findOneAndUpdate(
                                        {_id:user._id},
                                        {$set: {
                                            subscription_status:true,
                                            subscription_date:new Date,
                                            subscription_id: session.subscription,
                                            customer_id: session.customer,
                                            plan_id: getPlan._id,
                                            plan_key:getPlan.plan_key
                                        }},
                                        {new: true}
                                    );

                                    return res.status(200).json({status: true, message:'Webhook Ok: 200'});
                                }


                                return res.status(200).json({status: true, message:'Webhook Ok: 200'});
                            }else{
                                return res.status(200).json({status: false, message:'Invalid user request'});
                            }
                        }

                        return res.status(200).json({status: true, message:'Webhook Ok: 200'});
                    }
                break;

                case 'customer.subscription.updated':

                    {

                        var session = data.object;

                        const user = await User.findOne({subscription_id:session.id},'subscription_id subscription_next_payment_date');

                        if(user){

                            if(session.status ==='active'){

                                const timestamp = session.current_period_end; // Unix timestamp in seconds
                                const subscriptionDate = new Date(timestamp * 1000); // Convert to milliseconds

                                user.subscription_next_payment_date = subscriptionDate;
                                await user.save();

                                return res.status(200).json({status: true, message:'Webhook Ok: 200', data:{message:"Updated", date:subscriptionDate }});
                            }
                        }

                        return res.status(200).json({status: true, message:'Webhook Ok: 200'});
                    }
                break;

                case 'invoice.payment_failed':
                    {

                        var session = data.object;

                        const user = await User.findOne({subscription_id:session.subscription},'subscription_id first_name last_name email');

                        if(user){

                            user.subscription_status = false;
                            const isUpdate = await user.save();

                            if(isUpdate){
                                const subscription = await stripe.subscriptions.cancel(user.subscription_id);
                            }

                            await sendEmail({
                                name: `${user.first_name} ${user.last_name}`,
                                email: user.email,
                                message : `
                                    Unfortunately, we weren’t able to process your recent subscription payment for My First Job. As a result, your subscription has been canceled, and access to premium features has been paused.
                                    <br/><br/>
                                    But don’t worry — you can re-subscribe anytime to regain full access.
                                    <br/><br/>
                                    🔁 Click below to re-subscribe and continue your journey:
                                    <br/>
                                    👉 <a href="${process.env.REACTAPP_URL2+'/subscription'}" target="_blank">Choose a Plan</a>
                                    <br/><br/>
                                    If you believe this was a mistake or need help updating your payment information, please contact our support team — we're here to help!
                                    <br/><br/>
                                    Best regards,
                                    The My First Job Team
                                `,
                                key: "notification_email",
                                subject:"Payment Failed – Subscription Canceled on My First Job"
                            });

                            return res.status(200).json({status: true, message:'Webhook Ok: 200'});

                        }else{
                            return res.status(200).json({status: false, message:'Invalid user request'});
                        }
                    }
                break;

                case 'invoice.paid':
                    {
                        var session = data.object;

                        setInterval(async () => {

                            const user = await User.findOne({subscription_id:session.subscription},'subscription_id first_name last_name email').populate('plan_id','plan_name plan_price');

                            if(user){

                                const timestamp = session.period_end; // Unix timestamp in seconds
                                const subscriptionDate = new Date(timestamp * 1000); // Convert to milliseconds

                                const now = new Date();
                                const nextMonth = new Date(now.setMonth(now.getMonth() + 1));

                                user.subscription_next_payment_date = nextMonth;
                                user.subscription_status = true;
                                await user.save();

                                const isCheck = await Txn.findOne({charge_id:session.charge});

                                if(!isCheck){

                                    await Txn.create({
                                        plan:user.plan_id._id,
                                        user:user._id,
                                        description: 'Subscription Purchase ('+user.plan_id.plan_name+') ',
                                        amount: (session.amount_paid/100),
                                        credit: (session.amount_paid/100),
                                        type:'debit',
                                        session_id:session.id,
                                        payment_intent: session.payment_intent,
                                        charge_id: session.charge,
                                        invoice_pdf:session.invoice_pdf
                                    });

                                    await sendEmail({
                                        name: `${user.first_name} ${user.last_name}`,
                                        email: user.email,
                                        message : `
                                            We’ve successfully processed your monthly subscription payment for My First Job. Your plan remains active, and you’ll continue to enjoy all premium features without interruption.
                                            <br/><br/>
                                            🧾 You can view or download your payment receipt here:
                                            <br/>
                                            👉 <a href="${session.invoice_pdf}" target="_blank">View Receipt</a>
                                            <br/><br/>
                                            If you have any questions about your billing or need assistance, feel free to reach out to our support team — we’re happy to help.
                                            <br/><br/>
                                            Thanks for being with us!
                                            The My First Job Team
                                        `,
                                        key: "notification_email",
                                        subject:"Monthly Subscription Payment Received – My First Job"
                                    });

                                }else{
                                    isCheck.invoice_pdf = session.invoice_pdf;
                                    await isCheck.save();
                                }

                                return res.status(200).json({status: true, message:'Webhook Ok: 200'});

                            }else{
                                return res.status(200).json({status: false, message:'Invalid user request'});
                            }

                        }, 5000);

                        return res.status(200).json({status: true, message:'Webhook Ok: 200'});
                    }
                break;

                // ... handle other event types
                default:
                console.log(`Unhandled event type ${type}`);

            }

        } catch (error) {
            return res.status(200).json({status: false, message:error.message});
        }
    }

    async purchasemodule(req, res) {

        try {

            const userId = req.user.userId;
            const user = await User.findOne({_id:userId, user_deleted:false});
            const { type, id, name } = req.body;

            if(user){

                switch(type){

                    case 'guidance_counselor':

                        const siteConfigs = await SiteConfig.findOne({config_key:'guidance_counselor_fee'}, 'config_key config_type config_name config_value').sort({config_order:1});
                        const guidance_counselor_fee = siteConfigs.config_value;

                        if(guidance_counselor_fee && user.user_credit && user.user_credit >= guidance_counselor_fee){

                            if(!user.guidance_counselor){
                                await Txn.create({
                                    user:userId,
                                    description: 'Guidance Counselor Service Purchase',
                                    credit: guidance_counselor_fee,
                                    type:'debit'
                                });

                                const updated = await User.findOneAndUpdate(
                                    {_id:user._id},
                                    {$set: {
                                        user_credit:(parseFloat(user.user_credit||0) - parseFloat(guidance_counselor_fee)),
                                        guidance_counselor:true,
                                        purchased_plan:[...user.purchased_plan,'guidance_counselor']

                                    }},
                                    {new: true}
                                );

                                return res.status(200).json({status: true, data:updated, message:''});
                            }else{
                                return res.status(200).json({status: false, message:'You have already purchase this module.'});
                            }

                        }else{
                            return res.status(200).json({status: false, message:'You do not have enough credit to complete this transaction.'});
                        }
                    break;

                    case 'learning_path':

                        const path = await LearningPathModel.findOne({_id:id, status:true}).populate('skills');

                        if(!path){
                            return res.status(200).json({status: false, message:'This path is not available or inactive.'});
                        }

                        if(path.order > 1){
                            const lastpath = await LearningPathModel.findOne({order:(path.order-1), status:true},'credit_price')
                            const islastBuy = await PurchaseModules.countDocuments({user:userId, type: 'path', path:lastpath._id});

                            if(!islastBuy){
                                return res.status(200).json({status: false, message:'You can purchase this path only after purchasing the previous one.'});
                            }
                        }

                        if(path && user.user_credit && user.user_credit >= path.credit_price){

                            const isBuy = await PurchaseModules.countDocuments({user:userId, type: 'path', path:id});

                            if(!isBuy){

                                const txn = await Txn.create({
                                    user:userId,
                                    description: `Learning Path Purchase (${path.title})`,
                                    credit: path.credit_price,
                                    type:'debit'
                                });

                                await PurchaseModules.create({
                                    path: path._id,
                                    user:userId,
                                    credit: path.credit_price,
                                    type:'path',
                                    //expiration_period: path.expiration_period,
                                    txn: txn._id
                                });


                                const updated = await User.findOneAndUpdate(
                                    {_id:user._id},
                                    {$set: {
                                        user_credit:(parseFloat(user.user_credit||0) - parseFloat(path.credit_price)),
                                        // purchased_path:[...user.purchased_path, path._id],
                                        // purchased_skills:[...user.purchased_skills, ...path.skills],
                                    }},
                                    {new: true}
                                );


                                const levels =  await LevelModel.find({paths:path._id},'paths price');

                                if(levels.length > 0){
                                    for(const level of levels){

                                        const isAllBuy = await PurchaseModules.countDocuments({user:userId, type: "path", path:{$in:level.paths}});

                                        if(isAllBuy === level.paths.length){

                                            await PurchaseModules.create({
                                                level: level._id,
                                                user:userId,
                                                credit: level.price,
                                                type:'level'
                                            });

                                            const totalLevel = await LevelModel.countDocuments({});
                                            const totalBuy = await PurchaseModules.countDocuments({ type: 'level', user: userId });

                                            const shouldAddAccess = totalLevel === totalBuy;

                                            if(shouldAddAccess){
                                                await User.findOneAndUpdate(
                                                    {_id:userId},
                                                    {$set: {
                                                        purchased_plan: [...(user.purchased_plan || []), 'lms_access'],
                                                    }},
                                                    {new: true}
                                                );
                                            }
                                        }

                                    }
                                }

                                for(const skill of path.skills){

                                    const isBuy = await PurchaseModules.countDocuments({user:userId, type: {$in:['skill','internal']}, skill:skill._id});

                                    if(!isBuy){
                                        await PurchaseModules.create({
                                            skill: skill._id,
                                            user:userId,
                                            credit: skill.credit_price,
                                            type:'skill',
                                            //expiration_period: skill.expiration_period,
                                            txn: txn._id
                                        });
                                    }
                                }

                                return res.status(200).json({status: true, data:updated, message:'Path successfully purchased.'});
                            }else{
                                return res.status(200).json({status: false, message:'You have already purchase this module.'});
                            }

                        }else{
                            return res.status(200).json({status: false, message:'You do not have enough credit to complete this transaction.'});
                        }

                    break;

                    case 'learning_skill':

                        const skill = await SkillModel.findOne({_id:id, status:true});

                        if(!skill){
                            return res.status(200).json({status: false, message:'This skill is not available or inactive.'});
                        }

                        if(skill.order > 1){
                            const lastskill = await SkillModel.findOne({order:(skill.order-1), status:true},'credit_price')
                            const islastBuy = await PurchaseModules.countDocuments({user:userId, type: 'skill', skill:lastskill._id});

                            if(!islastBuy){
                                return res.status(200).json({status: false, message:'You can purchase this skill only after purchasing the previous one.'});
                            }
                        }

                        if(skill && user.user_credit && user.user_credit >= skill.credit_price){

                            const isBuy = await PurchaseModules.countDocuments({user:userId, type: {$in:['skill','internal']}, skill:id});

                            if(!isBuy){

                                const txn = await Txn.create({
                                    user:userId,
                                    description: `Skill Purchase (${skill.title})`,
                                    credit: skill.credit_price,
                                    type:'debit'
                                });

                                await PurchaseModules.create({
                                    skill: skill._id,
                                    user:userId,
                                    credit: skill.credit_price,
                                    type:'skill',
                                    //expiration_period: skill.expiration_period,
                                    txn: txn._id
                                });


                                const updated = await User.findOneAndUpdate(
                                    {_id:user._id},
                                    {$set: {
                                        user_credit:(parseFloat(user.user_credit||0) - parseFloat(skill.credit_price)),
                                        //purchased_skills:[...user.purchased_skills, skill._id],
                                    }},
                                    {new: true}
                                );

                                const paths = await LearningPathModel.find({skills:id},'skills credit_price');

                                if(paths.length > 0){

                                    for(const path of paths){

                                        const isAllBuy = await PurchaseModules.countDocuments({user:userId, type: "skill", skill:{$in:path.skills}});

                                        if(isAllBuy === path.skills.length){
                                            await PurchaseModules.create({
                                                path: path._id,
                                                user:userId,
                                                credit: path.credit_price,
                                                type:'path'
                                            });
                                        }

                                        const levels =  await LevelModel.find({paths:path._id},'paths price');

                                        if(levels.length > 0){
                                            for(const level of levels){

                                                const isAllBuy = await PurchaseModules.countDocuments({user:userId, type: "path", path:{$in:level.paths}});

                                                if(isAllBuy === level.paths.length){

                                                    await PurchaseModules.create({
                                                        level: level._id,
                                                        user:userId,
                                                        credit: level.price,
                                                        type:'level'
                                                    });

                                                    const totalLevel = await LevelModel.countDocuments({});
                                                    const totalBuy = await PurchaseModules.countDocuments({ type: 'level', user: userId });

                                                    const shouldAddAccess = totalLevel === totalBuy;

                                                    if(shouldAddAccess){
                                                        await User.findOneAndUpdate(
                                                            {_id:userId},
                                                            {$set: {
                                                                purchased_plan: [...(user.purchased_plan || []), 'lms_access'],
                                                            }},
                                                            {new: true}
                                                        );
                                                    }

                                                }

                                            }
                                        }
                                    }
                                }

                                return res.status(200).json({status: true, data:updated, message:'Skill successfully purchased.'});
                            }else{
                                return res.status(200).json({status: false, message:'You have already purchase this module.'});
                            }

                        }else{
                            return res.status(200).json({status: false, message:'You do not have enough credit to complete this transaction.'});
                        }

                    break;

                    case 'product':


                        const product = await ProductModel.findOne({_id:id, status: true});

                        if(product){

                            const siteConfigs = await SiteConfig.findOne({config_key:'app_site_mail'}, 'config_key config_type config_name config_value');

                            if(user.user_credit && user.user_credit >= product.price){

                                const txn = await Txn.create({
                                    user:userId,
                                    description: `Product Purchase (${product.title})`,
                                    credit: product.price,
                                    type:'debit'
                                });

                                await OrderModel.create({
                                    product: product._id,
                                    user:userId,
                                    credit: product.price,
                                    txn: txn._id
                                });


                                const updated = await User.findOneAndUpdate(
                                    {_id:user._id},
                                    {$set: {
                                        user_credit:(parseFloat(user.user_credit||0) - parseFloat(product.price))
                                    }},
                                    {new: true}
                                );

                                await sendNotification({
                                    from: user._id,
                                    to: user._id,
                                    message: `Your product (${product.title}) successfully purchased.`,
                                    key: 'product_purchased',
                                    extra: {}
                                })

                                await sendEmail({
                                    name: `${updated.first_name} ${updated.last_name}`,
                                    email: updated.email,
                                    message : `
                                        Your product (${product.title}) successfully purchased.
                                        <br />
                                        Thank you for purchasing.
                                        <br />
                                        Please feel free to reach out if any further action is required.
                                        <br />
                                        Thank you,
                                        <br />
                                        My First Job
                                    `,
                                    key: "notification_email",
                                    subject:"Product Purchase Notification"
                                });

                                await sendEmail({
                                    name: `Admin`,
                                    email: siteConfigs.config_value,
                                    message : `
                                        ${updated.user_type === 'teenager'?'Student':'Parent'} (${updated.first_name} ${updated.last_name}) has purchased the new (${product.title}) product.
                                        <br />
                                        <br />
                                        Thank you,
                                        <br />
                                        My First Job
                                    `,
                                    key: "notification_email",
                                    subject:"Product Purchase Notification"
                                });

                                return res.status(200).json({status: true, credit:updated.user_credit, message:'Product successfully purchased.'});

                            }else{
                                return res.status(200).json({status: false, message:'You do not have enough credit to complete this transaction.'});
                            }


                        }else{
                            return res.status(200).json({status: false, message:'This product is not available or inactive.'});
                        }

                    break;

                    case 'set_goal':

                        {

                            const siteConfigs = await SiteConfig.findOne({config_key:'app_site_mail'}, 'config_key config_type config_name config_value');

                            const postData = req.body;
                            let product;
                            let credit = 0;
                            if(postData.reward_type === 'product'){
                                product = await ProductModel.findOne({_id:postData.reward_product.id, status: true});

                                if(!product){
                                    return res.status(200).json({status: false, message:'This product is not available or inactive.'});
                                }

                                credit = product.price;
                                postData.reward_product  = postData.reward_product.id;
                                delete postData.reward_credit;
                            }else{
                                credit = postData.reward_credit;
                                delete postData.reward_product;
                            }

                            switch (postData.reward_for) {
                                case 'path':
                                    delete postData.reward_skill;
                                    delete postData.reward_level;
                                break;

                                case 'skill':
                                    delete postData.reward_path;
                                    delete postData.reward_level;
                                break;

                                case 'level':
                                    delete postData.reward_skill;
                                    delete postData.reward_path;
                                break;
                            }

                            // GoalModel
                            if(credit != 0 && user.user_credit && user.user_credit >= credit){

                                const txn = await Txn.create({
                                    user:userId,
                                    description: `Goal Set`,
                                    credit: credit,
                                    type:'debit'
                                });

                                if(product){
                                    await OrderModel.create({
                                        product: product._id,
                                        user:userId,
                                        credit: product.price,
                                        txn: txn._id
                                    });
                                }

                                postData.user = userId;
                                postData.txn = txn._id;


                                const createdGoal = await GoalModel.create(postData);

                                const updated = await User.findOneAndUpdate(
                                    {_id:user._id},
                                    {$set: {
                                        user_credit:(parseFloat(user.user_credit||0) - parseFloat(credit))
                                    }},
                                    {new: true}
                                );


                                const teen = await User.findOne({_id:postData.teenager},'first_name last_name email');


                                if(createdGoal){

                                    const getgoals = await GoalModel.findById(createdGoal._id)
                                    .populate('reward_path','title')
                                    .populate('reward_skill','title')
                                    .populate('reward_level','name');


                                    let goalmessage = getgoals.reward_type === 'product'?`Your parents set a goal for you to receive the (${product.title}) upon completion of the ${getgoals.reward_for === 'path'?`${getgoals.reward_path.title} Learning Path`:(getgoals.reward_for === 'level'?`${getgoals.reward_level.name} Level`:`${getgoals.reward_skill.title} Skill`)}.
                                    `:`Your parents set a goal for you to receive the (C ${credit} credits) upon completion of the ${getgoals.reward_for === 'path'?`${getgoals.reward_path.title} Learning Path`:(getgoals.reward_for === 'level'?`${getgoals.reward_level.name} Level`:`${getgoals.reward_skill.title} Skill`)}.`;

                                    await sendNotification({
                                        from: user._id,
                                        to: postData.teenager,
                                        message: goalmessage,
                                        key: 'parent_set_goal',
                                        extra: {}
                                    })

                                    await sendEmail({
                                        name: `${teen.first_name} ${teen.last_name}`,
                                        email: teen.email,
                                        message : `
                                            ${goalmessage}
                                            <br />
                                            <br />
                                            Thank you,
                                            <br />
                                            My First Job
                                        `,
                                        key: "notification_email",
                                        subject:"Set Goal Notification"
                                    });



                                    if(product){
                                        await sendEmail({
                                            name: `Admin`,
                                            email: siteConfigs.config_value,
                                            message : `
                                                Parent (${updated.first_name} ${updated.last_name}) has purchased the new (${product.title}) product.
                                                <br />
                                                <br />
                                                Thank you,
                                                <br />
                                                My First Job
                                            `,
                                            key: "notification_email",
                                            subject:"Product Purchase Notification"
                                        });
                                    }
                                }


                                return res.status(200).json({status: true, credit:updated.user_credit, message:'Goal set successfully.'});

                            }else{
                                return res.status(200).json({status: false, message:'You do not have enough credit to complete this transaction.'});
                            }

                        }

                    break;

                    case 'level':

                        const level =  await LevelModel.findOne({_id:id, status:true})
                        .populate({
                            path: 'paths',
                            populate: {
                                path: 'skills'
                            },
                        });

                        if(!level){
                            return res.status(200).json({status: false, message:'This level is not available or inactive.'});
                        }

                        if(level.order > 1){
                            const lastlevel = await LevelModel.findOne({order:(level.order-1), status:true},'name')
                            const islastBuy = await PurchaseModules.countDocuments({user:userId, type: 'level', level:lastlevel._id});

                            if(!islastBuy){
                                return res.status(200).json({status: false, message:'You can purchase this level only after purchasing the previous one.'});
                            }
                        }

                        if(level && level.price && user.user_credit >= level.price){

                            const isBuy = await PurchaseModules.countDocuments({user:userId, type: 'level', level:level._id});

                            if(!isBuy){

                                const txn = await Txn.create({
                                    user:userId,
                                    description: `Level Purchase (${level.name})`,
                                    credit: level.price,
                                    type:'debit'
                                });

                                await PurchaseModules.create({
                                    level: level._id,
                                    user:userId,
                                    credit: level.price,
                                    type:'level',
                                    txn: txn._id
                                });



                                const totalLevel = await LevelModel.countDocuments({});
                                const totalBuy = await PurchaseModules.countDocuments({ type: 'level', user: userId });

                                const shouldAddAccess = totalLevel === totalBuy;

                                const updated = await User.findOneAndUpdate(
                                    {_id:user._id},
                                    {$set: {
                                        user_credit:(parseFloat(user.user_credit||0) - parseFloat(level.price)),
                                        ...(shouldAddAccess && {
                                            purchased_plan: [...(user.purchased_plan || []), 'lms_access'],
                                        }),
                                    }},
                                    {new: true}
                                );


                                for(const path of level.paths){

                                    const isPBuy = await PurchaseModules.countDocuments({user:userId, type: "path", path:path._id});

                                    if(!isPBuy){

                                        await PurchaseModules.create({
                                            path: path._id,
                                            user:userId,
                                            credit: path.credit_price,
                                            type:'path',
                                            txn: txn._id
                                        });

                                        for(const skill of path.skills){

                                            const isSBuy = await PurchaseModules.countDocuments({user:userId, type: {$in:['skill','internal']}, skill:skill._id});

                                            if(!isSBuy){

                                                await PurchaseModules.create({
                                                    skill: skill._id,
                                                    user:userId,
                                                    credit: skill.credit_price,
                                                    type:'skill',
                                                    txn: txn._id
                                                });

                                            }
                                        }
                                    }
                                }




                                return res.status(200).json({status: true, data:updated, message:'Level successfully purchased.'});
                            }else{
                                return res.status(200).json({status: false, message:'You have already purchase this module.'});
                            }
                        }else{
                            return res.status(200).json({status: false, message:'You do not have enough credit to complete this transaction.'});
                        }

                    break;

                    case 'plan':

                        const plan = await PlanModel.findOne({_id:id});

                        if(!plan){
                            return res.status(200).json({status: false, message:'This plan is not found.'});
                        }

                        if(plan && plan.plan_price && user.user_credit >= plan.plan_price){

                            const isBuy = await PurchaseModules.countDocuments({user:userId, type:plan.plan_key, plan:plan._id});

                            if(!isBuy){

                                const txn = await Txn.create({
                                    user:userId,
                                    description: `Plan Purchase (${plan.plan_name})`,
                                    credit: plan.plan_price,
                                    type:'debit'
                                });

                                await PurchaseModules.create({
                                    plan: plan._id,
                                    user:userId,
                                    credit: plan.plan_price,
                                    type: plan.plan_key,
                                    txn: txn._id
                                });

                                let updated = await User.findOneAndUpdate(
                                    {_id:user._id},
                                    {$set: {
                                        user_credit:(parseFloat(user.user_credit||0) - parseFloat(plan.plan_price)),
                                        purchased_plan:[...user.purchased_plan, plan.plan_key],
                                    }},
                                    {new: true}
                                );

                                switch (plan.plan_key) {

                                    case 'lms_access':
                                        // logic for both lms_access and all_feature_access
                                        await handleLMSAccess(userId, txn);
                                        break;

                                    case 'all_feature_access':
                                        // logic for both lms_access and all_feature_access
                                        await handleLMSAccess(userId, txn);

                                        // additional logic only for all_feature_access
                                        updated = await User.findOneAndUpdate(
                                            { _id: user._id },
                                            {
                                                $set: {
                                                    purchased_plan: [
                                                        'cover_letter',
                                                        'resume_template',
                                                        'guidance_counselor',
                                                        'life_time_access',
                                                        'lms_access',
                                                        'all_feature_access'
                                                    ],
                                                    purchased_templates: [
                                                        'default',
                                                        'classic',
                                                        'dark',
                                                        'modernedge',
                                                        'vibrantflow',
                                                        'boldcontrast',
                                                        'creativegrid',
                                                        'professionalyellow',
                                                        'elegantcurve',
                                                        'friendlyprofile'
                                                    ],
                                                    guidance_counselor: true,
                                                }
                                            },
                                            { new: true }
                                        );
                                        break;

                                    case 'life_time_access':
                                        updated = await User.findOneAndUpdate(
                                            { _id: user._id },
                                            {
                                                $set: {
                                                    purchased_plan: [
                                                        ...updated.purchased_plan,
                                                        'cover_letter',
                                                        'resume_template',
                                                        'guidance_counselor',
                                                        'life_time_access'
                                                    ],
                                                    purchased_templates: [
                                                        'default',
                                                        'classic',
                                                        'dark',
                                                        'modernedge',
                                                        'vibrantflow',
                                                        'boldcontrast',
                                                        'creativegrid',
                                                        'professionalyellow',
                                                        'elegantcurve',
                                                        'friendlyprofile'
                                                    ],
                                                    guidance_counselor: true,
                                                }
                                            },
                                            { new: true }
                                        );
                                        break;

                                    case 'guidance_counselor':
                                        updated = await User.findOneAndUpdate(
                                            { _id: user._id },
                                            {
                                                $set: {
                                                    guidance_counselor: true,
                                                }
                                            },
                                            { new: true }
                                        );
                                        break;
                                }

                                if(updated.purchased_plan?.includes('life_time_access') && updated.purchased_plan?.includes('lms_access') && !updated.purchased_plan?.includes('all_feature_access')){
                                    await User.findOneAndUpdate(
                                        {_id:user._id},
                                        {$set: {
                                            purchased_plan:[...updated.purchased_plan, 'all_feature_access'],
                                        }},
                                        {new: true}
                                    );
                                }

                                return res.status(200).json({status: true, data:updated, message:'Plan successfully purchased.'});

                            }else{
                                return res.status(200).json({status: false, message:'You have already purchase this plan.'});
                            }

                        }else{
                            return res.status(200).json({status: false, message:'You do not have enough credit to complete this transaction.'});
                        }

                    break;

                    case 'cover_letter':

                        {
                            const siteConfigs = await SiteConfig.findOne({config_key:'cover_letter_credit'}, 'config_key config_type config_name config_value').sort({config_order:1});
                            const cover_letter_credit = siteConfigs.config_value

                            if(cover_letter_credit && user.user_credit && user.user_credit >= cover_letter_credit){

                                await Txn.create({
                                    user:userId,
                                    description: 'Cover letter Purchase',
                                    credit: cover_letter_credit,
                                    type:'debit'
                                });

                                const updated = await User.findOneAndUpdate(
                                    {_id:user._id},
                                    {$set: {
                                        user_credit:(parseFloat(user.user_credit||0) - parseFloat(cover_letter_credit)),
                                        purchased_letter:((user.purchased_letter||0)+1)

                                    }},
                                    {new: true}
                                );

                                return res.status(200).json({status: true, data:updated, message:'You have successfully purchase cover letter.'});

                            }else{
                                return res.status(200).json({status: false, message:'You do not have enough credit to complete this transaction.'});
                            }
                        }

                    break;

                    case 'template':

                        if(!user.purchased_templates.includes(id)){

                            const siteConfigs = await SiteConfig.findOne({config_key:'resume_credit'}, 'config_key config_type config_name config_value').sort({config_order:1});
                            const resume_credit = siteConfigs.config_value;

                            if(resume_credit && user.user_credit && user.user_credit >= resume_credit){

                                await Txn.create({
                                    user:userId,
                                    description: 'Resume Purchase ('+name+')',
                                    credit: resume_credit,
                                    type:'debit'
                                });

                                const updated = await User.findOneAndUpdate(
                                    {_id:user._id},
                                    {$set: {
                                        user_credit:(parseFloat(user.user_credit||0) - parseFloat(resume_credit)),
                                        purchased_templates:[...user.purchased_templates,id]

                                    }},
                                    {new: true}
                                );

                                return res.status(200).json({status: true, data:updated, message:'You have successfully purchase this template.'});

                            }else{
                                return res.status(200).json({status: false, message:'You do not have enough credit to complete this transaction.'});
                            }

                        }else{
                            return res.status(200).json({status: false, message:'You have already purchase this template.'});
                        }

                    break;

                    default:
                        return res.status(200).json({status: false, message:'Invalid purchase module request'});
                    break;
                }

            }else{
                return res.status(200).json({status: false, message:'Invalid user request'});
            }

        } catch (error) {
            return res.status(200).json({status: false, message:error.message});
        }

    }

    /** App IOS/Android */
    async createpaymentintent(req, res){
        try {

            const { key } = req.params;
            const userId = req.user.userId;
            const { type, job_paid, job_boost } = req.query;
            const user = await User.findOne({_id:userId});

            if(type === 'subscription'){


                try {

                    const getPlan = await PlanModel.findById(key);

                    if(getPlan){

                        let customerId = user.customer_id;

                        if(!user.customer_id){

                            const customer = await stripe.customers.create({
                                name: `${user.first_name} ${user.last_name}`,
                                email: user.email,
                            });

                            user.customer_id = customer.id;

                            await user.save();

                            customerId =  user.customer_id;
                        }

                        let priceId;

                        const priceList = await stripe.prices.list({
                            limit: 100,
                        });

                        const match = priceList.data.find(
                            (p) => p.unit_amount === (getPlan.plan_price * 100)
                        );

                        if (match) {
                            priceId = match.id;
                        } else {
                            // Create product or handle not found
                            const price = await stripe.prices.create({
                                currency: 'usd',
                                unit_amount: (getPlan.plan_price*100),
                                recurring: {
                                    interval: 'month',
                                },
                                product_data: {
                                    name: getPlan.plan_name,
                                    //description: `$${getPlan.plan_price}/per month subscription of ${getPlan.plan_name} for convenient transfers.`
                                },
                            });

                            priceId = price.id;
                        }

                        // Create the subscription. Note we're expanding the Subscription's
                        // latest invoice and that invoice's confirmation_secret
                        // so we can pass it to the front end to confirm the payment
                        const subscription = await stripe.subscriptions.create({
                            customer: customerId,
                            items: [{
                                price: priceId,
                            }],
                            payment_behavior: 'default_incomplete',
                            payment_settings: { save_default_payment_method: 'on_subscription' },
                            expand: ['latest_invoice.confirmation_secret'],
                            metadata: {
                                plan_id: key,
                                user: userId,
                                type: "subscription"
                            },
                        });

                        return res.status(200).json({
                            status: true,
                            subscriptionId: subscription.id,
                            clientSecret: subscription.latest_invoice.confirmation_secret.client_secret,
                        });

                    }else{
                        return res.status(200).json({status: false, message: 'Invalid plan request.'});
                    }

                } catch (error) {
                    return res.status(200).json({status: false, message: error.message });
                }


            }else if(type === 'job'){

                const getJob = await JobModel.findById(key);

                if(getJob){


                    const siteConfigs = await SiteConfig.find(
                        {config_key:{$in:['job_post_price','job_boost_price']}},
                        'config_key config_type config_name config_value'
                    )
                    .then(result => {
                        const configMap = {};
                        result.forEach(value => {
                            configMap[value.config_key] = value.config_value;
                        });
                        return configMap;
                    });


                    let price = 0;
                    let description = '';


                    if (job_paid === 'true') {
                      price += Number(siteConfigs.job_post_price);
                      description += `Job Post Charge: $${siteConfigs.job_post_price}. `;
                    }

                    if (job_boost === 'true') {
                      price += Number(siteConfigs.job_boost_price);
                      description += `Job Boost Charge: $${siteConfigs.job_boost_price}. `;
                    }

                    const paymentIntent = await stripe.paymentIntents.create({
                        amount: (price*100),
                        currency: 'usd',
                        //customer: customer.id,
                        // In the latest version of the API, specifying the `automatic_payment_methods` parameter
                        // is optional because Stripe enables its functionality by default.
                        automatic_payment_methods: {
                            enabled: true,
                        },
                        metadata: {
                            job_id: key,
                            user: userId,
                            type: "job",
                            job_paid,
                            job_boost
                        },
                    });

                    return res.status(200).json({
                        status: true,
                        paymentIntent: paymentIntent.id,
                        client_secret: paymentIntent.client_secret,
                        // ephemeralKey: ephemeralKey.secret,
                        // customer: customer.id,
                        publishableKey: process.env.STRIPE_PUBLIC_KEY
                    });

                }else{
                    return res.status(200).json({status: false, message: 'Invalid job request!!'});
                }

            }else{

                const getPlan = await PackageModel.findById(key);

                if(getPlan.package_status){


                    /* const customer = await stripe.customers.create();

                    const ephemeralKey = await stripe.ephemeralKeys.create(
                        {customer: customer.id},
                        {apiVersion: '2024-12-18.acacia'}
                    ); */

                    const paymentIntent = await stripe.paymentIntents.create({
                        amount: (getPlan.package_price*100),
                        currency: 'usd',
                        //customer: customer.id,
                        // In the latest version of the API, specifying the `automatic_payment_methods` parameter
                        // is optional because Stripe enables its functionality by default.
                        automatic_payment_methods: {
                        enabled: true,
                        },
                        metadata: {
                            package_id: key,
                            user: userId,
                            type: "credits"
                        },
                    });

                    return res.status(200).json({
                        status: true,
                        paymentIntent: paymentIntent.id,
                        client_secret: paymentIntent.client_secret,
                        // ephemeralKey: ephemeralKey.secret,
                        // customer: customer.id,
                        publishableKey: process.env.STRIPE_PUBLIC_KEY
                    });

                }else{
                    return res.status(200).json({status: false, message: 'This package is currently unavailable. Please check back later or contact support if the issue persists.'});
                }

            }

        } catch (error) {
            return res.status(200).json({status: false, message: 'Invalid request!!'});
        }
    }

    async paymentresponse(req, res){

        try {
            const { key } = req.params;
            const { type } = req.query;

            const userId = req.user.userId;

            const user = await User.findOne({_id:userId});

            if(type === 'subscription'){

                const subscription = await stripe.subscriptions.retrieve(key);


                if(subscription && subscription.status === 'active'){

                    const metadata = subscription.metadata;

                    const getPlan = await PlanModel.findById(metadata.plan_id);

                    const isCheck = await Txn.findOne({session_id:subscription.id});

                    if(!isCheck && getPlan){

                        const invoice = await stripe.invoices.retrieve(subscription.latest_invoice);

                        const paymentIntent = await stripe.paymentIntents.retrieve(invoice.payment_intent);

                        await Txn.create({
                            plan:getPlan._id,
                            user:userId,
                            description: 'Subscription Purchase ('+getPlan.plan_name+') ',
                            amount: getPlan.plan_price,
                            credit: getPlan.plan_price,
                            type:'debit',
                            session_id: subscription.id,
                            payment_intent: invoice.payment_intent,
                            charge_id: paymentIntent.latest_charge,
                            invoice_pdf: invoice.hosted_invoice_url
                        });

                        const now = new Date();
                        const nextMonth = new Date(now.setMonth(now.getMonth() + 1));

                        await User.findOneAndUpdate(
                            {_id:user._id},
                            {$set: {
                                subscription_status:true,
                                subscription_date:new Date,
                                subscription_next_payment_date: nextMonth,
                                subscription_id: subscription.id,
                                customer_id: subscription.customer,
                                plan_id: getPlan._id,
                                plan_key:getPlan.plan_key,
                            }},
                            {new: true}
                        );


                        await sendEmail({
                            name: `${user.first_name} ${user.last_name}`,
                            email: user.email,
                            message : `
                                Thank you for purchasing a subscription plan on My First Job. Your account has been successfully upgraded, and all features are associated with your plan is now available.
                                <br/>
                                <br/>
                                You can view or download your payment receipt using the link below:
                                <br/>
                                <br/>
                                👉 <a href="${invoice.hosted_invoice_url}" traget="_blank">View Receipt</a>
                                <br/>
                                <br/>
                                If you have any questions or need assistance, feel free to reach out to our support team.
                                <br/>
                                <br/>
                                Best,
                                <br/>
                                The MyFirstJob Team
                            `,
                            key: "notification_email",
                            subject:"Thank You for Your Purchase – Plan Activated"
                        });
                    }

                    return res.status(200).json({
                        status: true,
                        checkout_status: subscription.status,
                        message: "You have successfully subscribed."
                    });

                }else{
                    return res.status(200).json({status: true, message: 'Invalid subscription request!!'});
                }
            }else{

                const session = await stripe.paymentIntents.retrieve(key);
                const metadata = session.metadata;

                if(session.status === 'succeeded'){

                    if(metadata.type === 'job'){

                        {
                            const getJob = await JobModel.findById(metadata.job_id);

                            const isCheck = await Txn.findOne({payment_intent:session.id});

                            if(!isCheck){

                                const charge = await stripe.charges.retrieve(session.latest_charge);

                                const siteConfigs = await SiteConfig.find(
                                    {config_key:{$in:['job_post_price','job_boost_price']}},
                                    'config_key config_type config_name config_value'
                                )
                                .then(result => {
                                    const configMap = {};
                                    result.forEach(value => {
                                        configMap[value.config_key] = value.config_value;
                                    });
                                    return configMap;
                                });

                                let mailSubject;
                                let mailMessage;

                                if(metadata.job_paid === 'true'){

                                    await Txn.create({
                                        job:getJob._id,
                                        user:userId,
                                        description: 'Post Job: ('+getJob.job_position+') ',
                                        amount: siteConfigs.job_post_price,
                                        credit: siteConfigs.job_post_price,
                                        type:'debit',
                                        session_id:session.id,
                                        payment_intent: session.id,
                                        charge_id: session.latest_charge,
                                        invoice_pdf: charge.receipt_url

                                    });

                                    getJob.paid_job = true;

                                    mailSubject = "Your ("+getJob.job_position+") Job Post Is Live – Payment Received";

                                    mailMessage = `

                                        Thank you for posting your (${getJob.job_position}) job on My First Job! Your job has been successfully published.
                                        <br/>
                                        <br/>
                                        🧾 You can view your payment receipt here:
                                        <br/>
                                        👉 <a href="${charge.receipt_url}" traget="_blank">View Receipt</a>
                                        <br/>
                                        <br/>
                                        If you have any questions, feel free to reach out. We're happy to help!
                                        <br/>
                                        <br/>
                                        Best,
                                        <br/>
                                        The MyFirstJob Team
                                    `;

                                    getJob.job_status = true;
                                }

                                if(metadata.job_boost === 'true'){

                                    await Txn.create({
                                        job:getJob._id,
                                        user:userId,
                                        description: ' Job Boost Service: ('+getJob.job_position+') ',
                                        amount: siteConfigs.job_boost_price,
                                        credit: siteConfigs.job_boost_price,
                                        type:'debit',
                                        session_id:session.id,
                                        payment_intent: session.id,
                                        charge_id: session.latest_charge,
                                        invoice_pdf: charge.receipt_url
                                    });

                                    getJob.job_boost = true;

                                    mailSubject = "Your ("+getJob.job_position+") Job  Has Been Boosted Successfully";

                                    mailMessage = `

                                        Thanks for boosting your (${getJob.job_position}) job post on My First Job! Your job is now featured at the top for maximum visibility.
                                        <br/>
                                        <br/>
                                        🧾 You can view your payment receipt here:
                                        <br/>
                                        👉 <a href="${charge.receipt_url}" traget="_blank">View Receipt</a>
                                        <br/>
                                        <br/>
                                        We appreciate your trust in us. If you need any help, just let us know!
                                        <br/>
                                        <br/>
                                        Best,
                                        <br/>
                                        The MyFirstJob Team
                                    `;
                                }

                                await getJob.save();

                                if(metadata.job_paid === 'true' && metadata.job_boost === 'true'){

                                    mailSubject = "Your ("+getJob.job_position+") Job Post Is Live and Featured!";

                                    mailMessage = `
                                        Thank you for posting your (${getJob.job_position}) job on My First Job and choosing to boost it for extra visibility! Your job is now live and featured at the top to attract more candidates.
                                        <br/>
                                        <br/>
                                        🧾 You can view your payment receipt here:
                                        <br/>
                                        👉 <a href="${charge.receipt_url}" traget="_blank">View Receipt</a>
                                        <br/>
                                        <br/>
                                        We’re excited to help you find the right talent. If you have any questions, feel free to reach out!
                                        <br/>
                                        <br/>
                                        Best,
                                        <br/>
                                        The MyFirstJob Team
                                    `;
                                }

                                await sendEmail({
                                    name: `${user.first_name} ${user.last_name}`,
                                    email: user.email,
                                    message : mailMessage,
                                    key: "notification_email",
                                    subject: mailSubject
                                });

                            }


                            res.send({
                                status: true,
                                checkout_status: session.status,
                                message: 'You job successfully posted.'
                                //data:session
                            });

                        }

                    }else{

                        const getPlan = await PackageModel.findById(session.metadata.package_id);

                        const isCheck = await Txn.findOne({payment_intent:session.id});

                        if(!isCheck){
                            await Txn.create({
                                packages:getPlan._id,
                                user:userId,
                                description: 'Credit Purchase',
                                amount: getPlan.package_price,
                                credit: getPlan.package_credits,
                                type:'credit',
                                session_id:session.id,
                                payment_intent: session.id
                            });

                            await User.findOneAndUpdate(
                                {_id:user._id},
                                {$set: {user_credit:(parseFloat(user.user_credit||0) + parseFloat(getPlan.package_credits))}},
                                {new: true}
                            );
                        }

                        res.send({
                            status: true,
                            checkout_status: session.status,
                            message: 'Your wallet has been successfully credited.'
                            //data:session
                        });
                    }

                }else{
                    res.send({
                        status: false,
                        checkout_status: session.status
                    });
                }

            }

        } catch (error) {
            return res.status(200).json({status: true, message: error.message});
        }
    }

}

async function handleLMSAccess(userId, txn) {
    const levels = await LevelModel.find({}, 'price').populate({
        path: 'paths',
        select: "credit_price",
        populate: {
            path: 'skills',
            select: "credit_price"
        }
    });

    for (const level of levels) {
        const isBuy = await PurchaseModules.countDocuments({ user: userId, type: 'level', level: level._id });
        if (!isBuy) {
            await PurchaseModules.create({ level: level._id, user: userId, credit: level.price, type: 'level', txn: txn._id });

            for (const path of level.paths) {
                const isPBuy = await PurchaseModules.countDocuments({ user: userId, type: "path", path: path._id });
                if (!isPBuy) {
                    await PurchaseModules.create({ path: path._id, user: userId, credit: path.credit_price, type: 'path', txn: txn._id });

                    for (const skill of path.skills) {
                        const isSBuy = await PurchaseModules.countDocuments({ user: userId, type: { $in: ['skill', 'internal'] }, skill: skill._id });
                        if (!isSBuy) {
                            await PurchaseModules.create({ skill: skill._id, user: userId, credit: skill.credit_price, type: 'skill', txn: txn._id });
                        }
                    }
                }
            }
        }
    }
}

async function handleJobs(user) {

    const jobs = await JobModel.find({user_id: user._id }).sort({createdAt:-1});

    if(jobs.length > 0){

        const planType = user.plan_id.plan_key;
        const planJob = user.plan_id.plan_job;

        let i = 1;
        for(const job of jobs){

            switch (planType) {

                case 'free_plan':
                    if(!job.paid_job){
                        if(i > planJob){
                            job.job_status = false;
                        }
                        job.job_boost = false;
                    }
                break;

                case 'pro_plan':

                    if(!job.paid_job && i > planJob){
                        job.job_status = false;
                    }

                    job.job_boost = false;
                break;

                case 'premium_plan':

                    if(!job.paid_job && i > planJob){
                        job.job_status = false;
                    }
                    job.job_boost = true;

                break;

                case 'enterprise_plan':
                    job.job_boost = true;
                break;
            }

            if (!job.coordinate || !Array.isArray(job.coordinate.coordinates)) {
                job.coordinate = { type: "Point", coordinates: [0, 0] }; // or whatever default makes sense
            }

            if (!job.credited_by) {
                job.credited_by = user._id;
            }

            await job.save();

            if(!job.paid_job){
                i++;
            }
        }

    }
}


module.exports = Checkout;