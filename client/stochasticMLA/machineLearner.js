//input -> some day in the future

  //figure out what day of the week it is
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var D = new Date(Date.parse('08/05/2015'));
  var day = days[D.getDay()]

var x = [1, 2, 3]
var y = [3, 4, 6]
var b1 = 1;
var b2 = 3;
var func = function(x, y){
    var ans = (y - (b1*x + b2))
    return ans*ans
}

var sigma = function(func){
    var result = 0;
    for(var i = 0; i < x.length; i++){
        result+=func(x[i], y[i])
    }
    return result
}

var calcError = function(func){
    return (sigma(func)/x.length)
}

calcError(func)

var calcB1 = function(x, y){
   return (-x*(y - (b1*x + b2)))
}

var calcB2 = function(){
    return (-(y - (b1*x + b2)))
}

var gradientB1 = function(){
    return ((2*sigma(calcB1))/x.length)
}

var gradientB2 = function(){
    return ((2*sigma(gradientB1))/x.length)
}

gradientB1()




var x = [1, 2, 3, 3]
var y = [3, 2, 1.5, 0]

var b1 = 0
var b2 = 0
var learningRate = .5

var func = function(x, y){
    var ans = (y - (b1*x + b2))
    return ans*ans
}

var sigma1 = function(func){
    var result = 0;
    for(var i = 0; i < x.length; i++){
        result+=func(x[i], y[i])
    }
    return result
}
var calcB1 = function(x, y){
    return (-x*(y - (b1*x + b2)))
}

var calcB2 = function(){
    return (-1*(y - (b1*x + b2)))
}
var sigma2 = function(func1, func2){
    var b1GRAD = b1;
    var b2GRAD = b2;
    for(var i = 0; i < x.length; i++){
        b1GRAD+=(2*(func1(x[i], y[i])))/x.length
        b2GRAD+=(2*(func2(x[i], y[i])))/x.length
    }
    return [(b1 - (learningRate * b1GRAD)), (b2 - (learningRate * b2GRAD))]
}
var calcError = function(func){
    return (sigma1(func)/x.length)
}


/*def stepGradient(b_current, m_current, points, learningRate):
    b_gradient = 0
    m_gradient = 0
    N = float(len(points))
    for i in range(0, len(points)):
        b_gradient += -(2/N) * (points[i].y - ((m_current*points[i].x) + b_current))
        m_gradient += -(2/N) * points[i].x * (points[i].y - ((m_current * points[i].x) + b_current))
    new_b = b_current - (learningRate * b_gradient)
    new_m = m_current - (learningRate * m_gradient)
    return [new_b, new_m]*/

console.log( calcError(func), sigma2(calcB1, calcB2))
calcB2()