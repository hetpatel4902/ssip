const { application, json } = require('express')
const express = require('express')
const router = express.Router()

const {paymentsheet,webhook,createcheckoutsession} = require('../controllers/payments')

router.route('/payment-sheet').post(paymentsheet)
router.route('/webhook').post(express.raw({type:application/json}),webhook)
router.route('/create-checkout-session').post(createcheckoutsession);

module.exports = router
