const express = require('express');
const router = express.Router();
const { getTables, addTable } = require('../controllers/tableController');

router.get('/tables', getTables);
router.post('/tables', addTable);

module.exports = router;
