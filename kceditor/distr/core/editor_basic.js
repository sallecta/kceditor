/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

if ( !kceditor.editor ) {
	// Documented at editor.js.
	kceditor.editor = function() {
		// Push this editor to the pending list. It'll be processed later once
		// the full editor code is loaded.
		kceditor._.pending.push( [ this, arguments ] );

		// Call the kceditor.event constructor to initialize this instance.
		kceditor.event.call( this );
	};

	// Both fire and fireOnce will always pass this editor instance as the
	// "editor" param in kceditor.event.fire. So, we override it to do that
	// automaticaly.
	kceditor.editor.prototype.fire = function( eventName, data ) {
		if ( eventName in { instanceReady: 1, loaded: 1 } )
			this[ eventName ] = true;

		return kceditor.event.prototype.fire.call( this, eventName, data, this );
	};

	kceditor.editor.prototype.fireOnce = function( eventName, data ) {
		if ( eventName in { instanceReady: 1, loaded: 1 } )
			this[ eventName ] = true;

		return kceditor.event.prototype.fireOnce.call( this, eventName, data, this );
	};

	// "Inherit" (copy actually) from kceditor.event.
	kceditor.event.implementOn( kceditor.editor.prototype );
}
