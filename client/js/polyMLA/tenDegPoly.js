var D3Utils = require('../utils/D3Utils');

var stations = [41, 42, 45, 46, 47, 48, 49, 50, 51, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 82];
var obj = {};
 
//Test user input to be sure it's a valid date
obj.testDate = function() {
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
    setTimeout(function() {document.getElementById("errMessage").innerHTML = ''; }, 1500);
    return false;
  } else if ((year === y && month <= m && day <= d) || (year < y)) {
    document.getElementById("errMessage").innerHTML = ' Enter A Future Day Please';
    setTimeout(function() {document.getElementById("errMessage").innerHTML = ''; }, 1500);
    return false;
  } else if (month > 12) {
    document.getElementById("errMessage").innerHTML = ' Enter An Accurate Month Please';
    setTimeout(function() {document.getElementById("errMessage").innerHTML = ''; }, 1500);
    return false;
  } else if (day > 31) {
    document.getElementById("errMessage").innerHTML = ' Enter An Accurate Day Please';
    setTimeout(function() {document.getElementById("errMessage").innerHTML = ''; }, 1500);
    return false;
  } else {
    return true;
  }
};

//Retrieve data for 10th-Degree Regression Graph
obj.getData = function() {
  event.stopPropagation();
  event.preventDefault();
  if(obj.testDate()) {
    for (var i = 0; i < stations.length; i++) {
      d3.json("/api/ml/predictions?day=" + document.getElementById('inp').value + "&station=" + stations[i], function(error, docks) {
        if (error) {
          console.log("error", error);
        } else {
          obj.init(docks);
        }
      });
    }
  }
};

//Retrieve data for 1 through 10th degree regression - specific dock 
obj.getRegs = function() {
  event.stopPropagation();
  event.preventDefault();
  var input = document.getElementById('inp2').value;
  if(obj.testDate()){
    d3.json("/api/ml/predictions?day=" + document.getElementById('inp').value + "&station=" + input, function(error, docks) {
      if (error) {
        console.log("error", error);
      } else {
        obj.init(docks, true);
      }
    });
  }
};

var addRow = function(rowNum, arr) {
  // Get a reference to the table
  var tableRef = document.getElementById('results');
  // Insert a row in the table at row index 0
  var newRow = tableRef.insertRow(rowNum);
  // Insert a cell in the row at index 0
  for (var i = 0; i < arr.length; i++) {
    var newCell = newRow.insertCell(i);
    // Append a text node to the cell
    var newText = document.createTextNode(arr[i]);
    newCell.appendChild(newText);
    if (i === arr.length - 1) {
      newCell.style = 'overflow-x:scroll; overflow:hidden; white-space:nowrap;';
      newCell.style.fontSize = '0.5em';
    }
  }
};

var max = 0;
var min = 100;
var SE = [];
var SD = [];
var dockCount = 0;

obj.calcMinMax = function(coef) {
  var result = [];
  var count = 0;

  for (var j = 0; j < 24; j++) {
    count = 0;
    for (var i = 0; i < coef.length; i++) {
      count += (coef[i] * Math.pow(j, i));
    }
    result.push(count);
  }

  var thisMax = Math.max.apply(null, result);
  var thisMin = Math.min.apply(null, result);

  if (thisMax > max) {
    max = thisMax;
  }

  if (thisMin < min) {
    min = thisMin;
  }
};

