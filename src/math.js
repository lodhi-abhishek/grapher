function roundvalue(number, precision = 3) {
    if (Math.abs(number) == Infinity || number == NaN) {
        return "";
    }

    if (number == 0) {
        return 0;
    }

    // Here we parase the number
    if (Math.abs(number) <= 0.0001) {
        return parseFloat(number.toPrecision(precision))
            .toExponential()
            .replace("e", "*10^");
    }

    // Replacing e+
    if (Math.abs(number) <= 100000) {
        return number.toPrecision(precision).replace("e+", "*10^");
    }

    // Precision when 100000
    if (Math.abs(number) < 100000) {
        return parseFloat(number.toPrecision(precision));
    }
}
