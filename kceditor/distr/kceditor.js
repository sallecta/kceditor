kceditor = {};
/* (Base 36 value of each component of YYMMDDHH - 4 chars total - 
e.g. 87bm == 08071122) 
*/
kceditor.timestamp = '';

kceditor.version = '1.0.2';

kceditor.revision = '0';

kceditor.dom = {};

if ( window.crypto.getRandomValues )
{
    kceditor.rnd=window.crypto.getRandomValues(new Uint32Array(1));
    kceditor.rnd = kceditor.rnd[0] / (0xffffffff + 1);
    kceditor.rnd= Math.floor(kceditor.rnd * (999 - 100 + 1)) + 100;
	//console.log('kceditor.rnd',kceditor.rnd);
}
else
{
	kceditor.rnd = Math.floor( Math.random() * ( 999 - 100 + 1 ) ) + 100;
}

/* Private object used to hold core stuff */
kceditor._ = 
{
	pending: [],
	basePathSrcPattern: /(^|.*[\\\/])kceditor\.js(?:\?.*|;.*)?$/i
}
/* Private object used to hold core stuff */
kceditor.priv = 
{
	pending: [],
	basePathSrcPattern: /(^|.*[\\\/])kceditor\.js(?:\?.*|;.*)?$/i
}

/*
unloaded: the API is not yet loaded.
basic_loaded: the basic API features are available.
basic_ready: the basic API is ready to load the full core code.
loaded**: the API can be fully used.
 */
kceditor.status = 'unloaded';
 
/* The full URL for the KCEditor installation directory */
kceditor.basePath =
(
	function()
	{
		// Find out the editor directory path, based on its <script> tag.
		var path = window.kceditor_BASEPATH || '';
		
		if ( !path )
		{
			var scripts = document.getElementsByTagName( 'script' );
			for ( var i = 0; i < scripts.length; i++ )
			{
				var match = scripts[ i ].src.match( kceditor.priv.basePathSrcPattern );
		
				if ( match )
				{
					path = match[ 1 ];
					break;
				}
			}
		}
		if ( !path )
		{
			throw 'The KCEditor installation path could not be detected. Try set "kceditor_BASEPATH" before creating editor instances.';
		}
		return path;
	}
)();

/* Gets the full URL for KCEditor resources */
kceditor.getUrl = function( a_resource )
{
	// If this is not a full or absolute path.
	if ( a_resource.indexOf( ':/' ) == -1 && a_resource.indexOf( '/' ) !== 0 )
	{
		a_resource = this.basePath + a_resource;
	}
	a_resource = this.appendTimestamp( a_resource );
	return a_resource;
}

/* Appends {@link kceditor#timestamp} to the provided URL
 as querystring parameter ("t") */
kceditor.appendTimestamp = function( resource )
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

/* Based on the original jQuery code (available under the MIT license */
kceditor.events_joined= {};
kceditor.events= {};
kceditor.events.domReady =
(
	function()
	{
		kceditor.events_joined.domReady=[];
		const joined = kceditor.events_joined.domReady;
		var listener = function()
		{
			try
			{
				// Cleanup functions for the document ready method
				if (document.addEventListener)
				{
					document.removeEventListener('DOMContentLoaded', listener, false);
					window.removeEventListener('load', listener, false);
					run_joined();
				}
				// Make sure body exists.
				else if (document.attachEvent && document.readyState === 'complete')
				{
					document.detachEvent('onreadystatechange', listener);
					window.detachEvent('onload', listener);
					run_joined();
				}
			}
			catch (a_err) { console.warn(a_err); }
		}
		var run_joined = function()
		{
			for (const key in joined)
			{
				//console.log('run_joined',joined[key]);
				joined[key]();
			}
		}
		return function domReady(a_fn)
		{
			if ( !a_fn.name )
			{
				throw new Error('Anonymous function not supported');
			}
			joined.push(a_fn);
			//console.log('adding fn',a_fn.name);
			// Catch cases where this is called after the
			// browser event has already occurred.
			if (document.readyState === 'complete')
			{
				// Handle it asynchronously to allow scripts the opportunity to delay ready
				setTimeout(listener, 1);
			}
			// Run below once on demand only.
			if (joined.length != 1)
			{
				return;
			}
			if (document.addEventListener)
			{
				document.addEventListener('DOMContentLoaded', listener, false);
				window.addEventListener('load', listener, false);
			}
			function scrollCheck()
			{
				try
				{
					document.documentElement.doScroll('left');
				}
				catch (a_err)
				{
					setTimeout(scrollCheck, 1);
					console.warn(a_err); 
					return;
				}
				listener();
			}
		};
	}
)();

/*
The skin to load for all created instances.
kceditor.skinName = 'myskin,/customstuff/myskin/';
skinName='factory'
 */
kceditor.skinName = 
'factory';
 
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

