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

/**
 * @fileoverview
 * Shared JavaScript client for the Santa Tracker API.
 */

goog.provide('SantaService');

/**
 * Creates a new Santa service object.
 *
 * @param {string} clientId
 * @param {string} lang
 * @param {string} version
 * @constructor
 * @export
 */
SantaService = function SantaService(clientId, lang, version) {
  /** @private {string} */
  this.lang_ = lang;

  /** @const @private {string} */
  this.version_ = version;

  /**
   * The user's (optional) location on the Earth, from geo-ip.
   * @private {?string}
   */
  this.userLocation_ = null;

  /**
   * The user's (optional) stop ID.
   * @private {string}
   */
  this.userStop_ = '';

  /**
   * The stop the user is actually after. May be the stop before `userStop_`.
   * @private {string}
   */
  this.userStopAfter_ = '';

  /**
   * The arrival time at userStop_. Optional.
   * @private {number}
   */
  this.arrivalTime_ = 0;

  /**
   * All known destinations (including future ones).
   * Ordered chronologically (oldest destinations first).
   * @private {!Array<!SantaLocation>}
   */
  this.destinations_ = [];

  /**
   * Stream of cards (e.g. didyouknow, etc) but not destinations.
   * Ordered chronologically (oldest cards first).
   * @private {!Array<!StreamCard>}
   */
  this.stream_ = [];

  /**
   * Parts of the stream/destinations that have already elapsed (and should be
   * shown in the timeline view).
   * Ordered reverse chronologically (oldest cards last).
   */
  this.timeline_ = [];

  /**
   * Cards that have not been shown yet (they're to be displayed in the
   * future), and moved to `timeline_`.
   * Ordered chronologically (oldest cards first).
   */
  this.futureCards_ = [];

  /** Bound version of `fetchDetails_`. */
  this.boundFetchDetails_ = this.fetchDetails_.bind(this);

  /**
   * A number between 0 and 1, consistent within a user session. Sent to the
   * server to determine a consistent time offset for this client.
   *
   * @private {number}
   */
  this.jitterRand_ = Math.random();

  /**
   * @private {string}
   */
  this.clientId_ = clientId;

  /**
   * @private {number}
   */
  this.offset_ = 0;

  /**
   * @private {string}
   */
  this.fingerprint_ = '';

  /**
   * @private {boolean}
   */
  this.offline_ = false;

  /**
   * @private {boolean}
   */
  this.killed_ = false;

  /**
   * True if there is already a pending sync.
   * @private {boolean}
   */
  this.syncInFlight_ = false;

  /**
   * True if a sync has occurred at any point.
   * @private {boolean}
   */
  this.synced_ = false;

  /**
   * Santa's next stop. Used to determine whether to trigger the "next stop"
   * card.
   * @private {SantaLocation}
   */
  this.nextStop_ = null;

  /**
   * The next sync timeout.
   * @private {number}
   */
  this.syncTimeout_ = 0;

  /**
   * An extra offset determined by a URL parameter ("timestamp_override")
   *
   * @private {number|undefined}
   */
  this.debugOffset_;

  if (window['DEV']) {
    var overrideParam = getUrlParameter('timestamp_override');
    if (overrideParam) {
      if (overrideParam[overrideParam.length - 1] == '/') {
        overrideParam = overrideParam.slice(0, -1);
      }
      this.debugOffset_ = overrideParam - new Date();
    }
  }
}

/**
 * @param {string} eventName
 * @param {function()} handler
 * @export
 */
SantaService.prototype.addListener = function(eventName, handler) {
  return Events.addListener(this, eventName, handler);
};

/**
 * @param {string} eventName
 * @param {function()} handler
 * @return {boolean} whether removed successfully
 * @export
 */
SantaService.prototype.removeListener = function(eventName, handler) {
  return Events.removeListener(this, eventName, handler);
};

/**
 * @param {string} lang to set
 * @export
 */
SantaService.prototype.setLang = function(lang) {
  this.lang_ = lang;
};


/**
 * @param {function(SantaState)} callback
 * @export
 */
