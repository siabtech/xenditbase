const express = require('express');
const router = express.Router();
const routers = require('./routers');


router.get('/', (req, res) => res.send('server is running'));
router.use('/xendit', routers)

module.exports = router;