/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

'use strict';

( function() {
	/**
	 * A lightweight representation of HTML text.
	 *
	 * @class
	 * @extends kceditor.htmlParser.node
	 * @constructor Creates a text class instance.
	 * @param {String} value The text node value.
	 */
	kceditor.htmlParser.text = function( value ) {
		/**
		 * The text value.
		 *
		 * @property {String}
		 */
		this.value = value;

		/** @private */
		this._ = {
			isBlockLike: false
		};
	};

	kceditor.htmlParser.text.prototype = kceditor.tools.extend( new kceditor.htmlParser.node(), {
		/**
		 * The node type. This is a constant value set to {@link kceditor#NODE_TEXT}.
		 *
		 * @readonly
		 * @property {Number} [=kceditor.NODE_TEXT]
		 */
		type: kceditor.NODE_TEXT,

		/**
		 * Filter this text node with given filter.
		 *
		 * @since 4.1.0
		 * @param {kceditor.htmlParser.filter} filter
		 * @returns {Boolean} Method returns `false` when this text node has
		 * been removed. This is an information for {@link kceditor.htmlParser.element#filterChildren}
		 * that it has to repeat filter on current position in parent's children array.
		 */
		filter: function( filter, context ) {
			if ( !( this.value = filter.onText( context, this.value, this ) ) ) {
				this.remove();
				return false;
			}
		},

		/**
		 * Writes the HTML representation of this text to a {kceditor.htmlParser.basicWriter}.
		 *
		 * @param {kceditor.htmlParser.basicWriter} writer The writer to which write the HTML.
		 * @param {kceditor.htmlParser.filter} [filter] The filter to be applied to this node.
		 * **Note:** it's unsafe to filter offline (not appended) node.
		 */
		writeHtml: function( writer, filter ) {
			if ( filter )
				this.filter( filter );

			writer.text( this.value );
		}
	} );
} )();
