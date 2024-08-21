const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const userRoutes = require('./routes/user');
const forumRoutes = require('./routes/forum');
const listRoutes = require('./routes/lists');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'talha123_45', // Replace with a secure key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use('/users', userRoutes);
app.use('/forums', forumRoutes);
app.use('/lists', listRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
