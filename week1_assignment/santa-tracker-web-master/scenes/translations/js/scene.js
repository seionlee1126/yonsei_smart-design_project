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

goog.provide('app.Scene');

goog.require('app.Constants');
goog.require('app.InputEvent');
goog.require('app.shared.Tutorial');
goog.require('app.shared.utils');

/**
 * Main class for scene
 * @param {!Element} el DOM element containing the scene.
 * @constructor
 * @export
 */
app.Scene = function(el) {
  this.$el = $(el);
  this.$phraseContainerFrom = this.$el.find('.js-phrase-container-from');
  this.$phraseContainerTo = this.$el.find('.js-phrase-container-to');
  this.$languagesFrom = this.$el.find('#js-language-dropdown-from');
  this.$languagesTo = this.$el.find('#js-language-dropdown-to');
  this.$btnPlay = this.$el.find('.js-btn-play');
  this.$btnPrev = this.$el.find('.js-btn-prev');
  this.$btnNext = this.$el.find('.js-btn-next');
  this.$btnShuffle = this.$el.find('.js-btn-shuffle');
  this.detectedLabel = this.$el.find('.js-detected-label').text();

  /** @private {Animation} */
  this.playAnimation_ = null;

  /** @private {Animation} */
  this.changeTextAnimation_ = null;

  /** @private {Animation} */
  this.paginationAnimation_ = null;

  this.phraseIndex = 0;

  this.fromLang = app.Constants.DEFAULT_LANGUAGE;
  this.toLang = app.Constants.DEFAULT_LANGUAGE;

  this.onPlayPhrase_ = this.onPlayPhrase_.bind(this);
  this.onPrevPhrase_ = this.onPrevPhrase_.bind(this);
  this.onNextPhrase_ = this.onNextPhrase_.bind(this);
  this.onShuffleLanguages_ = this.onShuffleLanguages_.bind(this);
  this.onSelectFromLanguage_ = this.onSelectFromLanguage_.bind(this);
  this.onSelectToLanguage_ = this.onSelectToLanguage_.bind(this);

  this.tutorial_ = new app.shared.Tutorial(this.$el, 'touch-translations', 'mouse-translations', 'touch-translations');

  this.init_();
};


/**
 * @private
 * @param {!jQuery} $targetContainer Dom element to append generated phrases elements to
 * @return {!jQuery} Selection of generated phrase elements
 */
app.Scene.prototype.buildPhrases_ = function($targetContainer) {
  var l = app.Constants.PHRASES.length,
      i;

  for (i = 0; i < l; i++) {
    var phrase = app.Constants.PHRASES[i];
    var $el = $('<div>', {
      'data-index': i,
      'class': 'js-phrase translations-scene'
    });


    Object.keys(phrase).forEach(function(key) {
      var lang = phrase[key];
      var $lang = $('<span>', {'class': 'translations-scene'}).attr('data-lang', key).html(lang);

      if (lang.length > 12) {
        $lang.addClass('long-phrase');
      }

      $el.append($lang);
    });

    $targetContainer.append($el);
  }

  return $targetContainer.children();
};

/**
 * Detects default fromLanguage from browser & randomizes a toLAnguage
 * @private
 */
app.Scene.prototype.setDefaultLanguages_ = function() {
  // detect selected lang
  this.fromLang = document.documentElement.lang;

  if (!this.$languagesFrom.find('option[value=' + this.fromLang + ']')) {
    // detected language not found
    this.fromLang = app.Constants.DEFAULT_LANGUAGE;
    this.detectedLabel = '';
  }

  var $fromLang = this.$languagesFrom.find('option[value="' + this.fromLang + '"]');
  $fromLang.text($fromLang.text() + ' - ' + this.detectedLabel);
  $fromLang.attr('selected', 'selected');

  // randomize translated lang
  this.toLang = this.fromLang; // init to detected to make sure we dont get same
  this.selectRandomToLanguage_();
};

