/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

/**
 * @fileOverview Defines {@link kceditor#verbosity} and binary flags {@link kceditor#VERBOSITY_WARN} and
 * {@link kceditor#VERBOSITY_ERROR}. Defines also the {@link kceditor#error} and {@link kceditor#warn} functions
 * and the default handler for the {@link kceditor#log} event.
 */

/* global console */

'use strict';

/**
 * Warning reporting verbosity level. When {@link kceditor#verbosity} is set to this value, only {@link kceditor#warn}
 * messages will be output to the console. It is a binary flag so it might be combined with
 * the {@link kceditor#VERBOSITY_ERROR} flag.
 *
 * @since 4.5.4
 * @readonly
 * @property {Number} [=1]
 * @member kceditor
 */
kceditor.VERBOSITY_WARN = 1;

/**
 * Error reporting verbosity level. When {@link kceditor#verbosity} is set to this value, only {@link kceditor#error}
 * messages will be output to the console. It is a binary flag so it might be combined with
 * the {@link kceditor#VERBOSITY_WARN} flag.
 *
 * @since 4.5.4
 * @readonly
 * @property {Number} [=2]
 * @member kceditor
 */
kceditor.VERBOSITY_ERROR = 2;

/**
 * Verbosity of {@link kceditor#error} and {@link kceditor#warn} methods. Accepts binary flags
 * {@link kceditor#VERBOSITY_WARN} and {@link kceditor#VERBOSITY_ERROR}.
 *
 * 			kceditor.verbosity = 0; // No console output after kceditor.warn and kceditor.error methods.
 * 			kceditor.verbosity = kceditor.VERBOSITY_WARN; // Console output after kceditor.warn only.
 * 			kceditor.verbosity = kceditor.VERBOSITY_ERROR; // Console output after kceditor.error only.
 * 			kceditor.verbosity = kceditor.VERBOSITY_WARN | kceditor.VERBOSITY_ERROR; // Console output after both methods.
 *
 * Default value enables both {@link kceditor#VERBOSITY_WARN} and {@link kceditor#VERBOSITY_ERROR}.
 *
 * @since 4.5.4
 * @member kceditor
 * @type {Number}
 */
kceditor.verbosity = kceditor.VERBOSITY_WARN | kceditor.VERBOSITY_ERROR;

/**
 * Warning reporting function. When {@link kceditor#verbosity} has the {@link kceditor#VERBOSITY_WARN} flag set, it fires
 * the {@link kceditor#log} event with type set to `warn`. Fired event contains also provided `errorCode` and `additionalData`.
 *
 * @since 4.5.4
 * @member kceditor
 * @param {String} errorCode Error code describing reported problem.
 * @param {Object} [additionalData] Additional data associated with reported problem.
 */
kceditor.warn = function( errorCode, additionalData ) {
	if ( kceditor.verbosity & kceditor.VERBOSITY_WARN ) {
		kceditor.fire( 'log', { type: 'warn', errorCode: errorCode, additionalData: additionalData } );
	}
};

/**
 * Error reporting function. When {@link kceditor#verbosity} has {@link kceditor#VERBOSITY_ERROR} flag set, it fires
 * {@link kceditor#log} event with the type set to `error`. The fired event also contains the provided `errorCode` and
 * `additionalData`.
 *
 * @since 4.5.4
 * @member kceditor
 * @param {String} errorCode Error code describing the reported problem.
 * @param {Object} [additionalData] Additional data associated with the reported problem.
 */
kceditor.error = function( errorCode, additionalData ) {
	if ( kceditor.verbosity & kceditor.VERBOSITY_ERROR ) {
		kceditor.fire( 'log', { type: 'error', errorCode: errorCode, additionalData: additionalData } );
	}
};

/**
 * Fired by {@link kceditor#warn} and {@link kceditor#error} methods.
 * Default listener logs provided information to the console.
 *
 * This event can be used to provide a custom error/warning handler:
 *
 * 			CKEDTIOR.on( 'log', function( evt ) {
 *			    	// Cancel default listener.
 *					evt.cancel();
 *					// Log event data.
 *					console.log( evt.data.type, evt.data.errorCode, evt.data.additionalData );
 * 			} );
 *
 * @since 4.5.4
 * @event log
 * @member kceditor
 * @param data
 * @param {String} data.type Log type. Can be `error` or `warn`.
 * @param {String} data.errorCode Error code describing the reported problem.
 * @param {Object} [data.additionalData] Additional data associated with this log event.
 */
kceditor.on( 'log', function( evt ) {
	if ( !window.console || !window.console.log ) {
		return;
	}

	var type = console[ evt.data.type ] ? evt.data.type : 'log',
		errorCode = evt.data.errorCode,
		additionalData = evt.data.additionalData,
		prefix = '[kceditor] ',
		errorCodeLabel = 'Error code: ';

	if ( additionalData ) {
		console[ type ]( prefix + errorCodeLabel + errorCode + '.', additionalData );
	} else {
		console[ type ]( prefix + errorCodeLabel + errorCode + '.' );
	}

	console[ type ]( prefix + 'For more information about this error go to https://github.com/sallecta/kceditor/docs/kceditor4/latest/guide/dev_errors.html#' + errorCode );
}, null, null, 999 );
