/**
 * Created by zd on 11/10/15.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjetcId = require('mongodb').ObjectID;
var nyc_csv2json = require('./nyc_csv2json');
var iD = require('./insertDocument');

var inputFile = "./sampleInputShort.csv";

var baseCollectionName = 'journeys';

//Change this to connect to other DB
var url = 'mongodb://localhost:27017/nyc';

MongoClient.connect(url, function(err, db){
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    //Record all data in collection journeys
    db.collection(baseCollectionName, function(err, collection) {});//Creates the db if db does not exist. Not create if db exists.

    initData(db, function(){
        console.log('Done init data');
        timeCountData("timeCount", db, function(){
            console.log(('Done time series data'));
            db.close();
            console.log('database connection closed');
        });

    });
});

//Put all the data into database
var initData = function(db, cb){
    nyc_csv2json.inputName = inputFile;
    iD.insertDocument(nyc_csv2json.resultedStream(), baseCollectionName, function(data){
        return JSON.parse(data);
    }, db, cb);
};

//Put the time series data into database per hour
var timeCountData = function(collectionName, db, cb){
    var col = db.collection(baseCollectionName);
    var stream = col.find();
    iD.insertDocument(stream, collectionName, function(data){
        //console.log(data[0]);
        var dataObj = data;
        var newData = {"Med":dataObj['Med'], "PT":dataObj['PT']};
        //example PT : "PT" : "2013-01-06 03:02:00"
        var PT = newData['PT'].split(':');
        var newPT = PT[0] + ":00:00";
        //console.log(newPT);
        newData['PT'] = newPT;
        console.log(newData['PT']);
        return newData;
    }, db, cb);
};
