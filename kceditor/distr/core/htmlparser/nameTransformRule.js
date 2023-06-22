/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

/**
 * @fileOverview Defines the "virtual" {@link kceditor.htmlParser.nameTransformRule} class
 * that contains the definition of rule for filtering element names or attribute names. This file is for
 * documentation purposes only.
 */

/**
 * Abstract class describing the definition of {@link kceditor.htmlParser.filterRulesDefinition} `elementNames` and `attributesNames` filtering rules.
 *
 * ```javascript
 *  var rule = [ /^div$/, 'p' ];
 * ```
 *
 * @class kceditor.htmlParser.nameTransformRule
 * @abstract
 */

/**
 * @property {RegExp} 0 A regular expression to match the element name or attribute.
 */

/**
 * @property {String} 1 A string used to replace the match.
 */
