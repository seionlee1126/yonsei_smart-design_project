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

'use strict'

goog.provide('app.Drawer');

goog.require('app.Draggable');
goog.require('app.shared.utils');

/**
 * @param {!Element} drawer element for the context
 * @param {!game} game the game instance
 * @construtor
 */
app.Drawer = function(elem, game) {
  this.elem = elem;
  this.$elem = $(elem);
  this.game_ = game;

  this.onDrag = this.onDrag.bind(this);
  this.hasInteractionStarted = false;
  this.interactionCallback = null;
  this.isGamePaused = false;

  this.$drawers = {};
  this.$restart = this.$elem.find( '.' + this.CLASS_RESTART );
  this.setDrawers();

  this.$drawers[Constants.USER_OBJECT_TYPE_BELT]
    .$node
    .data('type', Constants.USER_OBJECT_TYPE_BELT);

  this.$drawers[Constants.USER_OBJECT_TYPE_SPRING]
    .$node
    .data('type', Constants.USER_OBJECT_TYPE_SPRING);

};

app.Drawer.prototype.CLASS_DRAWER_SPRING = 'js-drawer-spring';
app.Drawer.prototype.CLASS_DRAWER_BELT = 'js-drawer-belt';
app.Drawer.prototype.CLASS_DRAWER_HOLDER = 'js-drawer-holder';
app.Drawer.prototype.CLASS_SPRING = 'js-object-spring';
app.Drawer.prototype.CLASS_BELT = 'js-object-conveyorBelt';
app.Drawer.prototype.CLASS_INACTIVE = 'is-inactive';
app.Drawer.prototype.CLASS_COUNTER = 'js-drawer-counter';
app.Drawer.prototype.CLASS_RESTART = 'js-drawer-restart';
app.Drawer.prototype.CLASS_DRAGGABLE = 'js-draggable';
app.Drawer.prototype.CLASS_HOLDER_VISIBLE = 'drawer__holder--visible';
app.Drawer.prototype.CLASS_COUNT_VISIBLE = 'drawer__counter--visible';
app.Drawer.prototype.CLASS_OBJECT_VISIBLE = 'object--visible';
app.Drawer.prototype.CLASS_ANIMATE = 'animate';

/**
 * Sets the state to be paused.
 */
app.Drawer.prototype.pause = function() {
  this.isGamePaused = true;
};

/**
 * Sets the sets to be not paused.
 */
app.Drawer.prototype.resume = function() {
  this.isGamePaused = false;
};

/**
 * Returns the game state
 */
app.Drawer.prototype.isPaused = function() {
  return this.isGamePaused;
};

/**
 * Resets the drawers completely to it's initial state.
 */
app.Drawer.prototype.reset = function() {
  this.setDrawers();
  for (var prop in this.$drawers) {
    if (this.$drawers.hasOwnProperty(prop)) {
      this.getDraggableEl_( this.$drawers[prop].$node ).remove();
    }
  }
};

/**
 * Caches the drawer elements and resets the count.
 */
app.Drawer.prototype.setDrawers = function() {
  this.$drawers[Constants.USER_OBJECT_TYPE_SPRING] = {
    count: 0,
    $node: this.$elem.find( '.' + this.CLASS_DRAWER_SPRING )
  };

  this.$drawers[Constants.USER_OBJECT_TYPE_BELT] = {
    count: 0,
    $node: this.$elem.find( '.' + this.CLASS_DRAWER_BELT )
  };
}

/**
 * Adds an element to the drawer and makes it draggable.
 * @param {Object} data           Config data being passed from the level.
 * @param {String} type           What type of object this is. Can be conveyorbelt or spring.
 * @param {Function} onDropCallback Callback to be called on drop.
 * @param {Function} onTestCallback Callback to be called to test if it's a valid drop or not.
 */
