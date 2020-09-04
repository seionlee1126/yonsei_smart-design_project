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

goog.provide('app.BlockRunner');
goog.provide('app.ResultType');

goog.require('app.Step');
goog.require('app.shared.utils');

/**
 * Enum of possible execution results.
 * @enum {string}
 */
app.ResultType = {
  UNSET: 'UNSET',
  SUCCESS: 'SUCCESS',
  TIMEOUT: 'TIMEOUT',
  ERROR: 'ERROR'
};

/**
 * Enum of different animation states for block runner.
 * @enum {string}
 */
app.BlockRunnerState = {
  NOT_ANIMATING: 'NOT_ANIMATING',
  ANIMATING: 'ANIMATING'
};

/**
 * @typedef {{
 *   step: app.Step,
 *   blockId: string
 * }}
 */
app.BlockEvaluation;

/**
 * Runs code from blockly blocks.
 * @param {!app.Scene} scene instance.
 * @param {!app.Blockly} blockly interface to Blockly.
 * @constructor
 */
app.BlockRunner = class {
  constructor(scene, blockly) {
    this.api = this.createExecuteContext();
    this.blockly = blockly;
    this.scene = scene;
    /** @type {app.LevelResult} */
    this.levelResult = null;

    // Configure Blockly loops to highlight during iteration.
    Blockly.JavaScript.INFINITE_LOOP_TRAP = '  api.highlightLoop(%1);\n';

    // Register animation events.
    scene.player.addEventListener('step', this.onStep_.bind(this));
    scene.player.addEventListener('finish',
                                  this.onFinishAnimations_.bind(this));

    this.reset_();
  }

  reset_() {
    /** @type {Array<app.BlockEvaluation>} */
    this.stepQueue_ = [];
    /** @type {app.BlockRunnerState} */
    this.state_ = app.BlockRunnerState.NOT_ANIMATING;
    /** @type {app.LevelResult} */
    this.levelResult = null;
  }

  /**
   * Execute the user's code. Heaven help us...
   */
  execute() {
    this.reset_();

    var code = this.blockly.getCode();

    try {
      this.evalWith_(code, this.api);
    } catch (e) {
      console.warn(e);
    }

    this.runAnimation(this.scene.level.processResult(this.stepQueue_,
                                                     this.blockly));
  }

  runAnimation(result) {
    this.levelResult = result;

    if (this.levelResult.skipAnimation) {
      this.reportExecution_();
    } else {
      this.runAnimations_();
    }
  }

  beforeAnimations_() {
    this.blockly.toggleExecution(true);
  }

  onStep_(e) {
    this.blockly.highlightBlock(e.data);
  }

  onFinishAnimations_() {
    if (this.state_ === app.BlockRunnerState.NOT_ANIMATING) { return; }

    this.reportExecution_();

    // Reset state.
    this.blockly.toggleExecution(false);
    this.state_ = app.BlockRunnerState.NOT_ANIMATING;
  }

  reportExecution_() {
    this.scene.onFinishExecution(this.levelResult);
  }

  runAnimations_() {
    this.beforeAnimations_();
    this.state_ = app.BlockRunnerState.ANIMATING;

    this.scene.player.start(this.levelResult);
  }

  restartLevel() {
    // TODO: Any more cancel/restart things?
    this.state_ = app.BlockRunnerState.NOT_ANIMATING;
  }

  evalWith_(code, scope) {
    // execute JS code "natively"
    var params = [];
    var args = [];
    for (var k in scope) {
      if (scope.hasOwnProperty(k)) {
        params.push(k);
        args.push(scope[k]);
      }
    }
    params.push(code);

    /** @constructor */
    var Ctor = function() {
      return Function.apply(this, params);
    };
    Ctor.prototype = Function.prototype;
    return new Ctor().apply(null, args);
  }

  createExecuteContext() {
    const stepFn = step => blockId => this.stepQueue_.push({step, blockId});
    const highlightFn = blockId => this.stepQueue_.push({blockId});

    return {
      api: {
        pointLeft: stepFn(app.Step.LEFT_ARM),
        pointRight: stepFn(app.Step.RIGHT_ARM),
        stepLeft: stepFn(app.Step.LEFT_FOOT),
        stepRight: stepFn(app.Step.RIGHT_FOOT),
        jump: stepFn(app.Step.JUMP),
        splits: stepFn(app.Step.SPLIT),
        hip: stepFn(app.Step.SHAKE),
        highlightLoop: id => highlightFn(id)
      }
    };
  }
};

/**
 * How long should loop highlights last. Note that they attempt to borrow this time from
 * the last block highlight.
 * @type {number}
 */
app.BlockRunner.INJECTED_HIGHLIGHT_DURATION = 150;
