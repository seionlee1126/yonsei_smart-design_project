/*
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

goog.provide('app.shared.utils');

app.shared.utils = (function() {
  var utils = {

    /**
     * Assigns an animation class to the selected elements, removing it when
     * the animation finishes.
     * @param {!Element|!jQuery} el The jQuery element.
     * @param {string} name Class name to add.
     * @param {function(this:Element)=} opt_cb Callback function when animation finishes.
     */
    animWithClass: function(el, name, opt_cb) {
      var elem = $(el);

      elem.one('animationend transitionend', function(e) {
        elem.removeClass(name);
        if (opt_cb) {
          opt_cb.apply(elem[0]);
        }
      });
      elem.addClass(name);
    },

    /**
     * Updates any SVG that has inline styles like "url(#blah)" to include the
     * full local path. This is required in production as our base href there
     * is actually maps.gstatic.com/...
     */
    updateLocalSVGRef: function(node) {
      // Chrome handles this correctly, as does Firefox 51+. Just ignore it.
    },

    /**
     * Unwraps a jQuery object or confirms that an Element is non-null. Throws a
     * TypeError if there is no object available.
     * @param {Element|!jQuery} element source element or jQuery
     * @return {!Element} result element, or first jQuery object
     */
    unwrapElement: function(element) {
      var out = $(element)[0];
      if (!out) {
        throw new TypeError('Couldn\'t unwrap element, nothing matched');
      }
      return out;
    },

    /**
     * Returns the computed transform values as a raw object containing x, y
     * and rotate values (in degrees).
     * @param {!Element} elem to examine
     * @return {{x: number, y: number, rotate: number}}
     */
    computedTransform: function(elem) {
      var style = window.getComputedStyle(elem);
      var transform;

      ['', '-webkit-', '-moz-', '-ms-', '-o-'].some(function(prefix) {
        var t = style.getPropertyValue(prefix + 'transform');
        if (!t) { return false; }
        transform = t;
        return true;
      });

      if (transform === 'none') {
        return {x: 0, y: 0, rotate: 0};
      }

      var values;
      try {
        // expected to be matrix(....)
        values = transform.split('(')[1].split(')')[0].split(',');
        values = values.map(function(x) { return +x; });
      } catch(e) {
        throw new TypeError('Couldn\'t split transform, expected matrix(...)');
      }
      var a = values[0];
      var b = values[1];
      var scale = Math.sqrt(a*a + b*b);

      // arc sin, convert from radians to degrees, round
      var sin = b / scale;
      var rotate = Math.atan2(b, a) * (180 / Math.PI);

      return {x: values[4], y: values[5], rotate: rotate};
    },

    /**
     * Register listener for finish event on a Web Animation player.
     * TODO(samthor): Fix Function type when this code is replaced.
     * @param {!Animation} player The animation player object which will finish
     * @param {!Function} fn A callback function to execute when player finishes
     */
    onWebAnimationFinished: function(player, fn) {
      // TODO(samthor): player also exposes {!Promise<*>} under finished, not
      // defined in externs yet
      player.addEventListener('finish', fn, false);
    },

    /**
     * Determine whether a Web Animations player is finished. A null player
     * is considered to be finished.
     * @param {Animation} player
     * @return {boolean}
     */
    playerFinished: function(player) {
      if (!player) {
        return true;
      }
      return player.playState === 'finished';
    },

    /**
     * Guesses whether the device is touchEnabled: more specifically, whether the primary device
     * is a touch device.
     */
    get touchEnabled() {
      const hasCoarse = window.matchMedia('(pointer: coarse)').matches;
      if (hasCoarse) {
        return true;  // true-ish
      }
      const hasPointer = window.matchMedia('(pointer: fine)').matches;
      if (hasPointer) {
        return false;  // prioritize mouse control
      }

      // Otherwise, fall-back to older style mechanisms.
      return ('ontouchstart' in window) ||
          window.DocumentTouch && document instanceof window.DocumentTouch;
    }

  };

  /**
   * Wraps a value and provides useful utility methods for it.
   * @param {*} opt_initialValue Any value.
   * @constructor
   * @struct
   */
  utils.SmartValue = function(opt_initialValue) {
    this.value = opt_initialValue;
  };

  /**
   * Updates the value and returns true if it is different. Useful for caching reasons to only
   * apply some side effect when the value is actually different.
   * @param {*} newValue A new value.
   * @return {boolean} whether the underlying value changed
   */
  utils.SmartValue.prototype.change = function(newValue) {
    var isDifferent = this.value !== newValue;
    this.value = newValue;
    return isDifferent;
  };

  /**
   * Increments or decrements the value by amount to the target, not going over
   * it. Assumes that the wrapped value is a number.
   * @param {number} target Final value.
   * @param {number} amount Amount to change in this frame.
   * @return {!utils.SmartValue} the this object
   */
  utils.SmartValue.prototype.moveToTarget = function(target, amount) {
    var n = /** @type {number} */ (this.value);
    n = +n;
    if (this.value !== n) {
      throw new TypeError('SmartValue does not contain a number');
    }
    if (n < target) {
      n = Math.min(target, n + amount);
    } else if (n > target) {
      n = Math.max(target, n - amount);
    }
    this.value = n;
    return this;
  };

  return utils;
})();

var utils = app.shared.utils;
