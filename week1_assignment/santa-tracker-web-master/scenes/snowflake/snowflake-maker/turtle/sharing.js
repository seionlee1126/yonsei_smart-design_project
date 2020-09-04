/**
 * Blockly Games: Snowflake
 *
 * Copyright 2016 Google Inc.
 * https://github.com/google/blockly-games
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Handles encoding and decoding the workspace to a url-friendly string.
 * @author madeeha@google.com (Madeeha Ghori)
 */

goog.provide('Snowflake.Sharing');

goog.require('Blockly');


Snowflake.Sharing.HEX_COLOR_REGEX = /^#([0-9a-f]{3}){1,2}$/i;

// Constants for loop start and end.
Snowflake.Sharing.LOOP_START = '(';
Snowflake.Sharing.LOOP_END = ')';

Snowflake.Sharing.FIELD_START = '[';
Snowflake.Sharing.FIELD_END = ']';

/**
 * Mapping from block names to their single-letter encodings.
 */
Snowflake.Sharing.blockToInitial = {
  'turtle_colour': 'c',
  'pentagon_stamp': 'p',
  'square_stamp': 's',
  'triangle_stamp': 't',
  'turtle_move_forward': 'f',
  'turtle_move_backward': 'b',
  'turtle_turn_left': 'l',
  'turtle_turn_right': 'r',
  'control_repeat': Snowflake.Sharing.LOOP_START
};

Snowflake.Sharing.BLOCK_REGEX = /^\s*<block type="([A-z\_]+)" id=".+">$/;

Snowflake.Sharing.VALUE_REGEX = /^\s*<value/;

Snowflake.Sharing.FIELD_REGEX = /^\s*<field name="[A-z]+">(.+)<\/field>$/;

Snowflake.Sharing.LOOP_END_REGEX = /^\s*<\/statement>$/;

/**
 * Mapping from single-letter block encodings to XML for blocks on the workspace.
 */
Snowflake.Sharing.initialToBlock = {
  'p': '<block type="pentagon_stamp"><value name="SIZE"><shadow type="dropdown_pentagon"><field name="CHOICE">[VALUE]</field></shadow></value></block>',
  'c': '<block type="turtle_colour"><value name="COLOUR"><shadow type="dropdown_colour"><field name="CHOICE">[VALUE]</field></shadow></value></block>',
  's': '<block type="square_stamp"><value name="SIZE"><shadow type="dropdown_square"><field name="CHOICE">[VALUE]</field></shadow></value></block>',
  't': '<block type="triangle_stamp"><value name="SIZE"><shadow type="dropdown_triangle"><field name="CHOICE">[VALUE]</field></shadow></value></block>',
  'f': '<block type="turtle_move_forward"><value name="VALUE"><shadow type="dropdown_move_forward"><field name="CHOICE">[VALUE]</field></shadow></value></block>',
  'b': '<block type="turtle_move_backward"><value name="VALUE"><shadow type="dropdown_move_backward"><field name="CHOICE">[VALUE]</field></shadow></value></block>',
  'l': '<block type="turtle_turn_left"><value name="ANGLE"><shadow type="dropdown_turn_left"><field name="CHOICE">[VALUE]</field></shadow></value></block>',
  'r': '<block type="turtle_turn_right"><value name="ANGLE"><shadow type="dropdown_turn_right"><field name="CHOICE">[VALUE]</field></shadow></value></block>',
  'empty-loop': '<block type="control_repeat"><value name="TIMES"><shadow type="math_whole_number"><field name="NUM">[VALUE]</field></shadow></value></block>',
};

/**
 * Encode the contents of the workspace as a string.
 * @return {string} URL-safe representation of the workspace.
 */
Snowflake.Sharing.workspaceToUrl = function() {
  var topBlock = BlocklyInterface.getStarterBlock();
  var codeString = Snowflake.Sharing.textEncodeBlocks_(topBlock.getNextBlock());
  return codeString;
};

