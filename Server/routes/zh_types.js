const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const zhPath = path.join(__dirname, '../data/zh.json');
router.get('/', (req, res) => {
    fs.readFile(zhPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Error reading assignments.' });
        res.json(JSON.parse(data));
    });
});
