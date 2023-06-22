/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

/**
 * @fileOverview Defines the {@link kceditor.dom.text} class, which represents
 *		a DOM text node.
 */

/**
 * Represents a DOM text node.
 *
 *		var nativeNode = document.createTextNode( 'Example' );
 *		var text = new kceditor.dom.text( nativeNode );
 *
 *		var text = new kceditor.dom.text( 'Example' );
 *
 * @class
 * @extends kceditor.dom.node
 * @constructor Creates a text class instance.
 * @param {Object/String} text A native DOM text node or a string containing
 * the text to use to create a new text node.
 * @param {kceditor.dom.document} [ownerDocument] The document that will contain
 * the node in case of new node creation. Defaults to the current document.
 */
kceditor.dom.text = function( text, ownerDocument ) {
	if ( typeof text == 'string' )
		text = ( ownerDocument ? ownerDocument.$ : document ).createTextNode( text );

	// Theoretically, we should call the base constructor here
	// (not kceditor.dom.node though). But, IE doesn't support expando
	// properties on text node, so the features provided by domObject will not
	// work for text nodes (which is not a big issue for us).
	//
	// kceditor.dom.domObject.call( this, element );

	this.$ = text;
};

kceditor.dom.text.prototype = new kceditor.dom.node();

kceditor.tools.extend( kceditor.dom.text.prototype, {
	/**
	 * The node type. This is a constant value set to {@link kceditor#NODE_TEXT}.
	 *
	 * @readonly
	 * @property {Number} [=kceditor.NODE_TEXT]
	 */
	type: kceditor.NODE_TEXT,

	/**
	 * Gets length of node's value.
	 *
	 * @returns {Number}
	 */
	getLength: function() {
		return this.$.nodeValue.length;
	},

	/**
	 * Gets node's value.
	 *
	 * @returns {String}
	 */
	getText: function() {
		return this.$.nodeValue;
	},

	/**
	 * Sets node's value.
	 *
	 * @param {String} text
	 */
	setText: function( text ) {
		this.$.nodeValue = text;
	},

	/**
	 * Checks whether a node is empty or is a
	 * {@link kceditor.dom.selection#FILLING_CHAR_SEQUENCE FILLING_CHAR_SEQUENCE} string.
	 *
	 * @since 4.13.0
	 * @param {Boolean} [ignoreWhiteSpace] Specifies whether the content that consists of only whitespace characters
	 * should be treated as an empty one.
	 * @returns {Boolean}
	 */
	isEmpty: function( ignoreWhiteSpace ) {
		var text = this.getText();

		if ( ignoreWhiteSpace ) {
			text = kceditor.tools.trim( text );
		}

		return !text || text === kceditor.dom.selection.FILLING_CHAR_SEQUENCE;
	},

	/**
	 * Breaks this text node into two nodes at the specified offset,
	 * keeping both in the tree as siblings. This node then only contains
	 * all the content up to the offset point. A new text node, which is
	 * inserted as the next sibling of this node, contains all the content
	 * at and after the offset point. When the offset is equal to the
	 * length of this node, the new node has no data.
	 *
	 * @param {Number} The position at which to split, starting from zero.
	 * @returns {kceditor.dom.text} The new text node.
	 */
	split: function( offset ) {

		// Saved the children count and text length beforehand.
		var parent = this.$.parentNode,
			count = parent.childNodes.length,
			length = this.getLength();

		var doc = this.getDocument();
		var retval = new kceditor.dom.text( this.$.splitText( offset ), doc );

		if ( parent.childNodes.length == count ) {
			// If the offset is after the last char, IE creates the text node
			// on split, but don't include it into the DOM. So, we have to do
			// that manually here.
			if ( offset >= length ) {
				retval = doc.createText( '' );
				retval.insertAfter( this );
			} else {
				// IE BUG: IE8+ does not update the childNodes array in DOM after splitText(),
				// we need to make some DOM changes to make it update. (https://dev.kceditor.com/ticket/3436)
				var workaround = doc.createText( '' );
				workaround.insertAfter( retval );
				workaround.remove();
			}
		}

		return retval;
	},

	/**
	 * Extracts characters from indexA up to but not including `indexB`.
	 *
	 * @param {Number} indexA An integer between `0` and one less than the
	 * length of the text.
	 * @param {Number} [indexB] An integer between `0` and the length of the
	 * string. If omitted, extracts characters to the end of the text.
	 */
	substring: function( indexA, indexB ) {
		// We need the following check due to a Firefox bug
		// https://bugzilla.mozilla.org/show_bug.cgi?id=458886
		if ( typeof indexB != 'number' )
			return this.$.nodeValue.substr( indexA );
		else
			return this.$.nodeValue.substring( indexA, indexB );
	}
} );
