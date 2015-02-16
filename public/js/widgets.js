/**
 * widgets.js
 *
 * UI widgets built inside canvas elements.
 */

var PieChart,
    ProgressBar,

    EasingFunctions,

    fillRoundedRect,
    fillTriangle;


EasingFunctions = {

    easeInQuad: function (time, start, change, duration) {
        time /= duration;
        return change*time*time + start;
    },


    easeOutQuad: function (time, start, change, duration) {
        time /= duration;
        return -change * time*(time-2) + start;
    },


    easeInCubic: function (time, start, change, duration) {
        time /= duration;
        return change*time*time*time + start;
    },


    easeOutCubic: function (time, start, change, duration) {
        time /= duration;
        time--;
        return change*(time*time*time + 1) + start;
    }


};


/**
 * Draws a rounded rectangle using the current state of the canvas. 
 * If you omit the last three params, it will draw a rectangle 
 * outline with a 5 pixel border radius 
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate 
 * @param {Number} width The width of the rectangle 
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
fillRoundedRect = function(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }

};


fillTriangle = function (context, x1, y1, x2, y2, x3, y3) {

    // Draw triangle
    context.beginPath();
    // Draw a triangle location for each corner from x:y 100,110 -> 200,10 -> 300,110 (it will return to first point)
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x3, y3);
    context.closePath();

    context.fill();
};


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


PieChart.prototype = {

    /**
     * Render the pie chart inside it's context.
     *
     * @method render
     */
    render: function () {
        var self = this,
            centerX = this._context.canvas.width / 2,
            centerY = this._context.canvas.height / 2,
            radius = Math.min(centerX, centerY),

            totalSize = this._data.reduce(function (memo, segMap) {
                return memo + segMap.value;
            }, 0);

        if (totalSize === 0) {
            // The value of all elements is 0, just fill in the pie
            // chart with a black color.
            this._context.beginPath();
            this._context.moveTo(centerX, centerY);
            this._context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            this._context.closePath();

            this._context.fillStyle = "black";
            this._context.fill();
        }
        else {
            this._data.forEach(function (segMap, index) {
                self._drawSegment(index);
            });
        }
    
        // Clear the middle of the circle.
        this._context.save();
        this._context.beginPath();
        this._context.moveTo(centerX, centerY);
        this._context.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI, false);
        this._context.closePath();

        this._context.fillStyle = "white";
        this._context.fill();

        this._context.restore();
    },


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
    _segmentArcSize: function (index) {
        var 
            total = this._data.reduce(function (memo, segMap) {
                return memo + segMap.value;
            }, 0),

            multiplier = 2 * Math.PI / total;

        return this._data[index].value * multiplier;
    },


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
    _segmentStartAngle: function (index) {
        var self = this;
        return this._data.slice(0, index).reduce(function (memo, segMap, i) {
            return memo + self._segmentArcSize(i);
        }, 0);
    },


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
    _drawSegment: function (index) {
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

    }


};


/**
 * A progress bar widget for showing progress.
 *
 * @class ProgressBar
 * @constructor
 *
 * @param context {Context} The context to render the progress bar in.
 *
 * @param data {Object} The data used to render the progress bar.
 *  The data should include a "total" numeric value (key is "total"),
 *  a "current" numeric value (key is "current"), and a "selected"
 *  numeric value (key is "selected"). Note that the "total" value
 *  cannot be changed after the ProgressBar instance is initialized.
 */
ProgressBar = function (context, data) {
    this._context = context;
    this._data = data;
    this._xPadding = 20;
};


