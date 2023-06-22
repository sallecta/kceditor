/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

/**
 * @fileOverview Defines the {@link kceditor.dom.event} class, which
 *		represents the a native DOM event object.
 */

/**
 * Represents a native DOM event object.
 *
 * @class
 * @constructor Creates an event class instance.
 * @param {Object} domEvent A native DOM event object.
 */
kceditor.dom.event = function( domEvent ) {
	/**
	 * The native DOM event object represented by this class instance.
	 *
	 * @readonly
	 */
	this.$ = domEvent;
};

kceditor.dom.event.prototype = {
	/**
	 * Gets the key code associated to the event.
	 *
	 *		alert( event.getKey() ); // '65' if 'a' has been pressed
	 *
	 * @returns {Number} The key code.
	 */
	getKey: function() {
		return this.$.keyCode || this.$.which;
	},

	/**
	 * Gets a number represeting the combination of the keys pressed during the
	 * event. It is the sum with the current key code and the {@link kceditor#CTRL},
	 * {@link kceditor#SHIFT} and {@link kceditor#ALT} constants.
	 *
	 *		alert( event.getKeystroke() == 65 );									// 'a' key
	 *		alert( event.getKeystroke() == kceditor.CTRL + 65 );					// CTRL + 'a' key
	 *		alert( event.getKeystroke() == kceditor.CTRL + kceditor.SHIFT + 65 );	// CTRL + SHIFT + 'a' key
	 *
	 * @returns {Number} The number representing the keys combination.
	 */
	getKeystroke: function() {
		var keystroke = this.getKey();

		if ( this.$.ctrlKey || this.$.metaKey )
			keystroke += kceditor.CTRL;

		if ( this.$.shiftKey )
			keystroke += kceditor.SHIFT;

		if ( this.$.altKey )
			keystroke += kceditor.ALT;

		return keystroke;
	},

	/**
	 * Prevents the original behavior of the event to happen. It can optionally
	 * stop propagating the event in the event chain.
	 *
	 *		var element = kceditor.document.getById( 'myElement' );
	 *		element.on( 'click', function( ev ) {
	 *			// The DOM event object is passed by the 'data' property.
	 *			var domEvent = ev.data;
	 *			// Prevent the click to chave any effect in the element.
	 *			domEvent.preventDefault();
	 *		} );
	 *
	 * @param {Boolean} [stopPropagation=false] Stop propagating this event in the
	 * event chain.
	 */
	preventDefault: function( stopPropagation ) {
		var $ = this.$;
		if ( $.preventDefault )
			$.preventDefault();
		else
			$.returnValue = false;

		if ( stopPropagation )
			this.stopPropagation();
	},

	/**
	 * Stops this event propagation in the event chain.
	 */
	stopPropagation: function() {
		var $ = this.$;
		if ( $.stopPropagation )
			$.stopPropagation();
		else
			$.cancelBubble = true;
	},

	/**
	 * Returns the DOM node where the event was targeted to.
	 *
	 *		var element = kceditor.document.getById( 'myElement' );
	 *		element.on( 'click', function( ev ) {
	 *			// The DOM event object is passed by the 'data' property.
	 *			var domEvent = ev.data;
	 *			// Add a CSS class to the event target.
	 *			domEvent.getTarget().addClass( 'clicked' );
	 *		} );
	 *
	 * @returns {kceditor.dom.node} The target DOM node.
	 */
	getTarget: function() {
		var rawNode = this.$.target || this.$.srcElement;
		return rawNode ? new kceditor.dom.node( rawNode ) : null;
	},

	/**
	 * Returns an integer value that indicates the current processing phase of an event.
	 * For browsers that doesn't support event phase, {@link kceditor#EVENT_PHASE_AT_TARGET} is always returned.
	 *
	 * @returns {Number} One of {@link kceditor#EVENT_PHASE_CAPTURING},
	 * {@link kceditor#EVENT_PHASE_AT_TARGET}, or {@link kceditor#EVENT_PHASE_BUBBLING}.
	 */
	getPhase: function() {
		return this.$.eventPhase || 2;
	},

	/**
	 * Retrieves the coordinates of the mouse pointer relative to the top-left
	 * corner of the document, in mouse related event.
	 *
	 *		element.on( 'mousemouse', function( ev ) {
	 *			var pageOffset = ev.data.getPageOffset();
	 *			alert( pageOffset.x );			// page offset X
	 *			alert( pageOffset.y );			// page offset Y
	 *     } );
	 *
	 * @returns {Object} The object contains the position.
	 * @returns {Number} return.x
	 * @returns {Number} return.y
	 */
	getPageOffset: function() {
		var doc = this.getTarget().getDocument().$;
		var pageX = this.$.pageX || this.$.clientX + ( doc.documentElement.scrollLeft || doc.body.scrollLeft );
		var pageY = this.$.pageY || this.$.clientY + ( doc.documentElement.scrollTop || doc.body.scrollTop );
		return { x: pageX, y: pageY };
	}
};

// For the followind constants, we need to go over the Unicode boundaries
// (0x10FFFF) to avoid collision.

/**
 * CTRL key (0x110000).
 *
 * @readonly
 * @property {Number} [=0x110000]
 * @member kceditor
 */
kceditor.CTRL = 0x110000;

/**
 * SHIFT key (0x220000).
 *
 * @readonly
 * @property {Number} [=0x220000]
 * @member kceditor
 */
kceditor.SHIFT = 0x220000;

/**
 * ALT key (0x440000).
 *
 * @readonly
 * @property {Number} [=0x440000]
 * @member kceditor
 */
kceditor.ALT = 0x440000;

/**
 * Capturing phase.
 *
 * @readonly
 * @property {Number} [=1]
 * @member kceditor
 */
kceditor.EVENT_PHASE_CAPTURING = 1;

/**
 * Event at target.
 *
 * @readonly
 * @property {Number} [=2]
 * @member kceditor
 */
kceditor.EVENT_PHASE_AT_TARGET = 2;

/**
 * Bubbling phase.
 *
 * @readonly
 * @property {Number} [=3]
 * @member kceditor
 */
kceditor.EVENT_PHASE_BUBBLING = 3;

/**
 * Integration with browser's "Go back" and "Go forward" buttons using Native History API.
 *
 * @since 4.17.0
 * @readonly
 * @property {Number} [=1]
 * @member kceditor
 */
kceditor.HISTORY_NATIVE = 1;

/**
 * Integration with browser's "Go back" and "Go forward" buttons using hash-based navigation.
 *
 * @since 4.17.0
 * @readonly
 * @property {Number} [=2]
 * @member kceditor
 */
kceditor.HISTORY_HASH = 2;

/**
 * Switch off integration with browser's "Go back" and "Go forward" buttons.
 *
 * @since 4.17.0
 * @readonly
 * @property {Number} [=0]
 * @member kceditor
 */
kceditor.HISTORY_OFF = 0;
