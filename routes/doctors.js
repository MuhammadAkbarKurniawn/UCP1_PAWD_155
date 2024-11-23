const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua dokter
router.get('/', (req, res) => {
    db.query('SELECT * FROM doctors', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

// Endpoint untuk mendapatkan dokter berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM doctors WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Doctor not found');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan dokter baru
router.post('/', (req, res) => {
    const { name, specialization, phone } = req.body;
    if (!name || !specialization || !phone) {
        return res.status(400).send('Name, specialization, and phone are required');
    }

    db.query('INSERT INTO doctors (name, specialization, phone) VALUES (?, ?, ?)', [name, specialization, phone], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newDoctor = { id: results.insertId, name, specialization, phone };
        res.status(201).json(newDoctor);
    });
});

// Endpoint untuk memperbarui dokter
router.put('/:id', (req, res) => {
    const { name, specialization, phone } = req.body;
    db.query('UPDATE doctors SET name = ?, specialization = ?, phone = ? WHERE id = ?', [name, specialization, phone, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Doctor not found');
        res.json({ id: req.params.id, name, specialization, phone });
    });
});

// Endpoint untuk menghapus dokter
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM doctors WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Doctor not found');
        res.status(204).send();
    });
});

module.exports = router;
