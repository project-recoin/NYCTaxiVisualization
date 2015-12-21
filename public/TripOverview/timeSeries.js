
//Create time-series chart of journeys.
//Currently has no support for large set of data.
$.getScript("js/d3.js", function(){
    //http://stackoverflow.com/questions/23948335/d3-timeseries-reading-date-from-data-counting-entries-by-date
    //Will memory leak if too much entries.
    $(document).ready(function () {
        $.getJSON("/api/timeData",
            function (rawData) {
                //console.log(rawData);
                var parsePT = d3.time.format("%Y-%m-%d %X").parse;

                var data = rawData;

                var generateData = function(data){
                    var newData = [];
                    var dateMap = {};
                    data.forEach(function(element){
                        var newElement;
                        if(dateMap[element['PT']]){
                            newElement = dateMap[element['PT']];
                        } else {
                            newElement = {'PT': parsePT(element['PT']), count: 0 };
                            dateMap[element['PT']] = newElement;
                            newData.push(newElement);
                        }
                        newElement.count += 1;
                    });

                    newData.sort(function(a,b){
                        return a['PT'].getTime() - b['PT'].getTime();
                    });
                    console.log(newData);
                    return newData;
                };

                var newData = generateData(data);

                var margin = {top: 30, right: 20, bottom: 30, left: 50},
                    width = 600 - margin.left - margin.right,
                    height = 270 - margin.top - margin.bottom;

                var x = d3.time.scale().range([0, width]);
                var y = d3.scale.linear().range([height, 0]);

                var xAxis = d3.svg.axis().scale(x)
                    .orient("bottom").ticks(newData.length)
                    .tickFormat(d3.time.format("%y-%m-%d %H"));

                var yAxis = d3.svg.axis().scale(y)
                    .orient("left").ticks(newData.length);

                // define the line
                var line = d3.svg.line()
                    .x(function(d) {
                        return x(d['PT']);
                    })
                    .y(function(d) {
                        return y(d.count);
                    });

                x.domain(d3.extent(newData, function(d) { return d['PT']; }));
                y.domain([0, d3.max(newData, function(d) { return d.count; })]);

                // build the svg canvas
                var svg = d3.select("#timeseries")
                    .selectAll("svg")
                    .data([newData])
                    .enter()
                    .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // build the line
                svg.append("path")
                    .attr("class", "line")
                    .attr("d", line);

                // Add the X Axis
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                // Add the text label for the x axis
                svg.append("text")
                    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
                    .style("text-anchor", "middle")
                    .text("Date");

                // Add the Y Axis
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

                // Add the text label for the Y axis
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left)
                    .attr("x",0 - (height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Count");
            });
    });

});
