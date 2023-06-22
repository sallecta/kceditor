/**
 * @license GPL / LGPL / MPL
 * For licensing, see LICENSE.md or https://github.com/sallecta/kceditor/blob/main/LICENSE.md
 */

kceditor.dialog.add( 'about', function( editor ) {
	var lang = editor.lang.about,
		imagePath = kceditor.getUrl( kceditor.plugins.get( 'about' ).path + 'dialogs/' + ( kceditor.env.hidpi ? 'hidpi/' : '' ) + 'logo_kceditor.png' );

	return {
		title: lang.dlgTitle,
		minWidth: 390,
		minHeight: 210,
		contents: [ {
			id: 'tab1',
			label: '',
			title: '',
			expand: true,
			padding: 0,
			elements: [
				{
					type: 'html',
					html: '<style type="text/css">' +
						'.cke_about_container' +
						'{' +
							'color:#000 !important;' +
							'padding:10px 10px 0;' +
							'margin-top:5px' +
						'}' +
						'.cke_about_container p' +
						'{' +
							'margin: 0 0 10px;' +
						'}' +
						'.cke_about_container .cke_about_logo' +
						'{' +
							'height:81px;' +
							'background-color:#fff;' +
							'background-image:url(' + imagePath + ');' +
							( kceditor.env.hidpi ? 'background-size:194px 58px;' : '' ) +
							'background-position:center; ' +
							'background-repeat:no-repeat;' +
							'margin-bottom:10px;' +
						'}' +
						'.cke_about_container a' +
						'{' +
							'cursor:pointer !important;' +
							'color:#00B2CE !important;' +
							'text-decoration:underline !important;' +
						'}' +
						'.cke_about_container > p,' +
						'.cke_rtl .cke_about_container > p' +
						'{' +
							'text-align:center;' +
						'}' +
						'</style>' +
						'<div class="cke_about_container">' +
						'<div class="cke_about_logo"></div>' +
						'<p>' +
							'KCEditor ' + kceditor.version + ' (revision ' + kceditor.revision + ')<br>' +
							'<a target="_blank" rel="noopener noreferrer" href="https://github.com/sallecta/kceditor/">https://github.com/sallecta/kceditor</a>' +
						'</p>' +
						'<p>' +
							lang.moreInfo + '<br>' +
							'<a target="_blank" rel="noopener noreferrer" href="https://github.com/sallecta/kceditor/blob/main/LICENSE/">https://github.com/sallecta/kceditor/blob/main/LICENSE/</a>' +
						'</p>' +
						'<p>' +
							lang.copy.replace( '$1', '<a target="_blank" rel="noopener noreferrer" href="https://github.com/sallecta/kceditor/">KCEditor</a>' ) +
						'</p>' +
						'</div>'
				}
			]
		} ],
		buttons: [ kceditor.dialog.cancelButton ]
	};
} );
