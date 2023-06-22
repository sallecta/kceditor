/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

/**
 * Represents a list of {@link kceditor.dom.node} objects.
 * It is a wrapper for a native nodes list.
 *
 *		var nodeList = kceditor.document.getBody().getChildren();
 *		alert( nodeList.count() ); // number [0;N]
 *
 * @class
 * @constructor Creates a document class instance.
 * @param {Object} nativeList
 */
kceditor.dom.nodeList = function( nativeList ) {
	this.$ = nativeList;
};

kceditor.dom.nodeList.prototype = {
	/**
	 * Gets the count of nodes in this list.
	 *
	 * @returns {Number}
	 */
	count: function() {
		return this.$.length;
	},

	/**
	 * Gets the node from the list.
	 *
	 * @returns {kceditor.dom.node}
	 */
	getItem: function( index ) {
		if ( index < 0 || index >= this.$.length )
			return null;

		var $node = this.$[ index ];
		return $node ? new kceditor.dom.node( $node ) : null;
	},

	/**
	 * Returns a node list as an array.
	 *
	 * @returns {kceditor.dom.node[]}
	 */
	toArray: function() {
		return kceditor.tools.array.map( this.$, function( nativeEl ) {
			return new kceditor.dom.node( nativeEl );
		} );
	}
};