/**
 * @private
 * @param {string} string Text to play back
 * @param {string} lang ISO lang code to use for playback
 * @param {string} klangEvent to fire to Klang for Elvish
 */
app.Scene.prototype.playAudio_ = function(string, lang, klangEvent) {
  window.ga('send', 'event', 'game', 'listen', 'translations');

  if (this.toLang === 'elvish') {
    window.santaApp.fire('sound-trigger', klangEvent);
  } else {
    lang = lang || 'en';
    var url = app.Constants.TTS_DOMAIN + app.Constants.TTS_QUERY;
    url = encodeURI(url.replace('{TL}', lang).replace('{Q}', string));

    this.audio = new Audio(url);
    this.audio.play();
  }

  window.santaApp.fire('sound-trigger', 'translations_gramophone');
};

/**
 * @private
 * @param {!HTMLElement} topEl
 * @param {!HTMLElement} shadowEl
 * @param {TranslationsSceneAnimationOptions} opts Animation options
 * @return {!SequenceEffect}
 */
app.Scene.prototype.getButtonAnimation_ = function(topEl, shadowEl, opts) {
  var animateDown = new GroupEffect([
    new KeyframeEffect(topEl, [
      {transform: 'translateY(0px)'},
      {transform: 'translateY(' + opts.distancePx + 'px)'}
    ], {
      fill: 'forwards',
      endDelay: opts.durationDelay,
      duration: opts.durationDown,
      easing: app.Constants[opts.easingDown]
    }),
    new KeyframeEffect(shadowEl, [
      {transform: 'scale(1)'},
      {transform: 'scaleY(0.9) scaleX(0.8)'}
    ], {
      fill: 'forwards',
      endDelay: opts.durationDelay,
      duration: opts.durationDown,
      easing: app.Constants[opts.easingDown]
    })
  ], {
    fill: 'none'
  });

  var animateUp = new GroupEffect([
    new KeyframeEffect(topEl, [
      {transform: 'translateY(' + opts.distancePx + 'px)'},
      {transform: 'translateY(0px)'}
    ], {
      duration: opts.durationUp,
      easing: app.Constants[opts.easingUp]
    }),
    new KeyframeEffect(shadowEl, [
      {transform: 'scaleY(0.9) scaleX(0.8)'},
      {transform: 'scale(1)'}
    ], {
      duration: opts.durationUp,
      easing: app.Constants[opts.easingUp]
    })
  ]);

  return new SequenceEffect([animateDown, animateUp]);
};

/**
 * @private
 * @param {number} newIndex Phrase index to transition to
 */
app.Scene.prototype.transitionToPhrase_ = function(newIndex) {
  this.cancelAnimation_(this.paginationAnimation_);

  var direction = newIndex < this.phraseIndex ? -1 : 1;
  var numPhrases = app.Constants.PHRASES.length;
  newIndex = newIndex < 0 ? newIndex + numPhrases : newIndex % numPhrases;

  var $currentPhraseFrom = this.$phrasesFrom.eq(this.phraseIndex);
  var $newPhraseFrom = this.$phrasesFrom.eq(newIndex);

  var $currentPhraseTo = this.$phrasesTo.eq(this.phraseIndex);
  var $newPhraseTo = this.$phrasesTo.eq(newIndex);

  var timing = {
    duration: 650,
    fill: 'both',
    easing: app.Constants.EASE_IN_OUT_CIRC
  };

  var animation = new GroupEffect([
    new KeyframeEffect($currentPhraseFrom[0], [
      {transform: 'translateX(0)', opacity: 1},
      {transform: 'translateX(' + (direction * -100) + '%)', opacity: 0}
    ], timing),
    new KeyframeEffect($currentPhraseTo[0], [
      {transform: 'translateX(0)', opacity: 1},
      {transform: 'translateX(' + (direction * -100) + '%)', opacity: 0}
    ], timing),
    new KeyframeEffect($newPhraseFrom[0], [
      {transform: 'translateX(' + (direction * 100) + '%)', opacity: 0},
      {transform: 'translateX(0)', opacity: 1}
    ], timing),
    new KeyframeEffect($newPhraseTo[0], [
      {transform: 'translateX(' + (direction * 100) + '%)', opacity: 0},
      {transform: 'translateX(0)', opacity: 1}
    ], timing)
  ]);

  this.paginationAnimation_ = document.timeline.play(animation);

  this.phraseIndex = newIndex;
};

