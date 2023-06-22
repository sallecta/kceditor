/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

/* global Promise, ES6Promise */

( function() {
	'use strict';

	if ( window.Promise ) {
		kceditor.tools.promise = Promise;
	} else {
		var polyfillURL = kceditor.getUrl( 'vendor/promise.js' ),
			isAmdEnv = typeof window.define === 'function' && window.define.amd && typeof window.require === 'function';

		if ( isAmdEnv ) {
			return window.require( [ polyfillURL ], function( Promise ) {
				kceditor.tools.promise = Promise;
			} );
		}

		kceditor.scriptLoader.load( polyfillURL, function( success ) {
			if ( !success ) {
				return kceditor.error( 'no-vendor-lib', {
					path: polyfillURL
				} );
			}

			if ( typeof window.ES6Promise !== 'undefined' ) {
				return kceditor.tools.promise = ES6Promise;
			}
		} );
	}

	/**
	 * An alias for the [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
	 * object representing an asynchronous operation.
	 *
	 * It uses the native `Promise` browser implementation if it is available. For older browsers with lack of `Promise` support,
	 * the [`ES6-Promise`](https://github.com/stefanpenner/es6-promise) polyfill is used.
	 * See the [Promise Browser Compatibility table](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Browser_compatibility)
	 * to learn more.
	 *
	 * Refer to [MDN Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) guide for
	 * more details on how to work with promises.
	 *
	 * **NOTE:** `catch` and `finally` are reserved keywords in IE<9 browsers. Use bracket notation instead:
	 *
	 * ```js
	 * promise[ 'catch' ]( function( err ) {
	 * 		// ...
	 * } );
	 *
	 * promise[ 'finally' ]( function() {
	 *		// ...
	 * } );
	 * ```
	 *
	 * @since 4.12.0
	 * @class kceditor.tools.promise
	 */

	/**
	 * Creates a new `Promise` instance.
	 *
	 * ```js
	 *	new kceditor.tools.promise( function( resolve, reject ) {
	 *		setTimeout( function() {
	 *			var timestamp;
	 *			try {
	 *				timestamp = ( new Date() ).getTime();
	 *			} catch ( e ) {
	 *				reject( e );
	 *			}
	 *			resolve( timestamp );
	 *		}, 5000 );
	 *	} );
	 * ```
	 *
	 * @param {Function} resolver
	 * @param {Function} resolver.resolve
	 * @param {Function} resolver.reject
	 * @constructor
	 */

} )();
