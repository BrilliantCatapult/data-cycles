var x = [12.39999962, 14.30000019, 14.5, 14.89999962, 16.10000038, 16.89999962, 16.5, 15.39999962, 17, 17.89999962, 18.79999924, 20.29999924, 22.39999962, 19.39999962, 15.5, 16.70000076, 17.29999924, 18.39999962, 19.20000076, 17.39999962, 19.5, 19.70000076, 21.20000076, ]

var y = [11.19999981, 12.5, 12.69999981, 13.10000038, 14.10000038, 14.80000019, 14.39999962, 13.39999962, 14.89999962, 15.60000038, 16.39999962, 17.70000076, 19.60000038, 16.89999962, 14, 14.60000038, 15.10000038, 16.10000038, 16.79999924, 15.19999981, 17, 17.20000076, 18.60000038]

var b1 = 0
var b2 = 0
var learningRate = .01

var func = function(x1, y1) {
    var ans = (y1 - ((b1 * x1) + b2))
    return ans * ans
}
var sigma1 = function(func) {
    var result = 0;
    for (var i = 0; i < x.length; i++) {
        result += func(x[i], y[i])
    }
    return result
}
var calcB1 = function(x, y) {
    return ((-x) * (y - ((b1 * x) + b2)))
}

var calcB2 = function(x, y) {
    return ((-1) * (y - ((b1 * x) + b2)))
}
var sigma2 = function(func1, func2) {
    var b1GRAD = b1;
    var b2GRAD = b2;

    for (var i = 0; i < x.length; i++) {
        b1GRAD += (2 * (func1(x[i], y[i]))) / x.length
        b2GRAD += (2 * (func2(x[i], y[i]))) / x.length
    }
    return [(b1 - (learningRate * b1GRAD)), (b2 - (learningRate * b2GRAD))]
}
var calcError = function(func) {
    return (sigma1(func) / x.length)
}
var bestErr = 10;
var hold = [];
while (calcError(func) > 1.5) {
    var test = sigma2(calcB1, calcB2)
    b1 = b1 + test[0]
    console.log("B1: " + b1)
    b2 = b2 + test[1]
    console.log("B2: " + b2)
    console.log("ERR: " + calcError(func))
    if (calcError(func) < bestErr) {
        bestErr = calcError(func)
        hold = [b1, b2]
    }
}
console.log(hold, bestErr)