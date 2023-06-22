/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

/**
 * @fileOverview Defines the "virtual" {@link kceditor.dom.rect} class
 * that contains the definition of the element's DOM rectangle. This file is for
 * documentation purposes only.
 */

/**
 * Virtual class that illustrates the {@link kceditor.dom.element} DOM rectangle (dimensions and coordinates
 * of the area that the element occupies on the page).
 *
 * @class kceditor.dom.rect
 * @abstract
 */

/**
 * Element's offset from the viewport's top edge.
 *
 * @property {Number} top
 */

/**
 * Element's bottom edge offset from the viewport's top edge.
 *
 * This value is the same as the {@link kceditor.dom.rect#top} value plus the {@link kceditor.dom.rect#height} value.
 *
 * @property {Number} bottom
 */

/**
 * Element's offset from the viewport's left edge.
 *
 * @property {Number} left
 */

/**
 * Element's right edge offset from the viewport's left edge.
 *
 * This value is the same as the {@link kceditor.dom.rect#left} value plus the {@link kceditor.dom.rect#width} value.
 *
 * @property {Number} right
 */

/**
 * Element's height.
 *
 * @property {Number} height
 */

/**
 * Element's width.
 *
 * @property {Number} width
 */

/**
 * Element's offset from the viewport's left edge.
 *
 * This property is not available in Internet Explorer or Edge.
 *
 * @property {Number} x
 */

/**
 * Element's offset from the viewport's top edge.
 *
 * This property is not available in Internet Explorer or Edge.
 *
 * @property {Number} y
 */
