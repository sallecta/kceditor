/**
 * @license GPL / LGPL / MPL
 * For licensing, see https://github.com/sallecta/kceditor/blob/main/LICENSE
 */

kceditor.editorConfig = function( config ) {
	
	// %REMOVE_START%
	// The configuration options below are needed when running  KCEditor from source files.
	config.plugins = 'dialogui,dialog,about,button,toolbar,enterkey,floatingspace,wysiwygarea,undo,sourcearea';
	config.skin = 'moono-lisa';
	// %REMOVE_END%

	// Define changes to default configuration here.
	// For complete reference see:
	// https://github.com/sallecta/kceditor/docs/ckeditor4/latest/api/kceditor_config.html

	// The toolbar groups arrangement, optimized for a single toolbar row.
	config.toolbarGroups = [
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'forms' },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'tools' },
		{ name: 'others' },
		{ name: 'about' }
	];

	// The default plugins included in the basic setup define some buttons that
	// are not needed in a basic editor. They are removed here.
	//config.removeButtons = 'Undo,Redo';

	// Dialog windows are also simplified.
	config.removeDialogTabs = 'link:advanced';
};
