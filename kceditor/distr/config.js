/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

kceditor.editorConfig = function( a_config )
{
	a_config.plugins = 'dialogui,dialog,about,button,toolbar,enterkey,floatingspace,wysiwygarea,undo,sourcearea,editortxt,btns';
	a_config.skin = 'factory';
	a_config.toolbarGroups = [
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
	//a_config.removeButtons = 'Cut,Copy,Paste,Undo,Redo,Anchor,Underline,Strike,Subscript,Superscript';
	//a_config.removeDialogTabs = 'link:advanced';
};
