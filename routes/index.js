var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var Chat = require('../models/chatModel')
var VerifyToken = require('../auth/VerifyToken');
router.use(bodyParser.urlencoded({ extended: true }));

/* GET users listing. */
router.get('/', VerifyToken, function (req, res) {
  Chat.find({}, function (err, chats) {
    if (err) return res.status(500).send("There was a problem finding the chats.");
    res.status(200).send({chats});
  });
});

/*router.post('/', [multer.single('attachment')], function (req, res, next) {
  return storeWithOriginalName(req.file)
    .then(encodeURIComponent)
    .then(encoded => {
      res.redirect(`/upload/success?fileName=${encoded}`)
    })
    .catch(next)
})*/


//Register new chat
router.post('/', VerifyToken,(req, res, next) => {
  Chat.create({
    user1: req.body.user1,
    user2: req.body.user2,
    messages: req.body.messages,

  },
    function (err, chat) {
      if (err) return res.status(500).send("There was a problem adding the information to the database.");
      res.status(200).send(chat);
    });
});


//Get an user
router.get('/:id', VerifyToken,function (req, res) {
  Chat.findById(req.params.id, function (err, chat) {
    if (err) return res.status(500).send("There was a problem finding the chat.");
    if (!chat) return res.status(404).send("No chat found.");
    res.status(200).send(chat);
  });
});

//Modify an user
router.put('/:id', VerifyToken, function (req, res) {
  Chat.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, chat) {
    if (err) return res.status(500).send("There was a problem updating the chat.");
    res.status(200).send(chat);
  });
});

//Delete an user
router.delete('/:id', VerifyToken,function (req, res) {
  Chat.findByIdAndRemove(req.params.id, function (err, chat) {
    if (err) return res.status(500).send("There was a problem deleting the chat.");
    res.status(200).send("chart was deleted.");
  });
});
module.exports = router;