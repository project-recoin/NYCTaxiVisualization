var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NYCTaxi Data' });
});

/*GET Hello World page.*/
router.get('/helloworld', function(req, res){
  res.render('helloworld', {title: 'Hello, World!'});
})

/*GET Userlist page*/
router.get('/userlist', function(req,res){
  var db = req.db;
  var collection = db.get('journeys');
  collection.find({},{},function(e,docs){
    res.render('userlist', {
      title: 'Userlist',
      journeylist : docs
    });
  });
});

router.get('/overview', function(req, res){
  res.render('overview', {
    title: 'overview'});
});

router.get('/api/nycData', function(req, res){
  findOrderedJourneys(req.db, 'journeys', function(err, cursor){
    if(err)
    {
      res.send(err);
    }
    else
    {
      res.json(cursor);
    }
  });
});

router.get('/api/timeData', function(req, res){
  findOrderedJourneys(req.db, 'timeseries', function(err, cursor){
    if(err)
    {
      res.send(err);
    }
    else
    {
      res.json(cursor);
    }
  });
});

module.exports = router;

var findOrderedJourneys = function(db, collectionName, callback) {
  db.get(collectionName).find({}, {}, function(err, cursor) {
    callback(err, cursor);
  });
};
