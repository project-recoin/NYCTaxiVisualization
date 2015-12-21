var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var inserting = 0;
var insertionDone = false;
var insertionFinished = function(cb)
{
    if(inserting === 0 && insertionDone)
    {
        cb();
    }
}

//general function for inserting stream into collection
module.exports.insertDocument = function(stream, collectionName, entryParseFunc, db, cb) {
    console.log("start " + collectionName);
    var col = db.collection(collectionName);

    stream.on('data', function (data) {
        inserting++;
        console.log("new data")
        var readData = "";
        readData += data;
        col.insert(entryParseFunc(data), function (err, result) {
            console.log("new insert");
            assert.equal(err, null);
            console.log(result.result);
            inserting--;
            insertionFinished(cb);
        });
    }).on('end', function () {
        console.log("read stream end");
        insertionDone = true;
        insertionFinished(cb);
    });
};

