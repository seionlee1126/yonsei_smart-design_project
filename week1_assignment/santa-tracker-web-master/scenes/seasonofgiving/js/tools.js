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

goog.require('app.CustomSlider');
goog.require('app.GameManager');

goog.provide('app.Tools');

/**
 * Tool wrapper
 * @constructor
 * @param {jQuery} el element of wrapper
 */
app.ToolWrapper = function(el) {
  this.el = el;
};

/**
 * Base tool item
 * @constructor
 * @param {!app.Game} game The game object.
 * @param {string} name The name of the tool. Element should have class Tool-name.
 * @param {{x: number, y: number}} mouseOffset Mouse interaction offset
 */
app.Tool = function(game, name, mouseOffset) {
  this.game = game;
  this.el = this.elem.find('.Tool-' + name);
  this.container = this.el.closest('.Tool-container');
  this.isSelected = false;
  this.color = this.el.data('color');
  this.height = this.el.height();
  this.width = this.el.width();
  this.mouseOffset = mouseOffset || {x: 0, y: 0};

  // Polyfill pointer-events: none for IE 10
  var pointerEventsNone = function(e) {
    var origDisplayAttribute = /** @type {string} */ ($(this).css('display'));
    $(this).css('display', 'none');

    var underneathElem = document.elementFromPoint(e.clientX, e.clientY);

    if (origDisplayAttribute) {
      $(this).css('display', origDisplayAttribute);
    } else {
      $(this).css('display', '');
    }

    // fire the mouse event on the element below
    e.target = underneathElem;
    $(underneathElem).trigger(e);

    e.stopPropagation();
  };

  this.el.on('click touchend', pointerEventsNone);
};

/**
 * Select this tool from the toolbox
 */
app.Tool.prototype.select = function() {
  var endScale = (app.GameManager.sizeSlider.strokeSize * .1 * .1) * 2 + .2;
  this.isSelected = true;
  this.el.addClass('Tool--selected');
  this.width = this.el.width();
  this.elem.find('.canvas').addClass('canvas--active');
  this.bounceTo(endScale);
  this.move(this.game.mouse);
  window.santaApp.fire('sound-trigger', 'spirit_click');
};

/**
 * Bounce to animation
 * @param {number} value 0.1-1.0 scale to bounce to
 */
app.Tool.prototype.bounceTo = function(value) {
  const final = animScale(1, value);
  const bounce = [
    {transform: animScale(.3, value)},
    {transform: animScale(1.2, value)},
    {transform: animScale(.9, value)},
    {transform: animScale(1.03, value)},
    {transform: animScale(.97, value)},
    {transform: final},
  ];

  const target = this.el[0];
  const player = target.animate(bounce, {
    duration: 500,
    easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
  });
  player.onfinish = function() {
    target.style.transform = final;  // set final state
  };

  function animScale(to, end) {
    return 'scale3d(' + (to * end) + ',' + (to * end) + ',' + (to * end) + ')';
  }
};

/**
 * Deselect this tool
 */
app.Tool.prototype.deselect = function() {
  this.isSelected = false;
  this.bounceTo(1);
  this.el.removeClass('Tool--selected');
  this.el.css({
    top: '',
    left: '',
    transform: ''
  });
  this.elem.find('.canvas').removeClass('canvas--active');

  app.GameManager.tool = null;
};

/**
 * @param {!app.Mouse} mouse
 */
app.Tool.prototype.move = function(mouse) {
  var offset = this.mouseOffset;

  this.el.css({
    left: mouse.x - offset.x,
    top: mouse.y - this.height - offset.y
  });
};

/**
 * Resize Tool item
 */
app.Tool.prototype.resize = function() {
  this.el.css({
    'height': $(window).width() / 7,
    'width': $(window).width() / 7
  });
};

/**
 * Tool
 * @constructor
 * @param {!app.Game} game The game object.
 * @param {!Element|jQuery} elem DOM Element for Tool
 * @param {!Object} exporter Exported object for print and download
 */
