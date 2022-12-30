function Draw(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
}

/*
Draw.prototype
Javascript Object Prototype https://www.w3schools.com/js/js_object_prototypes.asp
*/

Draw.prototype.fill = function (color) {
    this.canvas.fillStyle = color; // Fill the color
};

Draw.prototype.line = function (x1, y1, x2, y2, color = "black") {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1); //start corrdinate
    this.ctx.lineTo(x2, y2); //stop corridinate
    this.ctx.strokeStyle = color;
    this.ctx.stroke(); // draw between corridinate
};

Draw.prototype.text = function (string, x, y, size = 10 * canvas.scale) {
    this.ctx.font = size + "px Arial";
    this.ctx.fillText(string, x, y);
};

Draw.prototype.rect = function (x, y, width, height, color = "white") {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
};

Draw.prototype.colorCircle = function (
    centerX,
    centerY,
    radius,
    color = "black"
) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();
};

export { Draw };
