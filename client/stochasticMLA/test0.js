//univariate linear regression
var calcError = function(){
    var result = 0;
    var double;
    for(var i = 0; i < x.length; i++){
        double = (y[i]-((m*x[i])+b))
        result+=(double*double)
    }
    return result/x.length
}

var calcM = function(){
   
    var func = function(x, y){
        total = 0;
        if(y === "square"){
            for(var i = 0; i < x.length; i++){
                total+=(x[i]*x[i])
            }
        }
        else if(y === undefined){
            for(var i = 0; i < x.length; i++){
                total+=x[i]
            }
        }else if(x === undefined){
            for(var i = 0; i < y.length; i++){
                total+=y[i]
            }
        }else{
            for(var i = 0; i < x.length; i++){
                total+=(y[i]*x[i])
            }
        }
        return total;
    }
     result = (x.length*(func(x, y))-((func(x, undefined))*(func(undefined, y))))/((x.length*(func(x, "square")))-(func(x, undefined)*func(x, undefined)))
     return result;
}

var calcB = function(){
    var func = function(x, y){
        total = 0;
        if(y === undefined){
            for(var i = 0; i < x.length; i++){
                total+=x[i]
            }
        }
        else{
            for(var i = 0 ; i < y.length; i++){
                total+=y[i]
            }
        }
        return total;
    }
    result = (func(undefined, y) - (calcM()*func(x, undefined)))/x.length
    return result
}

var err = Math.sqrt(calcError())

console.log(calcM(), calcB(), calcError(), err)