/**
 * @private
 */
app.Scene.prototype.selectRandomToLanguage_ = function() {
  var $languageOptions = this.$languagesTo.find('option');
  var randomId = Math.floor(Math.random() * $languageOptions.length);
  var lang = '' + $languageOptions.eq(randomId).val();

  if (lang === this.fromLang || lang === this.toLang) {
    return this.selectRandomToLanguage_();
  }

  this.$languagesTo.val(lang);
  this.$languagesTo.trigger('change');
};

/**
 * @private
 */
app.Scene.prototype.selectRandomPhrase_ = function() {
  var $phrases = this.$phrasesFrom;
  var randomId = Math.floor(Math.random() * this.$phrasesFrom.length);

  if (randomId === this.phraseIndex) {
    return this.selectRandomPhrase_();
  }
  this.transitionToPhrase_(randomId);
};

/**
 * @private
 */
app.Scene.prototype.onSelectFromLanguage_ = function() {
  this.fromLang = this.$languagesFrom.val();
  this.$phrasesFrom.find('span').hide();
  this.$phrasesFrom.find('span[data-lang="' + this.fromLang + '"]').css('display', 'table-cell');
};

/**
 * @private
 */
app.Scene.prototype.onSelectToLanguage_ = function() {
  this.toLang = this.$languagesTo.val();
  this.$phrasesTo.find('span').hide();
  this.$phrasesTo.find('span[data-lang="' + this.toLang + '"]').css('display', 'table-cell');
};

/**
 * @private
 */
app.Scene.prototype.onPrevPhrase_ = function() {
  if (!app.shared.utils.playerFinished(this.changeTextAnimation_)) {
    return;
  }
  this.cancelAnimation_(this.changeTextAnimation_);

  var btnTopEl = this.$btnPrev.find('#btn-prev-top')[0];
  var btnShadowEl = this.$btnPrev.find('#btn-prev-shadow')[0];
  var animOpts = app.Constants.ANIMATION_BTN_PAGINATION;
  var animation = this.getButtonAnimation_(btnTopEl, btnShadowEl, animOpts);
  this.changeTextAnimation_ = document.timeline.play(animation);

  this.transitionToPhrase_(this.phraseIndex - 1);
};

/**
 * @private
 */
app.Scene.prototype.onNextPhrase_ = function() {
  if (!app.shared.utils.playerFinished(this.changeTextAnimation_)) {
    return;
  }
  this.cancelAnimation_(this.changeTextAnimation_);

  var btnTopEl = this.$btnNext.find('#btn-next-top')[0];
  var btnShadowEl = this.$btnNext.find('#btn-next-shadow')[0];
  var animOpts = app.Constants.ANIMATION_BTN_PAGINATION;
  var animation = this.getButtonAnimation_(btnTopEl, btnShadowEl, animOpts);
  this.changeTextAnimation_ = document.timeline.play(animation);

  this.transitionToPhrase_(this.phraseIndex + 1);
};

/**
 * @private
 */
app.Scene.prototype.onShuffleLanguages_ = function() {
  if (!app.shared.utils.playerFinished(this.changeTextAnimation_)) {
    return;
  }
  this.cancelAnimation_(this.changeTextAnimation_);

  var btnTopEl = this.$btnShuffle.find('#btn-shuffle-top')[0];
  var btnShadowEl = this.$btnShuffle.find('#btn-shuffle-shadow')[0];
  var animOpts = app.Constants.ANIMATION_BTN_PAGINATION;
  var animation = this.getButtonAnimation_(btnTopEl, btnShadowEl, animOpts);
  this.changeTextAnimation_ = document.timeline.play(animation);

  this.selectRandomToLanguage_();
  this.selectRandomPhrase_();
};