obj.calcHours = function(coef) {
  if (dockCount === 35) {
    min = 100;
    max = 0;
  }

  if (dockCount === 35) {
    dockCount = 0;
    console.log("res");
    document.getElementById("res").className = "container"; 
    document.getElementById('date').innerHTML = document.getElementById('inp').value;
  }

  var result = [];
  var count = 0;
  var eq = 'y(x)=';

  for (var j = 0; j < 24; j++) {
    count = 0;
    for (var i = 0; i < coef.length; i++) {
      count += (coef[i] * Math.pow(j, i));
    }
    result.push(count);
  }

  for (var k = 0; k < coef.length; k++) {
    if (k === 0) {
      eq += coef[k].toString();
    } else {
      eq += '+' + coef[k].toString() + '*x^' + k;
    }
  }

  var minNum = Math.min.apply(null, result);
  var minTime = result.indexOf(minNum);
  var maxNum = Math.max.apply(null, result);
  var maxTime = result.indexOf(maxNum);
  var thisMax = [maxTime, maxNum];
  var thisMin = [minTime, minNum];

  if (thisMax[0] > 11) {
    if (thisMax[0] === 12) {
      thisMax[0] = thisMax[0].toString() + 'PM';
    } else {
      thisMax[0] = (thisMax[0] - 12).toString() + 'PM';
    }
  } else if (thisMax[0] === 0) {
      thisMax[0] = '12AM';
    } 
    else {
      thisMax[0] = thisMax[0].toString() + 'AM';
    }

  if (thisMin[0] > 11) {
    if (thisMin[0] === 12) {
      thisMin[0] = thisMin[0].toString() + 'PM';
    } else {
      thisMin[0] = (thisMin[0] - 12).toString() + 'PM';
    }
  } else if (thisMin[0] === 0) {
      thisMin[0] = '12AM';
  } else {
      thisMin[0] = thisMin[0].toString() + 'AM';
  }  

  addRow(dockCount + 1, [stations[dockCount], Math.round(thisMax[1]), thisMax[0], Math.round(thisMin[1]), thisMin[0], SD[dockCount], SE[dockCount], eq]);
  dockCount++;
  return result;
};

var linePoints = [];

obj.calcLineData = function(coef) {
  var data = [];
  var count = 0;
  
  for (var j = 0; j <= 23; j += 0.25) {
    count = 0;
    for (var i = 0; i < coef.length; i++) {
      count += (coef[i] * Math.pow(j, i));
    }
    data.push({
      x: j,
      y: count
    });
  }

  linePoints.push(data);
  if (linePoints.length === 35) {
    obj.graph(linePoints);
    linePoints = [];
  }
};

var regPoints = [];

var calcRegData = function(coef, docks) {
  var data = [];
  var count = 0;
  for (var j = 0; j <= 23; j += 0.25) {
    count = 0;
    for (var i = 0; i < coef.length; i++) {
      count += (coef[i] * Math.pow(j, i));
    }
      data.push({
      x: j,
      y: count
      });
  }
  regPoints.push(data);
  if (regPoints.length === 10) {
    var output = [];
    docks.forEach(function(hr, index) {
      for (var key in hr) {
        output.push([index, hr[key]]);
      }
    });
    obj.graph(regPoints, true, output);
    regPoints = [];
  }
};


