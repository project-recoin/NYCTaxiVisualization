/**
 * Created by zd on 11/9/15.
 *
 * DO NOT USE THIS FILEmm
 * Use my_csv2json.js instead
 * usage:
 * node my_csv2json.js [input_filename] [output_filename]
 */

var fileName = "./sampleInputShort.csv";
//var fileName = "/Users/zd/Study/year3/Cascade/trips_lookedup_openroute_seg_1x";

var outputName = "./outputData.json";

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

var Converter = require("csvtojson").Converter;
//Shorter header to save space
var converter = new Converter({headers:["Med", "PT", "DT", "NP", "Dis", "Path"], constructResult:false, checkType:true});

var parserMgr=require("csvtojson").parserMgr;

//parse latlngList field data format to {Path : [{lat : 123, lng: 456}, ..., ...]}

parserMgr.addParser("myParserName",/Path/,function (params){
    var coorArray = params.item.split(',');
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
    params.resultRow['Path']=JSON.stringify(coorPairArray);
});

//end_parsed will be emitted once parsing finished
//Note: Only used when dealing with small csv files
/*
converter.on("end_parsed", function (jsonArray) {
    //console.log(jsonArray);
    console.log("Parse finished");
});
*/
//read from file
var readStream = require("fs").createReadStream(fileName);
var writeStream=require("fs").createWriteStream(outputName);
readStream.pipe(converter).pipe(writeStream);