/**
 * @private
 */
app.Scene.prototype.onPlayPhrase_ = function() {
  if (!app.shared.utils.playerFinished(this.playAnimation_)) {
    return;
  }
  this.cancelAnimation_(this.playAnimation_);

  var text = app.Constants.PHRASES[this.phraseIndex][this.toLang];
  var klangEvent = app.Constants.PHRASES[this.phraseIndex][app.Constants.KLANG_EVENT_KEY];

  this.playAudio_(text, this.toLang, klangEvent);

  var btnTopEl = this.$btnPlay.find('#btn-play-top')[0];
  var btnShadowEl = this.$btnPlay.find('#btn-play-shadow')[0];
  var animOpts = app.Constants.ANIMATION_BTN_PLAY;
  var animation = this.getButtonAnimation_(btnTopEl, btnShadowEl, animOpts);
  this.playAnimation_ = document.timeline.play(animation);

  this.$el.addClass(app.Constants.CLASS_PLAYING);
  app.shared.utils.onWebAnimationFinished(this.playAnimation_, () => {
    this.$el.removeClass(app.Constants.CLASS_PLAYING);
  });
};

/**
 * @private
 */
app.Scene.prototype.addEventHandlers_ = function() {
  this.$btnPlay.on(app.InputEvent.START, this.onPlayPhrase_);
  this.$btnPrev.on(app.InputEvent.START, this.onPrevPhrase_);
  this.$btnNext.on(app.InputEvent.START, this.onNextPhrase_);
  this.$btnShuffle.on(app.InputEvent.START, this.onShuffleLanguages_);
  this.$languagesFrom.on('change', this.onSelectFromLanguage_);
  this.$languagesTo.on('change', this.onSelectToLanguage_);
};

/**
 * @private
 */
app.Scene.prototype.removeEventHandlers_ = function() {
  this.$btnPlay.off(app.InputEvent.START, this.onPlayPhrase_);
  this.$btnPrev.off(app.InputEvent.START, this.onPrevPhrase_);
  this.$btnNext.off(app.InputEvent.START, this.onNextPhrase_);
  this.$btnShuffle.off(app.InputEvent.START, this.onShuffleLanguages_);
  this.$languagesFrom.off('change', this.onSelectFromLanguage_);
  this.$languagesTo.off('change', this.onSelectToLanguage_);
};

/**
 * @private
 */
app.Scene.prototype.startTutorial_ = function() {
  // Start tutorial
  var this_ = this;
  this.tutorial_.start();
  this.$el.on('click.tutorial', function(event) {
    this_.tutorial_.off('mouse-translations');
    this_.$el.off('click.tutorial');
  }).one('touchstart', function() {
    this_.tutorial_.off('touch-translations');
  });
};

/**
 * @private
 */
app.Scene.prototype.init_ = function() {
  this.setDefaultLanguages_();

  this.$phrasesFrom = this.buildPhrases_(this.$phraseContainerFrom);
  this.$phrasesTo = this.buildPhrases_(this.$phraseContainerTo);

  this.onSelectFromLanguage_();
  this.onSelectToLanguage_();
  this.transitionToPhrase_(0);

  this.addEventHandlers_();

  this.startTutorial_();
};

/**
 * @private
 * @param {Animation} animation
 */
app.Scene.prototype.cancelAnimation_ = function(animation) {
  if (animation) {
    animation.cancel();
  }
};

/**
 * @export
 */
app.Scene.prototype.destroy = function() {
  this.removeEventHandlers_();
  this.audio = null;

  this.cancelAnimation_(this.playAnimation_);
  this.cancelAnimation_(this.changeTextAnimation_);
  this.cancelAnimation_(this.paginationAnimation_);
};
