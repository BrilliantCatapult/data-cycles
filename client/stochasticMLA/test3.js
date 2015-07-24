var x = [6.2,9.5,10.5,7.7,8.6,34.1,11,6.9,7.3,15.1,29.1,2.2,5.7,2,2.5,4,5.4,2.2,7.2,15.1,16.5,18.4,36.2,39.7,18.5,23.3,12.2,5.6,21.8,21.6,9,3.6,5,28.6,17.4,11.3,3.4,11.9,10.5,10.7,10.8,4.8]
var y = [29,44,36,37,53,68,75,18,31,25,34,14,11,11,22,16,27,9,29,30,40,32,41,147,22,29,46,23,4,31,39,15,32,27,32,34,17,46,42,43,34,19]
// for(var i = 0; i < x.length; i++){
//     console.log(x[i] +", "+y[i])
// }

var calcError = function(){
    var result = 0;
    var double;
    for(var i = 0; i < x.length; i++){
        double = (y[i]-((m*x[i])+b))
        result+=(double*double)
    }
    return Math.sqrt(result/x.length)
}

var b = 0;
var m = 0;
var learningRate = .0001;

var sumB = function(){
    var result = 0;
    for(var i = 0; i < x.length; i++){
        result+=(y[i] - (m*x[i] + b))
    }
    return result
}

var sumM = function(){
    var result = 0;
    for(var i = 0; i < x.length; i++){
        result+=(y[i] - (m*x[i] + b))*x[i]
    }
    return result
}
var count = 0;
calcError()
// while(calcError() > .1){
//     if(count === 20000){
//         break;
//     }
//     b = (b + learningRate*sumB())
//     m = (m + learningRate*sumM())
//     count++;
//     console.log(calcError(), b, m)
// }