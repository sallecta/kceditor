/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

/**
 * DocumentFragment is a "lightweight" or "minimal" Document object. It is
 * commonly used to extract a portion of the document's tree or to create a new
 * fragment of the document. Various operations may take document fragment objects
 * as arguments and result in all the child nodes of the document fragment being
 * moved to the child list of this node.
 *
 * @class
 * @constructor Creates a document fragment class instance.
 * @param {kceditor.dom.document/DocumentFragment} [nodeOrDoc=kceditor.document]
 */
kceditor.dom.documentFragment = function( nodeOrDoc ) {
	nodeOrDoc = nodeOrDoc || kceditor.document;

	if ( nodeOrDoc.type == kceditor.NODE_DOCUMENT )
		this.$ = nodeOrDoc.$.createDocumentFragment();
	else
		this.$ = nodeOrDoc;
};

kceditor.tools.extend( kceditor.dom.documentFragment.prototype, kceditor.dom.element.prototype, {
	/**
	 * The node type. This is a constant value set to {@link kceditor#NODE_DOCUMENT_FRAGMENT}.
	 *
	 * @readonly
	 * @property {Number} [=kceditor.NODE_DOCUMENT_FRAGMENT]
	 */
	type: kceditor.NODE_DOCUMENT_FRAGMENT,

	/**
	 * Inserts the document fragment content after the specified node.
	 *
	 * @param {kceditor.dom.node} node
	 */
	insertAfterNode: function( node ) {
		node = node.$;
		node.parentNode.insertBefore( this.$, node.nextSibling );
	},

	/**
	 * Gets the HTML of this document fragment's children.
	 *
	 * @since 4.5.0
	 * @returns {String} The HTML of this document fragment's children.
	 */
	getHtml: function() {
		var container = new kceditor.dom.element( 'div' );

		this.clone( 1, 1 ).appendTo( container );

		return container.getHtml().replace( /\s*data-cke-expando=".*?"/g, '' );
	}
}, true, {
	'append': 1, 'appendBogus': 1, 'clone': 1, 'getFirst': 1, 'getHtml': 1, 'getLast': 1, 'getParent': 1, 'getNext': 1, 'getPrevious': 1,
	'appendTo': 1, 'moveChildren': 1, 'insertBefore': 1, 'insertAfterNode': 1, 'replace': 1, 'trim': 1, 'type': 1,
	'ltrim': 1, 'rtrim': 1, 'getDocument': 1, 'getChildCount': 1, 'getChild': 1, 'getChildren': 1
} );

kceditor.tools.extend( kceditor.dom.documentFragment.prototype, kceditor.dom.document.prototype, true, {
	'find': 1, 'findOne': 1
} );

/**
 * @member kceditor.dom.documentFragment
 * @method append
 * @inheritdoc kceditor.dom.element#append
*/

/**
 * @member kceditor.dom.documentFragment
 * @method appendBogus
 * @inheritdoc kceditor.dom.element#appendBogus
 */

/**
 * @member kceditor.dom.documentFragment
 * @method clone
 * @inheritdoc kceditor.dom.element#clone
 */

/**
 * @member kceditor.dom.documentFragment
 * @method getFirst
 * @inheritdoc kceditor.dom.element#getFirst
 */

/**
 * @member kceditor.dom.documentFragment
 * @method getLast
 * @inheritdoc kceditor.dom.element#getLast
 */

/**
 * @member kceditor.dom.documentFragment
 * @method getParent
 * @inheritdoc kceditor.dom.element#getParent
 */

/**
 * @member kceditor.dom.documentFragment
 * @method getNext
 * @inheritdoc kceditor.dom.element#getNext
 */

/**
 * @member kceditor.dom.documentFragment
 * @method getPrevious
 * @inheritdoc kceditor.dom.element#getPrevious
 */

/**
 * @member kceditor.dom.documentFragment
 * @method appendTo
 * @inheritdoc kceditor.dom.element#appendTo
 */

/**
 * @member kceditor.dom.documentFragment
 * @method moveChildren
 * @inheritdoc kceditor.dom.element#moveChildren
 */

/**
 * @member kceditor.dom.documentFragment
 * @method insertBefore
 * @inheritdoc kceditor.dom.element#insertBefore
 */

/**
 * @member kceditor.dom.documentFragment
 * @method replace
 * @inheritdoc kceditor.dom.element#replace
 */

/**
 * @member kceditor.dom.documentFragment
 * @method trim
 * @inheritdoc kceditor.dom.element#trim
 */

/**
 * @member kceditor.dom.documentFragment
 * @method ltrim
 * @inheritdoc kceditor.dom.element#ltrim
 */

/**
 * @member kceditor.dom.documentFragment
 * @method rtrim
 * @inheritdoc kceditor.dom.element#rtrim
 */

/**
 * @member kceditor.dom.documentFragment
 * @method getDocument
 * @inheritdoc kceditor.dom.element#getDocument
 */

/**
 * @member kceditor.dom.documentFragment
 * @method getChildCount
 * @inheritdoc kceditor.dom.element#getChildCount
 */

/**
 * @member kceditor.dom.documentFragment
 * @method getChild
 * @inheritdoc kceditor.dom.element#getChild
 */

/**
 * @member kceditor.dom.documentFragment
 * @method getChildren
 * @inheritdoc kceditor.dom.element#getChildren
 */

/**
 * @member kceditor.dom.documentFragment
 * @method find
 * @since 4.12.0
 * @inheritdoc kceditor.dom.document#find
 */

/**
 * @member kceditor.dom.documentFragment
 * @method findOne
 * @since 4.12.0
 * @inheritdoc kceditor.dom.document#findOne
 */
