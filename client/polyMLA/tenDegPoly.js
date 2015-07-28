var stations = [41,42,45,46,47,48,49,50,51,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,82];
var getData = function() {
    event.stopPropagation();
    event.preventDefault();
    var input = document.getElementById('inp').value
    // console.log(input)
    for(var i = 0; i < stations.length; i++){
        d3.json("/api/ml/predictions?day=" + input + "&station=" + stations[i], function(error, docks) {
            if (error) {
                console.log("error", error);
            } else {
                // console.log("dataaaa: "+ JSON.stringify(docks))
                init(docks);
            }
        });
    }
};


var calcHours = function(coef) {
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
    // console.log(result)
    return result;
}

var init = function(docks) {
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

    var calcAvg = function(){
        var total = 0;
        for(var i = 0; i < y.length; i++){
            total+= +(y[i])
        }
        return total/y.length
    }

    var calcSD = function(){
        var total = 0;
        var avg = calcAvg();
        for(var i = 0; i < y.length; i++){
            total+= Math.pow((y[i] - avg), 2)
        }
        return Math.sqrt(total/y.length)
    }

    console.log("S. DEVIATION: " + calcSD());

    var calcSE = function(){
        var sd = calcSD();
        return sd/(Math.sqrt(y.length))
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
    var eq = gauss(fourDegMatrix);
    // console.log(eq)
    calcHours(eq)
}



