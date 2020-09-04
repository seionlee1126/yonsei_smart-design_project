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

goog.provide('app.Constants');
goog.provide('Constants');

/**
 * Gameplay constants
 * @const
 */
app.Constants = {
  TOTAL_LEVELS: 10,
  INITIAL_COUNTDOWN: 0,
  COUNTDOWN_FLASH: -1,

  // initial size of levelboard wrapper
  CANVAS_WIDTH: 1600,
  CANVAS_HEIGHT: 900,

  // When do we start scaling down?
  VIEWPORT_MIN_WIDTH: 1600,
  VIEWPORT_MIN_HEIGHT: 900,

  SHADOW_OFFSET_PX: 10, // distance to ball shadow
  CONVEYOR_BELT_SPEED: 6, // make sure belt animation is matching
  CORNER_RESOLUTION: 10, // for candy cane polygons

  USER_OBJECT_TYPE_BELT: 'USER_OBJECT_TYPE_BELT',
  USER_OBJECT_TYPE_SPRING: 'USER_OBJECT_TYPE_SPRING',

  PHYSICS_GRAVITY: 150,
  PHYSICS_SCALE: 30,
  PHYSICS_TIME_STEP: 1 / 60,
  PHYSICS_VELOCITY_ITERATIONS: 8,
  PHYSICS_POSITION_ITERATIONS: 8

};


// Hack to support shared scoreboard with other apps.
Constants = app.Constants;