ProgressBar.prototype = {

    getTotal: function () {
        return this._data.total;
    },

    getSelected: function () {
        return this._data.selected;
    },

    getCurrent: function () {
        return this._data.current;
    },

    /**
     * Render the progress bar in the
     * context.
     *
     * @method render
     */
    render: function () {
        this._context.clearRect(0,
                                0,
                                this._context.canvas.width,
                                this._context.canvas.height);

        this._renderWithData(this._data);
    },


    /**
     * Reset the progress bar with new data.
     *
     * @method reset
     *
     * @param data { Object } The data that goes into
     *  the progress bar.
     */
    reset: function (data) {
        this._data = data;
        this.render();
    },


    /**
     * Change the values of the progress bar. This can be
     * animated.
     *
     * @method change
     *
     * @param changeMap {Object} The set of changes to make
     *  to the data.
     *
     * @param options {Object} Any extra options to add to the
     *  change of the element. This may include a silent change
     *  or an animated change.
     */
    change: function (changeMap, options) {
        var current = changeMap.current,
            selected = changeMap.selected;

        options = options || {};

        if (+current !== +current) {
            // Current value was not added to the
            // change map.
            current = this._data.current;
        }

        if (+selected !== +selected) {
            selected = this._data.selected;
        }

        if (options.silent) {
            // Change the state without re-rendering the bar.
            this._data.current = current;
            this._data.selected = selected;
            return;
        }

        if (options.animate) {
            this._animateChange({ 
                total: this._data.total,
                selected: selected,
                current: current
            },
            EasingFunctions.easeOutQuad);
        }
        else {
            this._data.current = current;
            this._data.selected = selected;
            this.render();
        }

    },


    _animateChange: function (newData, easingFunction) {
        var
            self = this,
            ANIMATION_DURATION = 600,
            ANIMATION_STEPS = 60,
            DELTA = ANIMATION_DURATION / ANIMATION_STEPS,

            steps = 0;

        if (this._animationId) {

            // End the current animation.            
            clearInterval(this._animationId);
            this._animationId = null;

            // Update the data to reflect how far the last
            // animation got, then let the new animation move the
            // values their new locations.
            this._data = this._animationProgress;
            self._animationProgress = null;
        }

        this._animationId = setInterval(function () {

            // Cache the animation progress in an
            // instance variable. The purpose of
            // this is so that animations can be
            // properly handled in the case that
            // a user causes a new animation to
            // begin while an animation is in
            // progress.
            self._animationProgress = {

                current: easingFunction(steps * DELTA,
                                        self._data.current,
                                        newData.current - self._data.current,
                                        ANIMATION_DURATION),

                selected: easingFunction(steps * DELTA,
                                         self._data.selected,
                                         newData.selected - self._data.selected,
                                         ANIMATION_DURATION),

                total: newData.total
            };

            self._context.clearRect(0, 0, self._context.canvas.width, self._context.canvas.height);
            // If there is any error with rendering the data, then
            // we need to end the animation and render the
            // progress bar using the state prior to the
            // animation.
            try {
                self._renderWithData(self._animationProgress);
            }
            catch (e) {
                clearInterval(self._animationId);
                self._animationId = null;
                self.render();
                throw e;
            }


            // Clear the interval once the duration has been completed.
            if (steps * DELTA >= ANIMATION_DURATION) {
                // Clear the animation id and set it to null,
                // indicating that no animation is executing.
                clearInterval(self._animationId);
                self._animationId = null;
                // Set the current data to the new data now
                // that the animation has finished.
                self._data = newData;
            }
            ++steps;
        }, DELTA);
    },


    /**
     * Pass in the data to render the progress bar with.
     *
     * @method _renderWithData
     * @private
     *
     * @param data {Object} The data to render the progress bar
     *  with.
     */
    _renderWithData: function (data) {
        var
            RATIO_OFFSET = 0.01,
            BAR_PORTION = 0.35,
            TOOLTIP_PADDING = 2,

            NORMALIZED_RATIO_OFFSET = RATIO_OFFSET / (1 - RATIO_OFFSET),

            canvasHeight = this._context.canvas.height,
            barHeight = Math.min(canvasHeight * BAR_PORTION, 40),
            width = this._context.canvas.width - 2 * this._xPadding,
            startX = this._xPadding,
            startY = (canvasHeight - barHeight) / 2,
            
            // Add a bit of extra value to the ratio
            // so that the bar still shows when the
            // current or selected value is 0.
            currentRatio = ((data.current / data.total) + NORMALIZED_RATIO_OFFSET) / (1 + NORMALIZED_RATIO_OFFSET),
            selectedRatio = ((data.selected / data.total) + NORMALIZED_RATIO_OFFSET) / (1 + NORMALIZED_RATIO_OFFSET);

        if (data.total < data.current || data.total < data.selected) {
            throw Error("The total value of the progress bar cannot " +
                        "be less than the current or selected values");
        }

        if (data.current < data.selected) {
            throw Error("The current value of the progress bar cannot " +
                        "be less than the selected value");
        }

        // At least 2 * (Tooltip_height + Tooltip_padding)
        // Tooltip_Height = 40
        // Tooltip_Padding = 2
        if (canvasHeight * (1 - BAR_PORTION) < 84) {
            throw Error("The height of the canvas element needs to be larger to support " +
                        "the progress bar");
        }

        this._context.save();

        this._context.fillStyle = "rgb(216, 216, 216)";
        fillRoundedRect(this._context, startX, startY, width, barHeight, 5, true, false);

        this._context.fillStyle = "rgb(170, 170, 170)";
        this._context.fillRect(startX, startY, width * currentRatio, barHeight);


        this._context.fillStyle = "green";
        fillRoundedRect(this._context, startX, startY, width * selectedRatio, barHeight, 5, true, false);

        // Set the color and stroke of the tool tip.
        this._context.fillStyle = "#4A90E2";
        this._context.strokeStyle = "#4A90E2";

        this._renderTooltip(startX + width * selectedRatio,
                            startY - TOOLTIP_PADDING,
                            Math.floor(data.selected),
                            { direction: "up" });

        // Only render the tooltip for "current" if it is not the same as selected.
        if (Math.floor(data.selected) !== Math.floor(data.current)) {
            this._renderTooltip(startX + width * currentRatio,
                                barHeight + startY + TOOLTIP_PADDING,
                                Math.floor(data.current));
        }

        this._context.restore();
    },


    /**
     * Renders a tooltip at the given point. The tooltip is
     * configured to show above the element. The direction
     * of the tooltip can be changed in the options parameter.
     *
     * @method _renderTooltip
     * @private
     *
     * @param x {Number} The x point the tooltip starts at.
     *
     * @param y {Number} The y parameter the tooltip starts at.
     *
     * @param number {Number} The number to render inside the tooltip.
     *  This number is expected to be positive.
     *
     * @param options {Object} Any options that can be used to
     *  configure the tooltip.
     */
    _renderTooltip: function (x, y, number, options) {
        var WIDTH = 40,
            HEIGHT = 30,
            TEXT_START_X;

        // Single digit number.
        if (number < 10) {
            TEXT_START_X = 16;
        }
        else if (number < 100) {
            TEXT_START_X = 12;
        }
        else if (number < 1000) {
            TEXT_START_X = 8;
        }

        options = options || {};

        if (options.direction === "up") {
            fillTriangle(this._context, x, y, x - 5, y - 10, x + 5, y - 10);
            fillRoundedRect(this._context, x - (WIDTH / 2), y - 10 - HEIGHT, WIDTH, HEIGHT, 3, true, true);

            this._context.save();

            this._context.fillStyle = "white";
            this._context.font = "14px Helvetica";
            this._context.fillText(number, x - (WIDTH / 2) + TEXT_START_X, y - 10 - (HEIGHT / 2) + 6);

            this._context.restore();

        }
        else {
            // Down direction by default.
            fillTriangle(this._context, x, y, x - 5, y + 10, x + 5, y + 10);
            fillRoundedRect(this._context, x - (WIDTH / 2), y + 10, WIDTH, HEIGHT, 3, true, true);

            this._context.save();

            this._context.fillStyle = "white";
            this._context.font = "14px Helvetica";
            this._context.fillText(number, x - (WIDTH / 2) + TEXT_START_X, y + 10 + (HEIGHT / 2) + 6);

            this._context.restore();
        }
            
    }


};


module.exports = {
    PieChart: PieChart,
    ProgressBar: ProgressBar
};
