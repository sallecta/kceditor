kceditor.plugins.add( 'about', {
	requires: 'dialog',
	lang: 'en,ru',
	icons: 'about',
	hidpi: true,
	init: function( editor ) {
		var command = editor.addCommand( 'about', new kceditor.dialogCommand( 'about' ) );
		command.modes = { wysiwyg: 1, source: 1 };
		command.canUndo = false;
		command.readOnly = 1;

		editor.ui.addButton && editor.ui.addButton( 'About', {
			label: editor.lang.about.dlgTitle,
			command: 'about',
			toolbar: 'about'
		} );

		kceditor.dialog.add( 'about', this.path + 'dialogs/about.js' );
	}
} );
