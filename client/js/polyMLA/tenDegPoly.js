var D3Utils = require('../utils/D3Utils');


var stations = [41, 42, 45, 46, 47, 48, 49, 50, 51, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 82];
var obj = {}
obj.getData = function() {
    event.stopPropagation();
    event.preventDefault();
    var input = document.getElementById('inp').value;
    var dt = new Date();
    var m = dt.getMonth() + 1;
    var d = dt.getDate();
    var y = dt.getFullYear();
    var month = +input.slice(0, 2);
    var day = +input.slice(3, 5);
    var year = +input.slice(input.length - 4, input.length);
    if (!Number.isInteger(month) || !Number.isInteger(day) || !Number.isInteger(year)) {
        document.getElementById("errMessage").innerHTML = ' False Input';
        setTimeout(function(){document.getElementById("errMessage").innerHTML = '';}, 1500)
    } else if ((year === y && month <= m && day <= d) || (year < y)) {
        document.getElementById("errMessage").innerHTML = ' Enter A Future Day Please';
        setTimeout(function(){document.getElementById("errMessage").innerHTML = '';}, 1500)
    } else if (month > 12) {
        document.getElementById("errMessage").innerHTML = ' Enter An Accurate Month Please';
        setTimeout(function(){document.getElementById("errMessage").innerHTML = '';}, 1500)
    } else if (day > 31) {
        document.getElementById("errMessage").innerHTML = ' Enter An Accurate Day Please';
        setTimeout(function(){document.getElementById("errMessage").innerHTML = '';}, 1500)
    } else {
        for (var i = 0; i < stations.length; i++) {
            d3.json("/api/ml/predictions?day=" + input + "&station=" + stations[i], function(error, docks) {
                if (error) {
                    console.log("error", error);
                } else {
                    // console.log("dataaaa: "+ JSON.stringify(docks))
                    obj.init(docks);
                }
            });
        }
    }
};

obj.getRegs = function(){
    event.stopPropagation();
    event.preventDefault();
    var day = document.getElementById('inp').value; //SOLVE FOR IF THEY DON'T ENTER THIS
    var input = document.getElementById('inp2').value; 
    console.log(input)   
    if(stations.indexOf(+input) === -1){
        console.log("Not an SF dock")
    }else{
        d3.json("/api/ml/predictions?day=" + day + "&station=" + input, function(error, docks) {
            if (error) {
                console.log("error", error);
            } else {
                // console.log("dataaaa: "+ JSON.stringify(docks))
                obj.init(docks, true);
            }
        });
    }
}

var addRow = function(rowNum, arr) {
  // Get a reference to the table
  var tableRef = document.getElementById('results');
  // Insert a row in the table at row index 0
  var newRow   = tableRef.insertRow(rowNum);
  // Insert a cell in the row at index 0
  for(var i = 0; i < arr.length; i++){
      var newCell  = newRow.insertCell(i);
      // Append a text node to the cell
      var newText  = document.createTextNode(arr[i]);
      newCell.appendChild(newText);
  }
}

var max = 0;
var min = 100;
var SE = [];
var SD = [];
var dockCount = 0;

obj.calcMinMax = function(coef){
    var result = [];
    var count = 0;
    for (var j = 0; j < 24; j++) {
        count = 0;
        for (var i = 0; i < coef.length; i++) {
            count += (coef[i] * Math.pow(j, i))
        }
        result.push(count)
    }
    var thisMax = Math.max.apply(null, result);
    var thisMin = Math.min.apply(null, result);
    if (thisMax > max) {
        max = thisMax;
    }

    if (thisMin < min) {
        min = thisMin;
    }
}

