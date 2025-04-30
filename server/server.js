require('dotenv').config();
require("./config/postgresql");
const cron = require('node-cron');
const express = require('express');
const app = express();
var multer = require('multer');
var upload = multer();
const path = require('path');
const cors = require('cors');
const moment = require('moment');
const ContactsImportQueue = require('./model/contactsImportQueue');
const PORT = process.env.PORT || 3500;

// Cross Origin Resource Sharing
app.use(cors());

app.use(express.static(path.join(__dirname, '../client/dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// });

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));


// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

app.use('/api/v1/uploads', express.static(path.join(__dirname, 'uploads')));
// for parsing multipart/form-data



// routes
app.use('/api/v1/login', require('./routes/login'));
app.use('/api/v1/users', require('./routes/subAdmin'));
app.use('/api/v1/contacts', require('./routes/contacts'));
app.use('/api/v1/tickets', require('./routes/tickets'));
app.use('/api/v1/solutions', require('./routes/solution'));
app.use('/api/v1/expenses', require('./routes/expense'));
app.use('/api/v1/categories', require('./routes/category'));
app.use('/api/v1/company', require('./routes/company'));
app.use('/api/v1/report', require('./routes/report'));

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('json')) {
    res.json({ "error": "404 Not Found" });
  } else {
    res.type('txt').send("404 Not Found");
  }
});

(async () => {
  const now = new Date();

  // Get hours, minutes, and seconds
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  
  await ContactsImportQueue.processImport();

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
})();