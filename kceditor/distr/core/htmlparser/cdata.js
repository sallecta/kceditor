/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

'use strict';

( function() {

	/**
	 * A lightweight representation of HTML CDATA.
	 *
	 * @class
	 * @extends kceditor.htmlParser.node
	 * @constructor Creates a cdata class instance.
	 * @param {String} value The CDATA section value.
	 */
	kceditor.htmlParser.cdata = function( value ) {
		/**
		 * The CDATA value.
		 *
		 * @property {String}
		 */
		this.value = value;
	};

	kceditor.htmlParser.cdata.prototype = kceditor.tools.extend( new kceditor.htmlParser.node(), {
		/**
		 * CDATA has the same type as {@link kceditor.htmlParser.text} This is
		 * a constant value set to {@link kceditor#NODE_TEXT}.
		 *
		 * @readonly
		 * @property {Number} [=kceditor.NODE_TEXT]
		 */
		type: kceditor.NODE_TEXT,

		filter: function( filter ) {
			var style = this.getAscendant( 'style' );

			if ( !style ) {
				return;
			}

			// MathML and SVG namespaces processing parsers `style` content as a normal HTML, not text.
			// Make sure to filter such content also.
			var nonHtmlElementNamespace = style.getAscendant( { math: 1, svg: 1 } );

			if ( !nonHtmlElementNamespace ) {
				return;
			}

			var fragment = kceditor.htmlParser.fragment.fromHtml( this.value ),
				writer = new kceditor.htmlParser.basicWriter();

			filter.applyTo( fragment );
			fragment.writeHtml( writer );

			this.value = writer.getHtml();
		},

		/**
		 * Writes the CDATA with no special manipulations.
		 *
		 * @param {kceditor.htmlParser.basicWriter} writer The writer to which write the HTML.
		 */
		writeHtml: function( writer ) {
			writer.write( this.value );
		}
	} );
} )();
