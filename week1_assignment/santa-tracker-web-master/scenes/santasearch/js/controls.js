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
 'use strict';

goog.provide('app.Controls');

goog.require('app.Constants');

/**
 * Handles user input for controlling the game.
 * @param {!jQuery} elem The game element.
 * @param {!jQuery} sceneElem The scene element (i.e., not the GUI).
 * @param {{width: number, height: number, left: number, top: number}}
 *     viewportDimensions The dimensions of the viewport.
 * @constructor
 */
app.Controls = function(elem, sceneElem, viewportDimensions) {
  this.elem = elem;
  this.sceneElem = sceneElem;
  this.scrollableElem = this.elem.find('.viewport--scrollable');
  this.viewportDimensions = viewportDimensions;

  this.enabled = false;
  this.interactionType = '';

  this.syncingScroll = false;
  this.selecting = false;
  this.pinching = false;
  this.originalPinchDistance = undefined;
  this.originalPinchScale = undefined;

  this.hasLastLocation = false;
  this.lastLocation = {
    x: 0,
    y: 0,
  };

  this.pan = {
    x: 0,
    y: 0,
  };
  this.needsPanUpdate = false;

  this.scale = 1;
  this.needsScaleUpdate = false;
};

/**
 * Sets up event handlers for the controls.
 */
app.Controls.prototype.start = function() {
  this.elem.on('touchstart.santasearch', this.onTouchstart_.bind(this));
  this.elem.on('touchmove.santasearch', this.onTouchmove_.bind(this));
  this.elem.on('touchend.santasearch', this.onTouchend_.bind(this));

  this.elem.on('mousedown.santasearch', this.onMousedown_.bind(this));
  this.elem.on('mousemove.santasearch', this.onMousemove_.bind(this));
  this.elem.on('mouseup.santasearch', this.onMouseup_.bind(this));
  this.elem.on('mouseleave.santasearch', this.onMouseup_.bind(this));

  this.scrollableElem.on('scroll.santasearch', this.onScroll_.bind(this));

  this.elem.find('.zoom__in').on('click', this.zoomIn_.bind(this));
  this.elem.find('.zoom__out').on('click', this.zoomOut_.bind(this));
  this.scrollableElem.on('dblclick.santasearch', this.nextZoomLevel_.bind(this));

  this.enabled = true;
};

/**
 * Reset state.
 */
app.Controls.prototype.reset = function() {
  this.scale = 1;
  this.pan.x = 0;
  this.pan.y = 0;
  this.pinching = false;
  this.selecting = false;
  this.syncScroll();

  this.scaleTarget = undefined;
};

/**
 * Updates pan based on location of user interaction
 * @param {number} x X coordinate of where the user is touching the screen.
 * @param {number} y Y coordinate of where the user is touching the screen.
 * @private
 */
app.Controls.prototype.updateLocation_ = function(x, y) {
  if (!this.enabled) {
    return;
  }

  if (this.hasLastLocation) {
    this.pan.x += x - this.lastLocation.x;
    this.pan.y += y - this.lastLocation.y;

    this.needsPanUpdate = true;
  }

  this.lastLocation.x = x;
  this.lastLocation.y = y;
  this.hasLastLocation = true;

  this.syncScroll();
};

/**
 * Keep scroll position in sync
 */
app.Controls.prototype.syncScroll = function() {
  this.syncingScroll = true;
  this.scrollableElem.scrollLeft(this.viewportDimensions.left - this.pan.x);
  this.scrollableElem.scrollTop(this.viewportDimensions.top - this.pan.y);
};

/**
 * Sets the interaction type. If it's already set to another type (e.g. touch vs mouse), then
 * ignores it.
 */
app.Controls.prototype.claimInteraction = function(newType) {
  if (this.interactionType && this.interactionType !== newType) {
    return false;
  }
  this.interactionType = newType;
  return true;
};

/**
 * Handles the touchstart event.
 * @param {jQuery.Event} event The event object.
 * @private
 */
app.Controls.prototype.onTouchstart_ = function(event) {
  if (!this.claimInteraction('touch')) {
    return;
  }
  let touchCount = event.originalEvent.touches.length;

  if (this.sceneElem[0].contains(event.target)) {
    console.info('preventing default, this.elem[0] contains thing...', this.elem[0], 'thing', event.target);
    event.preventDefault();
  }

  if (touchCount === 1) {
    this.selecting = true;
    var touchX = event.originalEvent.changedTouches[0].pageX;
    var touchY = event.originalEvent.changedTouches[0].pageY;

    this.updateLocation_(touchX, touchY);
  } else {
    this.pinchStart_(event);
  }
};

/**
 * Handles the touchmove event.
 * @param {jQuery.Event} event The event object.
 * @private
 */
app.Controls.prototype.onTouchmove_ = function(event) {
  if (!this.claimInteraction('touch')) {
    return;
  }
  const touchCount = event.originalEvent.touches.length;
  const touchX = event.originalEvent.changedTouches[0].pageX;
  const touchY = event.originalEvent.changedTouches[0].pageY;

  if (touchCount === 1 && this.hasLastLocation && touchY < this.lastLocation.y) {
    // do nothing, this _might_ allow iOS/etc to scroll up and hide the toolbar
  } else {
    // iOS uses pinch/zoom gesture to control Safari
    event.preventDefault();
  }

  if (this.selecting && touchCount === 1) {
    this.updateLocation_(touchX, touchY);
  } else if (this.pinching) {
    this.pinchMove_(event);
  }
};

/**
 * Handles the touchend event.
 * @param {jQuery.Event} event The event object.
 * @private
 */
