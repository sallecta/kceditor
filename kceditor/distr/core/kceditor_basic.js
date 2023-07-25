/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

/**
 * @fileOverview Contains the second part of the {@link kceditor} object
 *		definition, which defines the basic editor features to be available in
 *		the root kceditor_basic.js file.
 */

if ( kceditor.status == 'unloaded' ) {
	( function() {
		kceditor.event.implementOn( kceditor );

		/**
		 * Forces the full KCEditor core code, in the case only the basic code has been
		 * loaded (`kceditor_basic.js`). This method self-destroys (becomes undefined) in
		 * the first call or as soon as the full code is available.
		 *
		 *		// Check if the full core code has been loaded and load it.
		 *		if ( kceditor.loadFullCore )
		 *			kceditor.loadFullCore();
		 *
		 * @member kceditor
		 */
		kceditor.loadFullCore = function() {
			// If the basic code is not ready, just mark it to be loaded.
			if ( kceditor.status != 'basic_ready' ) {
				kceditor.loadFullCore._load = 1;
				return;
			}

			// Destroy this function.
			delete kceditor.loadFullCore;

			// Append the script to the head.
			var script = document.createElement( 'script' );
			script.type = 'text/javascript';
			script.src = kceditor.basePath + 'kceditor.js';
			script.src = kceditor.basePath + 'kceditor_source.js'; // %REMOVE_LINE%

			document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );
		};

		/**
		 * The time to wait (in seconds) to load the full editor code after the
		 * page load, if the "kceditor_basic" file is used. If set to zero, the
		 * editor is loaded on demand, as soon as an instance is created.
		 *
		 * This value must be set on the page before the page load completion.
		 *
		 *		// Loads the full source after five seconds.
		 *		kceditor.loadFullCoreTimeout = 5;
		 *
		 * @property
		 * @member kceditor
		 */
		kceditor.loadFullCoreTimeout = 0;

		// Documented at kceditor.js.
		kceditor.add = function( editor ) {
			// For now, just put the editor in the pending list. It will be
			// processed as soon as the full code gets loaded.
			var pending = this._.pending || ( this._.pending = [] );
			pending.push( editor );
		};

		( function() {
			var load_basic = function() {
					var loadFullCore = kceditor.loadFullCore,
						loadFullCoreTimeout = kceditor.loadFullCoreTimeout;

					if ( !loadFullCore )
						return;

					kceditor.status = 'basic_ready';

					if ( loadFullCore && loadFullCore._load )
						loadFullCore();
					else if ( loadFullCoreTimeout ) {
						setTimeout( function() {
							if ( kceditor.loadFullCore )
								kceditor.loadFullCore();
						}, loadFullCoreTimeout * 1000 );
					}
				};

			kceditor.events.domReady( load_basic );
		} )();

		kceditor.status = 'basic_loaded';
	} )();
}
