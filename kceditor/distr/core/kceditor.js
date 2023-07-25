/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

/**
 * @fileOverview Contains the third and last part of the {@link kceditor} object
 *		definition.
 */

/** @class kceditor */

// Remove the kceditor.loadFullCore reference defined on kceditor_basic.
delete kceditor.loadFullCore;

/**
 * Stores references to all editor instances created. The name of the properties
 * in this object correspond to instance names, and their values contain the
 * {@link kceditor.editor} object representing them.
 *
 *		alert( kceditor.instances.editor1.name ); // 'editor1'
 *
 * @property {Object}
 */
kceditor.instances = {};

/**
 * The document of the window storing the kceditor object.
 *
 *		alert( kceditor.document.getBody().getName() ); // 'body'
 *
 * @property {kceditor.dom.document}
 */
kceditor.document = new kceditor.dom.document( document );

/**
 * Adds an editor instance to the global {@link kceditor} object. This function
 * is available for internal use mainly.
 *
 * @param {kceditor.editor} editor The editor instance to be added.
 */
kceditor.add = function( editor ) {
	kceditor.instances[ editor.name ] = editor;

	editor.on( 'focus', function() {
		if ( kceditor.currentInstance != editor ) {
			kceditor.currentInstance = editor;
			kceditor.fire( 'currentInstance' );
		}
	} );

	editor.on( 'blur', removeInstance );

	// Remove currentInstance if it's destroyed (#589).
	editor.on( 'destroy', removeInstance );

	kceditor.fire( 'instance', null, editor );

	function removeInstance() {
		if ( kceditor.currentInstance == editor ) {
			kceditor.currentInstance = null;
			kceditor.fire( 'currentInstance' );
		}
	}
};

/**
 * Removes an editor instance from the global {@link kceditor} object. This function
 * is available for internal use only. External code must use {@link kceditor.editor#method-destroy}.
 *
 * @private
 * @param {kceditor.editor} editor The editor instance to be removed.
 */
kceditor.remove = function( editor ) {
	delete kceditor.instances[ editor.name ];
};

( function() {
	var tpls = {};

	/**
	 * Adds a named {@link kceditor.template} instance to be reused among all editors.
	 * This will return the existing one if a template with same name is already
	 * defined. Additionally, it fires the "template" event to allow template source customization.
	 *
	 * @param {String} name The name which identifies a UI template.
	 * @param {String} source The source string for constructing this template.
	 * @returns {kceditor.template} The created template instance.
	 */
	kceditor.addTemplate = function( name, source ) {
		var tpl = tpls[ name ];
		if ( tpl )
			return tpl;

		// Make it possible to customize the template through event.
		var params = { name: name, source: source };
		kceditor.fire( 'template', params );

		return ( tpls[ name ] = new kceditor.template( params.source ) );
	};

	/**
	 * Retrieves a defined template created with {@link kceditor#addTemplate}.
	 *
	 * @param {String} name The template name.
	 */
	kceditor.getTemplate = function( name ) {
		return tpls[ name ];
	};
} )();

( function() {
	var styles = [];

	/**
	 * Adds CSS rules to be appended to the editor document.
	 * This method is mostly used by plugins to add custom styles to the editor
	 * document. For basic content styling the `contents.css` file should be
	 * used instead.
	 *
	 * **Note:** This function should be called before the creation of editor instances.
	 *
	 *		// Add styles for all headings inside editable contents.
	 *		kceditor.addCss( '.cke_editable h1,.cke_editable h2,.cke_editable h3 { border-bottom: 1px dotted red }' );
	 *
	 * @param {String} css The style rules to be appended.
	 * @see kceditor.config#contentsCss
	 */
	kceditor.addCss = function( css ) {
		styles.push( css );
	};

	/**
	 * Returns a string with all CSS rules passed to the {@link kceditor#addCss} method.
	 *
	 * @returns {String} A string containing CSS rules.
	 */
	kceditor.getCss = function() {
		return styles.join( '\n' );
	};
} )();

// Perform global clean up to free as much memory as possible
// when there are no instances left
kceditor.on( 'instanceDestroyed', function() {
	if ( kceditor.tools.isEmpty( this.instances ) )
		kceditor.fire( 'reset' );
} );

// Load the bootstrap script.
kceditor.loader.load( 'bootstrap' ); 

// Tri-state constants.
/**
 * Used to indicate the ON or ACTIVE state.
 *
 * @readonly
 * @property {Number} [=1]
 */
kceditor.TRISTATE_ON = 1;

/**
 * Used to indicate the OFF or INACTIVE state.
 *
 * @readonly
 * @property {Number} [=2]
 */
kceditor.TRISTATE_OFF = 2;

/**
 * Used to indicate the DISABLED state.
 *
 * @readonly
 * @property {Number} [=0]
 */
kceditor.TRISTATE_DISABLED = 0;

/**
 * The editor which is currently active (has user focus).
 *
 *		function showCurrentEditorName() {
 *			if ( kceditor.currentInstance )
 *				alert( kceditor.currentInstance.name );
 *			else
 *				alert( 'Please focus an editor first.' );
 *		}
 *
 * @property {kceditor.editor} currentInstance
 * @see kceditor#event-currentInstance
 */

/**
 * Fired when the kceditor.currentInstance object reference changes. This may
 * happen when setting the focus on different editor instances in the page.
 *
 *		var editor; // A variable to store a reference to the current editor.
 *		kceditor.on( 'currentInstance', function() {
 *			editor = kceditor.currentInstance;
 *		} );
 *
 * @event currentInstance
 */

/**
 * Fired when the last instance has been destroyed. This event is used to perform
 * global memory cleanup.
 *
 * @event reset
 */
