/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

/**
 * @fileOverview Defines the {@link kceditor.dom.comment} class, which represents
 *		a DOM comment node.
 */

/**
 * Represents a DOM comment node.
 *
 *		var nativeNode = document.createComment( 'Example' );
 *		var comment = new kceditor.dom.comment( nativeNode );
 *
 *		var comment = new kceditor.dom.comment( 'Example' );
 *
 * @class
 * @extends kceditor.dom.node
 * @constructor Creates a comment class instance.
 * @param {Object/String} comment A native DOM comment node or a string containing
 * the text to use to create a new comment node.
 * @param {kceditor.dom.document} [ownerDocument] The document that will contain
 * the node in case of new node creation. Defaults to the current document.
 */
kceditor.dom.comment = function( comment, ownerDocument ) {
	if ( typeof comment == 'string' )
		comment = ( ownerDocument ? ownerDocument.$ : document ).createComment( comment );

	kceditor.dom.domObject.call( this, comment );
};

kceditor.dom.comment.prototype = new kceditor.dom.node();

kceditor.tools.extend( kceditor.dom.comment.prototype, {
	/**
	 * The node type. This is a constant value set to {@link kceditor#NODE_COMMENT}.
	 *
	 * @readonly
	 * @property {Number} [=kceditor.NODE_COMMENT]
	 */
	type: kceditor.NODE_COMMENT,

	/**
	 * Gets the outer HTML of this comment.
	 *
	 * @returns {String} The HTML `<!-- comment value -->`.
	 */
	getOuterHtml: function() {
		return '<!--' + this.$.nodeValue + '-->';
	}
} );