SantaService.prototype.getCurrentLocation = function(callback) {
  var now = this.now();
  var dest = this.findDestination_(now);
  if (!this.isSynced()) {
    const handler = () => {
      Events.removeListener(this, 'sync', handler);
      this.getCurrentLocation(callback);
    };
    Events.addListener(this, 'sync', handler);
    return;
  }

  this.updateTimeline_();

  // TODO: handle dest == null
  if (dest == null) {
    console.warn('no destination');
    return;
  }

  var next = dest.next();

  if (now < dest.departure) {
    // At location
    var state = /** @type {SantaState} */({
      position: dest.getLocation(),
      presentsDelivered: this.calculatePresentsDelivered_(now, dest.prev(),
                                                          dest, next),
      distanceTravelled: dest.getDistanceTravelled(),
      heading: 0,
      prev: dest.prev(),
      stopover: dest,
      next: next
    });
    callback(state);
    return;
  }

  // In transit
  var travelTime = next.arrival - dest.departure;
  var elapsed = Math.max(now - dest.departure, 0);

  var userLocation = this.getUserLocation();
  var currentLocation;
  var ratio = elapsed / travelTime;

  if (dest.id === this.userStopAfter_ && userLocation != null) {
    // If this is the segment where the user is, interpolate to them.
    var firstDistance = Spherical.computeDistanceBetween(dest.getLocation(), userLocation);
    var secondDistance = Spherical.computeDistanceBetween(userLocation, next.getLocation());
    var along = (firstDistance + secondDistance) * ratio;
    if (along < firstDistance) {
      var firstRatio = firstDistance ? (along / firstDistance) : 0;
      currentLocation = Spherical.interpolate(dest.getLocation(), userLocation, firstRatio);
    } else {
      var secondRatio = secondDistance ? ((along - firstDistance) / secondDistance) : 0;
      currentLocation = Spherical.interpolate(userLocation, next.getLocation(), secondRatio);
    }
  } else if (next) {
    // Otherwise, interpolate between stops normally.
    currentLocation = Spherical.interpolate(
        dest.getLocation(),
        next.getLocation(),
        elapsed / travelTime);
  } else {
    // Or... just use location. For landing case.
    currentLocation = dest.getLocation();
  }

  var state = /** @type {SantaState} */({
    position: currentLocation,
    heading: Spherical.computeHeading(currentLocation, next.getLocation()),
    presentsDelivered: this.calculatePresentsDelivered_(now, dest, null, next),
    distanceTravelled: this.calculateDistanceTravelled_(now, dest, next),
    prev: dest,
    stopover: null,
    next: next
  });
  callback(state);

  // After Santa has left the stop, trigger the next stop card.
  if (!this.nextStop_ || this.nextStop_.id != next.id) {
    Events.trigger(this, 'card', /** @type {!StreamCard} */({
      type: 'city',
      timestamp: now,
      stop: next
    }));
  }
  this.nextStop_ = next;
};

/**
 * @const
 * @private
 */
SantaService.prototype.PRESENTS_OVER_WATER_ = .3;

/**
 * @const
 */
SantaService.prototype.PRESENTS_IN_CITY = 1 - SantaService.prototype.PRESENTS_OVER_WATER_;

/**
 * @param {number} now
 * @param {SantaLocation} prev
 * @param {SantaLocation} stopover
 * @param {SantaLocation} next
 * @return {number}
 */
SantaService.prototype.calculatePresentsDelivered_ = function(now, prev, stopover, next) {
  if (!stopover) {
    var elapsed = now - prev.departure;
    var duration = next.arrival - prev.departure;
    var delivering = next.presentsDelivered - prev.presentsDelivered;
    delivering *= this.PRESENTS_OVER_WATER_;

    // While flying, deliver some of the quota.
    return Math.floor(prev.presentsDelivered + delivering * elapsed / duration);
  }

  var elapsed = now - stopover.arrival;
  var duration = (stopover.departure - stopover.arrival) || 1e-10;
  var delivering = stopover.presentsDelivered - prev.presentsDelivered;

  // While stopped, deliver remaining quota.
  return Math.floor(prev.presentsDelivered +
                    (delivering * this.PRESENTS_OVER_WATER_) +
                    delivering * this.PRESENTS_IN_CITY * elapsed / duration);
};

/**
 * @param {number} now
 * @param {SantaLocation} prev
 * @param {SantaLocation} next
 * @return {number}
 */
SantaService.prototype.calculateDistanceTravelled_ = function(now, prev, next) {
  var elapsed = now - prev.departure;
  var travelTime = next.arrival - prev.departure;
  if (!travelTime) {
    return next.getDistanceTravelled();
  }

  var legLength = next.getDistanceTravelled() - prev.getDistanceTravelled();

  return prev.getDistanceTravelled() + (legLength * (elapsed / travelTime));
};