obj.calcHours = function(coef) {
    // console.log("this is coef:"+coef)
    if(dockCount === 35){
        min = 100;
        max = 0;
    }
    if(dockCount === 35 || dockCount === 0){
        document.getElementById('results').innerHTML = '';
        document.getElementById('results').innerHTML = '<tr id='+"description"+'><td>Dock</td><td>Max Bikes</td><td>Hour(Max)</td><td>Min Bikes</td><td>Hour(Min)</td><td>Standard Deviation</td><td>Standard Error</td><td>Equation (10th Degree)</td></tr>';
        dockCount = 0;
    }
    var result = [];
    var count = 0;
    var eq = 'y(x)=';
    for (var j = 0; j < 24; j++) {
        count = 0;
        for (var i = 0; i < coef.length; i++) {
            count += (coef[i] * Math.pow(j, i))
        }
        result.push(count)
    }
    for(var k = 0; k < coef.length; k++){
        if(k === 0){
            eq+=coef[k].toString();
        }else{
            eq+='+'+coef[k].toString()+'*x^'+i;
        }
    }
    // console.log(result)
    var minNum = Math.min.apply(null, result)
    var minTime = result.indexOf(minNum)
    var maxNum = Math.max.apply(null, result)
    var maxTime = result.indexOf(maxNum)
    var thisMax = [maxTime, maxNum];
    var thisMin = [minTime, minNum];
    
    if(thisMax[0] > 11){
        if(thisMax[0] === 12){
            thisMax[0] = thisMax[0].toString() + 'PM';
        }else{
            thisMax[0] = (thisMax[0]-12).toString() + 'PM';
        }
    }else if(thisMax[0] === 0){
        thisMax[0] = '12AM';
    }else{
        thisMax[0] = thisMax[0].toString() + 'AM';
    }

    if(thisMin[0] > 11){
        if(thisMin[0] === 12){
            thisMin[0] = thisMin[0].toString() + 'PM';
        }else{
            thisMin[0] = (thisMin[0]-12).toString() + 'PM';
        }
    }else if(thisMin[0] === 0){
        thisMin[0] = '12AM';
    }else{
        thisMin[0] = thisMin[0].toString() + 'AM';
    }
    // console.log("THIS IS RESULT"+result)
    // console.log(eq)
    addRow(dockCount+1, [stations[dockCount], Math.round(thisMax[1]), thisMax[0], Math.round(thisMin[1]), thisMin[0], SD[dockCount], SE[dockCount], eq])
    dockCount++;

    return result;
}

var linePoints = [];

obj.calcLineData = function(coef) {
    ("called")
    var data = [];
    var count = 0;
    for (var j = 0; j <= 23; j += 0.25) {
        count = 0;
        for (var i = 0; i < coef.length; i++) {
            count += (coef[i] * Math.pow(j, i))
        }
        data.push({
            x: j,
            y: count
        })
    }
    linePoints.push(data);
    if (linePoints.length === 35) {
        obj.graph(linePoints);
        linePoints = [];
    }
}

var regPoints = [];

var calcRegData = function(coef, docks) {
    console.log("COEF: "+coef.length, coef)
    var data = [];
    var count = 0;
    for (var j = 0; j <= 23; j += 0.25) {
        count = 0;
        for (var i = 0; i < coef.length; i++) {
            count += (coef[i] * Math.pow(j, i))
        }
        data.push({
            x: j,
            y: count
        })
    }
    console.log(data.length)
    regPoints.push(data);
    if (regPoints.length === 10) {
    // console.log("THE DOCKS")
    // console.dir(docks);
    var output = [];
    docks.forEach(function(hr,index){
        for(var key in hr){
            output.push([index, hr[key]]);
        }
    });
    //docks = output;
    obj.graph(regPoints, true, output);
    regPoints = [];
    console.log("New docks ", output);
    }
}


