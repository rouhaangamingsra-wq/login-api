var express = require('express');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
require('dotenv').config();

var app = express();
app.use(express.json());
app.use(express.static('.'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var dbUrl = process.env.MONGODB_URI;
mongoose.connect(dbUrl).then(function() {
  console.log('db connected');
}).catch(function(err) {
  console.log('db connection error: ' + err);
});

var userSchema = new mongoose.Schema({
  email: String,
  password: String
});

var User = mongoose.model('User', userSchema);

app.post('/signup', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) {
    res.status(400).json({ message: 'email and password are required' });
    return;
  }

  User.findOne({ email: email }).then(function(found) {
    if (found) {
      res.status(409).json({ message: 'email already exists' });
      return;
    }
    return bcrypt.hash(password, 10).then(function(hash) {
      var newUser = new User({ email: email, password: hash });
      return newUser.save();
    }).then(function() {
      res.status(201).json({ message: 'user created' });
    });
  }).catch(function(err) {
    res.status(500).json({ message: 'something went wrong' });
  });
});

app.post('/login', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) {
    res.status(400).json({ message: 'email and password are required' });
    return;
  }

  User.findOne({ email: email }).then(function(user) {
    if (!user) {
      res.status(401).json({ message: 'invalid credentials' });
      return;
    }
    return bcrypt.compare(password, user.password).then(function(result) {
      if (!result) {
        res.status(401).json({ message: 'invalid credentials' });
        return;
      }
      res.json({ message: 'login successful' });
    });
  }).catch(function(err) {
    res.status(500).json({ message: 'something went wrong' });
  });
});

app.listen(3000, function() {
  console.log('server running on port 3000');
});
