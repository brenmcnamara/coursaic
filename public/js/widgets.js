/**
 * widgets.js
 *
 * UI widgets built inside canvas elements.
 */

var PieChart,
    ProgressBar;


/**
 * A pie chart for displaying data.
 *
 * @class PieChart
 * @constructor
 *
 * @param context { Context } The canvas context
 *  to render the pie chart in.
 *
 * @param data { Array } An array of data elements
 *  for each segment of the pie chart. Each segment
 *  requires a numeric value (key is "value") and
 *  a color (key is "color").
 */
PieChart = function (context, data) {
    this._context = context;
    this._data = data;
};

/**
 * Render the pie chart inside it's context.
 *
 * @method render
 */
PieChart.prototype.render = function () {
    var self = this;
    this._data.forEach(function (segMap, index) {
        self._drawSegment(index);
    });
};


/**
 * Get the arc size (in radians) of a segment.
 *
 * @method _segmentArcSize
 * @private
 *
 * @param index {Number} The index of the segment
 *  to get the arc size for.
 *
 * @return {Number} The arc size of the segment
 *  (in radians).
 */
PieChart.prototype._segmentArcSize = function (index) {
    var 
        total = this._data.reduce(function (memo, segMap) {
            return memo + segMap.value;
        }, 0),

        multiplier = 2 * Math.PI / total;

    return this._data[index].value * multiplier;
};


/**
 * The start angle for a partcular segment (in radians).
 *
 * @method _segmentStartAngle
 * @private
 *
 * @param index {Number} The index of the start angle
 *  of the segment.
 *
 * @return {Number} The start angle for the segment (in radians).
 */
PieChart.prototype._segmentStartAngle = function (index) {
    var self = this;
    return this._data.slice(0, index).reduce(function (memo, segMap, i) {
        return memo + self._segmentArcSize(i);
    }, 0);
};


/**
 * Draw a segment into the context. The context will be saved and restored
 * to the state prior to when the drawing took place.
 *
 * @method _drawSegment
 * @private
 *
 * @param context {Context} The context of the canvas element.
 *
 * @param index {Number} The index of the element.
 */
PieChart.prototype._drawSegment = function (index) {
    var
        centerX = Math.floor(this._context.canvas.width / 2),
        centerY = Math.floor(this._context.canvas.height / 2),

        radius = Math.min(this._context.canvas.width / 2, this._context.canvas.height / 2),

        startAngle = this._segmentStartAngle(index),
        arcSize = this._segmentArcSize(index),
        endAngle = startAngle + arcSize;


    this._context.save();

    this._context.beginPath();
    this._context.moveTo(centerX, centerY);
    this._context.arc(centerX, centerY, radius, startAngle, endAngle, false);
    this._context.closePath();

    this._context.fillStyle = this._data[index].color;
    this._context.fill();

    this._context.restore();
};


module.exports = {
    PieChart: PieChart
};