obj.init = function(docks, truthy) {
    var x = [];
    var y = [];
    var count = 0;
    for (var key in docks) {
        for (k in docks[key]) {
            y.push(docks[key][k])
            x.push(count)
        }
        count++;
    }

    var calcAvg = function() {
        var total = 0;
        for (var i = 0; i < y.length; i++) {
            total += +(y[i])
        }
        return total / y.length
    }

    var calcSD = function() {
        var total = 0;
        var avg = calcAvg();
        for (var i = 0; i < y.length; i++) {
            total += Math.pow((y[i] - avg), 2)
        }
        var sd = Math.sqrt(total / y.length)
        if(SD.length === 35){
            SD = [];
            SE = [];
        }
        SD.push(sd)
        SE.push(sd / (Math.sqrt(y.length)))
    }

    calcSD();

    var calcError = function() {
        var result = 0;
        var double;
        for (var i = 0; i < x.length; i++) {
            double = (y[i] - ((m * x[i]) + b + (Math.pow(x[i], 2) * m1) + (Math.pow(x[i], 3) * m2)))
            result += (double * double)
        }
        return Math.sqrt(result / x.length)
    }

    var calcSquares = function(n) {
        if (n === 0) {
            return x.length
        }
        result = 0;
        for (var i = 0; i < x.length; i++) {
            result += Math.pow(x[i], n);
        }
        return result
    }

    var calcAugVal = function(n) {
        var result = 0;
        for (var j = 0; j < x.length; j++) {
            result += ((Math.pow(x[j], n)) * y[j])
        }
        return result
    }

    var calcMatrix = function(power) {
        var mx = [];
        for (var j = 0; j <= power; j++) {
            mx.push([])
            for (var i = 0; i <= power; i++) {
                mx[j].push(calcSquares(i + j))
            }
            mx[j].push(calcAugVal(j))
        }
        return mx;
    }

    var fourDegMatrix = calcMatrix(10)

    /** Solve a linear system of equations given by a n&times;n matrix 
        with a result vector n&times;1. */
    var gauss = function(A) {
        var n = A.length;
        for (var i = 0; i < n; i++) {
            // Search for maximum in this column
            var maxEl = Math.abs(A[i][i]);
            var maxRow = i;
            for (var k = i + 1; k < n; k++) {
                if (Math.abs(A[k][i]) > maxEl) {
                    maxEl = Math.abs(A[k][i]);
                    maxRow = k;
                }
            }
            //   console.log(A)
            // Swap maximum row with current row (column by column)
            for (var k = i; k < n + 1; k++) {
                var tmp = A[maxRow][k];
                A[maxRow][k] = A[i][k];
                A[i][k] = tmp;
            }

            // Make all rows below this one 0 in current column
            for (k = i + 1; k < n; k++) {
                var c = -A[k][i] / A[i][i];
                for (var j = i; j < n + 1; j++) {
                    if (i == j) {
                        A[k][j] = 0;
                    } else {
                        A[k][j] += c * A[i][j];
                    }
                }
            }
        }

        // Solve equation Ax=b for an upper triangular matrix A
        var x = new Array(n);
        for (var i = n - 1; i > -1; i--) {
            x[i] = A[i][n] / A[i][i];
            for (var k = i - 1; k > -1; k--) {
                A[k][n] -= A[k][i] * x[i];
            }
        }
        return x;
    }

    var calcRegs = function(){
        for(var i = 1; i <=10; i++){
            var A = calcMatrix(i);
            calcRegData(gauss(A), docks);            
        }
    }
    // console.log(document.getElementById('inp2').value);
   if(truthy){
       console.log("regs")
       calcRegs();
   }
   var eq = gauss(fourDegMatrix);
   // console.log(eq)
   obj.calcMinMax(eq);
   obj.calcHours(eq);
   obj.calcLineData(eq);
       // console.log("MAX: "+max)
}

obj.genColor = function(){
    var x=Math.round(0xffffff * Math.random()).toString(16);
    var y=(6-x.length);
    var z="000000";
    var z1 = z.substring(0,y);
    return "#" + z1 + x;
}

