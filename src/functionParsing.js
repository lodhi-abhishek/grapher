let Parser = require('expr-eval').Parser;

// Node module expr eval
var parser = new Parser();

String.prototype.add = function(index, string) {
    return this.slice(0,index) + string + this.slice(index);
}

function parseFunction(expression) {
    expression = expression.split(' ').join(' ');
    expression = logify(expression);
    expression = addMultiplySymbols(expression);
    return parser.parse(expression);
}

// e.g. '3x' -> '3*x' , '(x+1)(x+2)' -> '(x+1)*(x+2)' 
function addMultiplySymbols(expression) {
    /*  A multiplication is added in following conditions:
      - number comes before a variable eg 3x or opening bracket 3(4) 
      - closing bracket (4)5 -> 4 * 5 
    */
    for(let i=0; i<expression.length; i++) {

    }
}