app.Controls.prototype.onTouchend_ = function(event) {
  if (!this.claimInteraction('touch')) {
    return;
  }
  let touchCount = event.originalEvent.changedTouches.length;

  var touchX = event.originalEvent.changedTouches[0].pageX;
  var touchY = event.originalEvent.changedTouches[0].pageY;

  // nb. don't preventDefault here, as it'll prevent click from firing on UI

  if (touchCount === 1) {
    this.updateLocation_(touchX, touchY);
    this.selecting = false;
    this.interactionType = '';
  } else {
    this.pinchEnd_();
  }

  this.hasLastLocation = false;
};

/**
 * Calculate pinch distance.
 * @param {jQuery.Event} event The jQuery wrapped touch event.
 * @return {number} The pinch distance.
 * @private
 */
app.Controls.prototype.calculatePinchDistance_ = function(event) {
  let firstTouch = {
    x: event.originalEvent.touches[0].pageX,
    y: event.originalEvent.touches[0].pageY,
  };

  let secondTouch = {
    x: event.originalEvent.touches[1].pageX,
    y: event.originalEvent.touches[1].pageY,
  };

  let xDiff = secondTouch.x - firstTouch.x;
  let yDiff = secondTouch.y - firstTouch.y;
  return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
};

/**
 * Handle pinch start.
 * @param {jQuery.Event} event The touch event.
 * @private
 */
app.Controls.prototype.pinchStart_ = function(event) {
  let distance = this.calculatePinchDistance_(event);
  this.originalPinchDistance = distance;
  this.originalPinchScale = this.scale;

  this.pinching = true;
};

/**
 * Handle pinch move.
 * @param {jQuery.Event} event The touch event.
 * @private
 */
app.Controls.prototype.pinchMove_ = function(event) {
  let distance = this.calculatePinchDistance_(event) /
      this.originalPinchDistance;
  this.scalePan(this.scale, this.originalPinchScale * distance);
};

/**
 * Handle pinch end.
 * @private
 */
app.Controls.prototype.pinchEnd_ = function() {
  this.pinching = false;
};

/**
 * Handles the mousedown event.
 * @param {jQuery.Event} event The mouse event.
 * @private
 */
app.Controls.prototype.onMousedown_ = function(event) {
  if (!this.claimInteraction('mouse')) {
    return;
  }
  this.updateLocation_(event.pageX, event.pageY);

  this.selecting = true;
};

/**
 * Handles the mousemove event.
 * @param {jQuery.Event} event The mouse event.
 * @private
 */
app.Controls.prototype.onMousemove_ = function(event) {
  if (!this.claimInteraction('mouse')) {
    return;
  }
  if (this.selecting) {
    this.updateLocation_(event.pageX, event.pageY);
  }
};

/**
 * Handles the mouseup event.
 * @param {jQuery.Event} event The mouse event.
 * @private
 */
app.Controls.prototype.onMouseup_ = function(event) {
  if (!this.claimInteraction('mouse')) {
    return;
  }
  this.updateLocation_(event.pageX, event.pageY);

  this.hasLastLocation = false;

  this.selecting = false;
  this.interactionType = '';
};

/**
 * Handle scroll event.
 * @param {jQuery.Event} event The scroll event.
 * @private
 */
app.Controls.prototype.onScroll_ = function(event) {
  if (this.syncingScroll) {
    this.syncingScroll = false;
    return;
  }

  let dimensions = this.viewportDimensions;
  this.pan.x = dimensions.left - this.scrollableElem.scrollLeft();
  this.pan.y = dimensions.top - this.scrollableElem.scrollTop();

  this.needsPanUpdate = true;
};

/**
 * Scale and pan.
 * @param {number} from The current zoom level.
 * @param {number} to The new zoom level.
 */
app.Controls.prototype.scalePan = function(from, to) {
  let direction = to - from;
  let difference = Math.abs(direction);

  if (to < 1) {
    to = 1;
  }

  if (to > app.Constants.ZOOM_MAX) {
    to = app.Constants.ZOOM_MAX;
  }

  this.pan.x *= (to / from);
  this.pan.y *= (to / from);
  this.scale = to;

  if (this.scale === 1) {
    this.pan.x = 0;
    this.pan.y = 0;
  }

  this.needsPanUpdate = true;
  this.needsScaleUpdate = true;
};

/**
 * Handles zooming in when the user clicks the zoom-in element.
 * @private
 */
app.Controls.prototype.zoomIn_ = function() {
  if (!this.enabled || this.scale === app.Constants.ZOOM_MAX) {
    return;
  }

  let scaleTarget = this.scale + app.Constants.ZOOM_STEP_SIZE;

  if (scaleTarget <= app.Constants.ZOOM_MAX) {
    this.scaleTarget = scaleTarget;
  } else {
    this.scaleTarget = app.Constants.ZOOM_MAX;
  }
};

/**
 * Handles zooming out when the user clicks the zoom-out element.
 * @private
 */
app.Controls.prototype.zoomOut_ = function() {
  if (!this.enabled || this.scale === 1) {
    return;
  }

  let scaleTarget = this.scale - app.Constants.ZOOM_STEP_SIZE;

  if (scaleTarget >= 1) {
    this.scaleTarget = scaleTarget;
  } else {
    this.scaleTarget = 1;
  }
};

/**
 * Zoom in until the maximum zoom has been reached and then zoom out.
 * @private
 */
app.Controls.prototype.nextZoomLevel_ = function(event) {
  let x = (this.viewportDimensions.width / 2) - event.pageX;
  let y = (this.viewportDimensions.height / 2) - event.pageY;
  this.pan.x += x / this.scale;
  this.pan.y += y / this.scale;
  this.needsPanUpdate = true;

  if (this.scale === app.Constants.ZOOM_MAX) {
    this.scaleTarget = 1;
  } else {
    this.zoomIn_();
  }
};
