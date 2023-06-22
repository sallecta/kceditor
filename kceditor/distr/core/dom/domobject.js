/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

/**
 * @fileOverview Defines the {@link kceditor.editor} class, which is the base
 *		for other classes representing DOM objects.
 */

/**
 * Represents a DOM object. This class is not intended to be used directly. It
 * serves as the base class for other classes representing specific DOM
 * objects.
 *
 * @class
 * @mixins kceditor.event
 * @constructor Creates a domObject class instance.
 * @param {Object} nativeDomObject A native DOM object.
 */
kceditor.dom.domObject = function( nativeDomObject ) {
	if ( nativeDomObject ) {
		/**
		 * The native DOM object represented by this class instance.
		 *
		 *		var element = new kceditor.dom.element( 'span' );
		 *		alert( element.$.nodeType ); // '1'
		 *
		 * @readonly
		 * @property {Object}
		 */
		this.$ = nativeDomObject;
	}
};

kceditor.dom.domObject.prototype = ( function() {
	// Do not define other local variables here. We want to keep the native
	// listener closures as clean as possible.

	var getNativeListener = function( domObject, eventName ) {
			return function( domEvent ) {
				// In FF, when reloading the page with the editor focused, it may
				// throw an error because the kceditor global is not anymore
				// available. So, we check it here first. (https://dev.kceditor.com/ticket/2923)
				if ( typeof kceditor != 'undefined' )
					domObject.fire( eventName, new kceditor.dom.event( domEvent ) );
			};
		};

	return {

		/**
		 * Gets the private `_` object which is bound to the native
		 * DOM object using {@link #getCustomData}.
		 *
		 *		var elementA = new kceditor.dom.element( nativeElement );
		 *		elementA.getPrivate().value = 1;
		 *		...
		 *		var elementB = new kceditor.dom.element( nativeElement );
		 *		elementB.getPrivate().value; // 1
		 *
		 * @returns {Object} The private object.
		 */
		getPrivate: function() {
			var priv;

			// Get the main private object from the custom data. Create it if not defined.
			if ( !( priv = this.getCustomData( '_' ) ) )
				this.setCustomData( '_', ( priv = {} ) );

			return priv;
		},

		// Docs inherited from event.
		on: function( eventName ) {
			// We customize the "on" function here. The basic idea is that we'll have
			// only one listener for a native event, which will then call all listeners
			// set to the event.

			// Get the listeners holder object.
			var nativeListeners = this.getCustomData( '_cke_nativeListeners' );

			if ( !nativeListeners ) {
				nativeListeners = {};
				this.setCustomData( '_cke_nativeListeners', nativeListeners );
			}

			// Check if we have a listener for that event.
			if ( !nativeListeners[ eventName ] ) {
				var listener = nativeListeners[ eventName ] = getNativeListener( this, eventName );

				if ( this.$.addEventListener )
					this.$.addEventListener( eventName, listener, !!kceditor.event.useCapture );
				else if ( this.$.attachEvent )
					this.$.attachEvent( 'on' + eventName, listener );
			}

			// Call the original implementation.
			return kceditor.event.prototype.on.apply( this, arguments );
		},

		// Docs inherited from event.
		removeListener: function( eventName ) {
			// Call the original implementation.
			kceditor.event.prototype.removeListener.apply( this, arguments );

			// If we don't have listeners for this event, clean the DOM up.
			if ( !this.hasListeners( eventName ) ) {
				var nativeListeners = this.getCustomData( '_cke_nativeListeners' );
				var listener = nativeListeners && nativeListeners[ eventName ];
				if ( listener ) {
					if ( this.$.removeEventListener )
						this.$.removeEventListener( eventName, listener, false );
					else if ( this.$.detachEvent )
						this.$.detachEvent( 'on' + eventName, listener );

					delete nativeListeners[ eventName ];
				}
			}
		},

		/**
		 * Removes any listener set on this object.
		 *
		 * To avoid memory leaks we must assure that there are no
		 * references left after the object is no longer needed.
		 */
		removeAllListeners: function() {
			try {
				var nativeListeners = this.getCustomData( '_cke_nativeListeners' );
				for ( var eventName in nativeListeners ) {
					var listener = nativeListeners[ eventName ];
					if ( this.$.detachEvent ) {
						this.$.detachEvent( 'on' + eventName, listener );
					} else if ( this.$.removeEventListener ) {
						this.$.removeEventListener( eventName, listener, false );
					}

					delete nativeListeners[ eventName ];
				}
			// Catch Edge `Permission denied` error which occurs randomly. Since the error is quite
			// random, catching allows to continue the code execution and cleanup (#3419).
			} catch ( error ) {
				if ( !kceditor.env.edge || error.number !== -2146828218 ) {
					throw( error );
				}
			}

			// Remove events from events object so fire() method will not call
			// listeners (https://dev.kceditor.com/ticket/11400).
			kceditor.event.prototype.removeAllListeners.call( this );
		}
	};
} )();

