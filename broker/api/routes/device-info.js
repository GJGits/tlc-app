const express = require("express");
const router = express.Router();
const fs = require('fs');

router.get('/ip', (req, res, next) => {
    return res.status(200).send('192.168.1.5');
});

module.exports = router;
