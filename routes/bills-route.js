var express = require('express');
var router = express.Router();
var billController=require('../controllers/bill-controller');

router.post('/',async function(req, res, next) {
    await(billController.addBill(req, res));
});


module.exports = router;
