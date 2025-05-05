const Txn = require("../../models/transaction");
const PurchaseModules = require("../../models/purchasemodules");

class Transaction {

    async get(req, res) {

        try {
            const {key} = req.params;
            const userId = req.user.userId;
            let find = {};

            if(key){
                find.user = key;
            }else{
                find.packages =  { $exists: true, $ne: "", $ne: null };
            }

            const txn = await Txn.find(find,'description amount credit type createdAt payment_intent')
            .sort({createdAt:-1})
            .populate('user','first_name last_name')
            .populate('packages','package_name');

            return res.status(200).json({status: true, data: txn});

        } catch (error) {
            return res.status(200).json({status: false, message: error.message});
        }

    }

    async module(req, res) {

        try {
            const {key} = req.params;
            const userId = req.user.userId;
            let find = {type: {$in: ['skill','path']}};

            const txn = await PurchaseModules.find(find,'credit createdAt type')
            .sort({createdAt:-1})
            .populate('user','first_name last_name')
            .populate('txn','description');

            return res.status(200).json({status: true, data: txn});

        } catch (error) {
            return res.status(200).json({status: false, message: error.message});
        }

    }

    async job(req, res) {

        try {
            const {key} = req.params;
            const userId = req.user.userId;

            const find = {
                job: { $exists: true, $type: 'objectId' }
            };

            const txn = await Txn.find(find,'description charge_id amount createdAt')
            .sort({createdAt:-1})
            .populate('user','first_name last_name');

            return res.status(200).json({status: true, data: txn});

        } catch (error) {
            return res.status(200).json({status: false, message: error.message});
        }

    }

    async plan(req, res) {

        try {

            const {key} = req.params;

            const userId = req.user.userId;

            const find = {
                plan: { $exists: true, $type: 'objectId' }
            };

            const txn = await Txn.find(find,'description charge_id amount createdAt')
            .sort({createdAt:-1})
            .populate('user','first_name last_name');

            return res.status(200).json({status: true, data: txn});

        } catch (error) {
            return res.status(200).json({status: false, message: error.message});
        }

    }



}

module.exports = Transaction;