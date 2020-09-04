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
 'use strict';

goog.provide('app.Controls');

goog.require('app.Constants');
goog.require('app.InputEvent');

app.Controls = class {
  /**
   * Handles user input for controlling the game.
   * @param {app.Game} game The game that is being controlled
   */
  constructor(game) {
    this.game = game;
    this.keysDown = [];

    this.debounce_ = {};
  }

  /**
   * Setup event handlers.
   * @export
   */
  setup() {
    $(document).on('keydown.wrapbattle', this.onKeyDown.bind(this));
    $(document).on('keyup.wrapbattle', this.onKeyUp.bind(this));
    $('.mobile-button', this.game.elem).on(app.InputEvent.START,
        this.onTouchEvent.bind(this, true));
    $('.mobile-button', this.game.elem).on(app.InputEvent.END + ' ' +
        app.InputEvent.CANCEL, this.onTouchEvent.bind(this, false));
  }

  /**
   * Touch start handler
   * @param {boolean} shouldAdd Whether the key should be added
   * @param {!jQuery.Event} e The event
   */
  onTouchEvent(shouldAdd, e) {
    e = e.originalEvent || e;
    const target = $(e.target);
    let dir = undefined;

    if (target.hasClass('mobile-button--up')) {
      dir = app.Constants.DIRECTIONS.UP;
    } else if (target.hasClass('mobile-button--down')) {
      dir = app.Constants.DIRECTIONS.DOWN;
    } else if (target.hasClass('mobile-button--left')) {
      dir = app.Constants.DIRECTIONS.LEFT;
    } else if (target.hasClass('mobile-button--right')) {
      dir = app.Constants.DIRECTIONS.RIGHT;
    } else {
      return;
    }

    if (shouldAdd) {
      this.addKey(dir)
    } else {
      this.removeKey(dir);
    }
  }

  /**
   * Key down handler
   * @param  {Event} e The event
   */
  onKeyDown(e) {
    if (e.keyCode && (e.keyCode < 37 || e.keyCode > 40)) {
      return;
    }

    this.addKey(e.keyCode);
  }

  /**
   * Key up handler
   * @param  {Event} e The event
   */
  onKeyUp(e) {
    this.removeKey(e.keyCode);
  }

  /**
   * Add a key to the current keys down list
   * @param {number} keyCode The key code of the key
   */
  addKey(keyCode) {
    var found = this.keysDown.indexOf(keyCode);

    if (found < 0) {
      this.keysDown.push(keyCode);
    }
  }

  /**
   * Remove a key from the current keys down list
   * @param {number} keyCode The key code of the key
   */
  removeKey(keyCode) {
    window.clearTimeout(this.debounce_[keyCode] || 0);

    // Debounce key releases, so that touch/mouse events always have a minium duration.
    this.debounce_[keyCode] = window.setTimeout(() => {
      delete this.debounce_[keyCode];

      for (var i = 0; i < this.keysDown.length; i++) {
        if (this.keysDown[i] == keyCode) {
          this.keysDown.splice(i, 1);
          break;
        }
      }
    }, app.Constants.KEY_DELAY);
  }
}
