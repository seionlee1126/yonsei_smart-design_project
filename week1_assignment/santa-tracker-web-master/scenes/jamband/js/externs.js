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

/**
 * @fileoverview Externs for Klang, built for the Jamband scene.
 * @externs
 */


/**
 */
var Klang;

/**
 * @param {string} name
 * @return {AudioGroup|Sequencer}
 */
Klang.$ = function(name) {};

/**
 * @param {number} time
 * @param {function()} callback
 */
Klang.schedule = function(time, callback) {};

/** @type {!AudioContext} */
Klang.context;


/**
 * @constructor
 */
var AudioGroup;

/** @type {!Array<!AudioSource>} */
AudioGroup.prototype.content;


/**
 * @constructor
 */
var AudioSource;

/** @type {!GainNode} */
AudioSource.prototype.output;

/**
 * @param {number=} opt_when
 * @param {number=} opt_offset
 * @param {number=} opt_duration
 * @param {boolean=} opt_resume
 * @return {!AudioSource}
 */
AudioSource.prototype.play = function(opt_when, opt_offset, opt_duration, opt_resume) {};

/**
 * @param {number} duration
 * @param {number=} opt_when
 * @return {!AudioSource}
 */
AudioSource.prototype.fadeOutAndStop = function(duration, opt_when) {};

/**
 * @constructor
 */
var Sequencer = function() {};

/** @type {number} */
Sequencer.prototype._bpm;

/** @type {number} */
Sequencer.prototype.currentStep;

/**
 * @param {number} x Beat to calculate time to.
 * @return {number} When the beat will occur.
 */
Sequencer.prototype.getBeatTime = function(x) {};
