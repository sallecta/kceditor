
// KCEditor run script
var startKCEditor = (function()
{
	//var parentdir='rooot/dir/where/kceditor/listed';
	var parentdir='/media/data/dev/xps/kceditor';
	var parentdir=kceditor.basePath+'../';
	//var parentdir=<?php echo "'".$SITEURL.'/admin/template/js/'."'"; ?>;
	//var editor_el_name = 'post-content';
	var editor_el_name = 'editor';
	var custom_opts =
	{
		customConfig: parentdir+'/custom/config.js',
		//extraPlugins: 'format_buttons',
		//skin : 'getsimple,'+parentdir+'/custom/skins/getsimple/',
	};
	//console.log(['parentdir',parentdir,'custom_opts',custom_opts]);
	if ( kceditor.env.ie && kceditor.env.version < 9 )
	{
		kceditor.tools.enableHtml5Elements( document );
	}
	// The trick to keep the editor in the sample quite small
	// unless user specified own height.
	kceditor.config.height = 150;
	kceditor.config.width = 'auto';
	kceditor.config.contentsCss = parentdir+'/custom/contents.css';
	kceditor.plugins.basePath = parentdir+'/custom/plugins/';
	//kceditor.stylesSet.basePath = '/emm/';
	var wysiwygareaAvailable = isWysiwygareaAvailable();

	return function()
	{
		//var editor; // uncomment for local scope
		editor =  document.getElementById( editor_el_name );
		/* Create classic or inline editor. */
		if ( wysiwygareaAvailable )
		{
			editor = kceditor.replace( editor_el_name, custom_opts );
		}
		else
		{
			console.warn('KCEditor missing wysiwygarea plugin. Using inline mode.');
			editor.setAttribute( 'contenteditable', 'true' );
			editor = kceditor.inline( editor_el_name, custom_opts );
		}
		//isSomePlugin = !!kceditor.plugins.get( 'plugin_name' );
		//if ( true ) { editorElement.setHtml('Sample text.');}
		//console.log('editor element=',editor);
	};
	function isWysiwygareaAvailable()
	{
		// If in development mode, then the wysiwygarea must be available.
		// Split REV into two strings so builder does not replace it :D.
		if ( kceditor.revision == ( '%RE' + 'V%' ) )
		{
			return true;
		}
		return !!kceditor.plugins.get( 'wysiwygarea' );
	}
})();
kceditor.domReady(function(){ startKCEditor(); });
//end KCEditor run script
