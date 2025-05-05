const express = require("express");
const router = express.Router();
const Txn = require("../app/controllers/transactionController");

const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const TxnInstance = new Txn();


// Define routes
router.get("/get/:key?", handle, TxnInstance.get);
router.get("/module/:key?", handle, TxnInstance.module);
router.get("/job/:key?", handle, TxnInstance.job);
router.get("/plan/:key?", handle, TxnInstance.plan);


module.exports = router;
