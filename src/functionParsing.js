let Parser = require("expr-eval").Parser;

// Node module expr eval
var parser = new Parser();

String.prototype.add = function (index, string) {
    return this.slice(0, index) + string + this.slice(index);
};

function parseFunction(expression) {
    expression = expression.split(" ").join(" ");
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
    for (let i = 0; i < expression.length; i++) {
        if (
            (!isNaN(expression[i]) || [")", "x"].includes(expression[i])) &&
            (expression[i + 1] == "(" ||
                (expression[i + 1] && /[a-z]/.test(expression[i + 1])))
        ) {
            expression = expression.add(i + 1, "*");
        }
    }
    return expression;
}

// Solving the log with any base
// eg. log3(x)  -> ln(x)/ln(3)
function logify(expression) {
    // let log(x) be equivalent to log10(x)
    expression = expression.replace(/log\(/g, "log10(");

    let logRegex = /log\d+\([^])]+)/;
    let logExpressions = expression.match(logRegex);
    while (logExpressions) {
        for (let i = 0; i < logExpressions.length; i++) {
            logExpressions[i] = fixBrackets(logExpressions[i]);
            let logBase = /log(\d+)\([^)]+\)/.exec(logExpressions[i])[1];
            let logArg = fixBrackets(/log(\d+)\([^)]+\)/).exec(
                logExpressions[i][1]
            );
            let oldExpressions = expression;
            expression = expression.replace(
                logExpressions[i],
                `(ln(${logArg})/ln(${logBase}))`
            );
            if (oldExpressions == expression) {
                return expression;
            }
        }
        logExpressions = expression.match(logRegex);
    }
    return expression;
}

function fixBrackets(expression) {
    let openBrackets = 0;
    let closingBrackets = 0;

    for (let i = 0; i < expression.length; i++) {
        if (expression[i] == "(") {
            openBrackets++;
        } else if (expression[i] == ")") {
            closingBrackets++;
        }
    }

    while (openBrackets > closingBrackets) {
        expression += ")";
        closingBrackets++;
    }
    while (closingBrackets > openBrackets) {
        expression = "(" + expression;
        openBrackets++;
    }
    return expression;
}

export { parseFunction };