/**
 * List of destinations, sorted chronologically (latest destinations last).
 * @return {Array<!SantaLocation>} a list of destinations, or null if the
 * service isn't ready.
 * @export
 */
SantaService.prototype.getDestinations = function() {
  return this.destinations_.length ? this.destinations_ : null;
};

/**
 * List of cards sorted reverse chronologically (lastest cards first).
 * @return {Array<!StreamCard>} a list of cards, or null if the
 * service isn't ready.
 * @export
 */
SantaService.prototype.getTimeline = function() {
  this.updateTimeline_();
  return this.timeline_;
};

/**
 * @return {?LatLng} the user's location
 * @export
 */
SantaService.prototype.getUserLocation = function() {
  if (!this.userLocation_) {
    return null;
  }
  var parts = this.userLocation_.split(',');
  if (parts.length != 2) {
    return null;
  }
  return {lat: +parts[0], lng: +parts[1]};
};

/**
 * @return {string} the user's stop, or the empty string
 * @export
 */
SantaService.prototype.getUserStop = function() {
  return this.userStop_;
};

/**
 * Returns the expected arrival time of Santa. This is not transformed by any offset.
 * @return {number} the expected arrival time of Santa, or zero if unknown
 * @export
 */
SantaService.prototype.getArrivalTime = function() {
  return this.arrivalTime_;
};

/**
 * Finds Santa's current SantaLocation, or the one he was most recently at.
 *
 * @param {number} timestamp
 * @return {SantaLocation} null if the next destination cannot be found.
 * @private
 */
SantaService.prototype.findDestination_ = function(timestamp) {
  if (!this.destinations_.length) {
    return null;
  }
  if (this.destinations_[0].departure > timestamp) {
    // It's not xmas eve yet, so just assume Santa is at his workshop.
    return this.destinations_[0];
  }

  var i, dest;
  for (i = 0; dest = this.destinations_[i]; i++) {
    if (timestamp < dest.arrival) {
      break;
    }
  }
  return this.destinations_[i - 1];
};

/**
 * Appends newly fetched destinations to the current destination list.
 * @param {number} index The index that newDestinations should be spliced into
 * the destinations list.
 * @param {!Array<!SantaLocation>} newDestinations
 * @private
 */
SantaService.prototype.appendDestinations_ = function(index, newDestinations) {
  if (!newDestinations || !newDestinations.length) {
    // Nothing to append.
    return;
  }
  // The server may return a value different to the current length of the
  // destinations (i.e. what we gave it). Always consider the server to be
  // correct. For example, if the server thinks we should replace the whole
  // route, index will be 0 and the destinations list will be truncated.
  //
  // NOTE(cbro): Existing locations hold a reference to the array, so ensure
  // that the array referenced by this.destinations_ is never changed.
  this.destinations_.splice(index, this.destinations_.length - index);
  for (var i = 0; i < newDestinations.length; i++) {
    this.destinations_.push(newDestinations[i]);
  }

  // decorate the server responses with the SantaLocation type.
  for (var i = index, destination; destination = this.destinations_[i]; i++) {
    this.destinations_[i] = new SantaLocation(destination,
                                              this.boundFetchDetails_,
                                              this.destinations_,
                                              i);
  }

  // if not already found, find "our" stop in the next set of stops
  if (this.userStop_ && !this.userStopAfter_) {
    let candidate = null;
    let previous = this.destinations_[index - 1];
    for (let i = index, destination; destination = this.destinations_[i]; i++) {
      if (destination.id === this.userStop_) {
        candidate = destination;
        break;
      }
      previous = destination;
    }
    const userLocation = this.getUserLocation();
    if (previous && candidate && userLocation) {
      // Find the destination which the user's location is explicitly after. They might be closer
      // to an upcoming stop, but the route line should be tweaked _before_ that.
      const previousLocation = previous.getLocation();
      const normal = Spherical.computeDistanceBetween(previousLocation, candidate.getLocation());
      const user = Spherical.computeDistanceBetween(previousLocation, userLocation);
      if (user < normal) {
        this.userStopAfter_ = previous.id;
      } else {
        this.userStopAfter_ = candidate.id;
      }
    }
  }

  Events.trigger(this, 'destinations_changed', this.destinations_);
};

/**
 * Appends newly fetched cards to the current card stream.
 * @param {number} index The index that newCards should be spliced into the
 * stream list.
 * @param {!Array<!StreamCard>} newCards
 * @private
 */
