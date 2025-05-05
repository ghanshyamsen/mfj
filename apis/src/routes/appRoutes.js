const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');
const path = require('path');

const Profile = require('../app/controllers/appProfileController');
const Objective = require('../app/controllers/objectiveController');
const Resume = require('../app/controllers/resumeController');
const ResumeData = require('../app/controllers/resumeDataController');
const Faq = require('../app/controllers/faqController');
const Tutorial = require('../app/controllers/tutorialController');
const Config = require('../app/controllers/configController');
const Payment = require('../app/controllers/paymentController');
const Roles = require('../app/controllers/rolesController');
const SubUser = require('../app/controllers/subuserController');
const Jobs = require('../app/controllers/jobController');
const Company = require('../app/controllers/companyController');
const ResumeBuilder = require('../app/controllers/resumebuilderController');
const Support = require('../app/controllers/supportController');
const Review = require('../app/controllers/reviewController');
const PDF = require('../app/controllers/pdfController');
const Notification = require('../app/controllers/notificationController');
const JobSuggestion = require('../app/controllers/jobSuggestionsController');
const Article = require("../app/controllers/articleController");
const Analytics = require('../app/controllers/analyticsController');
const Package = require('../app/controllers/packagesController');
const CheckOut = require('../app/controllers/checkoutController');
const Learning = require('../app/controllers/learningController');
const Transaction = require('../app/controllers/transactionController');
const Badges = require("../app/controllers/badgeController");
const MessageTemplate = require("../app/controllers/messagetemplateController");
const Scheduler = require("../app/controllers/schedulerController");
const ProductCategory = require("../app/controllers/productcategoryController");
const Product = require("../app/controllers/productController");


const { handle } = require("../app/middleware/appauth");

const chatRoutes = require("./chatRoutes");
const teenagerRoutes = require("./teenagerRoutes");

const personalityTypeRoutes = require('./personalityTypeRoutes');
const personalityProfileRoutes = require('./personalityProfileRoutes');

const employeesAassessmentsRoutes = require('./employeesAassessmentsRoutes');
const employersAassessmentsRoutes = require('./employersAassessmentsRoutes');

const directoryPath = 'uploads/avtar/';
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

// Define storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directoryPath);
  },
  filename: function (req, file, cb) {
    // Determine the field name and generate a unique filename
    const fieldName = file.fieldname;
    const originalName = file.originalname;
    const uniqueFileName = generateRandomKey(10) + originalName;
    cb(null, uniqueFileName);
  }
});

// Check file type
function checkFileType(file, cb) {

  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    //cb(new Error('Error: Only JPEG, JPG, and PNG files are allowed!'));
    cb(null, false);  // Pass `false` to indicate invalid file type
  }
}

// Create a Multer instance with the storage options
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 20MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

const configUpload = upload.fields([
  { name: 'profile_image', maxCount: 1 }
]);



// Create an instance of the class
const profileInstance = new Profile();
const objectiveInstance = new Objective();
const resumeInstance = new Resume();
const resumeDataInstance = new ResumeData();
const faqInstance = new Faq();
const tutorialInstance = new Tutorial();
const paymentInstance = new Payment();
const rolesInstance = new Roles();
const subuserInstance = new SubUser();
const jobInstance = new Jobs();
const companyInstance = new Company();
const ResumeBuilderInstance = new ResumeBuilder();
const SupportrInstance = new Support();
const ReviewInstance = new Review();
const PDFInstance = new PDF();
const NotificationInstance = new Notification();
const JobSuggestionInstance = new JobSuggestion();
const ArticleInstance = new Article();
const AnalyticsInstance = new Analytics();
const PackageInstance = new Package();
const CheckOutInstance = new CheckOut();
const LearningInstance = new Learning();
const TransactionInstance = new Transaction();
const badgeInstance = new Badges();
const messageTemplateInstance = new MessageTemplate();
const SchedulerInstance = new Scheduler();
const ProductCategoryInstance = new ProductCategory();
const ProductInstance = new Product();