obj.init = function(docks, truthy) {
  var x = [];
  var y = [];
  var count = 0;
  for (var key in docks) {
    for (var k in docks[key]) {
      y.push(docks[key][k]);
      x.push(count);
    }
    count++;
  }

  var calcAvg = function() {
    var total = 0;
    for (var i = 0; i < y.length; i++) {
      total += +(y[i]);
    }
    return total / y.length;
  };

  var calcSD = function() {
    if (SD.length === 35) {
      SD = [];
      SE = [];
    }
    var total = 0;
    var avg = calcAvg();
    for (var i = 0; i < y.length; i++) {
      total += Math.pow((y[i] - avg), 2);
    }
    var sd = Math.sqrt(total / y.length);
    SD.push(sd);
    SE.push(sd / (Math.sqrt(y.length)));
  };

  if(!truthy) {
    calcSD();
  }

  var calcError = function() {
    var result = 0;
    var double;
    for (var i = 0; i < x.length; i++) {
      double = (y[i] - ((m * x[i]) + b + (Math.pow(x[i], 2) * m1) + (Math.pow(x[i], 3) * m2)));
      result += (double * double);
    }
    return Math.sqrt(result / x.length);
  };

  var calcSquares = function(n) {
    if (n === 0) {
      return x.length;
    }
    result = 0;
    for (var i = 0; i < x.length; i++) {
      result += Math.pow(x[i], n);
    }
    return result;
  };

  var calcAugVal = function(n) {
    var result = 0;
    for (var j = 0; j < x.length; j++) {
      result += ((Math.pow(x[j], n)) * y[j]);
    }
    return result;
  };

  var calcMatrix = function(power) {
    var mx = [];
    for (var j = 0; j <= power; j++) {
      mx.push([]);
      for (var i = 0; i <= power; i++) {
        mx[j].push(calcSquares(i + j));
      }
      mx[j].push(calcAugVal(j));
    }
    return mx;
  };

  var fourDegMatrix = calcMatrix(10);

  var gauss = function(matrix) {
    var n = matrix.length;
    for (var i = 0; i < n; i++) {
    // Search for maximum in this column
      var maxEl = Math.abs(matrix[i][i]);
      var maxRow = i;
      for (var k = i + 1; k < n; k++) {
        if (Math.abs(matrix[k][i]) > maxEl) {
          maxEl = Math.abs(matrix[k][i]);
          maxRow = k;
        }
      }

    // Swap maximum row with current row (column by column)
      for (var k = i; k < n + 1; k++) {
        var tmp = matrix[maxRow][k];
        matrix[maxRow][k] = matrix[i][k];
        matrix[i][k] = tmp;
      }

    // Make all rows below this one 0 in current column
      for (k = i + 1; k < n; k++) {
        var c = -matrix[k][i] / matrix[i][i];
        for (var j = i; j < n + 1; j++) {
          if (i === j) {
            matrix[k][j] = 0;
        } else {
            matrix[k][j] += c * matrix[i][j];
          }
        }
      }
    }

    // Solve equation Ax=b for an upper triangular matrix A
    var x = new Array(n);
    for (var i = n - 1; i > -1; i--) {
      x[i] = matrix[i][n] / matrix[i][i];
      for (var k = i - 1; k > -1; k--) {
        matrix[k][n] -= matrix[k][i] * x[i];
      }
    }
    return x;
  };

  var calcRegs = function() {
    for (var i = 1; i <= 10; i++) {
      var matrices = calcMatrix(i);
        calcRegData(gauss(matrices), docks);
      }
  };

  var eq = gauss(fourDegMatrix);
  if (truthy) {
    calcRegs();
  } else {
      obj.calcMinMax(eq);
      obj.calcHours(eq);
      obj.calcLineData(eq);
    }
};

obj.genColor = function() {
  var x = Math.round(0xffffff * Math.random()).toString(16);
  var y = (6 - x.length);
  var z = "000000";
  var z1 = z.substring(0, y);
  return "#" + z1 + x;
};

