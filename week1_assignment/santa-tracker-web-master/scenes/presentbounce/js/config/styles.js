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


goog.provide('app.config.Styles');

/**
 * Style templates - Dimensions and HTML for all available types of level objects
 * @const
 */
app.config.Styles = {
  dropper: {
    className: 'dropper',
    width: 361,
    height: 220,
    innerHTML: `
        <div class="js-dropper__button dropper__button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 131.2 131.2"><path fill="#D4D4D6" d="M0 0h131.2v131.2H0z"></path><circle fill="#77787C" cx="12.2" cy="12.2" r="6.2"></circle><circle fill="#77787C" cx="119" cy="12.2" r="6.2"></circle><circle  fill="#77787C" cx="12.2" cy="119" r="6.2"></circle><circle fill="#77787C" cx="119" cy="119" r="6.2"></circle><circle class="dropper__button__shadow" opacity=".25" fill="#434343" cx="72.6" cy="72.6" r="48.6"></circle><circle class="dropper__button__side" fill="#378F43" cx="65.6" cy="65.6" r="48.6"></circle><g class="dropper__button__hitarea"><circle class="dropper__button__surface" fill="#3BB34A" cx="60.9" cy="60.9" r="48.6"></circle><path fill="#378F43" class="dropper__button__pointer" d="M29 64.9h63.8L60.9 96.8zM44.9 33h31.9v31.9H44.9z"></path></g></svg>
        </div>
        <div class="dropper__pipe">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-273.6 67 204 260"><path opacity=".25" fill="#424242" d="M-69.6 133.4V117h-8.6V65.9h-179.7V117h-8.6v16.4h8.6v142.4h-8.6v16.3h197v-16.3h-8.6V133.4h8.5z"/><path fill="#D3D4D6" d="M-265 65.9h179.7v203.4H-265V65.9z"/><path fill="#FFF" d="M-265 65.9h161.6v203.4H-265V65.9z"/><path fill="#E53935" d="M-273.6 110h197v16.3h-197V110zm0 158.8h197v16.3h-197v-16.3z"/><path fill="#333" d="M-87.8 308.5c-4.8 0-8.7 3.9-8.7 8.7h8.7v-8.7z"/><path fill="#FFE200" d="M-79 317.2c0-4.8-3.9-8.7-8.7-8.7v8.7h8.7z"/><path fill="#333" d="M-79 317.2h-8.7v8.7c4.7 0 8.7-3.9 8.7-8.7z"/><path fill="#FFE200" d="M-96.5 317.2c0 4.8 3.9 8.7 8.7 8.7v-8.7h-8.7z"/><path fill="#333" d="M-262.5 308.5c-4.8 0-8.7 3.9-8.7 8.7h8.7v-8.7z"/><path fill="#FFE200" d="M-253.7 317.2c0-4.8-3.9-8.7-8.7-8.7v8.7h8.7z"/><path fill="#333" d="M-253.7 317.2h-8.7v8.7c4.8 0 8.7-3.9 8.7-8.7z"/><path fill="#FFE200" d="M-271.2 317.2c0 4.8 3.9 8.7 8.7 8.7v-8.7h-8.7z"/><g><path fill="#333" d="M-204.2 308.5c-4.8 0-8.7 3.9-8.7 8.7h8.7v-8.7z"/><path fill="#FFE200" d="M-195.5 317.2c0-4.8-3.9-8.7-8.7-8.7v8.7h8.7z"/><path fill="#333" d="M-195.5 317.2h-8.7v8.7c4.8 0 8.7-3.9 8.7-8.7z"/><path fill="#FFE200" d="M-213 317.2c0 4.8 3.9 8.7 8.7 8.7v-8.7h-8.7z"/></g><g><path fill="#333" d="M-146 308.5c-4.8 0-8.7 3.9-8.7 8.7h8.7v-8.7z"/><path fill="#FFE200" d="M-137.3 317.2c0-4.8-3.9-8.7-8.7-8.7v8.7h8.7z"/><path fill="#333" d="M-137.3 317.2h-8.7v8.7c4.8 0 8.7-3.9 8.7-8.7z"/><path fill="#FFE200" d="M-154.7 317.2c0 4.8 3.9 8.7 8.7 8.7v-8.7h-8.7z"/></g></svg>
        </div>
    `,
    marginTop: -90 // align dom element to bottom
  },
  snowGlobe: {
    className: 'object--snowglobe snowglobe',
    innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 41.1 47.7"><defs><circle id="a" cx="20.1" cy="20.1" r="20.1"/></defs><path fill="#F9CE1D" d="M37 47.7H3.2l3.3-10.1h27.2"/><circle fill="#86BAD6" cx="20.1" cy="20.1" r="20.1"/><defs><circle id="b" cx="20.1" cy="20.1" r="20.1"/></defs><clipPath id="c"><use xlink:href="#b" overflow="visible"/></clipPath><path clip-path="url(#c)" fill="#FFF" d="M2.2 29.3c2.5-2.1 5.9-2.8 9-2 2.1.6 4.1 1.8 6.2 1.3 1.7-.4 2.9-1.8 4.5-2.4 1.3-.5 2.8-.4 4.2-.1 1.4.3 2.7.9 4.1 1.3 2.7.8 5.6 1 8.4.5v5.3l-8.9 8.9H6.4l-4.8-7.3.6-5.5z"/><path clip-path="url(#c)" fill="none" stroke="#FFF" stroke-width="1.215" stroke-linecap="round" stroke-miterlimit="10" stroke-dasharray="0,27.3375" d="M23.1 11.1c-1.7-.2-3.4-.2-5 .1-.7.1-1.4.4-1.6 1-.2.5 0 1 .4 1.4.3.4.8.6 1.3.9l7.5 3.9c.8.4 1.7 1.1 1.5 2-.2.7-1 1-1.7 1.1-2.5.4-5.2.1-7.5-.8-.9-.3-1.7-.8-2.3-1.5s-.8-1.8-.3-2.6c.6-.9 1.7-1.1 2.8-1.1 1.9-.1 3.8.2 5.7.1 1.9 0 3.9-.4 5.4-1.6s2.5-3.2 1.8-5c-.4-1.2-1.4-2.1-2.5-2.8-5.7-4-13.4-5-19.9-2.6-1.8.7-3.5 1.6-4.9 3s-2.3 3.2-2.4 5.1c-.1 2 .9 3.9 2.1 5.5 3.1 4 8.4 6.1 13.5 6s10-2.3 14-5.6c.9-.8 1.8-1.6 2.8-2.2 1-.6 2.3-.9 3.4-.5s2 1.4 2.5 2.5.6 2.3.8 3.5c.1.9.2 1.9-.4 2.7-.6.8-1.7 1-2.7 1-5.6.1-11.1-3-13.8-7.9-1.2-2.2-2-4.9-4.1-6.3-1.9-1.3-4.4-1.2-6.6-.4-2.1.8-3.9 2.3-5.7 3.8-1.2 1-2.4 2-2.7 3.5-.4 2 1.2 3.8 2.9 4.7 2.6 1.3 5.7 1.1 8.5.1 2.7-1 5.2-2.6 7.7-4.1 2.5-1.5 5-3 7.9-3.6"/><path opacity=".2" fill="#4D4D4D" d="M31.3 3.4C34.8 7 37 12 37 17.4c0 11.1-9 20.2-20.2 20.2-3.9 0-7.5-1.1-10.6-3 3.6 3.5 8.5 5.6 13.9 5.6 11.1 0 20.1-9 20.1-20.1 0-7-3.5-13.1-8.9-16.7z"/><path fill="none" stroke="#F9CE1D" stroke-width="5.982" stroke-linecap="round" stroke-miterlimit="10" d="M3.7 37.6h32.8"/><circle fill="#FFF" cx="11.3" cy="11.4" r="2.7"/><circle opacity=".7" fill="#FFF" cx="7.4" cy="17.1" r="1.2"/><g><path opacity=".3" fill="#4D4D4D" d="M5.5 40.6l30.7 5.2-1.6-5.2"/></g><g><defs><circle id="d" cx="20.1" cy="20.1" r="20.1"/></defs></g></svg>',
    width: 50,
    height: 50 * 1.15,
    dynamicShadow: true
  },
  presentBall: {
    className: 'object--present-circle present present--circle',
    innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.6 49.6"><circle fill="#DA4737" cx="24.8" cy="24.8" r="24.8"/><path fill="#F0B31D" d="M40.3 18.1c0-4.8-3.9-8.8-8.8-8.8-1.8 0-3.4.5-4.8 1.4V.1c-.5-.1-1.2-.1-1.9-.1s-1.3 0-2 .1v10.6c-1.4-.9-3-1.4-4.8-1.4-4.8 0-8.8 3.9-8.8 8.8 0 1.8.5 3.4 1.4 4.8H.1c-.1.6-.1 1.2-.1 1.9s0 1.3.1 2h18c-.2.2-.4.5-.6.7-2.2 2.4-4.3 4.7-7.2 4.7v4c4.7 0 7.7-3.3 10.2-6 .8-.9 1.6-1.8 2.4-2.4v21.8c.7.1 1.3.1 2 .1s1.3 0 2-.1V27.8c.8.6 1.6 1.5 2.4 2.4 2.4 2.7 5.5 6 10.2 6v-4c-2.9 0-5-2.3-7.2-4.7-.2-.2-.4-.5-.6-.7h18c.1-.7.1-1.3.1-2s0-1.3-.1-2H38.9c.9-1.4 1.4-3 1.4-4.7zM18 22.8c-2.6 0-4.8-2.1-4.8-4.8s2.1-4.8 4.8-4.8c2.6 0 4.8 2.1 4.8 4.8v4.8H18zm13.6 0h-4.8V18c0-2.6 2.1-4.8 4.8-4.8 2.6 0 4.8 2.1 4.8 4.8s-2.2 4.8-4.8 4.8z"/></svg>',
    width: 50,
    height: 50,
    dynamicShadow: true
  },
  presentSquare: {
    className: 'object--present-square present present--square',
    innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.6 49.6"><path fill="#DA4737" d="M0 0h49.6v49.6H0z"/><path fill="#F0B31D" d="M40.3 18.1c0-4.8-3.9-8.8-8.8-8.8-1.8 0-3.4.5-4.8 1.4V0h-4v10.7c-1.4-.9-3-1.4-4.8-1.4-4.8 0-8.8 3.9-8.8 8.8 0 1.8.5 3.4 1.4 4.8H0v4h18c-.2.2-.4.5-.6.7-2.2 2.4-4.3 4.7-7.2 4.7v4c4.7 0 7.7-3.3 10.2-6 .8-.9 1.6-1.8 2.4-2.4v21.8h4V27.8c.8.6 1.6 1.5 2.4 2.4 2.4 2.7 5.5 6 10.2 6v-4c-2.9 0-5-2.3-7.2-4.7-.2-.2-.4-.5-.6-.7h18v-4H38.9c.9-1.4 1.4-3 1.4-4.7zM18 22.8c-2.6 0-4.8-2.1-4.8-4.8s2.1-4.8 4.8-4.8c2.6 0 4.8 2.1 4.8 4.8v4.8H18zm13.6 0h-4.8V18c0-2.6 2.1-4.8 4.8-4.8 2.6 0 4.8 2.1 4.8 4.8s-2.2 4.8-4.8 4.8z"/></svg>',
    width: 50,
    height: 50,
    dynamicShadow: true
  },
  presentRectangle: {
    className: 'object--present-rect',
    innerHTML: '',
    width: 50,
    height: 80,
    dynamicShadow: true
  },
  target: {
    className: 'object--target',
    innerHTML: `
      <div class="target">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 178 170"><path opacity=".25" fill="#434343" d="M7 117.6c0 11.1 9 20.1 20.1 20.1h31.1V178h68.5v-40.4h31.1c11.1 0 20.1-9 20.1-20.1H7z"/><path opacity=".25" fill="#434343" d="M136 27.5c.2-.3.3-.7.3-1 0-.8-.4-1.5-1-1.9L146.7 7H38.4l11.5 17.6c-.6.4-1 1.1-1 1.9 0 .4.1.7.3 1-14.9 8.1-25 23.9-25 42.1 0 26.5 21.5 48 48.1 48h40.8c26.6 0 48.1-21.5 48.1-48-.2-18.2-10.3-33.9-25.2-42.1z"/><path fill="#333" d="M151 130.6H20c-11 0-20-9-20-20v-.1h171v.1c0 11-9 20-20 20z"/><path fill="#D4D4D6" d="M51.2 130.6h68.5V178H51.2z"/><path fill="#989898" d="M109.7 130.6h10V178h-10z"/><g><path fill="#E53A35" d="M127 19.5L139.6 0H31.3L44 19.5c-16 7.8-27 24.2-27 43.1 0 26.5 21.5 48 48.1 48h40.8c26.6 0 48.1-21.5 48.1-48-.1-19-11.1-35.3-27-43.1z"/><path fill="#434343" d="M127 19.5L139.6 0h-26.3l-12.7 19.5c16 7.8 27 24.2 27 43.1 0 24.9-19.1 45.4-43.5 47.7 1.5.1 20.2.2 21.8.2 26.6 0 48.1-21.5 48.1-48-.1-18.9-11.1-35.2-27-43z" opacity=".25"/><path fill="none" stroke="#FED600" stroke-width="4.434" stroke-linecap="round" stroke-miterlimit="10" d="M44 19.5h83M110.8 19.5c2.7 0 5.2 1.1 6.3 3.5s.4 5.3-1.6 7c-.8.7-1.8 1.2-2.5 1.9-1.6 1.8-1.5 4.7-.1 6.7s3.8 3 6.1 3.5"/><path fill="none" stroke="#FED600" stroke-width="4.434" stroke-linecap="round" stroke-miterlimit="10" d="M113.2 19.5c5.3 0 10.6 2.9 11.7 6.3.4 1.2.1 2.5-.7 3.5-.5.6-1.3 1-1.7 1.7-.9 1.2-.5 3 .6 4.1 1 1.1 2.6 1.5 4 1.7"/></g></svg>
      </div>
    `,
    width: 200,
    height: 177,
    objectWidth: 128,
    objectHeight: 100
  },
  angledBeam: {
    className: '',
    innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 396.3 236.6"><circle fill="#B4B4B4" cx="32.9" cy="32.9" r="32.9"/><circle fill="#B4B4B4" cx="363.4" cy="203.7" r="32.9"/><g fill="#77787C"><circle cx="10.4" cy="23.6" r="3.1"/><circle cx="55.4" cy="42.2" r="3.1"/></g><g fill="#77787C"><circle cx="23.6" cy="55.4" r="3.1"/><circle cx="42.2" cy="10.4" r="3.1"/></g><g fill="#77787C"><circle cx="23.6" cy="10.4" r="3.1"/><circle cx="42.2" cy="55.4" r="3.1"/></g><g fill="#77787C"><circle cx="10.4" cy="42.2" r="3.1"/><circle cx="55.4" cy="23.6" r="3.1"/></g><g fill="#77787C"><circle cx="354" cy="226.2" r="3.1"/><circle cx="372.7" cy="181.2" r="3.1"/></g><g fill="#77787C"><circle cx="385.9" cy="213" r="3.1"/><circle cx="340.9" cy="194.4" r="3.1"/></g><g fill="#77787C"><circle cx="340.9" cy="213" r="3.1"/><circle cx="385.9" cy="194.4" r="3.1"/></g><g fill="#77787C"><circle cx="372.7" cy="226.2" r="3.1"/><circle cx="354" cy="181.2" r="3.1"/></g><path opacity=".25" fill="#434343" d="M388 112.7c0-49.9-40.5-90.4-90.4-90.4H39.9c-9.7 0-17.6 7.9-17.6 17.6 0 9.7 7.9 17.6 17.6 17.6h257.6c30.5 0 55.2 24.7 55.2 55.2v98c0 9.7 7.9 17.6 17.6 17.6 9.7 0 17.6-7.9 17.6-17.6l.1-98z"/><path fill="#FFF" d="M381 105.7c0-49.9-40.5-90.4-90.4-90.4H32.9c-9.7 0-17.6 7.9-17.6 17.6 0 9.7 7.9 17.6 17.6 17.6h257.6c30.5 0 55.2 24.7 55.2 55.2v98c0 9.7 7.9 17.6 17.6 17.6 9.7 0 17.6-7.9 17.6-17.6l.1-98z"/><defs><path id="beam-angled-a" d="M381 105.7c0-49.9-40.5-90.4-90.4-90.4H32.9c-9.7 0-17.6 7.9-17.6 17.6 0 9.7 7.9 17.6 17.6 17.6h257.6c30.5 0 55.2 24.7 55.2 55.2v98c0 9.7 7.9 17.6 17.6 17.6 9.7 0 17.6-7.9 17.6-17.6l.1-98z"/></defs><clipPath id="beam-angled-b"><use xlink:href="#beam-angled-a" overflow="visible"/></clipPath><g clip-path="url(#beam-angled-b)"><path fill="#DA4737" d="M95.5 51.2H29.2L-8.5 14.7h66.4zM209.9 51.2h-66.3l-37.7-36.5h66.3zM314.8 57s-.2-.1-.5-.3c-.3-.2-.8-.4-1.4-.7-.6-.3-1.4-.6-2.2-1-.9-.4-1.9-.8-3-1.1-2.2-.8-4.8-1.5-7.7-2-2.9-.5-6-.9-9.1-.9H258l-37.7-36.5h66.3l1.6 1.6c.5.5 1.1 1.1 1.9 1.8.8.7 1.8 1.5 2.8 2.4 4 3.5 8.8 8.6 12.4 14.1 3.7 5.4 6.3 11.1 7.6 15.4.7 2.1 1.2 3.9 1.5 5.1.3 1.4.4 2.1.4 2.1zM345.1 139.6v-33.2c0-.8 0-1.6-.1-2.4 0-.8-.1-1.5-.1-2.3 0-.8-.1-1.5-.2-2.3-.1-.7-.2-1.5-.3-2.2-.4-2.9-1.2-5.5-1.8-7.7-.7-2.2-1.4-4-2-5.3-.6-1.2-.9-1.9-.9-1.9s.3-.7.8-1.8c.3-.6.6-1.3.9-2.1.3-.8.7-1.8 1.1-2.8 1.5-4.2 3-10.3 3.3-16.9.5-6.5-.2-13.5-1.2-18.8-.5-2.6-1.1-4.9-1.5-6.4-.5-1.6-.7-2.4-.7-2.4s.3.2.8.5c.5.4 1.2.9 2.1 1.5.9.7 2 1.5 3.2 2.5 1.2 1 2.6 2.2 4 3.5 5.7 5.3 12.5 13.2 17.5 22.3 2.5 4.5 4.7 9.3 6.3 13.8 1.7 4.6 2.7 9 3.6 12.8.7 3.8 1.1 7 1.4 9.3.2 2.3.3 3.5.3 3.5s-.1.2-.4.5c-.3.4-.6.9-1.1 1.5-1 1.3-2.3 3.2-4.1 4.8-3.4 3.5-8 8.2-12.6 12.9-9.2 9.7-18.3 19.1-18.3 19.1zM345.1 254v-66.3l36.5-37.7v66.3z"/></g><g opacity=".25" fill="#434343"><path d="M32.9 50.5c-9.7 0-17.6-7.9-17.6-17.6 0-1.2.1-2.4.4-3.6 1.7 8 8.7 14 17.2 14H74l216.5 7.2H32.9zM381 203.7c0 9.7-7.9 17.6-17.6 17.6-1.2 0-2.4-.1-3.6-.4 8-1.7 14-8.7 14-17.2v-98h7.2v98z"/><path d="M373.8 105.7c0-49.9-33.3-90.3-83.2-90.3 54.3 0 90.4 43.8 90.4 90.3h-7.2z"/></g></svg>',
    width: 365,
    height: 205,
    stroke: 36, // thickness of bar
    padding: 15,
    hasAngle: true
  },
  angledBeamInvertedShadow: {
    className: '',
    innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 396.3 236.6"><circle fill="#B4B4B4" cx="32.9" cy="32.9" r="32.9"/><circle fill="#B4B4B4" cx="363.4" cy="203.7" r="32.9"/><g fill="#77787C"><circle cx="10.4" cy="23.6" r="3.1"/><circle cx="55.4" cy="42.2" r="3.1"/></g><g fill="#77787C"><circle cx="23.6" cy="55.4" r="3.1"/><circle cx="42.2" cy="10.4" r="3.1"/></g><g fill="#77787C"><circle cx="23.6" cy="10.4" r="3.1"/><circle cx="42.2" cy="55.4" r="3.1"/></g><g fill="#77787C"><circle cx="10.4" cy="42.2" r="3.1"/><circle cx="55.4" cy="23.6" r="3.1"/></g><g fill="#77787C"><circle cx="354" cy="226.2" r="3.1"/><circle cx="372.7" cy="181.2" r="3.1"/></g><g fill="#77787C"><circle cx="385.9" cy="213" r="3.1"/><circle cx="340.9" cy="194.4" r="3.1"/></g><g fill="#77787C"><circle cx="340.9" cy="213" r="3.1"/><circle cx="385.9" cy="194.4" r="3.1"/></g><g fill="#77787C"><circle cx="372.7" cy="226.2" r="3.1"/><circle cx="354" cy="181.2" r="3.1"/></g><path opacity=".25" fill="#434343" d="M374 98.7c0-49.9-40.5-90.4-90.4-90.4H25.9c-9.7 0-17.6 7.9-17.6 17.6 0 9.7 7.9 17.6 17.6 17.6h257.6c30.5 0 55.2 24.7 55.2 55.2v98c0 9.7 7.9 17.6 17.6 17.6 9.7 0 17.6-7.9 17.6-17.6l.1-98z"/><path fill="#FFF" d="M381 105.7c0-49.9-40.5-90.4-90.4-90.4H32.9c-9.7 0-17.6 7.9-17.6 17.6 0 9.7 7.9 17.6 17.6 17.6h257.6c30.5 0 55.2 24.7 55.2 55.2v98c0 9.7 7.9 17.6 17.6 17.6 9.7 0 17.6-7.9 17.6-17.6l.1-98z"/><defs><path id="beam-angled-inverted-a" d="M381 105.7c0-49.9-40.5-90.4-90.4-90.4H32.9c-9.7 0-17.6 7.9-17.6 17.6 0 9.7 7.9 17.6 17.6 17.6h257.6c30.5 0 55.2 24.7 55.2 55.2v98c0 9.7 7.9 17.6 17.6 17.6 9.7 0 17.6-7.9 17.6-17.6l.1-98z"/></defs><clipPath id="beam-angled-inverted-b"><use xlink:href="#beam-angled-inverted-a" overflow="visible"/></clipPath><g clip-path="url(#beam-angled-inverted-b)"><path fill="#DA4737" d="M95.5 51.2H29.2L-8.5 14.7h66.4zM209.9 51.2h-66.3l-37.7-36.5h66.3zM314.8 57s-.2-.1-.5-.3c-.3-.2-.8-.4-1.4-.7-.6-.3-1.4-.6-2.2-1-.9-.4-1.9-.8-3-1.1-2.2-.8-4.8-1.5-7.7-2-2.9-.5-6-.9-9.1-.9H258l-37.7-36.5h66.3l1.6 1.6c.5.5 1.1 1.1 1.9 1.8.8.7 1.8 1.5 2.8 2.4 4 3.5 8.8 8.6 12.4 14.1 3.7 5.4 6.3 11.1 7.6 15.4.7 2.1 1.2 3.9 1.5 5.1.3 1.4.4 2.1.4 2.1zM345.1 139.6v-33.2c0-.8 0-1.6-.1-2.4 0-.8-.1-1.5-.1-2.3 0-.8-.1-1.5-.2-2.3-.1-.7-.2-1.5-.3-2.2-.4-2.9-1.2-5.5-1.8-7.7-.7-2.2-1.4-4-2-5.3-.6-1.2-.9-1.9-.9-1.9s.3-.7.8-1.8c.3-.6.6-1.3.9-2.1.3-.8.7-1.8 1.1-2.8 1.5-4.2 3-10.3 3.3-16.9.5-6.5-.2-13.5-1.2-18.8-.5-2.6-1.1-4.9-1.5-6.4-.5-1.6-.7-2.4-.7-2.4s.3.2.8.5c.5.4 1.2.9 2.1 1.5.9.7 2 1.5 3.2 2.5 1.2 1 2.6 2.2 4 3.5 5.7 5.3 12.5 13.2 17.5 22.3 2.5 4.5 4.7 9.3 6.3 13.8 1.7 4.6 2.7 9 3.6 12.8.7 3.8 1.1 7 1.4 9.3.2 2.3.3 3.5.3 3.5s-.1.2-.4.5c-.3.4-.6.9-1.1 1.5-1 1.3-2.3 3.2-4.1 4.8-3.4 3.5-8 8.2-12.6 12.9-9.2 9.7-18.3 19.1-18.3 19.1zM345.1 254v-66.3l36.5-37.7v66.3z"/></g><g opacity=".25" fill="#434343"><path d="M32.9 15.3c-9.7 0-17.6 7.9-17.6 17.6 0 1.2.1 2.4.4 3.6 1.7-8 8.7-14 17.2-14H74l216.5-7.2H32.9zM345.8 203.7c0 9.7 7.9 17.6 17.6 17.6 1.2 0 2.4-.1 3.6-.4-8-1.7-14-8.7-14-17.2v-98h-7.2v98z"/><path d="M345.8 105.7c0-30.2-24.3-55.2-55.2-55.2 30.3 0 62.4 19.9 62.4 55.2h-7.2z"/></g></svg>',
    width: 365,
    height: 205,
    stroke: 36, // thickness of bar
    padding: 15,
    hasAngle: true
  },
  angledBeamInvertedShadow2: {
    className: '',
    innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 396.3 236.6"><circle fill="#B4B4B4" cx="32.9" cy="32.9" r="32.9"/><circle fill="#B4B4B4" cx="363.4" cy="203.7" r="32.9"/><g fill="#77787C"><circle cx="10.4" cy="23.6" r="3.1"/><circle cx="55.4" cy="42.2" r="3.1"/></g><g fill="#77787C"><circle cx="23.6" cy="55.4" r="3.1"/><circle cx="42.2" cy="10.4" r="3.1"/></g><g fill="#77787C"><circle cx="23.6" cy="10.4" r="3.1"/><circle cx="42.2" cy="55.4" r="3.1"/></g><g fill="#77787C"><circle cx="10.4" cy="42.2" r="3.1"/><circle cx="55.4" cy="23.6" r="3.1"/></g><g fill="#77787C"><circle cx="354" cy="226.2" r="3.1"/><circle cx="372.7" cy="181.2" r="3.1"/></g><g fill="#77787C"><circle cx="385.9" cy="213" r="3.1"/><circle cx="340.9" cy="194.4" r="3.1"/></g><g fill="#77787C"><circle cx="340.9" cy="213" r="3.1"/><circle cx="385.9" cy="194.4" r="3.1"/></g><g fill="#77787C"><circle cx="372.7" cy="226.2" r="3.1"/><circle cx="354" cy="181.2" r="3.1"/></g><path opacity=".25" fill="#434343" d="M388 112.7c0-49.9-40.5-90.4-90.4-90.4H39.9c-9.7 0-17.6 7.9-17.6 17.6 0 9.7 7.9 17.6 17.6 17.6h257.7c30.5 0 55.2 24.7 55.2 55.2v98c0 9.7 7.9 17.6 17.6 17.6 9.7 0 17.6-7.9 17.6-17.6v-98z"/><path fill="#FFF" d="M381 105.7c0-49.9-40.5-90.4-90.4-90.4H32.9c-9.7 0-17.6 7.9-17.6 17.6 0 9.7 7.9 17.6 17.6 17.6h257.7c30.5 0 55.2 24.7 55.2 55.2v98c0 9.7 7.9 17.6 17.6 17.6 9.7 0 17.6-7.9 17.6-17.6v-98z"/><defs><path id="angled-beam-inverted2-a" d="M381 105.7c0-49.9-40.5-90.4-90.4-90.4H32.9c-9.7 0-17.6 7.9-17.6 17.6 0 9.7 7.9 17.6 17.6 17.6h257.7c30.5 0 55.2 24.7 55.2 55.2v98c0 9.7 7.9 17.6 17.6 17.6 9.7 0 17.6-7.9 17.6-17.6v-98z"/></defs><clipPath id="angled-beam-inverted2-b"><use xlink:href="#angled-beam-inverted2-a" overflow="visible"/></clipPath><g clip-path="url(#angled-beam-inverted2-b)"><path fill="#DA4737" d="M95.5 51.2H29.2L-8.5 14.7h66.4zM209.9 51.2h-66.3l-37.7-36.5h66.3zM314.8 57s-.2-.1-.5-.3c-.3-.2-.8-.4-1.4-.7-.6-.3-1.4-.6-2.3-1-.9-.4-1.9-.8-3-1.1-2.2-.8-4.8-1.5-7.7-2-2.9-.5-6-.9-9.1-.9h-32.9l-37.7-36.5h66.3l1.6 1.6c.5.5 1.1 1.1 1.9 1.8.8.7 1.8 1.5 2.8 2.4 4 3.5 8.8 8.6 12.4 14.1 3.7 5.4 6.3 11.1 7.6 15.4.7 2.1 1.2 3.9 1.5 5.1.4 1.4.5 2.1.5 2.1zM345.1 139.6v-33.2c0-.8 0-1.6-.1-2.4 0-.8-.1-1.5-.1-2.3 0-.8-.1-1.5-.2-2.3-.1-.7-.2-1.5-.3-2.2-.4-2.9-1.2-5.5-1.8-7.7-.7-2.2-1.4-4-2-5.3-.6-1.2-.9-1.9-.9-1.9s.3-.7.8-1.8c.3-.6.6-1.3.9-2.1.3-.8.7-1.8 1.1-2.8 1.5-4.2 3-10.3 3.3-16.9.5-6.5-.2-13.5-1.2-18.8-.5-2.6-1.1-4.9-1.5-6.4-.5-1.6-.7-2.4-.7-2.4s.3.2.8.5c.5.4 1.2.9 2.1 1.5.9.7 2 1.5 3.2 2.5 1.2 1 2.6 2.2 4 3.5 5.7 5.3 12.5 13.2 17.5 22.3 2.5 4.5 4.7 9.3 6.3 13.8 1.7 4.6 2.7 9 3.6 12.8.7 3.8 1.1 7 1.4 9.3.2 2.3.3 3.5.3 3.5s-.1.2-.4.5c-.3.4-.6.9-1.1 1.5-1 1.3-2.3 3.2-4.1 4.8-3.4 3.5-8 8.2-12.6 12.9-9.2 9.7-18.3 19.1-18.3 19.1zM345.1 254v-66.3l36.5-37.7v66.3z"/></g><g opacity=".25" fill="#434343"><path d="M32.9 50.5c-9.7 0-17.6-7.9-17.6-17.6 0-1.2.1-2.4.4-3.6 1.7 8 8.7 14 17.2 14H74l216.5 7.2H32.9zM381 203.7c0 9.7-7.9 17.6-17.6 17.6-1.2 0-2.4-.1-3.6-.4 8-1.7 14-8.7 14-17.2v-98h7.2v98z"/><path d="M373.8 105.7c0-49.9-33.3-90.3-83.2-90.3 54.3 0 90.4 43.8 90.4 90.3h-7.2z"/></g></svg>',
    width: 365,
    height: 205,
    stroke: 36, // thickness of bar
    padding: 15,
    hasAngle: true
  },
  straightBeam: {
    className: '',
    innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 321.8 65.8"><circle fill="#B4B4B4" cx="32.9" cy="32.9" r="32.9"/><g fill="#77787C"><circle cx="10.4" cy="23.6" r="3.1"/><circle cx="55.4" cy="42.2" r="3.1"/></g><g fill="#77787C"><circle cx="23.6" cy="55.4" r="3.1"/><circle cx="42.2" cy="10.4" r="3.1"/></g><g fill="#77787C"><circle cx="23.6" cy="10.4" r="3.1"/><circle cx="42.2" cy="55.4" r="3.1"/></g><g fill="#77787C"><circle cx="10.4" cy="42.2" r="3.1"/><circle cx="55.4" cy="23.6" r="3.1"/></g><circle fill="#B4B4B4" cx="288.9" cy="32.9" r="32.9"/><g fill="#77787C"><circle cx="266.4" cy="23.6" r="3.1"/><circle cx="311.4" cy="42.2" r="3.1"/></g><g fill="#77787C"><circle cx="279.6" cy="55.4" r="3.1"/><circle cx="298.2" cy="10.4" r="3.1"/></g><g fill="#77787C"><circle cx="279.6" cy="10.4" r="3.1"/><circle cx="298.2" cy="55.4" r="3.1"/></g><g fill="#77787C"><circle cx="266.4" cy="42.2" r="3.1"/><circle cx="311.4" cy="23.6" r="3.1"/></g><path opacity=".25" fill="#434343" d="M313.5 40.8c0-9.7-7.9-17.6-17.6-17.6h-256c-9.7 0-17.6 7.9-17.6 17.6 0 9.7 7.9 17.6 17.6 17.6h256c9.7 0 17.6-7.9 17.6-17.6z"/><path fill="#FFF" d="M306.5 32.9c0-9.7-7.9-17.6-17.6-17.6h-256c-9.7 0-17.6 7.9-17.6 17.6 0 9.7 7.9 17.6 17.6 17.6h256c9.7 0 17.6-7.9 17.6-17.6z"/><g><defs><path id="a" d="M306.5 32.9c0-9.7-7.9-17.6-17.6-17.6h-256c-9.7 0-17.6 7.9-17.6 17.6 0 9.7 7.9 17.6 17.6 17.6h256c9.7 0 17.6-7.9 17.6-17.6z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><g clip-path="url(#b)"><path fill="#DA4737" d="M105.4 51.2h-59L12.9 14.7h59zM207.2 51.2h-59l-33.5-36.5h59zM308.9 51.2h-59l-33.5-36.5h59z"/></g></g><path opacity=".25" fill="#434343" d="M15.3 32.9c0-1.2.1-2.4.4-3.6 1.7 8 8.7 14 17.2 14h256c8.5 0 15.6-6 17.2-14 .2 1.2.4 2.4.4 3.6 0 9.7-7.9 17.6-17.6 17.6h-256c-9.7 0-17.6-7.9-17.6-17.6z"/></svg>',
    width: 290,
    padding: 15,
    height: 36, // thickness of bar
    hasAngle: false
  },
  straightBeamInvertedShadow: {
    className: '',
    innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="180 20.4 321.8 65.8"><circle fill="#B4B4B4" cx="212.9" cy="53.3" r="32.9"/><circle fill="#77787C" cx="190.4" cy="44" r="3.1"/><circle fill="#77787C" cx="235.4" cy="62.6" r="3.1"/><circle fill="#77787C" cx="203.6" cy="75.8" r="3.1"/><circle fill="#77787C" cx="222.2" cy="30.8" r="3.1"/><circle fill="#77787C" cx="203.6" cy="30.8" r="3.1"/><circle fill="#77787C" cx="222.2" cy="75.8" r="3.1"/><circle fill="#77787C" cx="190.4" cy="62.6" r="3.1"/><circle fill="#77787C" cx="235.4" cy="44" r="3.1"/><circle fill="#B4B4B4" cx="468.9" cy="53.3" r="32.9"/><circle fill="#77787C" cx="446.4" cy="44" r="3.1"/><circle fill="#77787C" cx="491.4" cy="62.6" r="3.1"/><circle fill="#77787C" cx="459.6" cy="75.8" r="3.1"/><circle fill="#77787C" cx="478.2" cy="30.8" r="3.1"/><g fill="#77787C"><circle cx="459.6" cy="30.8" r="3.1"/><circle cx="478.2" cy="75.8" r="3.1"/></g><g fill="#77787C"><circle cx="446.4" cy="62.6" r="3.1"/><circle cx="491.4" cy="44" r="3.1"/></g><path opacity=".25" fill="#434343" d="M479.5 61.2c0-9.7-7.9-17.6-17.6-17.6h-256c-9.7 0-17.6 7.9-17.6 17.6s7.9 17.6 17.6 17.6h256c9.7 0 17.6-7.9 17.6-17.6z"/><path fill="#FFF" d="M486.5 53.3c0-9.7-7.9-17.6-17.6-17.6h-256c-9.7 0-17.6 7.9-17.6 17.6s7.9 17.6 17.6 17.6h256c9.7 0 17.6-7.9 17.6-17.6z"/><defs><path id="straight-beam-inverted-shadow-a" d="M486.5 53.3c0-9.7-7.9-17.6-17.6-17.6h-256c-9.7 0-17.6 7.9-17.6 17.6s7.9 17.6 17.6 17.6h256c9.7 0 17.6-7.9 17.6-17.6z"/></defs><clipPath id="straight-beam-inverted-shadow-b"><use xlink:href="#straight-beam-inverted-shadow-a" overflow="visible"/></clipPath><path clip-path="url(#straight-beam-inverted-shadow-b)" fill="#DA4737" d="M285.4 71.6h-59l-33.5-36.5h59l33.5 36.5zm101.8 0h-59l-33.5-36.5h59l33.5 36.5zm101.7 0h-59l-33.5-36.5h59l33.5 36.5z"/><path opacity=".25" fill="#434343" d="M195.3 53.3c0-1.2.1-2.4.4-3.6 1.7 8 8.7 14 17.2 14h256c8.5 0 15.6-6 17.2-14 .2 1.2.4 2.4.4 3.6 0 9.7-7.9 17.6-17.6 17.6h-256c-9.7 0-17.6-7.9-17.6-17.6z"/></svg>',
    width: 290,
    padding: 15,
    height: 36, // thickness of bar
    hasAngle: false
  },
  conveyorBelt: {
    className: 'js-object-conveyorBelt object--conveyorBelt conveyor',
    innerHTML: `
      <div class="conveyor__belt">
        <div class="conveyor__wheel conveyor__wheel--first">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle fill="#ED6D23" cx="32" cy="32" r="32"/><path fill="#FFF" d="M62.8 23.6c.3 8-2.6 16.1-8.7 22.2-9.2 9.2-24.2 9.2-33.5 0-7.3-7.3-7.3-19.1 0-26.3 2.8-2.8 6.4-4.3 10.3-4.3 3.9 0 7.6 1.5 10.3 4.3 2.1 2.1 3.3 5 3.3 8s-1.2 5.9-3.3 8c-1.7 1.7-3.8 2.6-6.2 2.6-2.3 0-4.5-.9-6.2-2.6a6.64 6.64 0 0 1 0-9.4c1-1 2.2-1.5 3.6-1.5 1.3 0 2.6.5 3.5 1.5.7.7 1.1 1.6 1.1 2.6s-.4 1.9-1.1 2.6c-1 1-2.7 1-3.7 0-.7-.7-.7-1.9 0-2.5.6-.6.6-1.6 0-2.3-.6-.6-1.6-.6-2.3 0-1.9 1.9-1.9 5.2 0 7.1 2.3 2.3 6 2.3 8.3 0 1.3-1.3 2-3 2-4.9 0-1.8-.7-3.6-2-4.9-1.6-1.6-3.6-2.4-5.8-2.4s-4.3.9-5.8 2.4c-3.8 3.8-3.8 10.1 0 14 2.3 2.3 5.3 3.5 8.4 3.5 3.2 0 6.2-1.2 8.4-3.5 2.7-2.7 4.3-6.4 4.3-10.3s-1.5-7.5-4.3-10.3C40 13.8 35.6 12 30.8 12c-4.7 0-9.2 1.8-12.6 5.2-8.5 8.5-8.5 22.3 0 30.8 10.5 10.5 27.5 10.5 38 0 3.1-3.1 5.5-6.7 7.1-10.5.3-1.8.5-3.7.5-5.6.1-2.8-.3-5.6-1-8.3z"/></svg>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="151.4 -7 388.4 81.4"><path class="js-belt-shadow-path belt shadow" opacity=".25" fill="none" stroke="#424242" stroke-width="8" stroke-miterlimit="10" stroke-dasharray="24" d="M535.8 38.7c0 17.5-14.2 31.7-31.7 31.7h-307c-17.5-.1-31.7-14.2-31.7-31.7S179.6 7 197.1 7h307.1c17.5 0 31.6 14.2 31.6 31.7"/><g class="wheelshadow" opacity=".25"><circle fill="#424242" cx="196.7" cy="38.4" r="32"/><circle fill="#424242" cx="503.8" cy="38.4" r="32"/></g><path class="js-belt-path belt" fill="none" stroke="#F9CE1D" stroke-width="8" stroke-miterlimit="10" stroke-dasharray="24" d="M530.4 33.4c0 17.5-14.2 31.7-31.7 31.7h-307C174.2 65 160 50.9 160 33.4s14.2-31.7 31.7-31.7h307.1c17.5 0 31.6 14.2 31.6 31.7"/></svg>
        <div class="conveyor__wheel conveyor__wheel--last">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle fill="#3BB34A" cx="32" cy="32" r="32"/><path fill="#FFF" d="M1.1 23.6c-.3 8 2.6 16.1 8.7 22.2C19 55 34 55 43.3 45.8c7.3-7.3 7.3-19.1 0-26.3-2.8-2.8-6.4-4.3-10.3-4.3s-7.6 1.5-10.3 4.3c-2.1 2.1-3.3 5-3.3 8s1.2 5.9 3.3 8c1.7 1.7 3.8 2.6 6.2 2.6 2.3 0 4.5-.9 6.2-2.6 2.6-2.6 2.6-6.8 0-9.4-1-1-2.2-1.5-3.6-1.5-1.3 0-2.6.5-3.5 1.5-.7.7-1.1 1.6-1.1 2.6s.4 1.9 1.1 2.6c1 1 2.7 1 3.7 0 .7-.7.7-1.9 0-2.5-.6-.6-.6-1.6 0-2.3.6-.6 1.6-.6 2.3 0 1.9 1.9 1.9 5.2 0 7.1-2.3 2.3-6 2.3-8.3 0-1.3-1.3-2-3-2-4.9 0-1.8.7-3.6 2-4.9 1.6-1.6 3.6-2.4 5.8-2.4 2.2 0 4.3.9 5.8 2.4 3.8 3.8 3.8 10.1 0 14-2.3 2.3-5.3 3.5-8.4 3.5-3.2 0-6.2-1.2-8.4-3.5-2.7-2.7-4.3-6.4-4.3-10.3s1.5-7.5 4.3-10.3c3.4-3.4 7.8-5.2 12.6-5.2 4.7 0 9.2 1.8 12.6 5.2 8.5 8.5 8.5 22.3 0 30.8-10.5 10.5-27.5 10.5-38 0-3.1-3.1-5.5-6.7-7.1-10.5-.3-1.8-.5-3.7-.5-5.6-.1-2.8.3-5.6 1-8.3z"/></svg>
        </div>
      </div>
      <div class="object__rotate-handle js-rotate-handle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.7 34.7"><circle opacity=".25" fill="#424242" cx="20.9" cy="20.9" r="13.9"/><circle fill="#E91C24" cx="13.9" cy="13.9" r="13.9"/><g fill="none" stroke="#FFF" stroke-width="2" stroke-miterlimit="10"><path d="M17.5 8.4c1.9 1.3 2.9 3.3 2.9 5.5 0 3.6-2.9 6.6-6.6 6.6s-6.6-2.9-6.6-6.6 2.9-6.6 6.6-6.6"/><path d="M10.7 5.3l3.2 2-2 3.1"/></g></svg>
      </div>`,
    width: 380,
    height: 70,
    padding: 5
  },
  spring: {
    className: 'js-object-spring object--spring',
    innerHTML: `
      <div class="spring">
        <div class="spring__top">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76.1 11.8"><path fill="#D32E2E" d="M64.3 11.8H11.8C5.3 11.8 0 6.5 0 0h76.1c0 6.5-5.3 11.8-11.8 11.8z"/></svg>
        </div>
        <div class="spring__bottom">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76.1 87.7">
            <g opacity=".1"><path fill="none" stroke="#010101" stroke-width="7" stroke-linecap="round" stroke-miterlimit="10" d="M68.7 33l-51.5-6.6M68.7 19.8l-51.5-6.6M68.7 46.2l-51.5-6.6M68.7 59.4l-51.5-6.6M68.7 72.6L17.2 66M68.7 85.8l-51.5-6.6M17.2 26.4l51.5-6.6M17.2 39.6L68.7 33M17.2 52.8l51.5-6.6M17.2 66l51.5-6.6M17.2 79.2l51.5-6.6M42.9 89.1l25.8-3.3"/><path fill="#010101" d="M69.2 16.7H16.7c-6.5 0-11.8-5.3-11.8-11.8H81c0 6.5-5.3 11.8-11.8 11.8z"/></g><g fill="none" stroke="#CDCCCC" stroke-width="7" stroke-linecap="round" stroke-miterlimit="10"><path d="M63.8 28.1l-51.5-6.6M63.8 14.9L12.3 8.3M63.8 41.3l-51.5-6.6M63.8 54.5l-51.5-6.6M63.8 67.7l-51.5-6.6M63.8 80.9l-51.5-6.6"/></g><g fill="none" stroke="#FFF" stroke-width="7" stroke-linecap="round" stroke-miterlimit="10"><path d="M12.3 21.5l51.5-6.6M12.3 34.7l51.5-6.6M12.3 47.9l51.5-6.6M12.3 61.1l51.5-6.6M12.3 74.3l51.5-6.6M38 84.2l25.8-3.3"/></g>
          </svg>
        </div>
      </div>
      <div class="object__rotate-handle js-rotate-handle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.7 34.7"><circle opacity=".25" fill="#424242" cx="20.9" cy="20.9" r="13.9"/><circle fill="#E91C24" cx="13.9" cy="13.9" r="13.9"/><g fill="none" stroke="#FFF" stroke-width="2" stroke-miterlimit="10"><path d="M17.5 8.4c1.9 1.3 2.9 3.3 2.9 5.5 0 3.6-2.9 6.6-6.6 6.6s-6.6-2.9-6.6-6.6 2.9-6.6 6.6-6.6"/><path d="M10.7 5.3l3.2 2-2 3.1"/></g></svg>
      </div>`,
    height: 80,
    width: 75
  }
};