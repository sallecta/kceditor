/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

( function() {
	var template = '<a id="{id}"' +
		' class="cke_button cke_button__{name} cke_button_{state} {cls}"' +
		( kceditor.env.gecko && !kceditor.env.hc ? '' : ' href="javascript:void(\'{titleJs}\')"' ) +
		' title="{title}"' +
		' tabindex="-1"' +
		' hidefocus="true"' +
		' role="button"' +
		' aria-labelledby="{id}_label"' +
		' aria-describedby="{id}_description"' +
		' aria-haspopup="{hasArrow}"' +
		' aria-disabled="{ariaDisabled}"' +
		'{hasArrowAriaHtml}' +
		'{toggleAriaHtml}';

	// Some browsers don't cancel key events in the keydown but in the
	// keypress.
	// TODO: Check if really needed.
	if ( kceditor.env.gecko && kceditor.env.mac )
		template += ' onkeypress="return false;"';

	// With Firefox, we need to force the button to redraw, otherwise it
	// will remain in the focus state.
	if ( kceditor.env.gecko )
		template += ' onblur="this.style.cssText = this.style.cssText;"';

	// IE and Edge needs special click handler based on mouseup event with additional check
	// of which mouse button was clicked (https://dev.kceditor.com/ticket/188, #2565).
	var specialClickHandler = '';
	if ( kceditor.env.ie ) {
		specialClickHandler = 'return false;" onmouseup="kceditor.tools.getMouseButton(event)==kceditor.MOUSE_BUTTON_LEFT&&';
	}

	template += ' onkeydown="return kceditor.tools.callFunction({keydownFn},event);"' +
		' onfocus="return kceditor.tools.callFunction({focusFn},event);" ' +
		'onclick="' + specialClickHandler + 'kceditor.tools.callFunction({clickFn},this);return false;">' +
		'<span class="cke_button_icon cke_button__{iconName}_icon" style="{style}"';


	template += '>&nbsp;</span>' +
		'<span id="{id}_label" class="cke_button_label cke_button__{name}_label" aria-hidden="false">{label}</span>' +
		'<span id="{id}_description" class="cke_button_label" aria-hidden="false">{ariaShortcutSpace}{ariaShortcut}</span>' +
		'{arrowHtml}' +
		'</a>';

	var templateArrow = '<span class="cke_button_arrow">' +
		// BLACK DOWN-POINTING TRIANGLE
	( kceditor.env.hc ? '&#9660;' : '' ) +
		'</span>';

	var btnArrowTpl = kceditor.addTemplate( 'buttonArrow', templateArrow ),
		btnTpl = kceditor.addTemplate( 'button', template );

	kceditor.plugins.add( 'button', {
		beforeInit: function( editor ) {
			editor.ui.addHandler( kceditor.UI_BUTTON, kceditor.ui.button.handler );
		}
	} );

	/**
	 * Button UI element.
	 *
	 * @readonly
	 * @property {String} [='button']
	 * @member kceditor
	 */
	kceditor.UI_BUTTON = 'button';

	/**
	 * Represents a button UI element. This class should not be called directly. To
	 * create new buttons use {@link kceditor.ui#addButton} instead.
	 *
	 * @class
	 * @constructor Creates a button class instance.
	 * @param {Object} definition The button definition.
	 */
	kceditor.ui.button = function( definition ) {
		kceditor.tools.extend( this, definition,
		// Set defaults.
		{
			isToggle: definition.isToggle || false,
			title: definition.label,
			click: definition.click ||
			function( editor ) {
				editor.execCommand( definition.command );
			}
		} );

		this._ = {};
	};

	/**
	 * Represents the button handler object.
	 *
	 * @class
	 * @singleton
	 * @extends kceditor.ui.handlerDefinition
	 */
	kceditor.ui.button.handler = {
		/**
		 * Transforms a button definition into a {@link kceditor.ui.button} instance.
		 *
		 * @member kceditor.ui.button.handler
		 * @param {Object} definition
		 * @returns {kceditor.ui.button}
		 */
		create: function( definition ) {
			return new kceditor.ui.button( definition );
		}
	};

	/** @class kceditor.ui.button */
	kceditor.ui.button.prototype = {
		/**
		 * Renders the button.
		 *
		 * @param {kceditor.editor} editor The editor instance which this button is
		 * to be used by.
		 * @param {Array} output The output array to which the HTML code related to
		 * this button should be appended.
		 */
		render: function( editor, output ) {
			var modeStates = null;

			function updateState() {
				// "this" is a kceditor.ui.button instance.
				var mode = editor.mode;

				if ( mode ) {
					// Restore saved button state.
					var state = this.modes[ mode ] ? modeStates[ mode ] !== undefined ? modeStates[ mode ] : kceditor.TRISTATE_OFF : kceditor.TRISTATE_DISABLED;

					state = editor.readOnly && !this.readOnly ? kceditor.TRISTATE_DISABLED : state;

					this.setState( state );

					// Let plugin to disable button.
					if ( this.refresh )
						this.refresh();
				}
			}

			var env = kceditor.env,
				id = this._.id = kceditor.tools.getNextId(),
				stateName = '',
				command = this.command,
				// Get the command name.
				clickFn,
				keystroke,
				shortcut;

			this._.editor = editor;

			var instance = {
				id: id,
				button: this,
				editor: editor,
				focus: function() {
					var element = kceditor.document.getById( id );
					element.focus();
				},
				execute: function() {
					this.button.click( editor );
				},
				attach: function( editor ) {
					this.button.attach( editor );
				}
			};

			var keydownFn = kceditor.tools.addFunction( function( ev ) {
				if ( instance.onkey ) {
					ev = new kceditor.dom.event( ev );
					return ( instance.onkey( instance, ev.getKeystroke() ) !== false );
				}
			} );

			var focusFn = kceditor.tools.addFunction( function( ev ) {
				var retVal;

				if ( instance.onfocus )
					retVal = ( instance.onfocus( instance, new kceditor.dom.event( ev ) ) !== false );

				return retVal;
			} );

			var selLocked = 0;

			instance.clickFn = clickFn = kceditor.tools.addFunction( function() {

				// Restore locked selection in Opera.
				if ( selLocked ) {
					editor.unlockSelection( 1 );
					selLocked = 0;
				}
				instance.execute();

				// Fixed iOS focus issue when your press disabled button (https://dev.kceditor.com/ticket/12381).
				if ( env.iOS ) {
					editor.focus();
				}
			} );


			// Indicate a mode sensitive button.
			if ( this.modes ) {
				modeStates = {};

				editor.on( 'beforeModeUnload', function() {
					if ( editor.mode && this._.state != kceditor.TRISTATE_DISABLED )
						modeStates[ editor.mode ] = this._.state;
				}, this );

				// Update status when activeFilter, mode or readOnly changes.
				editor.on( 'activeFilterChange', updateState, this );
				editor.on( 'mode', updateState, this );
				// If this button is sensitive to readOnly state, update it accordingly.
				!this.readOnly && editor.on( 'readOnly', updateState, this );

			} else if ( command ) {
				// Get the command instance.
				command = editor.getCommand( command );

				if ( command ) {
					command.on( 'state', function() {
						this.setState( command.state );
					}, this );

					stateName += ( command.state == kceditor.TRISTATE_ON ? 'on' : command.state == kceditor.TRISTATE_DISABLED ? 'disabled' : 'off' );
				}
			}

			var iconName;

			// For button that has text-direction awareness on selection path.
			if ( this.directional ) {
				editor.on( 'contentDirChanged', function( evt ) {
					var el = kceditor.document.getById( this._.id ),
						icon = el.getFirst();

					var pathDir = evt.data;

					// Make a minor direction change to become style-able for the skin icon.
					if ( pathDir !=  editor.lang.dir )
						el.addClass( 'cke_' + pathDir );
					else
						el.removeClass( 'cke_ltr' ).removeClass( 'cke_rtl' );

					// Inline style update for the plugin icon.
					icon.setAttribute( 'style', kceditor.skin.getIconStyle( iconName, pathDir == 'rtl', this.icon, this.iconOffset ) );
				}, this );
			}

			if ( !command ) {
				stateName += 'off';
			} else {
				keystroke = editor.getCommandKeystroke( command );

				if ( keystroke ) {
					shortcut = kceditor.tools.keystrokeToString( editor.lang.common.keyboard, keystroke );
				}
			}

			var name = this.name || this.command,
				iconPath = null,
				overridePath = this.icon;

			iconName = name;

			// Check if we're pointing to an icon defined by another command. (https://dev.kceditor.com/ticket/9555)
			if ( this.icon && !( /\./ ).test( this.icon ) ) {
				iconName = this.icon;
				overridePath = null;

			} else {
				// Register and use custom icon for button (#1530).
				if ( this.icon ) {
					iconPath = this.icon;
				}
				if ( kceditor.env.hidpi && this.iconHiDpi ) {
					iconPath = this.iconHiDpi;
				}
			}

			if ( iconPath ) {
				kceditor.skin.addIcon( iconPath, iconPath );
				overridePath = null;
			} else {
				iconPath = iconName;
			}

			var params = {
				id: id,
				name: name,
				iconName: iconName,
				label: this.label,
				// .cke_button_expandable enables additional styling for popup buttons (#2483).
				cls:  ( this.hasArrow ? 'cke_button_expandable ' : '' ) + ( this.className || '' ),
				state: stateName,
				ariaDisabled: stateName == 'disabled' ? 'true' : 'false',
				title: this.title + ( shortcut ? ' (' + shortcut.display + ')' : '' ),
				ariaShortcutSpace: shortcut ? '&nbsp;' : '',
				ariaShortcut: shortcut ? editor.lang.common.keyboardShortcut + ' ' + shortcut.aria : '',
				titleJs: env.gecko && !env.hc ? '' : ( this.title || '' ).replace( "'", '' ),
				hasArrow: typeof this.hasArrow === 'string' && this.hasArrow || ( this.hasArrow ? 'true' : 'false' ),
				keydownFn: keydownFn,
				focusFn: focusFn,
				clickFn: clickFn,
				style: kceditor.skin.getIconStyle( iconPath, ( editor.lang.dir == 'rtl' ), overridePath, this.iconOffset ),
				arrowHtml: this.hasArrow ? btnArrowTpl.output() : '',
				hasArrowAriaHtml: this.hasArrow ? ' aria-expanded="false"' : '',
				toggleAriaHtml: this.isToggle ? 'aria-pressed="false"' : ''
			};

			btnTpl.output( params, output );

			if ( this.onRender )
				this.onRender();

			return instance;
		},

		/**
		 * Sets the button state.
		 *
		 * @param {Number} state Indicates the button state. One of {@link kceditor#TRISTATE_ON},
		 * {@link kceditor#TRISTATE_OFF}, or {@link kceditor#TRISTATE_DISABLED}.
		 */
		setState: function( state ) {
			if ( this._.state == state )
				return false;

			this._.state = state;

			var element = kceditor.document.getById( this._.id );

			if ( element ) {
				element.setState( state, 'cke_button' );
				element.setAttribute( 'aria-disabled', state == kceditor.TRISTATE_DISABLED );

				if ( this.isToggle && !this.hasArrow ) {
					// Note: aria-pressed attribute should not be added to menuButton instances. (https://dev.kceditor.com/ticket/11331).
					// For other buttons, do not remove the attribute, instead set its value (#2444).
					element.setAttribute( 'aria-pressed', state === kceditor.TRISTATE_ON );
				}

				return true;
			} else {
				return false;
			}
		},

		/**
		 * Gets the button state.
		 *
		 * @returns {Number} The button state. One of {@link kceditor#TRISTATE_ON},
		 * {@link kceditor#TRISTATE_OFF}, or {@link kceditor#TRISTATE_DISABLED}.
		 */
		getState: function() {
			return this._.state;
		},

		/**
		 * Returns this button's {@link kceditor.feature} instance.
		 *
		 * It may be this button instance if it has at least one of
		 * `allowedContent` and `requiredContent` properties. Otherwise,
		 * if a command is bound to this button by the `command` property, then
		 * that command will be returned.
		 *
		 * This method implements the {@link kceditor.feature#toFeature} interface method.
		 *
		 * @since 4.1.0
		 * @param {kceditor.editor} Editor instance.
		 * @returns {kceditor.feature} The feature.
		 */
		toFeature: function( editor ) {
			if ( this._.feature )
				return this._.feature;

			var feature = this;

			// If button isn't a feature, return command if is bound.
			if ( !this.allowedContent && !this.requiredContent && this.command )
				feature = editor.getCommand( this.command ) || feature;

			return this._.feature = feature;
		}
	};

	/**
	 * Adds a button definition to the UI elements list.
	 *
	 *		editorInstance.ui.addButton( 'MyBold', {
	 *			label: 'My Bold',
	 *			command: 'bold',
	 *			toolbar: 'basicstyles,1'
	 *		} );
	 *
	 * @member kceditor.ui
	 * @param {String} name The button name.
	 * @param {Object} definition The button definition.
	 * @param {String} definition.label The textual part of the button (if visible) and its tooltip.
	 * @param {String} definition.command The command to be executed once the button is activated.
	 * @param {String} definition.toolbar The {@link kceditor.config#toolbarGroups toolbar group} into which
	 * the button will be added. An optional index value (separated by a comma) determines the button position within the group.
	 * @param {String} definition.icon The path to a custom icon or icon name registered by another plugin. Custom icon paths
	 * are supported since the **4.9.0** version.
	 *
	 * To use icon registered by another plugin, icon parameter should be used like:
	 *
	 * 		editor.ui.addButton( 'my_button', {
	 * 			icon: 'Link' // Uses link icon from Link plugin.
	 * 		} );
	 *
	 * If the plugin provides a HiDPI version of an icon, it will be used for HiDPI displays (so defining `iconHiDpi` is not needed
	 * in this case).
	 *
	 * To use a custom icon, the path to the icon should be provided:
	 *
	 * 		editor.ui.addButton( 'my_button', {
	 * 			icon: 'assets/icons/my_button.png'
	 * 		} )
	 *
	 * This icon will be used for both standard and HiDPI displays unless `iconHiDpi` is explicitly defined.
	 * **Important**: KCEditor will resolve relative paths based on {@link kceditor#basePath}.
	 * @param {String} definition.iconHiDpi The path to the custom HiDPI icon version. Supported since **4.9.0** version.
	 * It will be used only in HiDPI environments. The usage is similar to the `icon` parameter:
	 *
	 * 		editor.ui.addButton( 'my_button', {
	 * 			iconHiDpi: 'assets/icons/my_button.hidpi.png'
	 * 		} )
	 * @param {String/Boolean} definition.hasArrow If Boolean, it indicates whether the button should have a dropdown. If a string, it acts
	 * as a value of the button's `aria-haspopup` attribute. Since **4.11.0** it supports the string as a value.
	 * @param {Boolean} [definition.isToggle=false] Indicates if the button should be treated as a toggle one
	 * (button that can be switched on and off, e.g. the "Bold" button). This option is supported since the **4.19.0** version.
	 */
	kceditor.ui.prototype.addButton = function( name, definition ) {
		this.add( name, kceditor.UI_BUTTON, definition );
	};

} )();
