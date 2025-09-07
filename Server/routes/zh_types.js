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

router.post('/', (req, res) => {
    const { assignments, active } = req.body;
    fs.writeFile(zhPath, JSON.stringify({ assignments, active }), err => {
        if (err) return res.status(500).json({ message: 'Error saving assignments.' });
        res.json({ message: 'Assignments updated.' });
    });
});

module.exports = router;