obj.graph = function(data, truthy, docks) {

  var parseDate = d3.time.format("%H:%M").parse;

  var id = '';
  if (truthy) {
    id = '#regs';
    var scaleMax = d3.max(docks, function(v) {
    return Number(v[1]);
    });
  } else {
    id = '#graph';
  }

  var activity = data.map(function(station, index) {
    return {
      name: truthy ? (index + 1) : stations[index],
      values: station,
      visible: true
    };
  });

  data = activity;

  d3.select(id).html('');
  // define dimensions of graph
  var width = document.getElementById(id.split("#")[1]).clientWidth;
  var height = 400;

  if (scaleMax) {
    var maximum = scaleMax;
  } else {
    var maximum = max;
  }

  var x = d3.scale.linear().domain([0, 24]).range([0, width - 40]);
  var y = d3.scale.linear().domain([0, maximum]).range([height - 40, 0]);

  // Add an SVG element with the desired dimensions and margin.
  var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) {
    return x(d.x);
    })
    .y(function(d) {
    return y(d.y);
    });

  var graph = d3.select(id).append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("transform", "translate(" + 30 + "," + 30 + ")");

  var tooltip = d3.select(id).append("div");
  tooltip.attr("class", "tooltip top");
  tooltip.append("div").attr("class", "tooltip-inner");
  tooltip.style("opacity", 0);
  
  // create yAxis
  var xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true);
  
  // Add the x-axis.
  graph.append("svg:g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height - 40) + ")")
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
  
  if (docks) {
    d3.select(id).append("button")
      .text("Remove Data")
      .on("click", function(d) { // On click make d.visible 
        var currentItem = d3.select(this)
        
        if (currentItem.text() === "Remove Data") {
          graph.selectAll("circle").remove();
          currentItem.text("Add Data");
          maxY = findMaxY(activity); // Find max Y rating value categories data with "visible"; true
          minY = findMinY(activity);
          y.domain([minY, maxY]);
        } else {
            maxY = d3.max(docks, function(v) {
              return Number(v[1]);
            }); // Find max Y rating value categories data with "visible"; true

            minY = 0;
            y.domain([minY, maxY]);

            graph.selectAll("circle")
              .data(docks).enter()
              .append("circle")
              .attr("cx", function(d, i) {
              return x(d[0]);
              })
              .attr("cy", function(d, i) {
              return y(d[1])
              })
              .attr("r", "2px")
              .attr("fill", "red");

            currentItem.text("Remove Data");
        }

        // Redefine yAxis domain based on highest y value of categories data with "visible"; true
        graph.select(".y.axis")
          .transition()
          .duration(500)
          .call(yAxisLeft);

        city.select("path")
          .transition()
          .duration(500)
          .attr("d", function(d) {
          return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
          });
      });

    graph.selectAll("circle")
      .data(docks).enter()
      .append("circle")
      .attr("cx", function(d, i) {
      return x(d[0]);
      })
      .attr("cy", function(d, i) {
      return y(d[1])
      })
      .attr("r", "2px")
      .attr("fill", "red");
  }

  var color = D3Utils.calculateColor([0, 100]);
  var city = graph.selectAll(".city")
    .data(activity)
    .enter().append("g")
    .attr("class", "city");

  city.append("path")
    .attr("class", "line")
    .style("stroke", function(d) {
    return color(Number(d.name));
    })
    .attr("id", function(d) {
    return "line-" + d.name; // Give line id of line-(insert issue name, with any spaces replaced with no spaces)
    })
    .attr("d", function(d) {
    return d.visible ? line(d.values) : null; // If array key "visible" = true then draw line, if not then don't 
    })
    .on("mouseover", function(d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);

      d3.select(id).select('.tooltip-inner').html("Station #" + d.name);

      tooltip
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 58) + "px");

    })
    .on("mouseout", function() {
    // Remove the info text on mouse out.
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

  // draw legend
  function findMaxY(data) { // Define function "findMaxY"
    var maxYValues = data.map(function(d) {
      if (d.visible) {
        return d3.max(d.values, function(value) { // Return max rating value
          return value.y;
        });
      }
    });
    return d3.max(maxYValues);
  };

  function findMinY(data) { // Define function "findMaxY"
    var minYValues = data.map(function(d) {
      if (d.visible) {
        return d3.min(d.values, function(value) { // Return max rating value
          return value.y;
        });
      }
    });
    return d3.min(minYValues);
  };


  var legendSpace = 300 / data.length; // 450/number of issues (ex. 40)    

  city.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("x", width - 65)
    .attr("y", function(d, i) {
      return (legendSpace) + i * (legendSpace) - 8;
    }) // spacing
    .attr("fill", function(d) {
      return d.visible ? color(d.name) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey 
    })
    .attr("class", "legend-box")
    .on("click", function(d) { // On click make d.visible 
      if (!truthy || !docks) {
        d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true
        maxY = findMaxY(activity); // Find max Y rating value categories data with "visible"; true
        minY = findMinY(activity);
        y.domain([minY, maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
        graph.select(".y.axis")
          .transition()
          .duration(500)
          .call(yAxisLeft);

        city.select("path")
          .transition()
          .duration(500)
          .attr("d", function(d) {
            return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
          });

        city.select("rect")
          .transition()
          .attr("fill", function(d) {
            return d.visible ? color(d.name) : "#F1F1F2";
          });
      }
    })
    .on("mouseover", function(d) {
      d3.select(this)
        .transition()
        .attr("fill", function(d) {
          return color(d.name);
        });

      d3.select("#line-" + d.name)
        .transition()
        .style("stroke-width", 2.5);
    })
    .on("mouseout", function(d) {
      d3.select(this)
        .transition()
        .attr("fill", function(d) {
          return d.visible ? color(d.name) : "#F1F1F2";
        });

      d3.select("#line-" + d.name)
        .transition()
        .style("stroke-width", 1.5);
    });

  city.append("text")
    .attr("x", width - 45)
    .attr("y", function(d, i) {
      return (legendSpace) + i * (legendSpace);
    })
    .text(function(d, i) {
      return d.name;
    });
}

module.exports = obj;