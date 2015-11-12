/**
 * Created by zd on 11/12/15.
 *
 * DO NOT USE THIS FILE
 * User nyc_csv2json instead
 *  Use this to process csv records of NYCTaxi data and store them into JSON files
 *  usage:
 *  node my_csv2json.js [input_filename] ([output_filename])
 */

var parse = require('csv').parse;
var transform = require('csv').transform;
var fs = require('fs');

var fileName = "./sampleInputShort.csv";
//var fileName = "/Users/zd/Study/year3/Cascade/trips_lookedup_openroute_seg_1x";
var outputName = "./outputDataC.json";

//Getting user command line input of file name if user provided any
var input = process.argv[2];
if(input)
{
    fileName = input;
}

var output = process.argv[3]
if(output)
{
    outputName = output;
}

//headers are a little bit unreadable but this saves hard drive space.
var header = ["Med", "PT", "DT", "NP", "Dis", "Path"]

var parser = parse({delimiter: ','});
var count = 0;
var transformer = transform(function(record, cb) {
    if(count !== 0)
    {
        var entry = {};
        //Format: {"Med":xxx, "PT":xxx...}
        for(var i = 0; i < record.length; i++)
        {
            entry[header[i]] = record[i];
        }

        //Break Path and format:{"Pa}
        var coorArray = entry['Path'].split(',');
        var coorPair = {lat : 0, lng : 0};
        var coorPairArray = [];
        for(var i = 1; i < coorArray.length+1; i++)
        {
            if(i%2 === 1)
            {
                coorPair.lat = coorArray[i-1];
            }
            else
            {
                coorPair.lng = coorArray[i-1];
                coorPairArray.push(coorPair);
                coorPair = {lat : 0, lng : 0};
            }
        }
        entry['Path'] = coorPairArray;
        //console.log(entry);
        cb(null, JSON.stringify(entry));
    }
    //console.log(count);
    count++;
});


var write = fs.createWriteStream(outputName, {flags: 'w'});

fs.createReadStream(fileName).pipe(parser).pipe(transformer).pipe(write);
