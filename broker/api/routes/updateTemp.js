const express = require("express");
const router = express.Router();
const fs = require('fs');
const cors = require('cors');

router.options('/', cors());

router.post('/', (req, res, next) => {
   console.log('Hey');
});

module.exports = router;