app.Drawer.prototype.add = function(data, type, onDropCallback, onTestCallback) {
  var $drawer = this.$drawers[type];
  var $node = this.createDraggableElement_(data);

  $drawer
    .$node
    .append( $node )
    .find('.js-rotate-handle')
    .remove();

  this.incrementCount( $drawer );

  new app.Draggable(
    $node,
    this.elem,
    (x, y, errorCallback) => {
      onDropCallback(data, type, {x, y}, errorCallback);
    },
    (x, y, validCallback) => {
      onTestCallback(data, type, {x, y}, validCallback);
    },
    this,
    data,
    this.game_
  );

};

/**
 * Gets a drawer type element from a given DOM element.
 * @param  {jQuery} $el The element that needs to be checked.
 * @return {String}     The type of element (belt/spring).
 */
app.Drawer.prototype.getDrawerTypeFromEl_ = function($el) {
  return $el.closest('.' + this.CLASS_DRAWER_HOLDER).data('type');
};

/**
 * Callback for when an element is being dragged.
 * @param  {jQuery} $el Element being dragged.
 */
app.Drawer.prototype.onDrag = function($el) {
  var drawerType = this.getDrawerTypeFromEl_($el);
  this.decrementCount( this.$drawers[drawerType] );
  window.santaApp.fire('sound-trigger', 'pb_grab_item');
  if (!this.hasInteractionStarted) {
    this.hasInteractionStarted = true;
    // Tell level that something happened
    // so it hides the tutorial etc
    if (typeof this.interactionCallback === "function") {
      this.interactionCallback();
    }
  }
};

/**
 * Sets an interaction callback function to be called
 * as soon as something is dragged.
 * @param {Function} callbackFn Function to be called.
 */
app.Drawer.prototype.setInteractionCallback = function(callbackFn) {
  this.hasInteractionStarted = false;
  this.interactionCallback = callbackFn;
}

/**
 * Callback for when an drop is invalid (can't drop in that place)
 * @param  {jQuery} $el Element with the drop error
 */
app.Drawer.prototype.onDropError = function($el) {
  var drawerType = this.getDrawerTypeFromEl_($el);
  var drawer = this.$drawers[drawerType];
  var $drawer = drawer.$node;
  var $counter = this.getCounterEl_( $drawer );
  // this is coming from zero
  // show the drawer again
  if (drawer.count === 0) {
    this.showDrawer(drawer);
  }
  this.incrementCount( drawer );
  this.showCounter( $counter );
  window.santaApp.fire('sound-trigger', 'pb_error');
};

/**
 * Callback for when an drop is valid.
 * @param  {jQuery} $el Element with the successfull drop
 */
app.Drawer.prototype.onDropSuccess = function($el) {
  var drawerType = this.getDrawerTypeFromEl_($el);
  var drawer = this.$drawers[drawerType];
  $el.remove();
  // Note: no need to decrement the counter here
  // as that already happens onDrag for instant feedback
  // so, just check if we reached zero
  if (drawer.count === 0) {
    this.hideDrawer(drawer);
  }
  window.santaApp.fire('sound-trigger', 'pb_place_item');
};

/**
 * Shows a specific drawer.
 * @param  {jQuery} $el The drawer element
 */
app.Drawer.prototype.showDrawer = function(drawer) {
  var $drawer = drawer.$node;
  $drawer.addClass( this.CLASS_HOLDER_VISIBLE );
  setTimeout(function() {
    this.showObject( this.getDraggableEl_( $drawer ));
    this.showCounter( this.getCounterEl_( $drawer ) );
  }.bind(this), 200);
};

/**
 * Hides a drawer.
 * @param  {jQuery} $el The drawer element.
 */
app.Drawer.prototype.hideDrawer = function(drawer) {
  var $drawer = drawer.$node;
  $drawer.removeClass( this.CLASS_HOLDER_VISIBLE );
  this.hideCounter( this.getCounterEl_($drawer) );
};

/**
 * Helper function to get the counter element from a drawer.
 * @param  {jQuery} $el The drawer element.
 * @return {Object}     The counter element.
 */