obj.graph = function(data, truthy, docks) {
    console.log("DATA ISSSS ", data);
    /* implementation heavily influenced by http://bl.ocks.org/1166403 */
    var parseDate = d3.time.format("%H:%M").parse;

    var id = '';
    if(truthy) {
        id = '#regs';
    } else {

   
        // var output = [];
        // data.forEach(function(station, index) {
        //   for(var station in hr) {
        //      //console.log("HR ISSSS ", hr)
        //     output[stations[station]] = output[stations[station]] || [];
        //     output[stations[station]].push({date: index, activity: hr[station]});
        //   }
        // });

        // var activity = [];
        // for(var station in output){
        //   activity.push({
        //     name: station,
        //     values: output[station],
        //     visible: true
        //   });
        // }
        
        id = '#graph';
    }
    var activity = data.map(function(station, index) {
      return {
        name: stations[index],
        values: station,
        visible: true
      };
    });

    console.log("activity is ", activity)
    data= activity;

    d3.select(id).html('');
    // var width = document.getElementById(id).clientWidth;
    // define dimensions of graph
    var w = document.getElementById(id.split("#")[1]).clientWidth;
    //console.log("W ISSS ", w);
    var h = 400; // height
    // X scale will fit all values from data[] within pixels 0-w
    console.log("this is max" + max)
    var x = d3.scale.linear().domain([0, 24]).range([0, w - 40]);
    var y = d3.scale.linear().domain([0, max]).range([h-40, 0]);
    // y.domain([
    //        // d3.min(activity, function(c) { return d3.min(c.values, function(v) { return v.activity; }); }),
    //        0,
    //        d3.max(activity, function(c) { return d3.max(c.values, function(v) { return v.y; }); })
    // ]);
    // // create a line function that can convert data[] into x and y points
        // Add an SVG element with the desired dimensions and margin.
    var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) {
                 return x(d.x); 
             })
            .y(function(d) { return y(d.y); })

    var graph = d3.select(id).append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
         .attr("transform", "translate(" + 30 + "," + 30+ ")");

    var tooltip = d3.select("body").append("div");
      tooltip.attr("class", "tooltip top");
      tooltip.append("div").attr("class", "tooltip-inner");
      tooltip.style("opacity", 0);
        // .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
    // create yAxis
    var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
    // Add the x-axis.
    graph.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (h - 40) + ")")
        .call(xAxis);
    // create left yAxis
    var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
    // Add the y-axis to the left
    graph.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(-5,0)")
        .call(yAxisLeft)
        .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")
                  .text("Number of Bikes Available");
    if(docks){
        // d3.slider().axis(true).min(1).max(10).step(1)
        console.log("plotting points")
        d3.select(id).append("button")
            .text("Remove Data")
            .on("click", function(d){ // On click make d.visible 
             
              console.log("THIS IS ", d3.select(this));
              var currentItem = d3.select(this)
              if(currentItem.text()==="Remove Data"){
                graph.selectAll("circle").remove();
                currentItem.text("Add Data");

                maxY = findMaxY(activity); // Find max Y rating value categories data with "visible"; true
                minY = findMinY(activity);
                y.domain([minY,maxY]); 

              } else {
                maxY = max[1]; // Find max Y rating value categories data with "visible"; true
                minY = 0;
                y.domain([minY,maxY]); 
                graph.selectAll("circle")
                    .data(docks).enter()
                    .append("circle")
                    // .on("mouseover", graph.select(this).attr("r", "4px").attr("fill", "green"))
                    // .on("mouseout", obj.shrink)
                    .attr("cx", function (d, i) { 
                        return x(d[0]);
                    })
                    .attr("cy", function (d, i) { return y(d[1])})
                    .attr("r", "2px")
                    .attr("fill", "red")

                currentItem.text("Remove Dots");
              }
              
              //maxY = findMaxY(activity); // Find max Y rating value categories data with "visible"; true
              //minY = findMinY(activity);

              //y.domain([minY,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
              graph.select(".y.axis")
                .transition()
                .duration(500)
                .call(yAxisLeft);   

              city.select("path")
                .transition()
                .duration(500)
                .attr("d", function(d){
                  return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
                });
            })

            //.attr("")
        graph.selectAll("circle")
            .data(docks).enter()
            .append("circle")
            // .on("mouseover", graph.select(this).attr("r", "4px").attr("fill", "green"))
            // .on("mouseout", obj.shrink)
            .attr("cx", function (d, i) { 
                return x(d[0]);
            })
            .attr("cy", function (d, i) { return y(d[1])})
            .attr("r", "2px")
            .attr("fill", "red")
        }     
    // for(var i = 0; i < data.length; i++){
    //         var line = i
    //         line = d3.svg.line()
    //             // assign the X function to plot our line as we wish
    //             .interpolate("basis")
    //             .x(function(d) {
    //                 var xcoord = d.x
    //                 // console.log("X: " + xcoord)
    //                 return x(xcoord);
    //             })
    //             .y(function(d) {
    //                 var ycoord = d.y
    //                 // console.log("Y: " + ycoord)
    //                 return y(ycoord);
    //             })  
    // graph.append("svg:path")
    //     .text("Dock "+stations[i])
    //     .style("stroke", obj.genColor())
    //     .attr("d", line(data[i]))
    //     .attr("id", "poly");
    //     // .on("mouseover", mapMouseOver)
    //     // .on("mouseout", mapMouseOut);
    // } 

    var color = D3Utils.calculateColor([0, 100]);
    var city = graph.selectAll(".city")
              .data(activity)
            .enter().append("g")
              .attr("class", "city");

          city.append("path")
              .attr("class", "line")
              //.attr("d", function(d) { return line(d.values); })
              .style("stroke", function(d) { return color(Number(d.name)); })
              .attr("id", function(d) {
                return "line-" + d.name; // Give line id of line-(insert issue name, with any spaces replaced with no spaces)
              })
              .attr("d", function(d) { 
                //console.log("values areeee ", d);
                return d.visible ? line(d.values) : null; // If array key "visible" = true then draw line, if not then don't 
              })
              .on("mouseover", function(d) {
                    tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);

                    d3.select('.tooltip-inner').html("Station #"+d.name);

                    tooltip
                      .style("left", (d3.event.pageX + 5) + "px")
                      .style("top", (d3.event.pageY - 28) + "px");
                       
                })
                .on("mouseout", function() {
                    // Remove the info text on mouse out.
                     tooltip.transition()
                         .duration(500)
                         .style("opacity", 0);
                });

    // draw legend
       function findMaxY(data){  // Define function "findMaxY"
           var maxYValues = data.map(function(d) { 
             if (d.visible){
               return d3.max(d.values, function(value) { // Return max rating value
                 return value.y; })
             }
           });
           return d3.max(maxYValues);
         }

        function findMinY(data){  // Define function "findMaxY"
            var minYValues = data.map(function(d) { 
              if (d.visible){
                return d3.min(d.values, function(value) { // Return max rating value
                  return value.y; })
              }
            });
            return d3.min(minYValues);
          }


       var legendSpace = 300 / data.length; // 450/number of issues (ex. 40)    

       city.append("rect")
       .attr("width", 10)
       .attr("height", 10)                                    
       .attr("x", w - 65) 
       .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 8; })  // spacing
       .attr("fill",function(d) {
         return d.visible ? color(d.name) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey 
       })
       .attr("class", "legend-box")

       .on("click", function(d){ // On click make d.visible 
         d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true

         maxY = findMaxY(activity); // Find max Y rating value categories data with "visible"; true
         y.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
         graph.select(".y.axis")
           .transition()
           .duration(500)
           .call(yAxisLeft);   

         city.select("path")
           .transition()
           .duration(500)
           .attr("d", function(d){
             return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
           });

         city.select("rect")
           .transition()
           .attr("fill", function(d) {
           return d.visible ? color(d.name) : "#F1F1F2";
         });
       })

       .on("mouseover", function(d){

         d3.select(this)
           .transition()
           .attr("fill", function(d) { return color(d.name); });

         d3.select("#line-" + d.name)
           .transition()
           .style("stroke-width", 2.5);  
       })

       .on("mouseout", function(d){

         d3.select(this)
           .transition()
           .attr("fill", function(d) {
           return d.visible ? color(d.name) : "#F1F1F2";});

         d3.select("#line-" + d.name)
           .transition()
           .style("stroke-width", 1.5);
       })
    if(!docks){
   city.append("text")
       .attr("x", w - 45) 
       .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); })  // (return (11.25/2 =) 5.625) + i * (5.625) 
       .text(function(d, i) { return d.name; }); 
   }else{
    city.append("text")
           .attr("x", w - 45) 
           .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); })  // (return (11.25/2 =) 5.625) + i * (5.625) 
           .text(function(d, i) { return i+1; }); 
   }
}

module.exports = obj;