SantaService.prototype.appendStream_ = function(index, newCards) {
  if (!newCards || !newCards.length) {
    // Nothing to append.
    return;
  }
  // The server may return a value different to the current length of the
  // destinations (i.e. what we gave it). Always consider the server to be
  // correct. For example, if the server thinks we should replace the whole
  // route, index will be 0 and the stream list will be truncated.
  this.stream_.splice(index, this.stream_.length - index);
  for (var i = 0; i < newCards.length; i++) {
    this.stream_.push(newCards[i]);
  }
  Events.trigger(this, 'stream_changed', this.stream_);
};

/**
 * @return {!Array<!StreamCard>}
 * @export
 */
SantaService.prototype.getStream = function() {
  return this.stream_;
};

/**
 * @param {string} id
 * @param {function(SantaDetails)} callback
 */
SantaService.prototype.fetchDetails_ = function(id, callback) {
  const data = {
    'id': id,
    'language': this.lang_,
    'fingerprint': this.fingerprint_,
  };

  function done(result) {
    if (result['status'] != 'OK') {
      console.error(result, result['status']);
      return;
    }
    callback(/** @type {SantaDetails} */ (result['details']));
  }
  function fail() {
    console.error('failed fetchDetails', id);
  }
  santaAPIRequest('details', data, done, fail);
};

/**
 * Synchronize info with the server. This function returns immediately, the
 * synchronization is performed asynchronously.
 *
 * @export
 */
SantaService.prototype.sync = function() {
  if (this.syncInFlight_) {
    return;
  }
  this.syncInFlight_ = true;

  const data = {
    'rand': this.jitterRand_,
    'client': this.clientId_,
    'language': this.lang_,
    // If this fingerprint doesn't match the servers, the server will replace
    // the route and status message text.
    'fingerprint': this.fingerprint_,
    'routeOffset': this.destinations_.length,
    'streamOffset': this.stream_.length,
  };

  const done = result => {
    let ok = true;
    if (result['status'] != 'OK') {
      console.error('api', result['status']);
      this.kill_();
      ok = false;
    }

    this.offset_ = result['now'] + result['timeOffset'] - new Date();
    if (result['switchOff']) {
      this.kill_();
      ok = false;  // not technically offline, but let's pretend
    }

    if (result['upgradeToVersion'] && this.version_) {
      if (this.version_ < result['upgradeToVersion']) {
        console.warn('reload: this', this.version_, 'upgrade to', result['upgradeToVersion']);
        this.scheduleReload_();
      }
    }

    if (ok) {
      this.reconnect_();
    }

    const fingerprintChanged = result['fingerprint'] != this.fingerprint_;
    this.fingerprint_ = result['fingerprint'];
    this.clientSpecific_ = result['clientSpecific'];
    this.userLocation_ = result['location'] || null;

    // userStop and arrivalTime are only sent when they need to be recomputed.
    if ('userStop' in result) {
      this.userStop_ = result['userStop'] || '';
    }
    if ('arrivalTime' in result) {
      this.arrivalTime_ = result['arrivalTime'] || 0;
    }

    this.appendDestinations_(result['routeOffset'], result['destinations']);
    this.appendStream_(result['streamOffset'], result['stream']);
    this.rebuildTimeline_(fingerprintChanged);

    this.synced_ = true;
    this.syncInFlight_ = false;
    Events.trigger(this, 'sync');

    window.clearTimeout(this.syncTimeout_);
    this.syncTimeout_ = window.setTimeout(this.sync.bind(this), result['refresh']);
  };

  const fail = () => {
    this.syncInFlight_ = false;
    window.clearTimeout(this.syncTimeout_);
    this.syncTimeout_ = window.setTimeout(() => {
      // Sync after 60s, but only if the page is in the foreground.
      window.requestAnimationFrame(this.sync.bind(this));
    }, 60 * 1000);
    this.disconnect_();
  };

  santaAPIRequest('info', data, done, fail);
};

/**
 * Collate the destination and card streams. Build the lists for timeline
 * (cards already shown) and future cards to show.
 * @param {boolean} forceDirty Force trigger of 'timeline_changed' event.
 * @private
 */