/**
* Encode a set of blocks as a string beginning with the block passed in.
* @param {Blockly.Block} block The block to start encoding from.
* @return {string} URL-safe representation of the blocks.
* @private
*/
Snowflake.Sharing.textEncodeBlocks_ = function(block) {
  if (!block) {
    return '';
  }
  var blockString = '';
  while (block) {
    switch(block.type) {
      case 'turtle_colour':
        blockString += Snowflake.Sharing.textEncodeColor_(block);
        break;
      case 'turtle_turn_left':
      case 'turtle_turn_right':
      case 'turtle_move_forward':
      case 'turtle_move_backward':
      case 'pentagon_stamp':
      case 'square_stamp':
      case 'triangle_stamp':
        blockString += Snowflake.Sharing.textEncodeValue_(block);
        break;
      case 'control_repeat':
        blockString += Snowflake.Sharing.textEncodeLoop_(block);
        break;
    }
    block = block.getNextBlock();
  }
  return blockString;
};

/**
* Encode a single block and its value as a string.
* @param {!Blockly.Block} block The block to encode.
* @return {string} URL-safe representation of the block.
* @private
*/
Snowflake.Sharing.textEncodeValue_ = function(block) {
  var value = block.inputList[0].connection.targetBlock().getFieldValue('CHOICE');
  var result = Snowflake.Sharing.blockToInitial[block.type] || '';
  if (result != '') {
    result = result + value + '-';
  }
  return result;
};

/**
* Encode a single loop block and any children connected to its statement input.
* @param {!Blockly.Block} block The block to encode, which must be of type control_repeat
* @return {string} URL-safe representation of the block.
* @private
*/
Snowflake.Sharing.textEncodeLoop_ = function(block) {
  var text = '(';
  text += Snowflake.Sharing.textEncodeBlocks_(block.inputList[0].connection.targetBlock());
  text += ')';
  var repeatCount = 0;
  try {
    repeatCount = parseInt(block.inputList[1].connection.targetBlock().getFieldValue('NUM'));
  } catch (e) {
    console.log('invalid value for block ' + block);
  }
  if (isNaN(repeatCount) || repeatCount < 0) {
    repeatCount = 0;
  } else if (repeatCount > 99) {
    repeatCount = 99;
  }
  text += repeatCount + '-';
  return text;
};

/**
* Encode a single color block as a string.
* @param {!Blockly.Block} block The block to encode, which must be of type turtle_colour.
* @return {string} URL-safe representation of the block.
* @private
*/
Snowflake.Sharing.textEncodeColor_ = function(block) {
  var color = block.inputList[0].connection.targetBlock().getFieldValue('CHOICE');
  if (color == 'random') {
    return 'cz-';
  } else if (color && color.length == 7) {
    // Removes any non-hexidecimal characters, ignoring case
    color = color.replace(/[^0-9a-f]/gi,'');
    if (color.length != 6) {
      console.log('Invalid color ' + color);
      return 'cz-';
    }
    return 'c' + color + '-';
  }
};

/**
 * Decode a string to a workspace.
 * @param {string} string The URL representation of the workspace.
 */
Snowflake.Sharing.urlToWorkspace = function(string) {
  var workspace = Snowflake.workspace;
  var starterConnection = BlocklyInterface.getStarterBlock().nextConnection;
  if (starterConnection.targetBlock() != null) {
    starterConnection.targetBlock().dispose();
  }
  this.stringToBlocks_(starterConnection, string);
};

/**
 * Convert the URL-encoded workspace into blocks and attach them to the starter
 * block.
 * @param {!Blockly.Connection} starterConnection The connection to eventually
 *     attach blocks to.
 * @param {string} string The URL-encoded workspace as a string.
 * @private
 */
