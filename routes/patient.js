const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua pasien
router.get('/', (req, res) => {
    db.query('SELECT * FROM patients', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

// Endpoint untuk mendapatkan pasien berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM patients WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Pasien tidak ditemukan');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan pasien baru
router.post('/', (req, res) => {
    const { name, age, diagnosis } = req.body;
    if (!name || !age || !diagnosis) {
        return res.status(400).send('Semua kolom harus diisi');
    }

    db.query('INSERT INTO patients (name, age, diagnosis) VALUES (?, ?, ?)', [name.trim(), age, diagnosis.trim()], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newPatient = { id: results.insertId, name: name.trim(), age, diagnosis: diagnosis.trim() };
        res.status(201).json(newPatient);
    });
});

// Endpoint untuk memperbarui pasien
router.put('/:id', (req, res) => {
    const { name, age, diagnosis } = req.body;

    db.query('UPDATE patients SET name = ?, age = ?, diagnosis = ? WHERE id = ?', [name, age, diagnosis, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Pasien tidak ditemukan');
        res.json({ id: req.params.id, name, age, diagnosis });
    });
});

// Endpoint untuk menghapus pasien
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM patients WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Pasien tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;