app.Tools = function(game, elem, exporter) {
  app.Tool.prototype.elem = elem;
  this.game = game;
  var crayonOffset = {x: 5, y: 48};
  this.context = $(elem);
  this.elem = this.context.find('.Tools');
  this.crayonRed = new app.Tool(this.game, 'crayon--red', crayonOffset);
  this.crayonOrange = new app.Tool(this.game, 'crayon--orange', crayonOffset);
  this.crayonYellow = new app.Tool(this.game, 'crayon--yellow', crayonOffset);
  this.crayonLightGreen = new app.Tool(this.game, 'crayon--light-green', crayonOffset);
  this.crayonGreen = new app.Tool(this.game, 'crayon--green', crayonOffset);
  this.crayonLightBlue = new app.Tool(this.game, 'crayon--light-blue', crayonOffset);
  this.crayonBlue = new app.Tool(this.game, 'crayon--blue', crayonOffset);
  this.crayonViolet = new app.Tool(this.game, 'crayon--violet', crayonOffset);
  this.crayonPurple = new app.Tool(this.game, 'crayon--purple', crayonOffset);
  this.crayonRainbow = new app.Tool(this.game, 'crayon--rainbow', crayonOffset);
  this.crayonBrown = new app.Tool(this.game, 'crayon--brown', crayonOffset);
  this.eraser = new app.Tool(this.game, 'crayon--eraser', {x: 40, y: 58});

  this.sizeSlider = new app.CustomSlider(this.context);
  app.GameManager.sizeSlider = this.sizeSlider;

  this.exporter = exporter;

  this.print = this.context.find('.Button-print');
  // Needs click in FF for popup
  this.print.on('click', this.onClickPrint.bind(this));

  this.download = this.context.find('.Button-download');
  // Needs click in FF for popup
  this.download.on('click', this.onClickDownload.bind(this));

  this.clearOrnament = this.context.find('.Button-reset');
  this.clearOrnament.on('touchstart mousedown', this.onClickReset.bind(this));

  this.downloadMobile = this.context.find('.Button-download--mobile');
  this.downloadMobile.parent().on('touchstart mousedown', this.onClickDownload.bind(this));

  this.resetMobile = this.context.find('.Button-reset--mobile');
  this.resetMobile.parent().on('touchstart mousedown', this.onClickReset.bind(this));

  this.toolWrapper = new app.ToolWrapper(this.context.find('.Tool-wrapper'));
  app.GameManager.toolWrapper = this.toolWrapper;

  this.buttons = this.context.find('.Buttons');

  this.tools = [
    this.crayonRed,
    this.crayonOrange,
    this.crayonYellow,
    this.crayonLightGreen,
    this.crayonGreen,
    this.crayonLightBlue,
    this.crayonBlue,
    this.crayonViolet,
    this.crayonPurple,
    this.crayonBrown,
    this.crayonRainbow,
    this.eraser
  ];

  $(window).on('resize.seasonofgiving', this.handleResize.bind(this));
  this.handleResize();
};

/**
 * Resize
 */
app.Tools.prototype.handleResize = function() {
  var wh = $(window).height() - window.santaApp.headerSize;
  var maxToolHeight = this.elem.height();
  var cols;

  if ($(window).width() > 1024 && $(window).height() > 600) {
    this.elem.find('.Tool-container').css({
      'height': '70px',
      'width': '33.3%'
    });
  } else {
    if ($(window).width() > 550) {
      cols = 14;
    } else {
      cols = 7;
    }

    var toolContainerSize = $(window).width() / cols - 10;
    this.elem.find('.Tool-container').css({
      'height': toolContainerSize,
      'width': toolContainerSize
    });
  }

  this.buttons.css({
    'left': this.toolWrapper.el[0].offsetLeft,
    'top': this.toolWrapper.el.height() + 10
  });
};

/**
 */
app.Tools.prototype.start = function() {
  this.game.mouse.subscribe(this.mouseChanged, this);
  this.elem.on('click touchend', this.selectTool.bind(this));
};

/**
 * @param {!app.Mouse} mouse
 */
app.Tools.prototype.mouseChanged = function(mouse) {
  if (this.selectedTool) {
    this.selectedTool.move(mouse);
  }
};

/**
 * Handle clicks on the toolbox to select a tool
 * @param {Event} e DOM click event
 */
app.Tools.prototype.selectTool = function(e) {
  var previousTool = this.selectedTool;
  var isSlider =
      $(e.target).closest('.crayon-size-wrapper').length > 0;

  if (isSlider) {
    return;
  }

  this.selectedTool = this.tools.filter(function(tool) {
    if (tool.container[0] === e.target && !tool.isSelected) {
      return tool;
    }
  })[0];

  if (previousTool) {
    previousTool.deselect();
  }

  if (this.selectedTool) {
    app.GameManager.tool = this.selectedTool;
    this.selectedTool.select();
    if (typeof this.selectedTool.color !== undefined) {
      app.GameManager.color = this.selectedTool.color;
    }
  }
};

/**
 * Clear ornament stage
 * @param {Event} event Event for click reset
 */
app.Tools.prototype.onClickReset = function(event) {
  if (app.GameManager.lastOrnamentObj) {
    app.GameManager.lastOrnamentObj.reset();
  }
};

/**
 * Print ornament stage
 * @param {Event} event Event for click print
 */
app.Tools.prototype.onClickPrint = function(event) {
  if (app.GameManager.lastOrnamentObj) {
    this.exporter.print(app.GameManager.lastOrnamentObj);
  }
};

/**
 * Download ornament stage
 * @param {Event} event Event for click download
 */
app.Tools.prototype.onClickDownload = function(event) {
  if (app.GameManager.lastOrnamentObj) {
    this.exporter.download(app.GameManager.lastOrnamentObj);
  }
};
