

var x = [];
var y = [];
// var count = 0;
for(var key in docks){
    for(k in docks[key]){
        y.push(docks[key][k])
        x.push(count)
    }
    // count++;
}
// for(var i = 0; i < x.length; i++){
//     console.log(x[i]+","+y[i])
// }

var calcError = function(){
    var result = 0;
    var double;
    for(var i = 0; i < x.length; i++){
        double = (y[i]-((m*x[i])+b+(Math.pow(x[i], 2)*m1)+(Math.pow(x[i], 3)*m2)))
        result+=(double*double)
    }
    return Math.sqrt(result/x.length)
}

var b = 6;
var m = 0;
var m1 = 0;
var m2 = 0;
var LRb = .0000001;
var LR = .000001;
var LR1 = .0000002;
var LR2 = .00000002;

var sumB = function(){
    var result = 0;
    for(var i = 0; i < x.length; i++){
        result+=(y[i]-((m*x[i])+b+(Math.pow(x[i], 2)*m1)+(Math.pow(x[i], 3)*m2)))
    }
    return result
}

var sumM = function(){
    var result = 0;
    for(var i = 0; i < x.length; i++){
        result+=(y[i]-((m*x[i])+b+(Math.pow(x[i], 2)*m1)+(Math.pow(x[i], 3)*m2)))*x[i]
    }
    return result
}
var count = 0;
calcError()
while(calcError() > .1){
    if(count === 30000){
        break;
    }
    b = (b + LRb*sumB())
    m = (m + LR*sumM())
    m1 = (m1 + LR1*sumM())
    m2 = (m2 + LR2*sumM())
    count++;
    console.log(calcError(), b, m, m1, m2)
}


    console.log('called')
    count = 0;
    
    while(count < 20000){
          b = (b + learningRate*sumB())
        m = (m + learningRate*sumM())
        m1 = (m1 + learningRate*sumM())
        m2 = (m2 + learningRate*sumM())
        count++;
        console.log(calcError(), b, m, m1, m2)
    }


// count = 0;

// while(count < 20000){
//       b = (b + learningRate*sumB())
//     m = (m + learningRate*sumM())
//     m1 = (m1 + learningRate*sumM())
//     m2 = (m2 + learningRate*sumM())
//     count++;
//     console.log(calcError(), b, m, m1, m2)
// }

// count = 0;

// while(count < 20000){
//       b = (b + learningRate*sumB())
//     m = (m + learningRate*sumM())
//     m1 = (m1 + learningRate*sumM())
//     m2 = (m2 + learningRate*sumM())
//     count++;
//     console.log(calcError(), b, m, m1, m2)
// }