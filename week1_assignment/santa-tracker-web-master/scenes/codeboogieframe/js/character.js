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

goog.provide('app.Character');

goog.require('app.Animation');
goog.require('app.AnimationData');
goog.require('app.Step');

app.Character = class {
  constructor(el, color) {
    /** @type {app.Animation} */
    this.animation = null;
    this.currentState = null;
    this.el = el;
    this.data = app.AnimationData();
    this.lastFrame = null;
    this.color = color;

    // Create canvas
    let canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    el.appendChild(canvas);

    this.context = canvas.getContext('2d');

    this.images = {};
    this.renderSprites_(color);
  }

  renderSprites_(color) {
    Object.keys(this.data).forEach(name => {
      this.loadImage(name, color)
    });
  }

  loadImage(name, color) {
    let image = new Image();

    image.onload = () => {
      this.images[name] = image;
    };

    image.onerror = () => {
      image.onerror = null;
      setTimeout(() => {
        image.src += '?' + +new Date;
      }, 1000);
    }

    image.src = `img/steps/${color}/${name}.png`;
  }

  update(dt) {
    if (!this.animation) return;

    let frame = this.animation.update(dt);

    if (frame === this.lastFrame) {
      return;
    }

    let image = this.images[frame.sprite];

    if (image) {
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

      this.context.drawImage(image, frame.x, frame.y,
          frame.width, frame.height, frame.offsetX, frame.offsetY,
          frame.width, frame.height);
    } else {
      // Try to load failed image again.
      // Check if we are displaying the first frame so we don't try 24 times.
      if (frame.x === 0) {
        this.loadImage(frame.sprite, this.color);
      }
    }

    this.lastFrame = frame;
  }

  setState(state) {
    if (state === this.currentState) {
      return;
    }

    if (this.currentState) {
      this.el.classList.remove(this.currentState);
    }

    this.currentState = state;
    this.el.classList.add(this.currentState);
  }

  play(step, bpm) {
    this.animation = new app.Animation(step, bpm, this.data);
    this.animation.play();
  }

  setColor(color) {
    if (this.color !== color) {
      this.color = color;
      this.renderSprites_(color);
    }
  }
};