( function( domObjectProto ) {
	var customData = {};

	kceditor.on( 'reset', function() {
		customData = {};
	} );

	/**
	 * Determines whether the specified object is equal to the current object.
	 *
	 *		var doc = new kceditor.dom.document( document );
	 *		alert( doc.equals( kceditor.document ) );	// true
	 *		alert( doc == kceditor.document );			// false
	 *
	 * @param {Object} object The object to compare with the current object.
	 * @returns {Boolean} `true` if the object is equal.
	 */
	domObjectProto.equals = function( object ) {
		// Try/Catch to avoid IE permission error when object is from different document.
		try {
			return ( object && object.$ === this.$ );
		} catch ( er ) {
			return false;
		}
	};

	/**
	 * Sets a data slot value for this object. These values are shared by all
	 * instances pointing to that same DOM object.
	 *
	 * **Note:** The created data slot is only guaranteed to be available on this unique DOM node,
	 * thus any wish to continue access to it from other element clones (either created by
	 * clone node or from `innerHtml`) will fail. For such usage please use
	 * {@link kceditor.dom.element#setAttribute} instead.
	 *
	 * **Note**: This method does not work on text nodes prior to Internet Explorer 9.
	 *
	 *		var element = new kceditor.dom.element( 'span' );
	 *		element.setCustomData( 'hasCustomData', true );
	 *
	 * @param {String} key A key used to identify the data slot.
	 * @param {Object} value The value to set to the data slot.
	 * @returns {kceditor.dom.domObject} This DOM object instance.
	 * @chainable
	 */
	domObjectProto.setCustomData = function( key, value ) {
		var expandoNumber = this.getUniqueId(),
			dataSlot = customData[ expandoNumber ] || ( customData[ expandoNumber ] = {} );

		dataSlot[ key ] = value;

		return this;
	};

	/**
	 * Gets the value set to a data slot in this object.
	 *
	 *		var element = new kceditor.dom.element( 'span' );
	 *		alert( element.getCustomData( 'hasCustomData' ) );		// e.g. 'true'
	 *		alert( element.getCustomData( 'nonExistingKey' ) );		// null
	 *
	 * @param {String} key The key used to identify the data slot.
	 * @returns {Object} This value set to the data slot.
	 */
	domObjectProto.getCustomData = function( key ) {
		var expandoNumber = this.$[ 'data-cke-expando' ],
			dataSlot = expandoNumber && customData[ expandoNumber ];

		return ( dataSlot && key in dataSlot ) ? dataSlot[ key ] : null;
	};

	/**
	 * Removes the value in the data slot under the given `key`.
	 *
	 * @param {String} key
	 * @returns {Object} Removed value or `null` if not found.
	 */
	domObjectProto.removeCustomData = function( key ) {
		var expandoNumber = this.$[ 'data-cke-expando' ],
			dataSlot = expandoNumber && customData[ expandoNumber ],
			retval, hadKey;

		if ( dataSlot ) {
			retval = dataSlot[ key ];
			hadKey = key in dataSlot;
			delete dataSlot[ key ];
		}

		return hadKey ? retval : null;
	};

	/**
	 * Removes any data stored in this object.
	 * To avoid memory leaks we must assure that there are no
	 * references left after the object is no longer needed.
	 */
	domObjectProto.clearCustomData = function() {
		// Clear all event listeners
		this.removeAllListeners();

		var expandoNumber = this.getUniqueId();
		expandoNumber && delete customData[ expandoNumber ];
	};

	/**
	 * Gets an ID that can be used to identify this DOM object in
	 * the running session.
	 *
	 * **Note**: This method does not work on text nodes prior to Internet Explorer 9.
	 *
	 * @returns {Number} A unique ID.
	 */
	domObjectProto.getUniqueId = function() {
		return this.$[ 'data-cke-expando' ] || ( this.$[ 'data-cke-expando' ] = kceditor.tools.getNextNumber() );
	};

	// Implement kceditor.event.
	kceditor.event.implementOn( domObjectProto );

} )( kceditor.dom.domObject.prototype );
