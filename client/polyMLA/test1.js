var calcError = function(){
    var result = 0;
    var double;
    for(var i = 0; i < x.length; i++){
        double = (y[i]-((m*x[i])+b))
        result+=(double*double)
    }
    return Math.sqrt(result/x.length)
}


var b = -1;
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

while(calcError() > .1){
    b = (b + learningRate*sumB())
    m = (m + learningRate*sumM())
}