// Define routes
/** Profile */
router.get("/get-profile/:key", handle, profileInstance.get);
router.patch("/update-profile/:key", handle, profileInstance.update);
router.patch("/update-password/:key", handle, profileInstance.resetpassword);
//router.patch("/update-profile-image/:key", [configUpload, handle], profileInstance.profileimage);
router.get("/get-badges/:key", handle, profileInstance.getbadges);


router.patch("/update-profile-image/:key", handle, (req, res, next) => {
  uploadFile(req, res, directoryPath, ['jpeg', 'jpg', 'png', 'svg'], 'profile_image', 'single',5).then((result) => {
    if(result.status){
      let fname = result.file.filename;
      if(fname){
        req.body.profile_image = fname;
      }
      profileInstance.profileimage(req, res);
    }else{
      profileInstance.profileimage(req, res);
      //res.status(200).json({status:false, message:result.message});
    }
  }).catch((err) => {
    res.status(200).json({status:false, message:err.message});
  });
});

router.patch("/update-company", handle, (req, res, next) => {
  uploadFile(req, res, directoryPath, ['jpeg', 'jpg', 'png', 'svg'], 'company_logo', 'single',5).then((result) => {
    console.log(result);
    if(result.status){
      let fname = result.file.filename;
      if(fname){
        req.body.company_logo = fname;
      }
      profileInstance.updatecompany(req, res);
    }else{
      if(result.message =='No file selected'){
        profileInstance.updatecompany(req, res);
      }else{
        res.status(200).json({status:false, message:result.message});
      }
    }
  }).catch((err) => {
    res.status(200).json({status:false, message:err.message});
  });
});

router.delete("/delete-company-image", handle, profileInstance.deletecompanyimage);

router.delete("/delete-account", handle, profileInstance.deleteaccount);
router.get("/get-company/:key", handle, profileInstance.getcompany);

/** User Setting */
router.get("/get-user-settings/:key", handle, profileInstance.getusersettings);
router.patch("/update-user-settings/:key", handle, profileInstance.updateusersettings);

/** Get Set Goals */
router.get('/get-set-goals', handle, profileInstance.getgoals);

/** Objective */
router.get("/get-objective", handle, objectiveInstance.get);

/** Resume */
router.get("/get-resume", handle, resumeInstance.get);
router.patch("/update-resume", handle, resumeInstance.update);
router.post("/upload-resume-image/:key?", handle, (req, res, next) => {
  uploadFile(req, res, 'uploads/resume/', ['jpeg', 'jpg', 'png', 'svg'], 'image', 'single',5).then((result) => {
      if(result.status){
        let fname = result.file.filename;
        if(fname){
          req.body = {
            image: fname
          };
        }
        resumeInstance.update(req, res);
      }else{
        if(result.message =='No file selected'){
          resumeInstance.update(req, res);
        }else{
          res.status(200).json({status:false, message:result.message});
        }
      }
  }).catch((err) => {
      res.status(200).json({status:false, message:err.message});
  });
});
router.delete("/delete-resume-image", handle, resumeInstance.delete);

/** Resume Data's */
router.get("/get-skills", handle, resumeDataInstance.getskills);
router.get("/get-skill-assessment", handle, resumeDataInstance.getskillsassessment);
router.get("/get-schools", handle, resumeDataInstance.getschools);
router.get("/get-academic", handle, resumeDataInstance.getacademic);
router.get("/get-coursework", handle, resumeDataInstance.getcoursework);
router.get("/get-activities", handle, resumeDataInstance.getactivities);
router.get("/get-volunteer-skills", handle, resumeDataInstance.getvolunteerskills);
router.get("/get-hobbies", handle, resumeDataInstance.gethobbies);

