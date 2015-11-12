/**
 * Created by zd on 11/9/15.
 *
 * Use this to process csv records of NYCTaxi data and store them into JSON files
 * usage:
 * node nyc_csv2json.js [input_filename] [output_filename]
 */
var csv = require('csvtojson');
var fs = require('fs');


var nyc_csv2json = {
    inputName: "./sampleInputShort.csv",
    //fileName: "/Users/zd/Study/year3/Cascade/trips_lookedup_openroute_seg_1x,
    outputName: "./outputData.json",

    resultedStream: function(){
        var Converter = csv.Converter;
        //Shorter header to save space
        var converter = new Converter({headers:["Med", "PT", "DT", "NP", "Dis", "Path"], constructResult:false});

        var parserMgr= csv.parserMgr;

        //parse latlngList field data format to {Path : [{lat : 123, lng: 456}, ..., ...]}

        var count = 0;
        parserMgr.addParser("PathBreaker",/Path/,function (params){
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
            console.log(count);
            count++;
            params.resultRow['Path']=JSON.stringify(coorPairArray);
        });
        return fs.createReadStream(this.inputName).pipe(converter);
    },
}

module.exports = nyc_csv2json;


//Getting user command line input of file name if user provided any
var input = process.argv[2];
if(input)
{
    inputName = input;
}

var output = process.argv[3]
if(output)
{
    outputName = output;
}

var writeStream=fs.createWriteStream(nyc_csv2json.outputName);
nyc_csv2json.resultedStream().pipe(writeStream);