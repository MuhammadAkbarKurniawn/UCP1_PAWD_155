const express = require('express');
const app = express();
const patientRoutes = require('./routes/patient.js');
const doctorRoutes = require('./routes/doctors.js');
require('dotenv').config();
const port = process.env.PORT;
const db = require('./database/db');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes.js');
const { isAuthenticated } = require('./middlewares/middleware.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);

// Konfigurasi express-session
app.use(session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false,
   cookie: { secure: false } // Set ke true jika menggunakan HTTPS
}));

app.use('/', authRoutes);
app.use('/patients', patientRoutes);
app.use('/doctors', doctorRoutes);
app.set('view engine', 'ejs');

app.get('/', isAuthenticated, (req, res) => {
   res.render('index', {
      layout: 'layouts/main-layout',
   });
});

app.get('/contact', isAuthenticated, (req, res) => {
   res.render('contact', {
      layout: 'layouts/main-layout',
   });
});

app.get('/todo-view', isAuthenticated, (req, res) => {
   db.query('SELECT * FROM patients', (err, patients) => {
       if (err) return res.status(500).send('Internal Server Error');
       res.render('todo', {
           layout: 'layouts/main-layout',
           patients: patients
       });

   });
});

app.get('/todo', isAuthenticated, (req, res) => {
    db.query('SELECT * FROM doctors', (err, doctors) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('doctors', {
            layout: 'layouts/main-layout',
            doctors: doctors
        });
    });
});

app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}/`);
});