/** Get Faq's/Tutorials/Data Privacy */
router.get("/get-faqs/:key?", handle, faqInstance.getfaqs);
router.get("/get-tutorials/:key?", handle, tutorialInstance.gettutorials);
router.get("/data-privacy", handle, Config.getdataprivacy);

/** Payments */
router.get("/get-payment/:key?", handle, paymentInstance.get);
router.post("/add-payment", handle, paymentInstance.create);
router.patch("/update-payment/:key", handle, paymentInstance.update);
router.delete("/delete-payment/:key", handle, paymentInstance.delete);

/** Roles */
router.get("/get-role/:key?", handle, rolesInstance.get);
router.post("/add-role", handle, rolesInstance.create);
router.patch("/update-role/:key", handle, rolesInstance.update);
router.delete("/delete-role/:key", handle, rolesInstance.delete);

/** Sub User */
router.get("/get-sub-user/:key?", handle, subuserInstance.get);
router.post("/add-sub-user", handle, subuserInstance.create);
router.patch("/update-sub-user/:key", handle, subuserInstance.update);
router.delete("/delete-sub-user/:key", handle, subuserInstance.delete);

/** Jobs */
router.post("/get-matched-jobs", handle, jobInstance.getmatched);
router.post("/get-matched-candidate/:key", handle, jobInstance.getmatchedcandidate);
router.post("/job-invitation", handle, jobInstance.jobinvitation);
router.get("/get-jobs/:key?", handle, jobInstance.getjobs);
router.get("/get-company-jobs/:key?", handle, jobInstance.getcompanyjobs);
router.post("/create-job", handle, jobInstance.create);
router.patch("/update-job/:key", handle, jobInstance.update);
router.delete("/delete-job/:key", handle, jobInstance.delete);

/** Job Views */
router.get("/get-job-views", handle, jobInstance.getjobviews);
router.post("/create-job-views", handle, jobInstance.jobviews);


/** Applications */
router.get("/get-applied-job", handle, jobInstance.getappliedjobs);
router.post("/applied-job", handle, jobInstance.appliedjobs);
router.patch("/update-applied-job/:key", handle, jobInstance.updateappliedjobs);
router.delete("/delete-applied-job/:key", handle, jobInstance.deleteappliedjob);

/** Reports */
router.get("/get-reports", handle, jobInstance.getreports);
router.post("/job-reports", handle, jobInstance.jobreports);

/** Company */
router.get("/get-candidates", handle, companyInstance.getcandidates);
router.get("/get-save-candidate/:uid/:cid", handle, companyInstance.getsavedcandident);
router.get("/get-save-candidates/:key", handle, companyInstance.getsavedcandidents);
router.post("/save-candidates", handle, companyInstance.savedcandidents);
router.delete("/delete-candidates/:key", handle, companyInstance.deletecandidents);
router.get("/get-matched-candidates/:key", handle, companyInstance.getmatchedcandidates);

/** Resume */
router.get("/get-resume-builder/:key?", handle, ResumeBuilderInstance.get);

/** Support  */
router.post('/email-us', handle, SupportrInstance.emailus);
router.post('/mail-personal-data', handle, SupportrInstance.maildata);

/** Candidate Review */
router.get('/get-review-of-candidate/:key?', handle, ReviewInstance.getcandidatereviews);
router.post('/review-to-candidate', handle, ReviewInstance.reviewtocandidate);
router.patch('/update-review-of-candidate/:key', handle, ReviewInstance.updatecandidatereview);
router.delete('/delete-review-of-candidate/:key', handle, ReviewInstance.deletecandidatereview);

/** Employer Review */
router.get('/get-review-of-employer/:key?', handle, ReviewInstance.getemployerreviews);
router.post('/review-to-employer', handle, ReviewInstance.reviewtoemployer);
router.patch('/update-review-of-employer/:key', handle, ReviewInstance.updateemployerreview);
router.delete('/delete-review-of-employer/:key', handle, ReviewInstance.deleteemployerreview);

