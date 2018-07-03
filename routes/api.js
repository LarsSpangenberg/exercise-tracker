const Exercise = require('../models/exercises');
const Users = require('../models/users');

const router = require('express').Router();

router.post('/new-user', function(req, res, next) {
  const user = new Users(req.body);
  
  user.save(function(err, newUser) {
    if(err) {
      return next(err);
    }
    
    res.json({
      username: newUser.username,
      _id: newUser._id
    });
  });  
});

router.post('/add', function(req, res, next) {
  Users.findById(req.body.userId, function(err, user) {
    
    if(err) {return next(err)}
    
    if(!user) {
      return next({
        message: 'user not found',
        status: 400
      });
    }
    
    const exercise = new Exercise(req.body);
    exercise.username = user.username;
    
    exercise.save(function(err, newExercise) {
      if(err) {return next(err)}
      console.log(newExercise);
      newExercise = newExercise.toObject();
      delete newExercise.userId;
      delete newExercise.__v;
      newExercise.date = (new Date(newExercise.date)).toDateString();
      res.json(newExercise);
    });
  });
});

router.get('/users', function(req, res, next) {
  Users.find({}, function(err, data) {
    res.json(data);
  });
});

router.get('/log', function(req, res, next) {
  console.log(req.query);
  
  const from = new Date(req.query.from);
  const to = new Date(req.query.to);
  
  Users.findById(req.query.userId, function(err, user) {
    
    if(err) {return next(err)}
    
    if(!user) {
      return next({
        message: 'no user found', 
        status: 400
      });
    }
    
    Exercise.find({
      userId: req.query.userId,
      date: {
        $lt: to != 'Invalid Date' ? to.getTime() : Date.now(),
        $gt: from != 'Invalid Date' ? from.getTime() : 0
      }
    })
    .sort('-date')
    .limit(parseInt(req.query.limit))
    .exec(function(err, ex) {
      if(err) {return next(err)}
      const output = {
        _id: req.query.userId,
        username: user.username,
        from: from.toDateString(),
        to: to.toDateString(),
        count: ex.length,
        log: ex.map((exercise) => {
          return {
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date.toDateString()
          }
        })
      }
      
      res.json(output);
    });
  });
});



module.exports = router;