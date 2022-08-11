const express = require('express');
const {payController} = require('../controller');
const router = express.Router();

router.get('/balance/:params', payController.balance);
router.get('/ewallet/:name/:phone/:metode/:jumlah', payController.ewallet);
router.get('/buatqr', payController.buatqr);
router.get('/cekqr/:params', payController.cekqr);
router.get('/bayarqr/:params', payController.bayarqr);
router.get('/aha', payController.aha);

//DB
router.get('/bacaDB', payController.bacaDB);
router.post('/inputDB', payController.inputDB);

//gang callbacks
router.post('/fva_success_c', payController.fva_success_c);
router.get('/fva_success_c', payController.fva_success_c);

router.post('/db_connected_c', payController.db_connected_c);
router.get('/db_connected_c', payController.db_connected_c);

router.post('/balance_c', payController.balance_c);
router.get('/balance_c', payController.balance_c);

router.post('/metode_c', payController.metode_c);
router.get('/metode_c', payController.metode_c);

router.post('/status_ewallet_c', payController.status_ewallet_c);
router.get('/status_ewallet_c', payController.status_ewallet_c);

router.post('/success', payController.success);
router.get('/success', payController.success);

router.post('/failure', payController.failure);
router.get('/failure', payController.failure);

module.exports = router;