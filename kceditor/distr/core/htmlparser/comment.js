/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

'use strict';

/**
 * A lightweight representation of an HTML comment.
 *
 * @class
 * @extends kceditor.htmlParser.node
 * @constructor Creates a comment class instance.
 * @param {String} value The comment text value.
 */
kceditor.htmlParser.comment = function( value ) {
	/**
	 * The comment text.
	 *
	 * @property {String}
	 */
	this.value = value;

	/** @private */
	this._ = {
		isBlockLike: false
	};
};

kceditor.htmlParser.comment.prototype = kceditor.tools.extend( new kceditor.htmlParser.node(), {
	/**
	 * The node type. This is a constant value set to {@link kceditor#NODE_COMMENT}.
	 *
	 * @readonly
	 * @property {Number} [=kceditor.NODE_COMMENT]
	 */
	type: kceditor.NODE_COMMENT,

	/**
	 * Filter this comment with given filter.
	 *
	 * @since 4.1.0
	 * @param {kceditor.htmlParser.filter} filter
	 * @returns {Boolean} Method returns `false` when this comment has
	 * been removed or replaced with other node. This is an information for
	 * {@link kceditor.htmlParser.element#filterChildren} that it has
	 * to repeat filter on current position in parent's children array.
	 */
	filter: function( filter, context ) {
		var comment = this.value;

		if ( !( comment = filter.onComment( context, comment, this ) ) ) {
			this.remove();
			return false;
		}

		if ( typeof comment != 'string' ) {
			this.replaceWith( comment );
			return false;
		}

		this.value = comment;

		return true;
	},

	/**
	 * Writes the HTML representation of this comment to a kceditor.htmlWriter.
	 *
	 * @param {kceditor.htmlParser.basicWriter} writer The writer to which write the HTML.
	 * @param {kceditor.htmlParser.filter} [filter] The filter to be applied to this node.
	 * **Note:** it's unsafe to filter offline (not appended) node.
	 */
	writeHtml: function( writer, filter ) {
		if ( filter )
			this.filter( filter );

		writer.comment( this.value );
	}
} );
