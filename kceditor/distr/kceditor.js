
//window.kceditor = (
	//function()
	//{
		//var kceditor = {};
		//if ( window.kceditor_GETURL )
		//{
			//var originalGetUrl = kceditor.getUrl;
			//kceditor.getUrl = function( a_resource )
			//{
				//return window.kceditor_GETURL.call( kceditor, a_resource ) || originalGetUrl.call( kceditor, a_resource );
			//};
		//}
		//return kceditor;
	//}
//)();

kceditor = {};
kceditor.timestamp = '';
/* (Base 36 value of each component of YYMMDDHH - 4 chars total - 
e.g. 87bm == 08071122) 
*/

kceditor.version = '1.0.0';

kceditor.revision = '0';

kceditor.rnd = 
/* Deprecated, use `window.crypto.getRandomValues()` native browser method instead */
Math.floor( Math.random() * ( 999 /*Max*/ - 100 /*Min*/ + 1 ) ) + 100 /*Min*/;

kceditor._ = 
/* Private object used to hold core stuff */
{
	pending: [],
	basePathSrcPattern: /(^|.*[\\\/])kceditor\.js(?:\?.*|;.*)?$/i
}
kceditor.priv = 
/* Private object used to hold core stuff */
{
	pending: [],
	basePathSrcPattern: /(^|.*[\\\/])kceditor\.js(?:\?.*|;.*)?$/i
}

kceditor.status =
/*
unloaded: the API is not yet loaded.
basic_loaded: the basic API features are available.
basic_ready: the basic API is ready to load the full core code.
loaded**: the API can be fully used.
 */
 'unloaded';
 
kceditor.basePath =
/* The full URL for the KCEditor installation directory */
( function()
{
	// Find out the editor directory path, based on its <script> tag.
	var path = window.kceditor_BASEPATH || '';
	
	if ( !path ) {
		var scripts = document.getElementsByTagName( 'script' );
	
		for ( var i = 0; i < scripts.length; i++ ) {
			var match = scripts[ i ].src.match( kceditor.priv.basePathSrcPattern );
	
			if ( match ) {
				path = match[ 1 ];
				break;
			}
		}
	}
	// In IE (only) the script.src string is the raw value entered in the
	// HTML source. Other browsers return the full resolved URL instead.
	if ( path.indexOf( ':/' ) == -1 && path.slice( 0, 2 ) != '//' ) {
		// Absolute path.
		if ( path.indexOf( '/' ) === 0 )
			path = location.href.match( /^.*?:\/\/[^\/]*/ )[ 0 ] + path;
		// Relative path.
		else
			path = location.href.match( /^[^\?]*\/(?:)/ )[ 0 ] + path;
	}
	
	if ( !path )
		throw 'The KCEditor installation path could not be automatically detected. Please set the global variable "kceditor_BASEPATH" before creating editor instances.';
	return path;
	} 
)();

kceditor.getUrl =
/* Gets the full URL for KCEditor resources */
function( a_resource )
{
	// If this is not a full or absolute path.
	if ( a_resource.indexOf( ':/' ) == -1 && a_resource.indexOf( '/' ) !== 0 )
	{
		a_resource = this.basePath + a_resource;
	}
	a_resource = this.appendTimestamp( a_resource );
	return a_resource;
}

kceditor.appendTimestamp = 
/* Appends {@link kceditor#timestamp} to the provided URL
 as querystring parameter ("t") */
function( resource )
{
	if ( !this.timestamp ||
		resource.charAt( resource.length - 1 ) === '/' ||
		( /[&?]t=/ ).test( resource )
	) 
		{
			return resource;
		}
	var concatenateSign = resource.indexOf( '?' ) >= 0 ? '&' : '?';
	return resource + concatenateSign + 't=' + this.timestamp;
};

kceditor.domReady =
/* Based on the original jQuery code (available under the MIT license */
(function()
{
	var callbacks = [];
	function onReady() {
		try {
			// Cleanup functions for the document ready method
			if (document.addEventListener) {
				document.removeEventListener('DOMContentLoaded', onReady, false);
				window.removeEventListener('load', onReady, false);
				executeCallbacks();
			}
			// Make sure body exists, at least, in case IE gets a little overzealous.
			else if (document.attachEvent && document.readyState === 'complete') {
				document.detachEvent('onreadystatechange', onReady);
				window.detachEvent('onload', onReady);
				executeCallbacks();
			}
		} catch (er) {}
	}
	function executeCallbacks() {
		var i;
		while ((i = callbacks.shift()))
			i();
	}
	return function(fn) {
		callbacks.push(fn);
		// Catch cases where this is called after the
		// browser event has already occurred.
		if (document.readyState === 'complete')
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout(onReady, 1);
		// Run below once on demand only.
		if (callbacks.length != 1)
			return;
		// For IE>8, Firefox, Opera and Webkit.
		if (document.addEventListener) {
			// Use the handy event callback
			document.addEventListener('DOMContentLoaded', onReady, false);
			// A fallback to window.onload, that will always work
			window.addEventListener('load', onReady, false);
		}
		// If old IE event model is used
		else if (document.attachEvent) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent('onreadystatechange', onReady);
			// A fallback to window.onload, that will always work
			window.attachEvent('onload', onReady);
			// If IE and not a frame
			// continually check to see if the document is ready
			// use the trick by Diego Perini
			// http://javascript.nwbox.com/IEContentLoaded/
			var toplevel = false;
			try {
				toplevel = !window.frameElement;
			} catch (e) {}
			if (document.documentElement.doScroll && toplevel) {
				scrollCheck();
			}
		}
		function scrollCheck() {
			try {
				document.documentElement.doScroll('left');
			} catch (e) {
				setTimeout(scrollCheck, 1);
				return;
			}
			onReady();
		}
	};

})();


kceditor.skinName = 
/*
The skin to load for all created instances.
kceditor.skinName = 'myskin,/customstuff/myskin/';
skinName='moono-lisa'
 */
'moono-lisa';
 
(
	function()
	{
		if ( kceditor.loader )
		{
			console.log('kceditor.loader');
			kceditor.loader.load( 'kceditor' );
		}
		else
		{
			// Set the script name to be loaded by the loader.
			kceditor._autoLoad = 'kceditor';
			// Include the loader script.
			if ( document.body && ( !document.readyState || document.readyState == 'complete' ) )
			{
				var script = document.createElement( 'script' );
				script.type = 'text/javascript';
				script.src = kceditor.getUrl( 'core/loader.js' );
				document.body.appendChild( script );
			} 
			else
			{
				document.write( '<script type="text/javascript" src="' + kceditor.getUrl( 'core/loader.js' ) + '"></script>' );
			}
		}
	}
)();

