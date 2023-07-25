/*
Writes "type here" text if editor content is empty
 */
( function() {
	kceditor.plugins.add( 'typehere', {
		
		lang: 'en,ru',
		
		isSupportedEnvironment: function() {
			return !kceditor.env.ie || kceditor.env.version >= 9;
		},

		onLoad: function() {
			kceditor.addCss( kceditor.plugins.typehere.styles );
		},

		init: function( a_editor ) {
			if ( !this.isSupportedEnvironment() || !a_editor.config.typehere ) {
				return;
			}

			bind_event( a_editor, 'contentDom' );
			bind_event( a_editor, 'focus' );
			bind_event( a_editor, 'blur' );

			// Debounce placeholder when typing to improve performance (#5184).
			bind_event( a_editor, 'change', a_editor.config.typehere_delay );
			
			var lang = a_editor.lang.typehere;
			a_editor.config.typehere = lang.typeHere;
		}
	} );

	var ATTRIBUTE_NAME = 'data-cke-typehere';

	/**
	 * Namespace providing the configuration for the Editor Placeholder plugin.
	 *
	 * @singleton
	 * @class kceditor.plugins.typehere
	 * @since 4.15.0
	 * @member kceditor.plugins
	 */
	kceditor.plugins.typehere = {
		/**
		 * Styles that would be applied to the editor by the placeholder text when visible.
		 *
		 * @property {String}
		 */
		styles: '[' + ATTRIBUTE_NAME + ']::before {' +
				'position: absolute;' +
				'opacity: .8;' +
				'color: #aaa;' +
				'content: attr( ' + ATTRIBUTE_NAME + ' );' +
			'}' +
			'.cke_wysiwyg_div[' + ATTRIBUTE_NAME + ']::before {' +
				'margin-top: 1em;' +
			'}'
	};

	function bind_event( editor, eventName, delay ) {
		var toggleFn = typehere_toggle;

		if ( delay ) {
			toggleFn = kceditor.tools.debounce( typehere_toggle, delay );
		}

		editor.on( eventName, toggleFn, null, { editor: editor } );
	}

	function isEditorEmpty( editor ) {
		// We need to include newline in the regex, as htmlwriter returns nicely formatted HTML.
		// We need to also account for <body>'s attributes (#4249).
		var fullPageRegex = /<body.*?>((?:.|[\n\r])*?)<\/body>/i,
			isFullPage = editor.config.fullPage,
			data = editor.getData();

		if ( isFullPage ) {
			var bodyDataMatched = data.match( fullPageRegex );

			// Check if body element exists in editor HTML (#4253).
			if ( bodyDataMatched && bodyDataMatched.length > 1 ) {
				data = bodyDataMatched[ 1 ];
			}
		}

		return data.length === 0;
	}

	function typehere_toggle( evt ) {
		var editor = evt.listenerData.editor,
			hasFocus = editor.focusManager.hasFocus,
			editable = editor.editable(),
			txt = editor.config.typehere;

		if ( !isEditorEmpty( editor ) || hasFocus ) {
			return editable.removeAttribute( ATTRIBUTE_NAME );
		}

		editable.setAttribute( ATTRIBUTE_NAME, txt );
	}

	/**
	 * The delay in milliseconds before the typehere is toggled when changing editor's text.
	 *
	 * The main purpose of this option is to improve performance when typing in the editor, so
	 * that the typehere is not updated every time the user types a character.
	 *
	 * @cfg {String} [typehere_delay=150]
	 * @since 4.19.1
	 * @member kceditor.config
	 */
	kceditor.config.typehere_delay = 1150;
	kceditor.config.typehere = 'Type here (global)';
}() );
