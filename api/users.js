const router = require('express').Router();

const { getBusinessesByOwnerID } = require('./businesses');
const { getReviewsByUserID } = require('./reviews');
const { getPhotosByUserID } = require('./photos');
const bcrypt = require('bcryptjs');



// Mongo Code========================================================

// To add user
function insertNewUser(user,mongoDB) {
     return bcrypt.hash(user.password, 8)
       .then((passwordHash) => {
     const userValues = {
     userID: user.userID,
     username: user.username,
     email: user.email,
     password: passwordHash
     };
     const usersCollection = mongoDB.collection('users');
     return usersCollection.insertOne(userValues)})
     .then((result) => {
     return Promise.resolve(result.insertedId);
     // let p = Promise.resolve(value);
     let p = new Promise((resolve) => { resolve(value); });
     });
     }

     /*
     * Route to add user
     */

     router.post('/users', function (req, res) {
     if (req.body && req.body.userID && req.body.username && req.body.password) {
          insertNewUser(req.body,req.app.locals.mongoDB)
            .then((id) => {res.status(201).json({ _id: id });})
            .catch((err) => {res.status(500).json({
          error: "Error creating new user."});});
          } else {
          res.status(400).json({
            error: "Request body does not contain valid user data."
          });
     }
     });

// Get user by their userID
function getUserByID(userID,mongoDB,includePassword) {
     const usersCollection = mongoDB.collection('users');
     const projection = includePassword ? {} : { password: 0 };
     return usersCollection.find({ userID: userID }).project(projection).toArray()
     .then((results) => {
     return Promise.resolve(results[0]);
     });
     }
     /*
     * Route to get user info by their userid
     */
     router.get('/:userID', function (req, res, next) {
     getUserByID(req.params.userID,req.app.locals.mongoDB)
       .then((user) => {if (user) {
            res.status(200).json(user);}
            else
            { next();}})
       .catch((err) => {res.status(500).json({
       error: "Error fetching user."
     });});
     });

//To get print all users
function getallUsers(mongoDB)
     {
     const usersCollection = mongoDB.collection('users');
     return usersCollection.find().toArray()
     .then((results) => {
     return Promise.resolve(results);
     });
     }

     // Route to get print all users
     router.get('/', function (req, res, next) {
     getallUsers(req.app.locals.mongoDB)
       .then((userdata) => {if (userdata) {
            res.status(200).json(userdata);}
            else
            { next();}})
       .catch((err) => {res.status(500).json({
       error: "Error fetching user."
     });});
     });

//=============================================================



// Mongo Code========================================================

// To add user
function insertNewUser(user,mongoDB) {
     const usersCollection = mongoDB.collection('users');
     const userValues = {
     userID: user.userID,
     username: user.username,
     email: user.email,
     password: user.password
     };
     return usersCollection.insertOne(userValues)
     .then((result) => {
     return Promise.resolve(result.insertedId);
     // let p = Promise.resolve(value);
     let p = new Promise((resolve) => { resolve(value); });
     });
     }

     /*
     * Route to add user
     */

     router.post('/users', function (req, res) {
     if (req.body && req.body.userID && req.body.username && req.body.password) {
          insertNewUser(req.body,req.app.locals.mongoDB)
            .then((id) => {res.status(201).json({ _id: id });})
            .catch((err) => {res.status(500).json({
          error: "Error creating new user."});});
          } else {
          res.status(400).json({
            error: "Request body does not contain valid user data."
          });
     }
     });

// Get user by their userID
function getUserByuserID(userID,mongoDB) {
     const usersCollection = mongoDB.collection('users');
     return usersCollection.find({ userID: userID }).toArray()
     .then((results) => {
     return Promise.resolve(results[0]);
     });
     }
     /*
     * Route to get user info by their userid
     */
     router.get('/:userID', function (req, res, next) {
     getUserByuserID(req.params.userID,req.app.locals.mongoDB)
       .then((user) => {if (user) {
            res.status(200).json(user);}
            else
            { next();}})
       .catch((err) => {res.status(500).json({
       error: "Error fetching user."
     });});
     });

//To get print all users
function getallUsers(mongoDB)
     {
     const usersCollection = mongoDB.collection('users');
     return usersCollection.find().toArray()
     .then((results) => {
     return Promise.resolve(results);
     });
     }

     // Route to get print all users
     router.get('/', function (req, res, next) {
     getallUsers(req.app.locals.mongoDB)
       .then((userdata) => {if (userdata) {
            res.status(200).json(userdata);}
            else
            { next();}})
       .catch((err) => {res.status(500).json({
       error: "Error fetching user."
     });});
     });

//=============================================================

/*
 * Route to list all of a user's businesses.
 */
router.get('/:userID/businesses', function (req, res) {
  const mysqlPool = req.app.locals.mysqlPool;
  const userID = parseInt(req.params.userID);
  getBusinessesByOwnerID(userID, mysqlPool)
    .then((businesses) => {
      if (businesses) {
        res.status(200).json({ businesses: businesses });
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch businesses.  Please try again later."
      });
    });
});

/*
 * Route to list all of a user's reviews.
 */
router.get('/:userID/reviews', function (req, res) {
  const mysqlPool = req.app.locals.mysqlPool;
  const userID = parseInt(req.params.userID);
  getReviewsByUserID(userID, mysqlPool)
    .then((reviews) => {
      if (reviews) {
        res.status(200).json({ reviews: reviews });
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch reviews.  Please try again later."
      });
    });
});

/*
 * Route to list all of a user's photos.
 */
router.get('/:userID/photos', function (req, res) {
  const mysqlPool = req.app.locals.mysqlPool;
  const userID = parseInt(req.params.userID);
  getPhotosByUserID(userID, mysqlPool)
    .then((photos) => {
      if (photos) {
        res.status(200).json({ photos: photos });
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch photos.  Please try again later."
      });
    });
});


exports.router = router;
