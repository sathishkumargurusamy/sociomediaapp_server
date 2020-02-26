const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const post = require('../models/post');
const comments = require('../models/comment');
const likes = require('../models/likes');
const chat_message = require('../models/message');
const group = require('../models/groups');
const story = require('../models/story');
const bcrypt = require('bcrypt-nodejs');
const jwtLogin = require('jwt-login');
var email = require('emailjs/email');
var Pusher = require('pusher');
var pusher = new Pusher({
    appId: '943935',
    key: '74df637180c0aa9440a4',
    secret: '7791971c50b634ad29ba',
    cluster: 'ap2',
    encrypted: true
});

var server = email.server.connect({
    user: "sathishppit@gmail.com",
    password: "satzai67jt",
    host: "smtp.gmail.com",
    ssl: true,
    port: 465
});
server.send({
    text: "Your message body text",
    from: "sathishppit@gmail.com",
    to: "gsathishkumar2597@gmail.com",
    subject: "Your message subject"
}, function(err, message) {
    if (err)
        console.log(err);
    else
        res.json({ success: true, msg: 'sent' });
});
//USER ROUTES
router.post('/newuser', (req, res, next) => {
    let newuser = new user({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        status: 0,
        token: 'abcde',
        profileimage: ''
    });
    newuser.save((err, newuser) => {
        if (err) {
            res.json(0);
        } else {
            res.json(1);
        }
    });
});
router.post('/user', (req, res, next) => {
    user.find({ username: req.body.username, password: req.body.password }, function(err, users) {
        if (users.length == 0) {
            res.json(false);
        } else {
            // const token = jwt.sign({
            //     user: users
            // }, 'supersecret', { expiresIn: '2h' });
            res.json(users);
        }
    });
});
// GROUPCHAT ROUTES
router.get('/groups', (req, res, next) => {
    group.find(function(err, group) {
        if (err) {
            res.json('Error finding Group!!');
        } else {
            res.json(group);
        }
    });
});
router.get('/groups/:id', (req, res, next) => {
    group.find({ _id: req.params.id }, function(err, group) {
        if (err) {
            res.json('Error finding Group!!');

        } else {
            res.json(group);
        }
    });
});
router.post('/groups', (req, res, next) => {
    let newgroup = new group({
        userid: req.body.userid,
        username: req.body.username,
        groupname: req.body.groupname
    });
    newgroup.save((err, group) => {
        if (err) {
            res.json({ msg: 'Failed to add group' });

        } else {
            res.json({ msg: 'Group added Successfully' });
        }
    });
});
router.get('/user/:id', (req, res, next) => {
    user.find({ _id: req.params.id }, function(err, user) {
        if (err) {
            res.json('Error finding user!!');

        } else {
            res.json(user);
        }
    });
});
router.get('/allusers', (req, res, next) => {
    user.find(function(err, user) {
        if (err) {
            res.json('Error finding user!!');

        } else {
            res.json(user);
        }
    });
});
// POSTS ROUTE
router.post('/post', (req, res, next) => {
    let newpost = new post({
        userid: req.body.userid,
        username: req.body.username,
        post: req.body.post,
        postimg: req.body.postimg,
        likes: req.body.likes
    });
    pusher.trigger('posts', 'post-created', newpost);
    newpost.save((err, post) => {
        if (err) {
            res.json({ msg: 'Failed to add Post' });

        } else {
            res.json({ msg: 'Post added Successfully' });
        }
    });
});
router.put('/updateuser/:id', (req, res, next) => {
    user.findById(req.params.id, function(err, user) {

        if (err)
            res.send(err);
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.profileimage = req.body.profileimage;
        user.dob = req.body.dateofbirth;
        user.gender = req.body.gender;
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: user });
        });

    });
});
router.put('/user/:id', (req, res, next) => {
    user.findById(req.params.id, function(err, user) {
        pusher.trigger('user', 'user-logged', 'Story loggedIn');

        if (err)
            res.send(err);
        user.status = req.body.status;
        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: user });
        });

    });
});
router.put('/post/:postid', (req, res, next) => {
    post.findById(req.params.postid, function(err, post) {

        if (err)
            res.send(err);

        post.likes = req.body.likes;

        post.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Post updated!' });
        });

    });
});
router.get('/post', (req, res, next) => {
    post.find(function(err, post) {
        if (err) {
            res.json('Error finding post!!');

        } else {
            res.json(post);
        }
    });
});
router.get('/posts/:postid', (req, res, next) => {
    post.find({ _id: req.params.postid }, function(err, post) {
        if (err) {
            res.json('Error finding post!!');

        } else {
            res.json(post);
        }
    });
});
router.delete('/post/:id', (req, res, next) => {

    pusher.trigger('posts', 'post-deleted', "Deleted");
    post.remove({ _id: req.params.id }, function(err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});
router.get('/mypost/:userid', (req, res, next) => {
    post.find({ userid: req.params.userid }, function(err, post) {
        if (err) {
            res.json('Error finding post!!');

        } else {
            res.json(post);
        }
    });
});
//COMMENTS ROUTE
router.post('/comments', (req, res, next) => {
    let newcomment = new comments({
        userid: req.body.userid,
        username: req.body.username,
        postid: req.body.postid,
        comment: req.body.comment
    });
    pusher.trigger('comments', 'comment-created', newcomment);
    newcomment.save((err, comment) => {
        if (err) {
            res.json(err);

        } else {
            res.json({ msg: 'Comment added Successfully' });
        }
    });
});


router.get('/comments', (req, res, next) => {
    comments.find(function(err, comment) {
        if (err) {
            res.json('Error finding comment!!');

        } else {
            res.json(comment);
        }
    });
});
router.delete('/comments/:id', (req, res, next) => {
    pusher.trigger('comments', 'comment-deleted', 'Comment Deleted');
    comments.remove({ _id: req.params.id }, function(err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});
router.delete('/comment/:id', (req, res, next) => {

    comments.remove({ postid: req.params.id }, function(err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});
router.delete('/like/:id', (req, res, next) => {
    likes.remove({ postid: req.params.id }, function(err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});


//LIKES ROUTE
router.get('/likes/:uid', (req, res, next) => {
    likes.find({ "userid": req.params.uid }, function(err, likes) {
        if (err) {
            res.json('Error finding likes!!');

        } else {
            res.json(likes);
        }
    });
});
router.post('/likes', (req, res, next) => {
    let newlikes = new likes({
        userid: req.body.userid,
        username: req.body.username,
        postid: req.body.postid,
        status: req.body.status
    });
    pusher.trigger('likes', 'likes-added', newlikes);
    newlikes.save((err, comment) => {
        if (err) {
            res.json({ msg: 'Failed to add likes' });

        } else {
            res.json({ msg: 'like added Successfully' });
        }
    });
});
router.delete('/likes/:uid&:pid', (req, res, next) => {
    pusher.trigger('likes', 'likes-removed', 'Likes deleted');
    likes.remove({ userid: req.params.uid, postid: req.params.pid }, function(err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});

//CHAT-MESSAGE ROUTE
router.get('/message', (req, res, next) => {
    chat_message.find().sort({ time: 1 }).exec(function(err, message) {
        if (err) {
            res.json('Error finding message!!');

        } else {
            if (message) {
                // pusher.trigger('message', 'unreadmessages-count', 'Unread Messages');
                res.json(message);
            }
        }
    });
});
router.post('/message', (req, res, next) => {
    let newmessage = new chat_message({
        sendername: req.body.sendername,
        senderid: req.body.senderid,
        friendname: req.body.friendname,
        friendid: req.body.friendid,
        message: req.body.message,
        read: req.body.read
    });
    pusher.trigger('message', 'message-sent', newmessage);
    newmessage.save((err, message) => {
        if (err) {
            res.json({ msg: 'Failed to send message' });

        } else {
            res.json({ msg: 'Message sent successfully' });
        }
    });
});
router.put('/message/:msgid', (req, res, next) => {

    chat_message.findById(req.params.msgid, function(err, message) {

        if (err)
            res.send(err);

        message.read = true;
        message.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Message updated!' });

        });

    });
});

//STORY ROUTES
router.post('/story', (req, res, next) => {
    let newStory = new story({
        username: req.body.username,
        userid: req.body.userid,
        story: req.body.story,
    });
    pusher.trigger('story', 'story-added', 'Story added');
    newStory.save((err, story) => {
        if (err) {
            res.json({ msg: 'Failed to add story' });

        } else {
            res.json({ msg: 'Story posted successfully' });
        }
    });
});
router.get('/story', (req, res, next) => {
    story.find().sort({ time: 1 }).exec(function(err, story) {
        if (err) {
            res.json('Error finding story!!');

        } else {
            if (story) {
                // pusher.trigger('message', 'unreadmessages-count', 'Unread Messages');
                res.json(story);
            }
        }
    });
});
router.get('/story/:id', (req, res, next) => {
    story.findById({ _id: req.params.id }).exec(function(err, story) {
        if (err) {
            res.json('Error finding story!!');

        } else {
            if (story) {
                // pusher.trigger('message', 'unreadmessages-count', 'Unread Messages');
                res.json(story);
            }
        }
    });
});

module.exports = router;