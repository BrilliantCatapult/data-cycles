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
        console.log("false input")
    } else if (year <= y && month <= m && day <= d) {
        console.log("future day please")
    } else if (month > 12) {
        console.log("accurate month please")
    } else if (day > 31) {
        console.log("accurate day please")
    } else {
        for (var i = 0; i < stations.length; i++) {
            d3.json("/api/ml/predictions?day=" + input + "&station=" + stations[i], function(error, docks) {
                if (error) {
                    console.log("error", error);
                } else {
                    console.log("dataaaa: "+ JSON.stringify(docks))
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
                console.log("dataaaa: "+ JSON.stringify(docks))
                obj.init(docks, true);
            }
        });
    }
}


var max = [0, 0];

obj.calcHours = function(coef) {
    // console.log("this is coef:"+coef)
    var result = [];
    var count = 0;
    for (var j = 0; j < 24; j++) {
        count = 0;
        for (var i = 0; i < coef.length; i++) {
            count += (coef[i] * Math.pow(j, i))
        }
        result.push(count)
    }
    console.log(result)
    var thisMax = Math.max.apply(null, result);
    console.log("THIS MAX: " + thisMax, "THIS HOUR: " + result.indexOf(thisMax))
    if (thisMax > max[1]) {
        max[1] = thisMax
        max[0] = result.indexOf(thisMax)
    }
    return result;
}

var linePoints = [];

obj.calcLineData = function(coef) {
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

var calcRegData = function(coef) {
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
        obj.graph(regPoints, true);
        regPoints = [];
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
        return Math.sqrt(total / y.length)
    }

    console.log("S. DEVIATION: " + calcSD());

    var calcSE = function() {
        var sd = calcSD();
        return sd / (Math.sqrt(y.length))
    }

    console.log("S. ERROR: " + calcSE());

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
            calcRegData(gauss(A));            
        }
    }
    if(truthy){
        console.log("regs")
        calcRegs();
    }
    var eq = gauss(fourDegMatrix);
    // console.log(eq)
    obj.calcHours(eq)
        // console.log("MAX: "+max)
    obj.calcLineData(eq);
}

obj.genColor = function(){
    var x=Math.round(0xffffff * Math.random()).toString(16);
    var y=(6-x.length);
    var z="000000";
    var z1 = z.substring(0,y);
    return "#" + z1 + x;
}


obj.graph = function(data, truthy) {
    /* implementation heavily influenced by http://bl.ocks.org/1166403 */
    var id = '';
    if(truthy){
        id = '#regs';
    }else{
        id = '#graph';
    }
    d3.select(id).html('');
    // define dimensions of graph
    var m = [80, 80, 80, 80]; // margins
    var w = 1000 - m[1] - m[3]; // width
    var h = 400 - m[0] - m[2]; // height

    // X scale will fit all values from data[] within pixels 0-w
    var x = d3.scale.linear().domain([0, 24]).range([0, w]);
    var y = d3.scale.linear().domain([0, max[1]+2]).range([h, 0]);
    // // create a line function that can convert data[] into x and y points
        // Add an SVG element with the desired dimensions and margin.
    var graph = d3.select(id).append("svg:svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
    // create yAxis
    var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
    // Add the x-axis.
    graph.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);
    // var mapMouseOver = function(d){
    //     document.body.append(this.innerHTML)
    // }
    // var mapMouseOut = function(d){
    //     console.log("OUT: "+d)
    // }
    // create left yAxis
    var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
    // Add the y-axis to the left
    graph.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(-25,0)")
        .call(yAxisLeft);
    for(var i = 0; i < data.length; i++){
            var line = i
            line = d3.svg.line()
                // assign the X function to plot our line as we wish
                .interpolate("basis")
                .x(function(d) {
                    var xcoord = d.x
                    // console.log("X: " + xcoord)
                    return x(xcoord);
                })
                .y(function(d) {
                    var ycoord = d.y
                    // console.log("Y: " + ycoord)
                    return y(ycoord);
                })  
    graph.append("svg:path")
        .text("Dock "+stations[i])
        .style("stroke", obj.genColor())
        .attr("d", line(data[i]))
        .attr("id", "poly");
        // .on("mouseover", mapMouseOver)
        // .on("mouseout", mapMouseOut);
    }    
}

module.exports = obj;