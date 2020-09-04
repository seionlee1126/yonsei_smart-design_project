/*
 * Copyright 2016 Google Inc. All rights reserved.
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

goog.provide('Snowflake.Tutorial');

/**
 * Manages the display of a tutorial animation for the game.
 * @param {Element} el the .tutorial element.
 * @constructor
 */
Snowflake.Tutorial = function(el) {
  this.el = el;

  this.visible_ = false;
  this.el.hidden = !this.visible;
  this.scheduleTimeout_ = null;

  this.hasBeenShown = false;
  this.boundOnBlocklyChange_ = this.onBlocklyChange_.bind(this);
  Blockly.getMainWorkspace().addChangeListener(this.boundOnBlocklyChange_);
};

/**
 * Dispose of this Tutorial.
 */
Snowflake.Tutorial.prototype.dispose = function() {
  Blockly.getMainWorkspace().removeChangeListener(this.onBlocklyChange_);
};

/**
 * Schedules displaying the tutorial. Only happens max once, some time after the
 * first time requested.
 */
Snowflake.Tutorial.prototype.schedule = function(force) {
  if (this.hasBeenShown && !force) { return; }

  // Blockly does some non-user initiated workspace changes on timeout, so we wait for
  // them to finish.
  this.scheduleTimeout_ = window.setTimeout(this.toggle.bind(this, true), 300);
};

/**
 * Shows or hides the tutorial.
 * @param {boolean} visible is true to show the tutorial, otherwise false.
 */
Snowflake.Tutorial.prototype.toggle = function(visible) {
  if (this.scheduleTimeout_) {
    window.clearTimeout(this.scheduleTimeout_);
    this.scheduleTimeout_ = null;
  }

  this.hasBeenShown = this.hasBeenShown || visible;
  this.visible_ = visible;
  this.el.hidden = !visible;
};

/**
 * Hide the tutorial on edit blockly workspace.
 * @private
 */
Snowflake.Tutorial.prototype.onBlocklyChange_ = function(event) {
  var mainWorkspace = Blockly.getMainWorkspace();
  if (event.type == Blockly.Events.MOVE &&
      // There is a move event when we first place the blocks on the workspace.
      event.blockId != mainWorkspace.topBlocks_[0].id &&
      // The block has to be connected to another block for us to pay attention.
      mainWorkspace.getBlockById(event.blockId) &&
      mainWorkspace.getBlockById(event.blockId).getRootBlock().id == "SnowflakeStartBlock") {
    if (this.visible_ || this.scheduleTimeout_) {
      this.toggle(false);
    }
    mainWorkspace.removeChangeListener(this.onBlocklyChange_);
  }
};