Snowflake.Sharing.stringToBlocks_ = function(starterConnection, string) {
  var simpleBlocks = ['f', 'b', 'l', 'r', 's', 'p', 't', 'c'];
  var currentConnection = starterConnection;
  var loopStack = [];

  var nextBlock;
  for (var i = 0; i < string.length;) {
    var char = string[i];
    var nextChar = string[i + 1] || '';
    // If it's a simple block we can build it as is.
    if (simpleBlocks.indexOf(char) != -1) {
      var nextDash = string.indexOf('-', i);
      if (nextDash == -1) {
        console.log('invalid string, no end for block value at ' + i);
        return;
      }
      var valueContent = string.substring(i + 1, nextDash);
      // Colors need a little extra work to decode
      if (char == 'c') {
        if (valueContent == 'z') {
          valueContent = 'random';
        } else {
          valueContent = '#' + valueContent;
        }
      }
      // Build the block with its value
      nextBlock = this.makeBlockFromInitial(char, valueContent);
      currentConnection.connect(nextBlock.previousConnection);
      // Move on to the next block
      currentConnection = nextBlock.nextConnection;
      i = nextDash + 1;
    } else if (char == Snowflake.Sharing.LOOP_START) {
      // Create an empty loop and set the next connection to its statement
      nextBlock = this.makeBlockFromInitial('empty-loop', 1);
      // And add it to the stack of loops
      loopStack.push(nextBlock);
      currentConnection.connect(nextBlock.previousConnection);
      // Move on to the blocks in its statement
      currentConnection = nextBlock.inputList[0].connection;
      i++;
    } else if (char == Snowflake.Sharing.LOOP_END) {
      // Pop the most recent loop off the stack and set its value
      if (loopStack.length == 0) {
        console.log('invalid string, uneven loop characters');
        return;
      }
      nextBlock = loopStack.pop();
      var nextDash = string.indexOf('-', i);
      if (nextDash == -1) {
        console.log('invalid string, no end for loop value at ' + i);
        return;
      }
      var valueContent = string.substring(i + 1, nextDash);
      var validatedValue = Snowflake.Sharing.validateBlockValue('empty-loop', valueContent);
      nextBlock.inputList[1].connection.targetBlock().setFieldValue(validatedValue, 'NUM');
      // Move on to the next block
      currentConnection = nextBlock.nextConnection;
      i = nextDash + 1;
    } else {
      // Invalid character, skip it
      i++
    }
  }
};

/**
 * Translate a single-character block name into a blockly block and set the
 * value.
 * @param {string} initial The single-character encoding of a block name, which
 *     must be in the key set of Snowflake.Sharing.initialToBlock.
 * @param {string} value The value to set on the block, which may be a number,
 *     a color, or a key for selecting from a dropdown.
 * @return {Blockly.Block} The block represented by the initial + value
 *     combination.
 */
Snowflake.Sharing.makeBlockFromInitial = function (initial, value) {
  var validatedValue = Snowflake.Sharing.validateBlockValue(initial, value);
  var xmlString = Snowflake.Sharing.initialToBlock[initial].replace(/\[VALUE\]/, validatedValue);
  var xml = Blockly.Xml.textToDom(xmlString);
  return Blockly.Xml.domToBlock(xml, Snowflake.workspace);
};

/**
 * Returns a sanitized block value based on the initial.  For example,
 * shape blocks can only have sizes between 20 and 200.  This allows values
 * that we cannot choose dropdown values for and relies on the block definition
 * to show a valid image/choice in dropdown menus even if it does not match.
 * @param {string} initial String representing which block type to validate a
 * value for. Each block has only one value input.
 * @param {string} value The input value to validate.
 * @return {string|number} A valid value for a block parameter. For color
 * blocks this will be a hex string or 'random'; for shape, turn, and repeat
 * blocks this will be a number in the valid range.
 */
Snowflake.Sharing.validateBlockValue = function(initial, value) {
  var validValue = null;
  switch(initial) {
    // Shape blocks. Dropdown values: 20, 40, 60, 80, 100, 120.
    case 'p':
    case 's':
    case 't':
      validValue = parseInt(value);
      if (!validValue || validValue < 20 || validValue > 150) {
        validValue = 100;
      }
      break;
    // Forward/backward blocks. Dropdown values 10, 20, 30.
    case 'f':
    case 'b':
      validValue = parseInt(value);
      if (!validValue || validValue < 10 || validValue > 99) {
        validValue = 20;
      }
      break;
    // The left right blocks. Dropdown values 30, 60, 90, 120, 150, 180.
    case 'l':
    case 'r':
      validValue = parseInt(value);
      if (!validValue || validValue < 10 || validValue > 180) {
        validValue = 30;
      }
      break;
    // Color block. Accept any hex color and set to random if not valid.
    case 'c':
      var match = Snowflake.Sharing.HEX_COLOR_REGEX.exec(value);
      if (match && match[0]) {
        validValue = match[0];
      } else {
        validValue = 'random';
      }
      break;
    // 'empty-loop' appears to be the initial for all loops.
    case 'empty-loop':
      validValue = parseInt(value);
      if (!validValue || validValue < 0 || validValue > 99) {
        validValue = 4; //set back to default.
      }
      break;
    default:
      // This should not happen...
      validValue = 0;
      break;
  }
  return validValue;
};