/** Generate PDF */
router.post('/generate-pdf', handle, PDFInstance.generate);

/** Notificaion */
router.get('/get-notificaion', handle, NotificationInstance.get);
router.get('/read-notificaion', handle, NotificationInstance.markread);

/* Job Suggestions */
router.get('/find-job-suggestions', handle, JobSuggestionInstance.findjob);

/* Articles  */
router.get('/get-articles/:key?', handle, ArticleInstance.getarticles);

/* Analytics */
router.get('/get-analytics', handle, AnalyticsInstance.getanalytics);
router.post('/post-clicks', handle, AnalyticsInstance.postclicks);

/* Packages */
router.get('/get-packages/:key?', handle, PackageInstance.getpackages);

/** LMS */
router.get('/create-payment/:key', handle, CheckOutInstance.createpayment);
router.get('/payment-response/:key', handle, CheckOutInstance.checkoutresponse);
router.get('/get-txn', handle, CheckOutInstance.gettxn);
router.post('/assign-credits', handle, CheckOutInstance.assgincredits);
router.post('/purchase-module', handle, CheckOutInstance.purchasemodule);
router.get('/cancel-subscription', handle, CheckOutInstance.cancelsubscription);


/** APP */
router.get('/create-payment-intent/:key', handle, CheckOutInstance.createpaymentintent);
router.get('/payment-intent-response/:key', handle, CheckOutInstance.paymentresponse);

/** APP */
router.post('/stripe-webhook-response', CheckOutInstance.webhookresponse);


/** Learning  */
router.get('/get-plans', handle, LearningInstance.getplans);
router.get('/get-levels', handle, LearningInstance.getlevels);
router.get('/get-learning-skill/:key?', handle, LearningInstance.getskill);
router.get('/get-learning-path/:key?', handle, LearningInstance.getpath);
router.get('/my-learning', handle, LearningInstance.mylearning);
router.post('/leave-path-review/:key', handle, LearningInstance.pathreview);
router.get('/get-material/:key', handle, LearningInstance.getmaterial);
router.get('/get-material/:key', handle, LearningInstance.getmaterial);
router.get('/get-assessment/:key', handle, LearningInstance.getassessment);
router.post('/mark-completed', handle, LearningInstance.completedchapter);
router.get('/lms-reviews', handle, LearningInstance.getreviews);

router.get('/result/:key', handle, LearningInstance.result);
router.get('/check-purchased/:type/:key', handle, LearningInstance.checkpurchased);
router.get('/get-golas', handle, LearningInstance.getgolas);
router.get('/get-leader-board', handle, LearningInstance.getleaderboard);

router.get('/get-purchased-modules/:key',handle, LearningInstance.getpurchasedmodule);

router.get('/get-message-template', handle, messageTemplateInstance.gettemplate);
router.get('/get-badge-list', handle, badgeInstance.getbadge);
router.post('/assign-badge', handle, badgeInstance.assignbadge);

router.post('/set-reminder', handle, SchedulerInstance.create);


/** Chat */
router.use('/chat', handle, chatRoutes);

/** Teenager */
router.use('/teenager', handle, teenagerRoutes);

/* Personality Profile */
router.use('/personality-profile', personalityProfileRoutes);

/* Personality Type */
router.use('/personality-type', personalityTypeRoutes);

/* Employers Assessments */
router.use('/employers-assessments', employersAassessmentsRoutes);

/* Employees Assessments */
router.use('/employees-assessments', employeesAassessmentsRoutes);


/** Products */
router.get('/get-product-category', handle, ProductCategoryInstance.getproductcategory);
router.get('/get-products/:key?', handle, ProductInstance.getproducts);
router.get('/get-orders', handle, ProductInstance.getorders);


router.get('/*', (req, res) => {
  res.status(400).send('This is an API endpoint. It cannot be accessed directly in a browser.');
});


module.exports = router;