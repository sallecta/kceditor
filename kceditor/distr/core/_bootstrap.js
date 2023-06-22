/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

/**
 * @fileOverview API initialization code.
 */

( function() {
	// Check whether high contrast is active by creating a colored border.
	var hcDetect = kceditor.dom.element.createFromHtml( '<div style="width:0;height:0;position:absolute;left:-10000px;' +
		'border:1px solid;border-color:red blue"></div>', kceditor.document );

	hcDetect.appendTo( kceditor.document.getHead() );

	// Update kceditor.env.
	// Catch exception needed sometimes for FF. (https://dev.kceditor.com/ticket/4230)
	try {
		var top = hcDetect.getComputedStyle( 'border-top-color' ),
			right = hcDetect.getComputedStyle( 'border-right-color' );

		// We need to check if getComputedStyle returned any value, because on FF
		// it returnes empty string if KCEditor is loaded in hidden iframe. (https://dev.kceditor.com/ticket/11121)
		kceditor.env.hc = !!( top && top == right );
	} catch ( e ) {
		kceditor.env.hc = false;
	}

	hcDetect.remove();

	if ( kceditor.env.hc )
		kceditor.env.cssClass += ' cke_hc';

	// Initially hide UI spaces when relevant skins are loading, later restored by skin css.
	kceditor.document.appendStyleText( '.cke{visibility:hidden;}' );

	// Mark the editor as fully loaded.
	kceditor.status = 'loaded';
	kceditor.fireOnce( 'loaded' );

	// Process all instances created by the "basic" implementation.
	var pending = kceditor._.pending;
	if ( pending ) {
		delete kceditor._.pending;

		for ( var i = 0; i < pending.length; i++ ) {
			kceditor.editor.prototype.constructor.apply( pending[ i ][ 0 ], pending[ i ][ 1 ] );
			kceditor.add( pending[ i ][ 0 ] );
		}
	}
} )();

/**
 * Indicates that KCEditor is running on a High Contrast environment.
 *
 *		if ( kceditor.env.hc )
 *			alert( 'You\'re running on High Contrast mode. The editor interface will get adapted to provide you a better experience.' );
 *
 * @property {Boolean} hc
 * @member kceditor.env
 */

/**
 * Fired when a kceditor core object is fully loaded and ready for interaction.
 *
 * @event loaded
 * @member kceditor
 */