app.Drawer.prototype.getCounterEl_ = function($el) {
  return $el.find( '.' + this.CLASS_COUNTER );
};

/**
 * Helper function to get the draggable element from a drawer.
 * @param  {jQuery} $el The drawer element reference.
 * @return {Object}     The draggable element
 */
app.Drawer.prototype.getDraggableEl_ = function($el) {
  return $el.find( '.' + this.CLASS_DRAGGABLE );
};

/**
 * Shows the object(s) from a drawer.
 * @param  {jQuery} $el The object element.
 */
app.Drawer.prototype.showObject = function($el) {
  $el.addClass( this.CLASS_OBJECT_VISIBLE );
};

/**
 * Hides the object(s) from a drawer.
 * @param  {jQuery} $el The object element.
 */
app.Drawer.prototype.hideObject = function($el) {
  $el.removeClass( this.CLASS_OBJECT_VISIBLE );
};

/**
 * Shows the counter from a specific drawer.
 * @param  {jQuery} $el The counter to be shown.
 */
app.Drawer.prototype.showCounter = function($el) {
  $el.addClass( this.CLASS_COUNT_VISIBLE );
};

/**
 * Hides the counter from the drawer.
 * @param  {jQuery} $el The counter to be hidden.
 */
app.Drawer.prototype.hideCounter = function($el) {
  $el.removeClass( this.CLASS_COUNT_VISIBLE );
};

/**
 * Shows the restart drawer button. Not visible on desktop.
 */
app.Drawer.prototype.showRestart = function() {
  this.$restart.addClass( this.CLASS_HOLDER_VISIBLE );
};

/**
 * Creates a DOM element for a draggable object .
 * @param  {Object} data Config to be used as reference for the creation.
 * @return {Object}      jQuery object.
 */
app.Drawer.prototype.createDraggableElement_ = function(data) {
  var classes = [this.CLASS_DRAGGABLE, 'object ' + data.style.className];
  return $('<div />').addClass(classes.join(' ')).html(data.style.innerHTML || '');
};

/**
 * Goes through the drawers and check which should be shown or hidden.
 * @param {Object} drawer (Optional) pass a drawer to check only that one.
 */
app.Drawer.prototype.updateDrawersVisibility = function (drawer) {
  var toggleVisibility = function(drawer) {
    (drawer && drawer.count > 0) ? this.showDrawer(drawer) : this.hideDrawer(drawer);
  }.bind(this);
  if (drawer) {
    toggleVisibility(drawer);
  }
  else {
    for (var prop in this.$drawers) {
      if (this.$drawers.hasOwnProperty(prop)) {
        toggleVisibility(this.$drawers[prop]);
      }
    }
  }
  this.showRestart();
};

/**
 * Increments the counter by one in a specific drawer.
 * @param  {Object} drawer The drawer object.
 */
app.Drawer.prototype.incrementCount = function(drawer) {
  if (drawer.count === 0) {
    this.showCounter(drawer.$node);
  }
  drawer.count++;
  this.updateCounterText(drawer);
};

/**
 * Decrements the counter by one in a specific drawer.
 * @param  {Object} $drawer The drawer object.
 */
app.Drawer.prototype.decrementCount = function(drawer) {
  drawer.count = Math.max(drawer.count-1, 0);
  if (drawer.count === 0) {
    this.hideCounter( this.getCounterEl_(drawer.$node) );
  }
  this.updateCounterText(drawer);
};

/**
 * Updates the text of a counter from a specific drawer.
 * @param  {Object} $drawer The drawer object.
 */
app.Drawer.prototype.updateCounterText = function(drawer) {
  var $counter = this.getCounterEl_( drawer.$node );
  $counter.text(drawer.count);
  this.animateCounter($counter);
};

/**
 * Triggers a CSS3 animation on the counter element.
 * @param  {jQuery} $counter jQuery counter element to be animated.
 */
app.Drawer.prototype.animateCounter = function($counter) {
  utils.animWithClass($counter, this.CLASS_ANIMATE);
};