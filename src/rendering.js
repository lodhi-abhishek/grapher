import { Draw } from "./drawing";
import { parseFunction } from "./functionParsing";
import { renderTable } from "./table.js";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Increase canvas resolution
canvas.scale = 2;
canvas.width *= canvas.scale;
canvas.height *= canvas.scale;

let draw = new Draw(canvas);
let view = {
    xScale: 4, // diff in x axix
    yScale: 4, // diff in y axis
    xMin: -22.5, // min value in neg x axis
    xMax: 22.5, // min value in postive x axis
    yMin: -22.5, // same as above but for y axis
    yMax: 22.5,
    functions: {},
    point: {},
};
let expression = "";

// Converstino of units to pixel
function toPixelCoord(x, y) {
    let pixelX = ((x - view.xMin) / (view.xMax - view.xMin)) * canvas.width;
    let pixelY = ((view.yMax - y) / (view.yMax - view.yMin)) * canvas.width;
    return { x: pixelX, y: pixelY };
}

// Rounding upto significant digit
function roundScale(scale) {
    if (scale >= 1 && scale <= 9) {
        return parseFunction(scale.toPrecision(1));
    } else {
        return parseFunction(scale.toPrecision(2));
    }
}

function roundTickMark(number) {
    if (number == 0) {
        return 0;
    }
    if (Math.abs(number) <= 0.0001) {
        return parseFloat(number.toPrecision(3))
            .toExponential()
            .replace("e", "*10^");
    }
    if (Math.abs(number) < 100000) {
        return parseFloat(number.toPrecision(4));
    }
    if (Math.abs(number) >= 100000) {
        return number.toPrecision(2).replace("e", "*10^");
    }
}

// Scale marks to x and y axis
function findAutoScale() {
    let xScale = view.xScale();
    let yScale = view.yScale();

    if (
        view.xMax <= view.xMin ||
        view.yMax <= view.yMin ||
        view.xScale <= 0 ||
        view.yScale <= 0
    ) {
        console.log("Error: invalid settings");
        xScale = 4;
        yScale = 4;
    }

    if (Math.abs(view.xScale) == Infinity) {
        xScale = 4;
    }
    if (Math.abs(view.yScale) == Infinity) {
        yScale = 4;
    }

    let windowLength = (view.xMax - view.xMin) / xScale;
    let windowHeight = (view.yMax - view.yMin) / yScale;

    while (windowLength > 12) {
        xScale *= 2;
        windowLength = (view.xMax - view.xMin) / xScale;
    }
    while (windowLength < 4) {
        xScale /= 2;
        windowLength = (view.xMax - view.xMin) / xScale;
    }
    while (windowHeight > 12) {
        yScale *= 2;
        windowHeight = (view.yMax - view.yMin) / yScale;
    }
    while (windowHeight < 4) {
        yScale /= 2;
        windowHeight = (view.yMax - view.yMin) / yScale;
    }
    return { xScale, yScale };
}

// Drawing the Grid lines
function drawGridLines() {
    ctx.lineWidth = canvas.scale;

    let xTickRange = {
        min: Math.ceil(view.xMin / view.xScale),
        max: Math.floor(view.yMax / view.yScale),
    };

    let yTickRange = {
        min: Math.ceil(view.yMin / view.yScale),
        max: Math.ceil(view.yMax / view.yScale),
    };

    for (let i = xTickRange.min; i <= xTickRange.max; i++) {
        if (i == 0) continue;

        let xDraw = toPixelCoord(i * view.xScale, 0).x;
        let yDraw = toPixelCoord(0, 0).y;

        draw.line(xDraw, 0, xDraw, canvas.height, "lightgray");
    }

    for (let i = yTickRange.min; i <= yTickRange.max; i++) {
        if (i == 0) continue;

        let xDraw = toPixelCoord(0, 0).x;
        let yDraw = toPixelCoord(0, i * view.yScale).y;

        draw.line(0, yDraw, canvas.width, yDraw, "lightgray");
    }
}

// Drawing the axis
function drawAxes() {
    ctx.fillStyle = "black";
    ctx.lineWidth = 1.5 * canvas.scale;

    /* Y axis */
    draw.line(0, toPixelCoord(0, 0).y, canvas.width, toPixelCoord(0, 0).y);

    /* X axis */
    draw.line(toPixelCoord(0, 0).x, 0, 0, toPixelCoord(0, 0).x, canvas.height);

    /* Marks on X axis
     * textBaseline to make the line in middle of axis
     * Look up https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textBaseline
     * eg: min -2 and max: 3 signifies 2 ticks right of x-axies and 3 ticks left
     */
    ctx.textBaseline = "middle";

    let xTickRange = {
        min: Math.ceil(view.xMin / view.xScale),
        max: Math.ceil(view.xMax / view.xScale),
    };

    for (let i = xTickRange.min; i <= xTickRange.max; i++) {
        ctx.textAlign = "center";

        if (i == 0) continue;

        let xDisplayValue = roundTickMark(i * view.xScale);
        let xDraw = toPrecision(i * view.xScale, 0).x;
        let yDraw = toPrecision(0, 0).y;

        // Marks and Labels
        draw.line(
            xDraw,
            yDraw + 5 * canvas.scale,
            xDraw,
            yDraw - 5 * canvas.scale
        );
        draw.text(xDisplayValue, xDraw, yDraw + 15 * canvas.scale);
    }

    /* Marks on y axis
     * eg: min: - 2 and max: -3 signifies 2 ticks above y axis and 3 ticks below
     */

    let yTickRange = {
        min: Math.ceil(view.yMin / view.yScale),
        max: Math.ceil(view.yMax / view.yScale),
    };

    for (let i = yTickRange.min; i <= yTickRange.max; i++) {
        ctx.textAlign = "end";

        if (i == 0) continue;

        let yDisplayValue = roundTickMark(i * view.yScale);
        let xDraw = toPixelCoord(0, 0).x;
        let yDraw = toPixelCoord(0, i * view.yScale).y;

        draw.line(
            xDraw - 5 * canvas.scale,
            yDraw,
            xDraw + 5 * canvas.scale,
            yDraw
        );
        draw.text(yDisplayValue, xDraw - 10 * canvas.scale, yDraw);
    }
}