SantaService.prototype.rebuildTimeline_ = function(forceDirty) {
  var historyStream = [];
  var futureStream = [];
  var dests = this.destinations_.slice(0);
  var stream = this.stream_.slice(0);
  var now = this.now();
  while (dests.length && stream.length) {
    var toPush;
    if (!dests.length) {
      // No more destinations - push all of the stream cards.
      toPush = stream.shift();
    } else if (!stream.length) {
      // No more stream cards - push all of the destination cards.
      var dest = dests.shift();
      // Create a "card" for the stop.
      toPush = /** @type {!StreamCard} */({
        timestamp: dest.arrival,
        stop: dest,
        type: 'city'
      });
    } else if (dests[0].arrival < stream[0].timestamp) {
      // Destination comes before the next stream card.
      var dest = dests.shift();
      // Create a "card" for the stop.
      toPush = /** @type {!StreamCard} */({
        timestamp: dest.arrival,
        stop: dest,
        type: 'city'
      });
    } else {
      // Stream card comes before the next destination.
      toPush = stream.shift();
    }
    if (toPush.game && toPush.status) {
      // Trump status with game.
      toPush.status = undefined;
    }
    if (toPush.game) {
      toPush.type = 'scene';
    } else if (toPush.youtubeId) {
      toPush.type = 'video';
    } else if (toPush.imageUrl) {
      toPush.type = 'photos';
    } else if (toPush.status) {
      toPush.type = 'update';
    } else if (toPush.didyouknow) {
      toPush.type = 'facts';
    }

    // Check whether the card would have already been shown or whether it is
    // scheduled to be shown in the future.
    if (toPush.timestamp < now) {
      // Insert at the beginning of the array.
      historyStream.unshift(toPush);
    } else {
      futureStream.push(toPush);
    }
  }
  var dirty = forceDirty || this.timeline_.length != historyStream.length;
  this.timeline_ = historyStream;
  this.futureCards_ = futureStream;

  if (dirty) {
    Events.trigger(this, 'timeline_changed', this.timeline_);
  }
};

/**
 * Ensures the timeline has all currently displayable cards.
 * @private
 */
SantaService.prototype.updateTimeline_ = function() {
  var now = this.now();
  var dirty = false;
  // Move any cards where the timestamp has elapsed onto the main feed
  // (this.timeline_)
  while (this.futureCards_.length && this.futureCards_[0].timestamp < now) {
    var card = this.futureCards_.shift();
    if (!card.stop) {
      Events.trigger(this, 'card', card);
    }
    // Insert at the beginning of the timeline.
    this.timeline_.unshift(card);
    dirty = true;
  }
  if (dirty) {
    Events.trigger(this, 'timeline_changed', this.timeline_);
  }
};


/**
 * Send the kill event, if not already killed.
 * @private
 */
SantaService.prototype.kill_ = function() {
  if (!this.killed_) {
    this.killed_ = true;
    Events.trigger(this, 'kill');
  }
};

/**
 * Send the offline event, if not alreay offline.
 * @private
 */
SantaService.prototype.disconnect_ = function() {
  if (!this.offline_) {
    this.offline_ = true;
    Events.trigger(this, 'offline');
  }
}

/**
 * Send the online event, if not already online.
 * @private
 */
SantaService.prototype.reconnect_ = function() {
  if (this.offline_) {
    this.offline_ = false;
    Events.trigger(this, 'online');
  }
};

/**
 * Register to reload the page in a while, after the user has stopped clicking
 * on it.
 * @private
 */
SantaService.prototype.scheduleReload_ = function() {
  Events.trigger(this, 'reload');
};


/**
 * @return {number}
 * @export
 */
SantaService.prototype.now = function() {
  return +new Date() + (this.debugOffset_ || this.offset_ || 0);
};

/**
 * @return {!Date}
 * @export
 */
SantaService.prototype.dateNow = function() {
  return new Date(this.now());
};

/**
 * @return {boolean} true if time has been synchronized with the server.
 * @export
 */
SantaService.prototype.isSynced = function() {
  return this.synced_;
};

/**
 * @return {boolean} true if the service has been killed.
 * @export
 */
SantaService.prototype.isKilled = function() {
  return this.killed_;
};

/**
 * @return {boolean} true if the service is offline.
 * @export
 */
SantaService.prototype.isOffline = function() {
  return this.offline_;
};

/**
 * Client-specific kill switches.
 * For example, the website has a flag to disable the Google earth button.
 * @return {!Object}
 * @export
 */
SantaService.prototype.getClientSpecific = function() {
  return this.clientSpecific_ || {};
};
