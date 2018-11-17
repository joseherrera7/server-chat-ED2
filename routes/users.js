var express = require('express');
var router = express.Router();
var User = require('../models/userModel')
var jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', (req, res, next) => {

  User.find({}, function (error, users) {
    if (error) {
      const error = new Error('There is not users');
      error.status = 404;
      next(error);
    } else {

      res.status(200).send(users);
    }
  })
});

exports.register = function(req, res) {
  var newUser = new User(req.body);
  
  newUser.save(function(err, user) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      user.hash_password = undefined;
      return res.json(user);
    }
  });
};

exports.sign_in = function(req, res) {
  User.findOne({
    mail: req.body.mail
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.status(401).json({ message: 'Authentication failed. User not found.' });
    } else if (user) {
      if (!user.comparePassword(req.body.password)) {
        res.status(401).json({ message: 'Authentication failed. Wrong password.' });
      } else {
        return res.json({token: jwt.sign({ mail: user.mail, name: user.name, _id: user._id}, 'ESTRUCTURAS')});
      }
    }
  });
};

exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};
//GetJWT
router.get('/jwt', (req, res, next) => {

  jwt.sign()
});

//Register new user
router.post('/', (req, res, next) => {
  let newUser = new User(
    {
      user: req.body.user,
      name: req.body.name,
      mail: req.body.mail,
      password: req.body.password
    }
  );
  newUser.save(function (err) {
    if (err) {
      const error = new Error('Error: failed to insert to DB');
      error.status = 400;
      next(error);
    }
    res.status(200).send('User created sucessfully')
  });
});

//Get an user
router.get('/:userID', (req, res, next) => {
  const id = req.params.userID;
  User.findById(id, function (err, document) {
    if (err) {
      return next(err);
    }
    res.status(200).send(document);
  })
});

//Modify an user
router.put('/:userID', (req, res, next) => {
  const id = req.params.userID;
  User.findById(id, function (error, document) {
    if (error) {
      res.send('Error: failed to modify the user.');
    } else {
      var user = document;
      user.user = req.body.user;
      user.password = req.body.password;
      user.mail = req.body.mail;
      user.name = req.body.name;
      user.save(function (error, document) {
        if (error) {
          res.status(500).send('Error: failed to save the user');
        } else {
          res.status(200).send('User updated')
        }
      });
    }
  });
});

//Delete an user
router.delete('/:user', (req, res, next) => {
  const id = req.params.user;
  User.findOneAndDelete({ nombre: id }, function (error) {
    if (error) {
      res.status(500).send('Error: failed to delete the user');
    } else {
      res.status(200).send('Delete sucessfull');
    }
  });
});
module.exports = router;