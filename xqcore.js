(function (root, factory) {
    /*global define:false */

    if (typeof define === 'function' && define.amd) {
        define('XQCore', [], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.XQCore = factory();
    }
}(this, function () {
    // 'use strict';

    var deps = [],
        args = Array.prototype.slice.call(arguments);

    var lastCache;
    var require = function(file) {

        if (deps.indexOf(file) !== -1) {
            return args[deps.indexOf(file)];
        }

        if (require.alias && require.alias[file]) {
            file = require.alias[file];
        }

        file = require.resolve(file, this ? this.file : null);

        var module = {
            exports: {},
            file: file
        };

        lastCache = require.cache;
        if (require.cache[file]) {

            if (require.cache[file].obj) {
                return require.cache[file].obj;
            }

            require.cache[file].fn(module, module.exports, require.bind(module));
            require.cache[file].obj = module.exports || {};
            return require.cache[file].obj;
        }
        else {
            throw new Error('Module ' + file + ' not found!');
        }
    };

    require.resolve = function(path, parent) {
        parent = parent || '';

        var resolved = [];
        if (path.charAt(0) === '.') {
            var newPath = parent;
            newPath = newPath.split('/');
            newPath.pop();
            newPath = newPath.concat(path.split('/'));

            newPath.forEach(function(p) {
                if (p === '..') {
                    resolved.pop();
                    return;
                }
                else if (p === '.' || p === '') {
                    return;
                }

                resolved.push(p);
            });

            if (!parent ||parent.charAt(0) === '.') {
                resolved.unshift('.');
            }
        }
        else {
            return path;
        }

        resolved = resolved.join('/');
        if (!/\.js(on)?$/.test(resolved)) {
            resolved += '.js';
        }

        return resolved;
    };

    require.register = function(alias, path, fn) {
        if (arguments.length === 2) {
            fn = path;
            path = alias;
            alias= null;
        }

        require.cache[path] = {fn: fn, calls: 0};
        if (alias) {
            require.alias[alias] = path;
        }
    };

    require.cache = {};
    require.alias = {};

require.alias['jquery'] = 'jquery/dist/jquery.js';
require.register('jquery/dist/jquery.js', function(module, exports, require) { /*!
 * jQuery JavaScript Library v2.2.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:23Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var arr = [];

var document = window.document;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "2.2.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isPlainObject: function( obj ) {
		var key;

		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype || {}, "isPrototypeOf" ) ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android<4.0, iOS<6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {

			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf( "use strict" ) === 1 ) {
				script = document.createElement( "script" );
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {

				// Otherwise, avoid the DOM node creation, insertion
				// and removal by using an indirect global eval

				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE9-11+
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[i] = nidselect + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					// Support: Blackberry 4.6
					// gEBID returns nodes no longer in the document (#6963)
					if ( elem && elem.parentNode ) {

						// Inject the element directly into the jQuery object
						this.length = 1;
						this[ 0 ] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

				// Always skip document fragments
				if ( cur.nodeType < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// Add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// If we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE9-10 only
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	register: function( owner, initial ) {
		var value = initial || {};

		// If it is a node unlikely to be stringify-ed or looped over
		// use plain assignment
		if ( owner.nodeType ) {
			owner[ this.expando ] = value;

		// Otherwise secure it in a non-enumerable, non-writable property
		// configurability must be true to allow the property to be
		// deleted with the delete operator
		} else {
			Object.defineProperty( owner, this.expando, {
				value: value,
				writable: true,
				configurable: true
			} );
		}
		return owner[ this.expando ];
	},
	cache: function( owner ) {

		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return an empty object.
		if ( !acceptData( owner ) ) {
			return {};
		}

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ prop ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :
			owner[ this.expando ] && owner[ this.expando ][ key ];
	},
	access: function( owner, key, value ) {
		var stored;

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase( key ) );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key === undefined ) {
			this.register( owner );

		} else {

			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );

				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;

			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <= 35-45+
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://code.google.com/p/chromium/issues/detail?id=378607
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data, camelKey;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// with the key as-is
				data = dataUser.get( elem, key ) ||

					// Try to find dashed key if it exists (gh-2779)
					// This is for 2.2.x only
					dataUser.get( elem, key.replace( rmultiDash, "-$&" ).toLowerCase() );

				if ( data !== undefined ) {
					return data;
				}

				camelKey = jQuery.camelCase( key );

				// Attempt to get data from the cache
				// with the key camelized
				data = dataUser.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			camelKey = jQuery.camelCase( key );
			this.each( function() {

				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = dataUser.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				dataUser.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf( "-" ) > -1 && data !== undefined ) {
					dataUser.set( this, key, value );
				}
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE9
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE9-11+
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android<4.1, PhantomJS<2
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android<4.1, PhantomJS<2
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0-4.3, Safari<=5.1
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari<=5.1, Android<4.2
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<=11+
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY offsetX offsetY pageX pageY " +
			"screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome<28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android<4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {
	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName( "tbody" )[ 0 ] ||
			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <= 35-45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <= 35-45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );


var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var documentElement = document.documentElement;



( function() {
	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE9-11+
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {
		div.style.cssText =

			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );
	}

	jQuery.extend( support, {
		pixelPosition: function() {

			// This test is executed only once but we still do memoizing
			// since we can use the boxSizingReliable pre-computing.
			// No need to check if the test was already performed, though.
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
			// since that compresses better and they're computed together anyway.
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		},
		reliableMarginRight: function() {

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// This support function is only executed once so no memoizing is needed.
			var ret,
				marginDiv = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			marginDiv.style.cssText = div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;box-sizing:content-box;" +
				"display:block;margin:0;border:0;padding:0";
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			documentElement.appendChild( container );

			ret = !parseFloat( window.getComputedStyle( marginDiv ).marginRight );

			documentElement.removeChild( container );
			div.removeChild( marginDiv );

			return ret;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );
	ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

	// Support: Opera 12.1x only
	// Fall back to style even without computed
	// computed is undefined for elems on document fragments
	if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
		ret = jQuery.style( elem, name );
	}

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// http://dev.w3.org/csswg/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE9-11+
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = dataPriv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {

			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = dataPriv.access(
					elem,
					"olddisplay",
					defaultDisplay( elem.nodeName )
				);
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				dataPriv.set(
					elem,
					"olddisplay",
					hidden ? display : jQuery.css( elem, "display" )
				);
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Support: IE9-11+
			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				style[ name ] = value;
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			dataPriv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show
				// and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = dataPriv.access( elem, "fxshow", {} );
		}

		// Store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done( function() {
				jQuery( elem ).hide();
			} );
		}
		anim.done( function() {
			var prop;

			dataPriv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		} );
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {
	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnotwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ?
		opt.duration : opt.duration in jQuery.fx.speeds ?
			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	window.clearInterval( timerId );

	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: iOS<=5.1, Android<=4.2+
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE<=11+
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: Android<=2.3
	// Options inside disabled selects are incorrectly marked as disabled
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<=11+
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// Handle most common string cases
					ret.replace( rreturn, "" ) :

					// Handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// The jqXHR state
			state = 0,

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {

								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" ).replace( rhash, "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE8-11+
			// IE throws exception if url is malformed, e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE8-11+
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );

				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapAll( html.call( this, i ) );
			} );
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function() {
		return this.parent().each( function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		} ).end();
	}
} );


jQuery.expr.filters.hidden = function( elem ) {
	return !jQuery.expr.filters.visible( elem );
};
jQuery.expr.filters.visible = function( elem ) {

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	// Use OR instead of AND as the element is not visible if either is true
	// See tickets #10406 and #13132
	return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE9
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE9
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win,
			elem = this[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		box = elem.getBoundingClientRect();
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},
	size: function() {
		return this.length;
	}
} );

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));

});
require.register('./xqcore-init.js', function(module, exports, require) { var XQCore = require('./src/xqcore');
XQCore.Promise = require('./src/promise');
XQCore.Logger = require('./src/logger');
XQCore.ReadyState = require('./src/ready-state');
XQCore.Event = require('./src/event');
XQCore.Sync = require('./src/sync');
XQCore.List = require('./src/list');
XQCore.Model = require('./src/model');
XQCore.Presenter = require('./src/presenter');
XQCore.Router = require('./src/router');
XQCore.Service = require('./src/service');
XQCore.SocketConnection = require('./src/socket-connection');
XQCore.Socket = require('./src/socket');
XQCore.SyncList = require('./src/synclist');
XQCore.SyncModel = require('./src/syncmodel');
XQCore.Tmpl = require('./src/tmpl');
XQCore.View = require('./src/view');
XQCore.Component = require('./src/component');

module.exports = XQCore;

});
require.register('./src/xqcore.js', function(module, exports, require) { 'use strict';

/**
 * XQCore core module
 * @module XQCore
 */

/**
 * XQCore main object
 *
 * @package XQcore
 * @type {Object}
 */
var XQCore = {
  /**
   * Contains the current XQCore version
   * @property {String} version
   */
  version: '0.13.1',

  /**
   * Defines a default route
   * @property {String} defaultRoute
   */
  defaultRoute: '/',

  /**
   * Enables html5 routing support
   * @property {Boolean} html5Routes
   * @default false
   */
  html5Routes: false,

  /**
   * Defines a base path of your projewt
   * @type {String}
   */
  basePath: '',

  /**
   * Sets a hashbang for routing. This value is added to each route if html5Routes is set to false
   * @property {String} hashBang
   */
  hashBang: '#!',

  /**
   * Sets the default template engine
   * @property {String} templateEngine
   * @default firetpl
   */
  templateEngine: 'firetpl',

  /**
   * Sets a views directory
   * @property {String} viewsDir
   */
  viewsDir: './views/',

  /**
   * Set the file extension for views
   * @property {String} viewExt
   */
  viewExt: '.fire',

  /**
   * Defines a default socket port
   * @property {Number} socketPort
   * @default 9889
   */
  socketPort: 9889,

  /**
   * Sets max length of event listener
   * @property {Number} eventListenerMaxLength
   * @default  1328
   */
  eventListenerMaxLength: 1328
};


/**
 * Merges the properties from one or more objects together into a target object
 * Its simply an alias for jQuery.extend.
 *
 * @method extend
 * @param {Boolean} [deep] If true, a deep merge is using
 * @param {Object} target Target object. This object will be extended with new properties
 * @param {Object} [object1] Object to merge
 * @param {Object} [objectN] Object to merge
 * @return {Object} Returns the merged target object
 * @example {js}
 * var target = {
 *     a: 'A1',
 *     b: 'B1'
 * }
 *
 * var obj1 = {
 *     b: 'B2',
 *     c: 'C2'
 * }
 *
 * extend(target, obj1);
 * //Returns {a: 'A1', b: 'B2', c: 'C2'}
 *
 */
Object.defineProperty(XQCore, 'extend', {
  enumerable: false,
  configurable: true,
  writable: true,
  value: function(target) {
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert first argument to object');
    }

    var to = Object(target);
    for (var i = 1; i < arguments.length; i++) {
      var nextSource = arguments[i];
      if (nextSource === undefined || nextSource === null) {
        continue;
      }

      nextSource = Object(nextSource);

      var keysArray = Object.keys(nextSource);
      for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
        var nextKey = keysArray[nextIndex];
        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== undefined && desc.enumerable) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }

    return to;
  }
});

/**
 * Checks whether an value is a plain object
 *
 * Tests if an value is an object and was declared with `{}` and it hasn't any prototyped properties
 *
 * @method isPlainObject
 *
 * @param {Object} obj The value which should be checked
 * @returns {Boolean} Returns true if value is a function, otherwise returns false
 */
XQCore.isPlainObject = function(obj) {

};


/**
 * Checks whether an value is a function
 * @method isPlainObject
 *
 * @param {Object} obj The value which should be checked
 * @returns {Boolean} Returns true if value is a plain object, otherwise returns false
 */
XQCore.isFunction = function(fn) {
  return typeof fn === 'function';
}

/**
 * Checks for a valid ObjectId
 *
 * The pattern of an objectId can be overwritten by setting the XQCore.objectIdPattern property
 *
 * @return {Boolean} Returns true if value is an valid objectId
 */
XQCore.isObjectId = function(value) {
  return (/^[a-zA-Z0-9]{24}$/).test(value);
};

/**
 * Set a local for the current session
 *
 * @method setLocale
 * @param  {String}  locale Local string
 */
XQCore.setLocale = function(locale) {
  localStorage.setItem('xqcore.locale', locale);
};

/**
 * Returns a local string
 * @method getLocale
 * @return {[type]}  [description]
 */
XQCore.getLocale = function() {
  var locale = localStorage.getItem('xqcore.locale');
  if (locale) {
    return locale;
  }

  return navigator.language;
};

/**
 * Defines a global log level
 *
 * XQCore has 5 log levels
 *
 * 0 = off
 * 1 = error
 * 2 = warning
 * 3 = info
 * 4 = debug
 * 5 = trace
 *
 * @property {String} logLevel
 */
XQCore.logLevel = 1;

/**
 * Returns one or all queries
 * Converts all numeric items to a Number
 *
 * @method getQuery
 * @param  {String} name Query name
 * @return {Object|String}      Returns all queries or one value.
 */
XQCore.getQuery = function(name) {
  if (!XQCore.__query) {
    XQCore.__query = {};
    location.search.substr(1).split('&').forEach(function(q) {
      q = q.split('=');
      if (q && q[0]) {
        var val = encodeURI(q[1]);
        XQCore.__query[q[0]] = (isNaN(val) ? val : Number(val));
      }
    });
  }

  if (name) {
    return XQCore.__query[name];
  }
  else {
    return XQCore.__query;
  }
};

/**
 * Checks whether an object is an empty object
 * @param  {Object}  obj Object which should be checked
 * @return {Boolean}     Returns true if object is empty
 */
XQCore.isEmptyObject = function(obj) {
  for (var name in obj) { // eslint-disable-line
    return false;
  }
  return true;
};

/**
 * Checks whether an object is an empty object or an empty array
 * @param  {Object|Array}  obj Object which should be checked
 * @return {Boolean}     Returns true if obj is empty
 */
XQCore.isEmpty = function(obj) {
  if (Array.isArray(obj)) {
    return obj.length === 0;
  }

  return XQCore.isEmptyObject(obj);
};

/**
 * Create a component
 */
XQCore.cmp = function(cmpName, property) {
  var cmp = new XQCore.Component(cmpName);
  return cmp;
};

XQCore.registerComponent = function(name, cmp) {
  return XQCore.Component.registerComponent(name, cmp);
};

XQCore.getComponent = function(name, cmp) {
  return XQCore.Component.getComponent(name, cmp);
};

/**
 * Extends XQCore with some usefull functions
 *
 * @module  XQCore.Utils
 */
'use strict';

XQCore.undotify = function(path, obj) {
  if(path) {
    path = path.split('.');
    path.forEach(function(key) {
      obj = obj ? obj[key] : undefined;
    });
  }

  return obj;
};

/**
 * Creates a object from an dotified key and a value
 *
 * @public
 * @method dedotify
 *
 * @param {Object} obj Add new value to obj. This param is optional.
 * @param {String} key The dotified key
 * @param {Any} value The value
 *
 * @returns {Object} Returns the extended object if obj was set otherwis a new object will be returned
 */
XQCore.dedotify = function(obj, key, value) {

  if (typeof obj === 'string') {
    value = key;
    key = obj;
    obj = {};
  }

  var newObj = obj;

  if(key) {
    key = key.split('.');
    var len = key.length;
    key.forEach(function(k, i) {
      if (i === len - 1) {
        if (/\[\]$/.test(k)) {
          k = k.substr(0, k.length - 2);
          if (!obj[k]) {
            obj[k] = [];
          }
          obj[k].push(value);
          return;
        }

        obj[k] = value;
        return;
      }

      if (!obj[k]) {
        obj[k] = {};
      }

      obj = obj[k];
    });
  }

  obj = value;

  return newObj;
};

/**
 * Creates a unique id
 *
 * @param {Number} len (Optional) String length. Defaults to 7
 * @returns {String} Unique string
 */
XQCore.uid = function(len) {
  len = len || 7;
  var str = '';

  while (str.length < len) {
    var part = Math.random().toString(36).substr(2);
    str += part;
  }

  return str.substr(0, len);
};

/**
 * Returns a promise object
 *
 * the returning object has two extra methods
 *
 * `resolve` to resolv the promise
 * `reject` to reject the promise
 *
 * If callback is set it will be called, when promise will be resolved or rejected.
 * Gets the reject data as first argument and the resolve data as second argument
 *
 * @example {js}
 * var promise = XQCore.promise();
 * promise.then(function() {
 *     console.log('Resolve');
 * });
 *
 * setTimeout(function() {
 *     promise.resolve();
 * }, 100);
 *
 * @method promise
 * @param  {Function} [callback] Callback function, to be called on resolv or rejecting the promise
 * @return {Object} Returns a promise object
 */
XQCore.promise = function(callback) {

  var s, r;
  var promise = new XQCore.Promise(function(resolve, reject) {
    s = resolve;
    r = reject;
  });

  promise.resolve = function(data) {
    s(data);
    if (typeof callback === 'function') {
      callback(null, data);
    }

    return promise;
  };

  promise.reject = function(data) {
    r(data);
    if (typeof callback === 'function') {
      callback(data);
    }

    return promise;
  };

  var chain = [];

  promise.push = function(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Could not create a promise chain! First arg is not a function in promise.push().');
    }

    chain.push(fn);
    return this;
  };

  promise.each = function(data) {
    var p = chain.shift();
    if (!p) {
      promise.resolve(data);
      return;
    }

    p(data).then(function(data) {
      promise.each(data);
    }).catch(function(err) {
      promise.reject(err);
    });

    return promise;
  };

  return promise;
};

/**
 * Walks recursive through a nested object tree
 * @param  {object|array}  tree Tree object
 * @param  {Function} fn   Call function on each item
 * @return {object|array}  Returns a resolved tree response
 */
XQCore.recurse = function(tree, fn) {
  var res;
  var i;
  if (Array.isArray(tree)) {
    res = [];

    for (i = 0; i < tree.length; i++) {
       res.push(fn(tree[i], function(data) {
         return XQCore.recurse(data, fn)
       }));
    }

    return res;
  }
  else if (tree && typeof tree === 'object') {
    var keys = Object.keys(tree);
    res = {};

    for (i = 0; i < keys.length; i++) {
       res[keys]= fn(tree[keys[i]], fn);
    }

    return res;
  }

};

XQCore.assign = Object.assign || function(target) {
  'use strict';
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  target = Object(target);
  for (var index = 1; index < arguments.length; index++) {
    var source = arguments[index];
    if (source != null) {
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
  }
  return target;
};

/**
 * Registers a route listener and couples a presenter to it
 *
 * Calls presenter.active() if changed route is route
 * and calls presenter.inactive() on all other route changes if presenter is active
 *
 * @method function
 * @param {string} route Route
 * @param {function} cb Callback function. Gets a presenter instance as its first argument
 *
 * @returns {object} Returns a presenter
 *
 * @example {js}
 * XQCore.route('/foo', function(self) {
 *   self.active = function(route) {
 *   	 console.log('Route /foo called', router);
 *   };
 * });
 */
XQCore.route = function(route, fn) {
  var routeName = 'route' + route;
  var presenter = new XQCore.Presenter(routeName, fn);
  presenter.path = route;
  presenter.route(route, function(router) {
    presenter.active(router);
  });

  return presenter;
};

//--

module.exports = XQCore;

});
require.register('./src/promise.js', function(module, exports, require) { 'use strict';

var Promise = function(fn) {
  this._fullFillFuncs = [];
  this._rejectsFuncs = [];
  this.state = 'pending';
  this.value = null;

  this.onFullFill = function(value) {
    this.state = 'fulfilled';
    this.value = value;
    this._fullFillFuncs.forEach(function(fn) {
      fn(value);
    });
  }.bind(this);

  this.onReject = function(reason) {
    this.state = 'rejected';
    this.reason = reason;
    this._rejectsFuncs.forEach(function(fn) {
      fn(reason);
    });
  }.bind(this);

  fn(this.onFullFill, this.onReject);
};

Promise.resolve = function(value) {
  var promise = new Promise(function(resolve) {
    resolve(value);
  });

  return promise;
};

Promise.reject = function(reason) {
  var promise = new Promise(function(resolve, reject) {
    reject(reason);
  });

  return promise;
};

Promise.prototype.then = function(fn) {
  if (this.state === 'pending') {
    this._fullFillFuncs.push(fn);
  }
  else if (this.state === 'fulfilled') {
    fn(this.value);
  }
  return this;
};

Promise.prototype.catch = function(fn) {
  if (this.state === 'pending') {
    this._rejectsFuncs.push(fn);
  }
  else if (this.state === 'rejected') {
    fn(this.reason);
  }
  return this;
};

//--

module.exports = Promise;

});
require.register('./src/logger.js', function(module, exports, require) { /**
 * XQCore Logger module
 *
 * Produces logging output to the browser console. This module is in all XQCore modules as var `log` available.
 * It is not necessary to instantiate it. The logger module has 5 logging levels: `ERROR, WARN, INFO, DEBUG`.
 * The log-levels can be controlled by setting it globally by setting the XQCore.logLevel property,
 * or locally for each module by change the log.logLevel property. The locally property overrides the globally property
 * for the current module.
 *
 * @module XQCore.Logger
 *
 */

'use strict';

/**
 * XQCore Logger is a logging module to log messages, warnings, errors to the browser console
 *
 * @constructor
 * @version 1.0.0
 *
 * @param {String} name Logger name (Optional)
 *
 * @example {js}
 * var log = new XQCore.Logger('myLog');
 * log.log('Hello World');
 *
 * //Logs this to the console: [myLog] Hello World
 *
 * var log2 = new XQCore.Logger();
 * log2.log('Hello World');
 *
 * //Logs this to the console: Hello World
 *
 *
 */
var Logger = function(name) {
  this.loggerName = name;
  this.logLevel = 1;
};

/**
 * Log level constan `ERROR`
 * @const ERROR
 * @version 1.0.0
 */
 Logger.ERROR = 1;

/**
 * Log level constan `WARN`
 * @const WARN
 * @version 1.0.0
 */
 Logger.WARN = 2;

/**
 * Log level constan `INFO`
 * @const INFO
 * @version 1.0.0
 */
 Logger.INFO = 3;

/**
 * Log level constan `DEBUG`
 * @const DEBUG
 * @version 1.0.0
 */
 Logger.DEBUG = 4;


/**
 * Sets a loglevel
 *
 * @method setLevel
 * @version 1.0.0
 *
 * @param  {number|sstring} level Loglevel
 *
 * @example {js}
 * var log = new XQCore.Logger('mylogger');
 * log.setLevel(2); // sets log level to `info`
 */
Logger.prototype.setLevel = function(level) {
  if (typeof level === 'string') {
    level = Logger[level.toUpperCase()];
  }

  if (typeof level === 'number' && level > 0 && level < 5) {
    this.logLevel = level;
  }
}

/**
 * Logs a message to the console.
 *
 * To log a message of this type a minimum logLevel of INFO is required.
 * Only the first given argument will be logged if log level is set to INFO.
 * To log all arguments, log level must be set to DEBUG.
 *
 * This method can have multiple arguments!
 *
 * @method info
 * @version 1.0.0
 *
 * @param  {any} ...args Log args. Logs all args to the console, seperated by a space.
 *
 * @example {js}
 * log.setLevel('info');
 * log.info('Write to console', {test: '123'});
 *
 * @param {Any} msg logs all arguments to the console
 */
Logger.prototype.info = function() {
  var args;
  if (this.logLevel >= Logger.INFO) {
    args = Array.prototype.slice.call(arguments);

    if (this.loggerName) {
      args.unshift('[' + this.loggerName + ']');
    }

    console.log.apply(console, args); // eslint-disable-line
  }
};

Logger.prototype.log = Logger.prototype.info;

/**
 * Logs a warning message to the console.
 *
 * To log a warning message of this type a minimum logLevel of WARNING is required.
 *
 * This method can have multiple arguments!
 *
 * @method warn
 * @version 1.0.0
 *
 * @param  {any} ...args Logs all args to the console, seperated by a space.
 *
 * @example {js}
 * log.setLevel('warn');
 * log.warn('Unvalid number', {test: '123'});
 *
 * @param {Any} msg logs all arguments to the console
 */
Logger.prototype.warn = function() {
  var args;
  if (this.logLevel >= Logger.WARN) {
    args = Array.prototype.slice.call(arguments);
    if (this.loggerName) {
      args.unshift('[' + this.loggerName + ']');
    }

    console.warn.apply(console, args); // eslint-disable-line
  }
};

/**
 * Logs a error message to the console.
 *
 * To log a error message of this type a minimum logLevel of WARNING is required.
 *
 * This method can have multiple arguments!
 *
 * @method error
 * @version 1.0.0
 *
 * @param  {any} ...args Logs all args to the console, seperated by a space.
 *
 * @example {js}
 * log.logLevel = 1; //ERROR
 * log.error('Unvalid number', {test: '123'});
 */
Logger.prototype.error = function() {
  var args;
  if (this.logLevel >= Logger.ERROR) {
    args = Array.prototype.slice.call(arguments);
    if (this.loggerName) {
      args.unshift('[' + this.loggerName + ']');
    }

    console.error.apply(console, args); // eslint-disable-line
  }
};

/**
 * Logs a debug message to the console.
 *
 * To log a debug message of this type a minimum logLevel of DEBUG is required.
 * Only the first given argument will be logged if log level is set to DEBUG.
 * To log all arguments, log level must be set to TRACE.
 *
 * This method can have multiple arguments!
 *
 * @method debug
 * @version 1.0.0
 *
 * @param  {any} ...args Logs all args to the console, seperated by a space.
 *
 * @example {js}
 * log.setLevel('debug');
 * log.debug('Write to console', {test: '123'});
 */
Logger.prototype.debug = function() {
  var args;
  if (this.logLevel >= Logger.DEBUG) {
    args = Array.prototype.slice.call(arguments);

    if (this.loggerName) {
      args.unshift('[' + this.loggerName + ']');
    }

    console.debug.apply(console, args); // eslint-disable-line
  }
};

/**
 * Logs a log message to the console. This is just an alias for log
 *
 * @method info
 */
Logger.prototype.info = Logger.prototype.log;

/**
 * Start a timeTracer
 *
 * @method timer
 * @version 1.0.0
 * 
 * @param {String} timerName Set the name for your (Optional)
 * @return {Object} Returns a TimerObject
 */
Logger.prototype.timer = function(name) {
  var self = this;

  var timer = {
    start: null,
    stop: null,
    name: name,
    logger: this,
    end: function() {
      this.stop = Date.now();
      this.logger.log('Timer ' + name + ' finished after ' + self.getHumanTime(this.stop - this.start));
    }
  };

  /*if (name) {
    this.timerStore[name] = timer;
  }*/

  this.log('Start Timer ' + name);

  //Set timer start time
  timer.start = Date.now();
  return timer;
};

/**
 * Returns a human readable time format
 * @method getHumanTime
 * @private
 * @param  {Number}     time Time in milliseconds
 * @return {String}          Returns a readable time string
 */
Logger.prototype.getHumanTime = function(time) {
  if (time < 1000) {
    return time + 'ms';
  }
  else if (time < 60000) {
    return (Math.round(time / 100) / 10) + 'sec';
  }
  else {
    return (Math.round(time / 60000)) + 'min ' + Math.round(time % 60000 / 1000) + 'sec';
  }
};

//--

module.exports = Logger;

});
require.register('./src/ready-state.js', function(module, exports, require) { /**
 * XQCore ReadyState module
 *
 * Holds a function call until a state becomes ready
 *
 * @package XQCore
 * @module ReadyState
 */
'use strict';

var ReadyState = function() {
  this.__isReady = false;
  this.__readyFuncs = [];
};

/**
 * Wait till view is ready
 *
 * @method ready
 * @param {Function} fn FUnction to be called if state becomes ready
 */
ReadyState.prototype.ready = function(fn) {
  if (this.__isReady) {
    fn.call(this);
  }
  else {
    this.__readyFuncs.push(fn);
  }
};

/**
 * Sets a state ready and calls all retained functions
 *
 * @method setReady
 */
ReadyState.prototype.setReady = function() {
  var self = this;

  this.__isReady = true;

  if (this.__readyFuncs) {
    this.__readyFuncs.forEach(function(fn) {
      fn.call(self);
    });
    this.__readyFuncs = [];
  }
};

/**
 * Unsets a ready state
 *
 * @method unsetReady
 */
ReadyState.prototype.unsetReady = function() {
  this.__isReady = false;
};

//--

module.exports = ReadyState;

});
require.register('./src/event.js', function(module, exports, require) { /**
* XQCore EventEmitter
*
* A powerfull event emitter
*
* @module XQCore.EventEmitter
*
* @example {js}
* var ee = new XQCore.EventEmitter();
* ee.on('echo', function(msg) {
*     console.log('Msg:', msg);
* });
*
* //Emit an event
* ee.emit('echo', 'Hello World!');
*
* @example {js}
* var MyModule = function() {
*     //Call EventEmitter constructor
*     XQCore.EventEmitter.call(this);
* };
*
* //Extend MyModule with event emitter methods
* XQCore.extend(MyModule.prototype, XQCore.EventEmitter.prototype);
*/

'use strict';

var XQCore = require('./xqcore');
var Logger = require('./logger');

var log;

/**
 * An EventListener represents a single event.
 *
 * Each event registration is an instance of EventListener
 *
 * @constructor
 * @group XQCore.EventEmitter.EventListener
 * @private
 * @method  EventListener
 */
var EventListener = function(ee, event, fn) {
  this.fn = fn;
  this.calls = 0;
  this.once = false;

  /**
   * Removes this event listener
   * @group XQCore.EventEmitter.EventListener
   * @private
   * @method remove
   * @return {Boolean} Returns true if event was removed
   */
  this.remove = function() {
    ee.off(event, fn);
  };
};

/**
 * EventEmitter emitter constructor
 *
 * @constructor
 * @method EventEmitter
 */
var EventEmitter = function() {
  log = new Logger('EventEmitter');
  log.setLevel(XQCore.logLevel);

  this.__events = {};
  this.__logger = log;

  /**
   * Sets max length of event listeners
   * @property {Number} maxLength
   */
  this.maxLength = XQCore.eventListenerMaxLength;
};

/**
 * Registers an event listener
 * @method on
 * @param  {String}   event EventEmitter name
 * @param  {Function} fn    EventEmitter function
 * @return {Object}         Returns an EventListener instance
 */
EventEmitter.prototype.on = function(event, fn) {
  var listener = new EventListener(this, event, fn);
  if (!this.__events[event]) {
    this.__events[event] = [];
  }

  this.__events[event].push(listener);
  if (this.__events[event].length > this.maxLength) {
    log.warn('Listener max length was exceeded!', 'List:', event, 'Length:', this.__events[event].length);
  }
  else {
    log.info('Register new `' + event + '` event');
  }

  return listener;
};

/**
 * Registers an once event listener. This listener is called only once a time.
 *
 * @method once
 * @param  {event}  event  EventEmitter name
 * @param  {Function} fn    EventEmitter function
 * @return {Object}         Returns an EventListener instance
 */
EventEmitter.prototype.once = function(event, fn) {
  var args = Array.prototype.slice.call(arguments);
  var listener = this.on.apply(this, args);
  listener.once = true;
  return listener;
};

/**
 * Emits an event
 * @method emit
 * @param  {String} event EventEmitter name
 * @param  {Any} data  EventEmitter data, you can use multiple args here
 * @return {Number}    Returns the number of emited events
 */
EventEmitter.prototype.emit = function(event, data) {
  if (!this.__events[event]) {
    log.info('Emit `' + event + '` event failed! No listener of this type are registered');
    return 0;
  }

  var args = Array.prototype.slice.call(arguments, 1),
    len = this.__events[event].length;

  for (var i = len - 1; i >= 0; i--) {
    var listener = this.__events[event][i];
    listener.fn.apply(this, args);
    listener.calls++;
    if (listener.once === true) {
      this.__events[event].splice(i, 1);
    }
  }

  if (len) {
    log.info('Emit `' + event + '` event to', len, 'listener');
    log.debug(' ... data:', data);
  }

  return len;
};

/**
 * Unregisters events
 *
 * @method off
 * @param  {String}  event  EventEmitter name
 * @param  {Function}  [fn]  EventEmitter function. If this property is set only that function will be removed. Otherwis all events of this name will be removed
 * @return {Number} Returns the number of removed events
 */
EventEmitter.prototype.off = function(event, fn) {
  var removed = 0;

  if (!this.__events[event]) {
    log.info('Unregister events failed! No `' + event + '` events were found!');
    return 0;
  }

  if (fn) {
    var len = this.__events[event].length;
    for (var i = 0; i < len; i++) {
      var listener = this.__events[event][i];
      if (listener && listener.fn === fn) {
        this.__events[event].splice(i, 1);
        removed++;
        //Do not break at this point, to remove duplicated events

        if (this.__events[event].length === 0) {
          delete this.__events[event];
        }
      }
    }
  }
  else {
    removed = this.__events[event].length;
    delete this.__events[event];
  }

  log.info('Unregister `' + event + '` events!', 'Removed ' + removed + ' listener');
  return removed;
};

/**
 * Removes all registered events
 * @method clear
 * @return {Number} Returns the number of removed events
 */
EventEmitter.prototype.clearEvents = function() {
  this.__events = {};
};

//--

module.exports = EventEmitter;

});
require.register('./src/sync.js', function(module, exports, require) { /**
 * XQCore Sync module
 *
 * @package XQCore
 * @module Sync
 */
'use strict';

var $ = require('jquery');
var XQCore = require('./xqcore');
var Promise = require('./promise');

var Sync = function() {
  /**
   * Sets a server URI
   *
   * This URI is used by all send methods as default server URI
   * @property {String} server
   */
  this.server = null;

};

/**
 * Called on before sending an ajax request
 * You can use this function to manipulate all data they be send to the server
 *
 * @param {Object} data The data to send to the server
 * @return {Object} data
 */
Sync.prototype.onSend = function(data) {
  return data;
};

/**
 * Send an ajax request to the webserver.
 *
 * You must set the server URI first with model.server = 'http://example.com/post'
 *
 * @param {String} Method send method, GET, POST, PUT, DELETE (default POST)
 * @param {String} url Server URL (optional, then model.server must be set)
 * @param {Object} data The data to sent to the server
 * @param {Function} callback Calls callback(err, data, status, jqXHR) if response was receiving
 */
Sync.prototype.send = function(method, url, data, callback) {
  var self = this;

  if (typeof url === 'object') {
    callback = data;
    data = url;
    url = this.server;
  }
  else if (typeof data === 'function') {
    callback = data;
    data = this.toJSON ? this.toJSON() : null;
  }
  else if (data === undefined) {
    data = this.toJSON ? this.toJSON() : null;
  }

  if (method === undefined) {
    method = 'POST';
  }

  if (!url) {
    url = this.server;
  }

  if (method === 'GET' && Array.isArray(data)) {
    url = url.replace(/\/$/, '') + '/' + data.join('/');
    data = null;
  }

  //Handle onSend
  if (typeof this.onSend === 'function') {
    data = this.onSend.call(this, data);
  }

  this.log('Send an ajax call to ', url, 'with data: ', data);
  this.state('syncing');

  var promise = new Promise(function(resolve, reject) {
    $.ajax({
      url: url,
      type: method,
      data: XQCore.isEmpty(data) ? null : JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        'Accept': 'application/json'
      },
      success: function(data, status, jqXHR) {
        if (typeof callback === 'function') {
          callback.call(self, null, data, status, jqXHR);
        }
        self.state('success');
        resolve(data);
      },
      error: function(jqXHR, status, error) {
        if (typeof callback === 'function') {
          callback.call(self, {
            type: status,
            http: error
          }, null, status, jqXHR);
        }
        self.state('failed');
        reject({
          type: status,
          http: error
        });
      }
    });
  });

  return promise;
};

/**
 * Sends a POST to the Datastore
 *
 * @param {String} url Server URL (optional, then model.server must be set)
 * @param  {Object}   data     Dato to sending
 * @param  {Function} callback Calling on response
 *
 * callback: void function(err, data, status, jqXHR)
 *
 */
Sync.prototype.sendPOST = function(url, data, callback) {
  return this.send('POST', url, data, callback);
};

/**
 * Sends a GET to the Datastore
 *
 * @param {String} url Server URL (optional, then model.server must be set)
 * @param  {Object}   data     Dato to sending
 * @param  {Function} callback Calling on response
 *
 * callback: void function(err, data, status, jqXHR)
 *
 */
Sync.prototype.sendGET = function(url, data, callback) {
  return this.send('GET', url, data, callback);
};

/**
 * Sends a PUT to the Datastore
 *
 * @param {String} url Server URL (optional, then model.server must be set)
 * @param  {Object}   data     Dato to sending
 * @param  {Function} callback Calling on response
 *
 * callback: void function(err, data, status, jqXHR)
 *
 */
Sync.prototype.sendPUT = function(url, data, callback) {
  return this.send('PUT', url, data, callback);
};

/**
 * Sends a DELETE to the Datastore
 *
 * @param {String} url Server URL (optional, then model.server must be set)
 * @param  {Object}   data     Dato to sending
 * @param  {Function} callback Calling on response
 *
 * callback: void function(err, data, status, jqXHR)
 *
 */
Sync.prototype.sendDELETE = function(url, data, callback) {
  return this.send('DELETE', url, data, callback);
};

/**
 * Fetch data from server
 *
 * @param {Object} query MongoDB query
 * @param {Function} callback Callback function
 */
Sync.prototype.fetch = function(query, callback) {
  return this.sendGET(query, callback);
};

/**
 * Save a model if it's valid
 */
Sync.prototype.save = function(data, callback) {
  if (typeof data === 'function') {
    callback = data;
    data = this.schema ? this.getByKeys(Object.keys(this.schema)) : this.toJSON();
  }

  if (this.isValid()) {
    return this.sendPOST(data, callback);
  }
  else {
    if (typeof callback === 'function') {
      callback({
        msg: 'Model isn\'t valid. Cancle save'
      });
    }
    else {
      return Promise.reject({
        msg: 'Model isn\'t valid. Cancle save'
      });
    }
  }
};

/**
 * Update a model if it's valid
 */
Sync.prototype.update = function(data, callback) {
  if (typeof data === 'function') {
    callback = data;
    data = this.schema ? this.getByKeys(Object.keys(this.schema)) : this.toJSON();
  }

  if (this.isValid()) {
    this.sendPUT(data, callback);
  }
  else {
    if (typeof callback === 'function') {
      callback({
        msg: 'Model isn\'t valid. Cancel update'
      });
    }
  }
};

/**
 * To be called when a form was submited in a coupled model
 *
 * This method merges submited form data with model.
 * If validation doesn't fail, update or save methode have to be called.
 * It calls update if data.id is not undefined, otherwise it calls save
 * Override this function if this behavior isn't desired
 *
 * @method sync
 * @override
 * @param  {Any} data     data
 */
Sync.prototype.submit = function(data) {
  var self = this;

  var promise = new Promise(function(resolve, reject) {
    self.set(data, { extend: true })
    .then(function() {
      if (self.server) {
        if (self.get('id') === undefined || self.get('id') === null) {
          self.save(data)
          .then(function(result) {
            resolve(result);
            self.emit('data.submit', result);
          })
          .catch(function(err) {
            reject(err);
          });
        }
        else {
          self.update(data)
          .then(function(result) {
            resolve(result);
            self.emit('data.submit', result);
          })
          .catch(function(err) {
            reject(err);
          });
        }
      }

    });
  });

  return promise;
};

//--

module.exports = Sync;

});
require.register('./src/list.js', function(module, exports, require) { /**
 * XQCore List
 *
 * @package XQCore
 * @module List
 * @requires EventEmitter
 * @requires Logger
 * @example
 *
 * var MyModel = XQCore.Model.inherit({
 *   schema: {
 *     title: { type: 'string', min: 3, max 100 },
 *     content: { type: 'string', min: 3, max 1000 }
 *   }
 * });
 *
 * var list new XQCore.List('myList', function(self) { {
 *   self.model = MyModel;
 * }});
 *
 * list.push({
 *   title: 'Item 1',
 *   content: 'This is my first list item'
 * });
 *
 */

'use strict';

var XQCore = require('./xqcore');
var Logger = require('./logger');
var EventEmitter = require('./event');
var Model = require('./model');
var Sync = require('./sync');
var ReadyState = require('./ready-state');

/**
 * List base class
 *
 * @class List
 * @constructor
 *
 * @uses Logger
 * @uses EventEmitter
 *
 * @param {Object} conf List extend object
 */
var List = function(name, conf) {
  //Call Logger constructor
  Logger.call(this);

  //Call ReadyState constructor
  ReadyState.call(this);

  //Call EventEmitter constructor
  EventEmitter.call(this);

  var self = this;

  if (typeof arguments[0] === 'object') {
    conf = name;
    name = conf.name;
  }

  /**
   * Enable debug mode
   * @public
   * @type {Boolean}
   */
  this.logLevel = XQCore.logLevel;

  if (conf === undefined) {
    conf = {};
  }

  this.__unfiltered = {};

  /**
   * List name
   * @property {String} name
   */
  this.name = (name ? name.replace(/List$/, '') : 'Nameless') + 'List';

  /**
   * Contains list items
   * @property {Array} items
   */
  this.items = [];

  /**
   * Sets a maxlength of items
   * @property {Number} maxlength
   * @default null
   */
  this.maxLength = null;

  /**
   * Sets the Model to be used to create new models in push and unshift methods.
   * @property {Object} model
   */
  if (!this.model) {
    this.model = Model;
  }

  /*!
   * Mapping of initial conf
   */
  if (typeof conf === 'function') {
    conf.call(this, self);
  }
  else {
    XQCore.assign(this, conf);
  }

  /**
   * Sets default values
   * @property {Object|Array} defaults
   */
  if (this.defaults && !XQCore.isEmpty(this.defaults)) {
    this.push(this.defaults, {
      silent: true,
      noValidation: true
    });
  }

  /*!
   * Sets ready state
   */
  this.state('ready');
  this.setReady();
};

//Extend with ready state
XQCore.assign(List.prototype, ReadyState.prototype);
XQCore.assign(List.prototype, EventEmitter.prototype);
XQCore.assign(List.prototype, Logger.prototype);
XQCore.assign(List.prototype, Sync.prototype);

/**
 * Inherits a list prototype
 * @method inherit
 * @param  {String} name    list name
 * @param  {Object} options Model properties
 * @return {Object}         Returns a Model prototype
 */
List.inherit = function(name, options) {
  if (typeof name === 'object') {
    options = name;
    name = undefined;
  }

  var Proto = function() {
    List.call(this, name, options);
  };

  Proto.prototype = Object.create(List.prototype);
  Proto.prototype.constructor = Proto;
  return Proto;
};

/**
 * Contains the length of the list
 * @property length
 * @type {Number}
 */
Object.defineProperty(List.prototype, 'length', {
  get: function() {
    return this.items.length;
  }
});

/**
 * Change the list state
 *
 * @method state
 * @param {String} state New state
 */
List.prototype.state = function(state) {
  this.__state = state;
  this.emit('state.' + state);
  this.emit('state.change', state);
};

/**
 * Get the current list state
 *
 * @method getState
 */
List.prototype.getState = function() {
  return this.__state;
};

/**
 * Adds one ore more items to the end of a list.
 * You can pass a Model or a plain data object.
 * A data object will be converted into a Model.
 * The model must be valid to be added to the list.
 *
 * @param {Object|Array} data Model instance or a plain data object. Add multiple models by using an array of items
 * @param {Object} options Options object
 * {
 *     silent: true,    //Disable event emitting
 *     noSync: true     //Don't call sync method
 * }
 *
 * @returns {Boolean} Returns true if validation was succesfully and all items were added
 */
List.prototype.push = function(data, options) {
  var models = [],
    model,
    item;

  options = options || {};

  if (!Array.isArray(data)) {
    data = [data];
  }

  for (var i = 0, len = data.length; i < len; i++) {
    item = data[i];

    if (item instanceof Model) {
      model = item;
    }
    else {
      model = new this.model('ListItem');
      model.set(item, {
        noSync: true,
        silent: true
      });
    }

    if (model.isValid()) {
      models.push(model);
    }
    else {
      return false;
    }
  }

  //No validation error has been ocured.
  var length = this.items.push.apply(this.items, models);

  if (length) {
    if (this.maxLength && this.items.length > this.maxLength) {
      this.items.splice(0, this.items.length - this.maxLength);
    }

    if (!options.silent) {
      this.emit('item.push', models, length);
    }

    if (!options.noSync) {
      if (typeof this.sync === 'function') {
        this.sync('push', models);
      }
    }
  }

  return true;
};

/**
 * Adds one ore more items to the beginning of a list.
 * You can pass a Model or a plain data object.
 * A data object will be converted into a Model.
 * The model must be valid to be added to the list.
 *
 * @param {Object|Array} data Model instance or a plain data object. Add multiple models by using an array of items
 * @param {Object} options Options object
 * {
 *     silent: true,    //Disable event emitting
 *     noSync: true     //Don't call sync method
 * }
 * @returns {Boolean} Returns true if validation was succesfully and all items were added
 */
List.prototype.unshift = function(data, options) {
  var models = [],
    model,
    item;

  options = options || {};

  if (!Array.isArray(data)) {
    data = [data];
  }

  for (var i = 0, len = data.length; i < len; i++) {
    item = data[i];

    if (item instanceof Model) {
      model = item;
    }
    else {
      model = new this.model('ListItem');
      model.set(item, {
        noSync: true,
        silent: true
      });
    }

    if (model.isValid()) {
      models.unshift(model);
    }
    else {
      return false;
    }
  }

  //No validation error has been ocured.
  var length = this.items.unshift.apply(this.items, models);

  if (length) {
    if (this.maxLength && this.items.length > this.maxLength) {
      this.items.splice(this.maxLength);
    }

    if (!options.silent) {
      this.emit('item.unshift', models, length);
    }

    if (!options.noSync) {
      if (typeof this.sync === 'function') {
        this.sync('unshift', models);
      }
    }
  }

  return true;
};

/**
 * Removes the last item from a list and returns it.
 *
 * @event item.remove Emits an item.remove event. The removed item will be passed as the first argument
 *
 * @param {Object} options Options object
 * {
 *     silent: true,    //Disable event emitting
 *     noSync: true     //Don't call sync method
 * }
 *
 * @returns {Object} Returns the removed item
 */
List.prototype.pop = function(options) {
  var model;

  options = options || {};

  model = this.items.pop() || null;
  if (model === undefined) {
    return null;
  }

  if (!options.silent) {
    this.emit('item.pop', model);
  }

  if (!options.noSync) {
    if (typeof this.sync === 'function') {
      this.sync('pop', model);
    }
  }

  return model;
};

/**
 * Removes the first item from a list and returns it.
 *
 * @event item.shift Emits an item.shift event. The removed item will be passed as the first argument
 *
 * @param {Object} options Options object
 * {
 *     silent: true,    //Disable event emitting
 *     noSync: true     //Don't call sync method
 * }
 *
 * @returns {Object} Returns the removed item
 */
List.prototype.shift = function(options) {
  var model;

  options = options || {};

  model = this.items.shift() || null;
  if (model === undefined) {
    return null;
  }

  if (!options.silent) {
    this.emit('item.shift', model);
  }

  if (!options.noSync) {
    if (typeof this.sync === 'function') {
      this.sync('shift', model);
    }
  }

  return model;
};

/**
 * Updates a list item or pushs it to the end
 * You can pass a Model or a plain data object.
 * A data object will be converted into a Model.
 * The model must be valid to be added to the list.
 *
 * @param {Object|Number} match Match to find element which should be updated
 * @param {Object} data Model instance or a plain data object.
 * @param {Object} options Options object
 * {
 *     silent: true,    //Disable event emitting
 *     noSync: true     //Don't call sync method
 * }
 *
 * @fires item.update
 * Fires an item.update event if item was succesfully updated. Othwewise fires an item.push event
 *
 * @returns {Object} Returns the updated item
 */
List.prototype.update = function(match, data, options) {
  options = options || {};

  var updateItem;
  if (typeof match === 'number') {

    updateItem = this.items[match];
  }
  else {
    updateItem = this.findOne(match);
  }

  if (updateItem) {
    updateItem.set(data, { noSync: true, silent: true });

    if (!options.silent) {
      this.emit('item.update', updateItem);
    }

    if (!options.noSync) {
      if (typeof this.sync === 'function') {
        this.sync('update', match, data);
      }
    }
  }

  return updateItem;
};

/**
 * Removes an item at a given position
 *
 * @param {Object|Number} match Match to find element which should be removed
 * @param {Object} options Options object
 * {
 *     silent: true,    //Disable event emitting
 *     noSync: true     //Don't call sync method
 * }
 *
 * @fires item.remove
 * Fires an item.remove event if item was succesfully removed.
 *
 * @returns {Object} Returns the removed item
 */
List.prototype.remove = function(match, options) {
  options = options || {};

  var removedItem,
    index = 0;
  if (typeof match === 'number') {
    removedItem = this.items[match];
    index = match;
  }
  else {
    removedItem = this.findOne(match);
    for (var i = 0, len = this.items.length; i < len; i++) {
      if (this.items[i] === removedItem) {
        index = i;
        break;
      }
    }
  }

  if (removedItem) {
    this.items.splice(index, 1);

    if (!options.silent) {
      this.emit('item.remove', removedItem, index);
    }

    if (!options.noSync) {
      if (typeof this.sync === 'function') {
        this.sync('remove', match, index);
      }
    }
  }

  return removedItem;
};

/**
 * Clears the whole list
 * @param  {Object} options Options object
 * {
 *     silent: true,    //Disable event emitting
 *     noSync: true     //Don't call sync method
 * }
 *
 * @fires item.clear
 * Fires an item.clear event if item was succesfully cleared. It will not fire any events on an empty list
 *
 * @returns {Number} Returns the amount of removed items
 */
List.prototype.clear = function(options) {
  options = options || {};

  if (this.items.length === 0) {
    return 0;
  }

  var oldValue = this.toArray();

  this.items = [];

  if (!options.silent) {
    this.emit('item.clear', oldValue);
  }

  if (!options.noSync) {
    if (typeof this.sync === 'function') {
      this.sync('clear', oldValue);
    }
  }

  return oldValue.length;
};

/**
 * Returns list items as an array
 * @method toArray
 * @return {Array} Returns an array of list items
 */
List.prototype.toArray = function() {
  return this.items.map(function(model) {
    return model.properties;
  });
};

/**
 * Compatibility, does the same as toArray()
 * @method toJSON
 * @return {Array} Returns an array of list items
 */
List.prototype.toJSON = function() {
  return this.toArray();
};

/**
 * Search through list items and returns the first matching item
 *
 * @method findOne
 * @param {Object} searchfor Searching for object
 * @return {Object} Returns the first matched item or null. The returning item is a Model object
 */
List.prototype.findOne = function(query) {
  var parent;

  parent = this.items;

  if (parent) {
    for (var i = 0; i < parent.length; i++) {
      var prop = parent[i],
        matching;

      for (var p in query) {
        if (query.hasOwnProperty(p)) {
          if (prop.properties[p] && prop.properties[p] === query[p]) {
            matching = true;
            break;
          }
          else {
            matching = false;
          }
        }
      }

      if (matching === true) {
        return prop;
      }
    }
  }

  return null;
};

/**
 * Search through list items and returns all matching items
 *
 * @method find
 * @param {Object} searchfor Searching for object
 * @return {Object} Returns all matched item or an empty array.
 * The returning value is an array of Model objects
 */
List.prototype.find = function(query) {
  var parent,
    res = [];

  parent = this.items;

  if (parent) {
    for (var i = 0; i < parent.length; i++) {
      var prop = parent[i],
        matching;

      for (var p in query) {
        if (query.hasOwnProperty(p)) {
          if (prop.properties[p] && prop.properties[p] === query[p]) {
            matching = true;
            break;
          }
          else {
            matching = false;
          }
        }
      }

      if (matching === true) {
        res.push(prop);
      }

    }
  }

  return res;
};

/**
 * Calls a function on each item.
 * Optionally traverse the `initial` object through all methods and returns it at the end.
 *
 * @method each
 * @param  {Object}   initial Object which will be traversed and returned at the end
 * @param  {Function} fn      Funtion to be called on each item. Gets the model as first arg and the traversing object as second arg.
 * @returns {Object}          Returns a traversed object
 */
List.prototype.each = function(initial, fn) {
  if (typeof initial === 'function') {
    fn = initial;
    initial = {};
  }

  var data = initial;
  for (var i = 0, len = this.items.length; i < len; i++) {
    data = fn(this.items[i], data);
  }

  return data;
};

//--

module.exports = List;

});
require.register('./src/model.js', function(module, exports, require) { /**
 * XQCore Model
 *
 * This module organizes your data.
 * A model has different states and changes it on a specific action.
 *
 * States:
 * starting | Before initialization
 * ready    | Initial state
 * valid    | Validation was successfull
 * invalid  | Validation failed
 *
 *
 * @package XQCore
 * @module Model
 * @requires Utils
 * @requires EventEmitter
 * @requires Logger
 */

'use strict';

var XQCore = require('./xqcore');
var Logger = require('./logger');
var ReadyState = require('./ready-state');
var Sync = require('./sync');
var Promise = require('./promise');
var EventEmitter = require('./event');

/**
 * Model base class
 *
 * @class Model
 * @constructor
 *
 * @uses Logger
 * @uses EventEmitter
 *
 * @param {Object} conf Model extend object
 */
var Model = function(name, conf) {
  //Call Logger constructor
  Logger.call(this);

  //Call ReadyState constructor
  ReadyState.call(this);

  //Call EventEmitter constructor
  EventEmitter.call(this);

  if (typeof arguments[0] === 'object') {
    conf = name;
    name = conf.name;
  }

  /**
   * Enable debug mode
   * @public
   * @type {Boolean}
   */
  this.logLevel = XQCore.logLevel;

  /**
   * Stores models properties
   * @type {Object}
   * @property properties
   */
  this.properties = {};

  /**
   * Contains last validation errors if state is invalid
   * @type {Array}
   * @property lastValidationError
   */
  this.lastValidationError = null;

  //-- Initial conf mapping
  if (conf === undefined) {
    conf = {};
  }

  if (typeof conf === 'function') {
    conf.call(this, this);
  }
  else {
    XQCore.extend(this, conf);
  }

  this.__state = 'starting';
  this.__unfiltered = {};
  this.__isValid = false;

  this.customValidate = conf.validate;
  delete conf.validate;

  this.conf = conf;

  /**
   * Model name
   * @property {String} name
   */
  this.name = (name ? name.replace(/Model$/, '') : 'Nameless') + 'Model';

  //-- Add default values
  if (this.defaults && !XQCore.isEmptyObject(this.defaults)) {
    this.set(this.defaults, {
      silent: true,
      noValidation: true
    });
  }

  //-- Add schema props as default values
  if (this.schema) {
    Object.keys(this.schema).forEach(function(key) {
      if (!(key in this.properties)) {
        this.properties[key] = this.schema[key].default !== undefined ? this.schema[key].default : null;
      }
    }, this);
  }

  this.__isValid = !this.schema;
  this.state('ready');
};


//Extend with ready state
XQCore.extend(Model.prototype, ReadyState.prototype);
XQCore.extend(Model.prototype, EventEmitter.prototype);
XQCore.extend(Model.prototype, Logger.prototype);
XQCore.extend(Model.prototype, Sync.prototype);


/**
 * Inherits a model prototype
 * @method inherit
 * @static
 * @param  {String} name    model name
 * @param  {Object} options Model properties
 * @return {Object}         Returns a XQCore.Model prototype
 */
Model.inherit = function(name, options) {
  if (typeof name === 'object') {
    options = name;
    name = undefined;
  }

  var Proto = function(_name, _options) {
    //TODO call this later, ready state will be set before _options had been run
    Model.call(this, name, options);

    if (_name) {
      if (typeof _name === 'string') {
        name = _name;
      }
      else {
        _options = _name;
      }

      if (typeof _options === 'function') {
        _options.call(this, this);
      }
      else if (typeof _options === 'object') {
        XQCore.extend(this, _options);
      }
    }
  };

  Proto.prototype = Object.create(Model.prototype);
  Proto.prototype.constructor = Proto;
  return Proto;
};

/**
 * Change the model state
 *
 * @method state
 * @param {String} state New state
 */
Model.prototype.state = function(state) {
  this.__state = state;
  this.emit('state.' + state);
  this.emit('state.change', state);
};

/**
 * Get the current model state
 *
 * @method getState
 */
Model.prototype.getState = function() {
  return this.__state;
};

/**
 * Set model data
 *
 * Triggers a data.change event if data was set succesfully
 *
 * @method set
 * @param {Object} data
 */

/**
 * Set model data
 *
 * Triggers these events if data was set succesfully<br>
 * data.change<br>
 * &lt;key&gt;.change
 *
 * options: {
 *   silent: <Boolean> Don't trigger any events
 *   noValidation: <Boolean> Don't validate
 *   replace: <Boolean> Replace all date with new data
 *   noSync: <Boolean> Do not call sync method. Default: false
 * }
 *
 * @method set
 * @param {String} key
 * @param {Object} value Data value
 * @param {Object} options Options
 *
 * @returns {Object} Returns a promise object
 */
Model.prototype.set = function(key, value, options) {
  var newData = {},
    oldData = this.get(),
    validationResult,
    setItem = false,
    setAll = false;

  options = options || {};

  if (arguments[0] === null) {
    newData = arguments[1];
    setAll = true;
    this.log('Set data', newData, oldData);
  }
  else if (typeof arguments[0] === 'object') {
    //Add a dataset
    options = value || {};
    newData = options.replace ? arguments[0] : XQCore.extend(newData, oldData, arguments[0]);
    setAll = true;
    key = null;
    this.log('Set data', newData, oldData);
  }
  else if (typeof arguments[0] === 'string') {
    newData = XQCore.extend({}, this.get());
    setItem = true;
    XQCore.dedotify(newData, key, value);
    this.log('Set value', key, value, oldData);
  }
  else {
    this.warn('Data are incorrect in model.set()', arguments);
  }

  options = options || {};

  if (options.noValidation !== true) {
    if (this.customValidate) {
      this.log('Using a custom validation!');
      validationResult = this.customValidate(newData);
    }
    else if (this.schema) {
      validationResult = this.validate(newData);
      if (setItem && validationResult) {
        var newValidationResult;
        for (var i = 0, len = validationResult.length; i < len; i++) {
          if (validationResult[i].property === key) {
            newValidationResult = [validationResult[i]];
            break;
          }
        }

        validationResult = newValidationResult || null;
      }
    }

    if (validationResult) {
      this.warn('Validation error', validationResult);
      if (options.silent !== true) {
        this.emit('validation.error', validationResult, newData);
      }

      return Promise.reject({
        msg: 'validation.error',
        err: validationResult
      });
    }
  }

  this.properties = newData;
  if (options.silent !== true) {
    if (setAll) {
      if (!options.noSync && typeof this.sync === 'function') {
        this.sync(options.replace ? 'replace' : 'set', newData);
      }
      else {
        //TODO show only replaced data if set is using
        this.emit(options.replace ? 'data.replace' : 'data.set', newData, oldData);
      }
    }
    else if (setItem){
      if (!options.noSync && typeof this.sync === 'function') {
        this.sync('value', key, value);
      }

      this.emit('value.set', key, value);
    }

    this.emit('data.change', newData, oldData);
  }

  return Promise.resolve(newData);
};

/**
 * Get one or all properties from a dataset
 *
 * <b>Options:</b>
 *   copy: <Boolean>  //Set it to true to get a copy of the dataset
 *
 * @param {String} key Data key
 * @param {Object} options Set options
 *
 * @returns {Object}    Returns the whole model or a filtered dataset
 */
Model.prototype.get = function(key, options) {
  if (options === undefined) {
    options = {};
  }

  var data;

  if (typeof key === 'object' && arguments.length === 1) {
    options = key;
    key = null;
  }

  if (key === undefined || key === null) {
    if (options.copy === true) {
      data = this.properties;
      switch (typeof data) {
        case 'object':
          return Array.isArray(data) ? data.slice() : XQCore.extend(true, {}, data);
        case 'function':
          //jshint evil:true
          return eval('(' + data.toString() + ')');
        default:
          return data;
      }
    }

    return this.properties;
  }
  else if (typeof key === 'string' && typeof options === 'number') {
    var index = options;
    if (arguments.length === 3) {
      options = arguments[2];
    }

    var item = this.get(key);

    if (options.copy === true) {
      if (typeof item[index] === 'object') {
        return XQCore.extend({}, item[index]);
      }
    }

    return item ? item[index] : null;
  }
  else {
    if (options.copy === true) {
      data = XQCore.undotify(key, this.properties);
      switch (typeof data) {
        case 'object':
          return Array.isArray(data) ? data.slice() : XQCore.extend(true, {}, data);
        case 'function':
          //jshint evil:true
          return eval('(' + data.toString() + ')');
        default:
          return data;
      }
    }

    return XQCore.undotify(key, this.properties);
  }
};

/**
 * Get items filtered by a key array or object
 * @param  {Object|Array} keys Key array
 * @param  {Object} data (Optional) Data to be filtered. Uses model data if it is undefined
 * @return {Object}      Returns a filtered data object
 */
Model.prototype.getByKeys = function(keys, data) {
  if (typeof keys !== 'object') {
    throw new Error('First param must be an object or array in Model.getByKeys()!');
  }

  var out = {};

  data = data || this.get();

  if (Array.isArray(keys)) {
    keys.forEach(function(key) {
      if (key.indexOf('.') === -1) {
        out[key] = data[key];
      }
      else {
         out = XQCore.dedotify(out, key, XQCore.undotify(key, data));
      }
    });
  }
  else {
    for (var k in keys) {
      if (keys.hasOwnProperty(k)) {
        var item = data[k];
        if (typeof item === 'object') {
          out[k] = this.getByKeys(keys[k], data[k]);
        }
        else {
          out[k] = data[k];
        }
      }
    }
  }

  return out;
};

/**
 * Check wether model has a dataset
 *
 * @method  has
 * @param {String} key Dataset key
 * @return {Boolean} Returns true if model has a dataset with key
 */
Model.prototype.has = function(key) {
  var hasKey = true,
    obj = this.properties;

  key = key.split('.');
  for (var i = 0, len = key.length; i < len; i++) {
    if (typeof obj === 'object' && obj.hasOwnProperty(key[i])) {
      obj = obj[key[i]];
      continue;
    }

    hasKey = false;
    break;
  }

  return hasKey;
};

/**
 * Removes all data from model
 *
 * @method reset
 * @param  {Object} options Options object
 * {
 *     removeListener: true,    //Remove all event listener
 *     silent: true,            //Disable event emitting
 *     noSync: true             //Don't call sync method
 * }
 *
 * @fires data.reset
 * Fires a data.reset event if model was succesfully reseted.
 *
 * @returns {Object} Returns removed data
 *
 */
Model.prototype.reset = function(options) {
  options = options || {};

  this.log('Reset model');
  var oldData = this.get();
  this.properties = XQCore.extend({}, this.defaults);
  this.state('ready');
  if (!options.silent) {
    this.emit('data.reset', oldData);
  }

  if (options.removeListener) {
    this.clearEvents();
  }

  if (!options.noSync) {
    if (typeof this.sync === 'function') {
      this.sync('reset', oldData);
    }
  }

  return oldData;
};

/**
 * Push data to a subset
 *
 * @method push
 * @param {String} path path to subset
 * @param {Object} data data to add
 */
Model.prototype.push = function(path, data, options) {
  var dataset = XQCore.undotify(path, this.properties);

  options = options || {};

  if (dataset instanceof Array) {
    dataset.push(data);
  }
  else if (typeof dataset === 'undefined') {
    XQCore.dedotify(this.properties, path, [data]);
  }
  else if (typeof dataset === 'object' && !path && XQCore.isEmptyObject(this.properties)) {
    this.properties = [data];
  }
  else {
    this.error('Model.push requires an array. Dataset isn\'t an array. Path: ', path);
    return;
  }

  if (options.silent !== true) {
    if (!options.noSync && typeof this.sync === 'function') {
      this.sync('insert', path, -1, data);
    }

    this.emit('item.insert', path, -1, data);
    this.emit('data.change', this.properties);
  }
};

/**
 * Unshift data to a subset
 *
 * @method unshift
 * @param {String} path path to subset
 * @param {Object} data data to add
 */
Model.prototype.unshift = function(path, data, options) {
  var dataset = XQCore.undotify(path, this.properties);

  options = options || {};

  if (dataset instanceof Array) {
    dataset.unshift(data);
  }
  else if (typeof dataset === 'undefined') {
    XQCore.dedotify(this.properties, path, [data]);
  }
  else if (typeof dataset === 'object' && !path && XQCore.isEmptyObject(this.properties)) {
    this.properties = [data];
  }
  else {
    this.error('Model.unshift requires an array. Dataset isn\'t an array. Path: ', path);
    return;
  }

  if (options.silent !== true) {
    if (!options.noSync && typeof this.sync === 'function') {
      this.sync('insert', path, 0, data);
    }

    this.emit('item.insert', path, 0, data);
    this.emit('data.change', this.properties);
  }
};

/**
 * Insert data into a subset at a given index
 *
 * @method insert
 * @param {String} path Path to subset
 * @param {Number} index The index where the data should be inserted
 * @param {Object} data Dataset to be inserted
 * @param {Object} options Inserting options
 */
Model.prototype.insert = function(path, index, data, options) {
  var dataset = XQCore.undotify(path, this.properties);

  options = options || {};

  if (dataset instanceof Array) {
    if (index === -1) {
      dataset.push(data);
    }
    else if (index === 0) {
      dataset.unshift(data);
    }
    else {
      dataset.splice(index, 0, data);
    }
  }
  else if (!dataset) {
    XQCore.dedotify(this.properties, path, [data]);
  }
  else {
    this.error('Model.insert requires an array. Dataset isn\'t an array. Path: ', path);
    return;
  }

  if (options.silent !== true) {
    if (!options.noSync && typeof this.sync === 'function') {
      this.sync('insert', path, index, data);
    }

    this.emit('item.insert', path, index, data);
    this.emit('data.change', this.properties);
  }
};

/**
 * Remove a subset
 *
 * @method remove
 * @param {String} path path to subset
 * @param {Number} index Index of the subsut to remove
 * @param {Object} options Remove options
 *
 * @return {Object} removed subset
 */
Model.prototype.remove = function(path, index, options) {
  var dataset = XQCore.undotify(path, this.properties),
    removed = null;


  options = options || {};

  if (dataset instanceof Array) {
    removed = dataset.splice(index, 1);
  }
  else if (typeof dataset === 'object') {
    this.error('Model.remove requires an array. Dataset isn\'t an array. Path: ', path);
    return;
  }

  if (removed && options.silent !== true) {
    if (!options.noSync && typeof this.sync === 'function') {
      this.sync('remove', path, index);
    }

    this.emit('item.remove', path, index, removed[0]);
    this.emit('data.change', this.properties);
  }

  return removed;
};

/**
 * Replace all models data with new data. This is a alias for set(<AnyData>, {replace: true})
 *
 * @method replace
 * @param {Object} data Data object
 * @param {Object} options Option data. (See set method for details)
 */
Model.prototype.replace = function(data, options) {
  options = options || {};
  options.replace = true;
  return this.set(data, options);
};

/**
 * Search an item in models properties
 *
 * @method search
 * @param {String} path Path to the parent property. We use dot notation to navigate to subproperties. (data.bla.blub) (Optional)
 * @param {Object} searchfor Searching for object
 * @return {Object} Returns the first matched item or null
 */
Model.prototype.search = function(path, searchfor) {
  var parent;

  if (arguments.length === 1) {
    searchfor = path;
    path = '';
    parent = this.properties;
  }
  else if (!path) {
    parent = this.properties;
  }
  else {
    parent = XQCore.undotify(path, this.properties);
  }

  if (parent) {
    for (var i = 0; i < parent.length; i++) {
      var prop = parent[i],
        matching;

      for (var p in searchfor) {
        if (searchfor.hasOwnProperty(p)) {
          if (prop[p] && prop[p] === searchfor[p]) {
            matching = true;
            break;
          }
          else {
            matching = false;
          }
        }
      }

      if (matching === true) {
        return prop;
      }

    }
  }

  return null;
};

/**
 * Updates a dataset
 * @development
 *
 * @method modify
 * @param {String} path Parent path
 * @param {Number|Object} match Search match or index to find the to be modifyd item
 * @param {Object} data Update date
 */
Model.prototype.modify = function(path, match, data, options) {
  var item;

  options = options || {};

  if (typeof match === 'number') {
    item = this.get(path, match);
  }
  else {
    item = this.search(path, match);
  }

  var oldData = XQCore.extend({}, item);
  if (item) {
    XQCore.extend(item, data);

    if (options.silent !== true) {
      this.emit('data.modify', path, match, data, oldData);
      this.emit('data.change', this.properties);
    }

    if (!options.noSync && typeof this.sync === 'function') {
      this.sync('modify', path, match, data);
    }
  }
};

/**
 * Sort an array collection by a given attribute
 *
 * @method  sortBy
 * @param {String} path Path to the collection
 * @param {Object} sortKeys Sort by key
 *
 * sortKeys: {
 *   'key': 1 // Sort ascend by key,
 *   'second.key': -1 // Sort descand by second.key
 * }
 *
 * ascend, a -> z, 0 - > 9 (-1)
 * descend, z -> a, 9 -> 0 (1)
 *
 */
Model.prototype.sortBy = function(path, sortKeys) {
  if (arguments.length === 1) {
    sortKeys = path;
    path = null;
  }

  var data = XQCore.undotify(path, this.properties),
    order;

  if (!Array.isArray(data)) {
    this.warn('Could not sort data of type', typeof data);
    return [];
  }

  data.sort(function(a, b) {
    order = -1;
    for (var key in sortKeys) {
      if (sortKeys.hasOwnProperty(key)) {
        order = String(XQCore.undotify(key, a)).localeCompare(String(XQCore.undotify(key, b)));
        if (order === 0) {
          continue;
        }
        else if(sortKeys[key] === -1) {
          order = order > 0 ? -1 : 1;
        }

        break;
      }
    }

    return order;
  });

  this.set(path, data);
  return data;
};

/**
 * Filter an array collection by a given filter function
 *
 * @method filter
 * @param {String} path Path to the collection
 * @param {String | Function} filter Filter function
 *
 */
Model.prototype.filter = function(path, property, query, fn) {
  if (arguments.length === 1) {
    fn = path;
    path = null;
  }

  if (typeof fn === 'string') {
    if (this.__registeredFilter[fn]) {
      fn = this.__registeredFilter[fn];
    }
    else {
      throw new Error('Filter ' + fn + ' not registered!');
    }
  }

  //We use a for i instead of Array.filter because it's faster!
  var data = XQCore.undotify(path, this.__unfiltered.data || this.properties);
  var filtered = [];
  for (var i = 0, len = data.length; i < len; i++) {
    if (fn(property, query, data[i])) {
      filtered.push(data[i]);
    }
  }

  this.__unfiltered = {
    path: path,
    data: data
  };

  this.set(path, filtered);
  return filtered;
};

/**
 * Resets a filter
 * @method filterReset
 * @param {Object} options Set options
 */
Model.prototype.filterReset = function(options) {
  if (this.__unfiltered) {
    this.set(this.__unfiltered.path, this.__unfiltered.data, options);
  }
};

/**
 * Validate model
 * @method validate
 * @param {Object} data Data to be validated
 * @param {Object} schema Schema
 * @returns {Object} Returns an object with failed validations or null if validation succeeds
 */
Model.prototype.validate = function(data, schema) {
  var self = this,
    failed = [],
    subFailed;

  schema = schema || this.schema;

  if (schema) {
    Object.keys(schema).forEach(function(key) {
      if (typeof schema[key] === 'object' && typeof schema[key].type === 'undefined') {
        if (schema[key].ref && schema[key].schema) {
          subFailed = self.validate(data, schema[key].schema);
          if (subFailed) {
            failed = failed.concat(subFailed);
          }
        }
        else {
          subFailed = self.validate(XQCore.extend({}, data[key]), XQCore.extend({}, schema[key]));
          if (Array.isArray(subFailed) && subFailed.length > 0) {
            failed = failed.concat(subFailed);
          }
        }
        return;
      }

      var validationResult = self.validateOne(schema[key], data[key]);

      if (validationResult.isValid === true) {
        data[key] = validationResult.value;
      }
      else {
        validationResult.error.property = key;
        failed.push(validationResult.error);
      }
    });
  }

  if (failed.length === 0) {
    this.__isValid = true;
    this.lastValidationError = null;
    this.state('valid');
    return null;
  }
  else {
    this.__isValid = false;
    this.lastValidationError = failed;
    this.state('invalid');
    return failed;
  }
};

/**
 * Validate one property
 *
 * ValidatorResultItemObject
 * {
 *   isValid: Boolean,
 *   value: Any,
 *   error: Object
 * }
 *
 * @param  {Any} schema Schema for the check
 * @param  {Any} value Property value
 *
 * @return {Object}       Returns a ValidatorResultItemObject
 */
Model.prototype.validateOne = function(schema, value, propName) {
  var failed,
    schemaType;

  if (schema.type === undefined) {
    if ( !schema.ref) {
      throw new Error('No schema type are set!');
    }

    schemaType = 'ref';
  } else {
    schemaType = schema.type.toLowerCase();
  }

  if (value === '' && schema.noEmpty === true) {
    value = undefined;
  }

  if ((value === undefined || value === null || value === '') && schema['default']) {
    value = schema['default'];
  }

  if ((value === undefined || value === null || value === '')) {
    if (schema.required === true) {
      failed = {
        msg: 'Property is undefined or null, but it\'s required',
        errCode: 10
      };
    }
  }
  else {
    if (this.__registeredValidations[schemaType]) {
      failed = this.__registeredValidations[schemaType].call(this, value, schema);
    }
    else {
      throw new Error('Undefined schema type', schema);
    }
  }

  if (failed === undefined) {
    failed = {
      isValid: true,
      value: value,
      error: null
    };
  }
  else {
    failed = {
      isValid: false,
      value: value,
      error: failed
    };
  }

  return failed;
};

/**
 * Checks the validation of a property without changeing any states
 *
 * @method checkValidation
 * @param  {String}  key  Property name
 * @param {String} value Property value
 * @returns {Boolean} Returns true if validation had been passed
 */
Model.prototype.checkValidation = function(key, value) {
  var check = this.validateOne(this.schema[key], value, key);
  return check.isValid;
};

/**
 * Returns the validation state of the model
 *
 * @method isValid
 * @returns {Boolean} Returns true when model data are valid. When no data was set it'll returns false
 */
Model.prototype.isValid = function() {
  return this.__isValid;
};

/**
 * To be called when a form has been submited in a coupled model
 *
 * Model gets <i>submited</i> state when validation succeeds
 * If validation fails, model gets <i>invalid</i> state
 *
 * @deprecated
 * @method setData
 * @param {Object} data Form data
 */
Model.prototype.setData = function(data, caller) {
  this.warn('Model.setData has been deprecated since v0.9');
  this.set(data, {
    extend: true
  });
};

/**
 * Register a filter function
 *
 * XQCore.Model.registerFilter('myfilter', fn);
 * Registers a filter for all models
 *
 * instance.registerFilter('myfilter', fn);
 * Registers a filter for the instance only.
 *
 * @method registerFilter
 * @param {String} filterName [description]
 * @param {Function} filterFunction [description]
 */
Model.registerFilter = function(filterName, filterFunction) {
  if (typeof filterFunction !== 'function') {
    throw new Error('Filter function isn\'t a function');
  }

  var obj = typeof this === 'function' ? Model.prototype : this;
  obj.__registeredFilter[filterName] = filterFunction;
};

/**
 * Alias for Model.registerFilter
 * @type {method}
 */
Model.prototype.registerFilter = Model.registerFilter;

/**
 * Holds registered filter
 * @type {Object}
 * @private
 */
Model.prototype.__registeredFilter = {
  quicksearch: function(property, query, item) {
    var value = XQCore.undotify(property, item);
    var pat = new RegExp(query.replace(/[a-z0-9äüöß]/g, '$&.*'), 'i');
    return pat.test(value);
  }
};

/**
 * Register validation metods for all Models
 *
 * @method registerValidation
 * @static
 * @param {String} type Data type
 * @param {Function} fn Validation function
 */
Model.registerValidation = function(type, fn) {
  var obj = typeof this === 'function' ? Model.prototype : this;
  obj.__registeredValidations[type] = fn;
};

/**
 * Register new validation method for currentyl instanciated model
 *
 * @method registerValidation
 * @param {String} type Data type
 * @param {Function} fn Validation function
 */
Model.prototype.registerValidation = Model.registerValidation;

/**
 * Stores registered validatiion functions
 * @type {Object}
 * @private
 */
Model.prototype.__registeredValidations = {
  'string': function(value, schema) {
    if (schema.convert && typeof(value) === 'number') {
      value = String(value);
    }

    if ('string' !== typeof(value)) {
      return {
        msg: 'Property type is a ' + typeof(value) + ', but a string is required',
        errCode: 11
      };
    }
    else if(schema.min && schema.min > value.length) {
      return {
        msg: 'String length is too short',
        errCode: 12
      };
    }
    else if(schema.max && schema.max < value.length) {
      return {
        msg: 'String length is too long',
        errCode: 13
      };
    }
    else if(schema.match && !schema.match.test(value)) {
      return {
        msg: 'String doesn\'t match regexp',
        errCode: 14
      };
    }
  },
  'number': function(value, schema) {

    if (schema.convert && typeof(value) === 'string') {
      value = parseInt(value, 10);
    }

    if ('number' !== typeof value || isNaN(value)) {
      return {
        msg: 'Property type is not a valid number',
        errCode: 21
      };
    }
    else if(schema.min && schema.min > value) {
      return {
        msg: 'Number is too low',
        errCode: 22
      };
    }
    else if(schema.max && schema.max < value) {
      return {
        msg: 'Number is too high',
        errCode: 23
      };
    }
  },
  'date': function(value, schema) {
    if (value) {
      var date = Date.parse(value);
      if (isNaN(date)) {
        return {
          msg: 'Property isn\'t a valid date',
          errCode: 31
        };
      }
    }
  },
  'array': function(value, schema) {
    if (!Array.isArray(value)) {
      return {
        msg: 'Property type is a ' + typeof(value) + ', but an array is required',
        errCode: 41
      };
    }
    else if(schema.min && schema.min > value.length) {
      return {
        msg: 'Array length is ' + value.length + ' but must be greater than ' + schema.min,
        errCode: 42
      };
    }
    else if(schema.max && schema.max < value.length) {
      return {
        msg: 'Array length is ' + value.length + ' but must be lesser than ' + schema.max,
        errCode: 43
      };
    }
  },
  'object': function(value, schema) {
    if (typeof(value) !== 'object') {
      return {
        msg: 'Property isn\'t a valid object',
        errCode: 51
      };
    }
  },
  'objectid': function(value, schema) {
    if (!/^[a-zA-Z0-9]{24}$/.test(value)) {
      return {
        msg: 'Property isn\'t a valid objectId',
        errCode: 52
      };
    }
  },
  'boolean': function(value, schema) {
    if (typeof(value) !== 'boolean') {
      return {
        msg: 'Property isn\'t a valid boolean',
        errCode: 61
      };
    }
  },

  /**
   * Validation type time
   *
   * Allowed values are:
   * HH:MM
   * HH:MM:SS
   * D:HH:MM:SS
   */
  'time': function(value, schema) {
    if (!/^\d+(:\d{2}){1,3}$/.test(value)) {
      return {
        msg: 'Property isn\'t a valid time',
        errCode: 71
      };
    }
  },

  /**
   * Validation type email         *
   */
  'email': function(value, schema) {
    if (!/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)) {
      return {
        msg: 'Property isn\'t a valid email',
        errCode: 72
      };
    }
  }
};

/**
 * Returns model as JSON
 * @method toJSON
 * @return {Object} Returns model data as JSON
 */
Model.prototype.toJSON = function() {
  return this.get();
};

//--

module.exports = Model;

});
require.register('./src/presenter.js', function(module, exports, require) { /**
 * XQCore Presenter
 *
 * A presenter controlls your models, lists and views.
 * It renders views as long as any data had been changed.
 *
 * @module XQCore.Presenter
 */

'use strict';


var XQCore = require('./xqcore');
var Logger = require('./logger');
var Router = require('./router');
var EventEmitter = require('./event');
var List = require('./list');
var Model = require('./model');
var View = require('./view');
var Tmpl = require('./tmpl');

var log;

/**
 * XQCore.Presenter base class
 *
 * @class XQCore.Presenter
 * @constructor
 *
 * @uses XQCore.Logger
 * @uses XQCore.EventEmitter
 *
 * @param {String} name Presenter name
 * @param {Function} fn Init callback and presenter scope method. To be called during the instantiating progress
 */
var Presenter = function(name, fn) {
  var self = this;

  if (typeof arguments[0] !== 'string') {
    throw new Error('Name argument not set. Fisrt argument must be a presenter name!');
  }

  /**
   * Set presenter name
   * @public
   * @type {String}
   */
  this.name = name || 'Nameless';
  this.path = '/' + (name === 'index' ? '' : name);

  /**
   * Router instance
   * @private
   * @type {Object}
   */
  this.router = Router.getInstance();

  /**
   * Logger instance
   * @ignore
   * @type {Object}
   */
  log = new Logger(this.name + 'Presenter');

  /**
   * Stores registered views
   * @private
   * @type {Object}
   */
  this.__views = {};

  //-- Initial config mapping
  if (typeof fn === 'function') {
    fn.call(this, self, log);
  }

  // register presenter route handler
  this.route(this.path);
};

XQCore.extend(Presenter.prototype, new EventEmitter());

/**
 * Add a history item to the browser history
 *
 * @method pushState
 *
 * @param {String} url Page URL (Optional) defaults to the curent URL
 * @param {Object} data Data object
 */
Presenter.prototype.pushState = function(url, data) {
  // log.info('Check State', data, history.state, XQCore.compare(data, history.state));
  // if (XQCore.compare(data, history.state)) {
  //     this.warn('Abborting history.pushState because data are equale to current history state');
  // }
  var hash = XQCore.html5Routes || url.charAt(0) === '/' ? '' : XQCore.hashBang;
  url = hash + url;
  history.pushState(data, '', url || null);
  log.info('Update history with pushState. New URL: ' + data, url);
};

/**
 * Add a history item to the browser history
 *
 * @method replaceState
 *
 * @param {String} url Page URL (Optional) defaults to the current URL
 * @param {Object} data Data object
 */
Presenter.prototype.replaceState = function(url, data) {
  var hash = XQCore.html5Routes || url.charAt(0) === '/' ? '' : XQCore.hashBang;
  url = hash + url;
  history.replaceState(data, '', url || null);
  log.info('Update history with replaceState. New URL: ' + data, url);
};

/**
 * Navigates to a given route
 *
 * @method  navigateTo
 *
 * Options: {
 *  replace: <Boolean> Replace current history entry with route (Only when html5 routes are enabled)
 *  noPush: <Boolean> Set this to false to surpress a route change when new route equals to old route
 * }
 *
 * @param {String} route Route url
 * @param {Object} options Options
 */
Presenter.prototype.navigateTo = function(route, options) {
  //TODO check route trigger
  options = options || {};
  if (XQCore.html5Routes) {
    this.router.callRoute(route, options);
  }
  else {
    location.hash = XQCore.hashBang + route;
    this.router.callRoute(route, options);
  }
};

/**
 * Navigate back
 *
 * @method navigateBack
 */
Presenter.prototype.navigateBack = function() {
  history.back();
};

/**
 * Gets a view by it's name
 *
 * @method getView
 * @param {String} viewName Required view name
 * @return {Object} Returns view object or null if no view was found
 */
Presenter.prototype.getView = function(viewName) {
  return this.__views[viewName] || null;
};

/**
 * Returns the current hash
 *
 * @method getHash
 * @returns {String} Returns the current value from location.hash
 */
Presenter.prototype.getHash = function() {
  return location.hash;
};

/**
 * Returns the current pathname
 *
 * @method getPathname
 * @returns {String} Returns the current value from location.pathname
 */
Presenter.prototype.getPathname = function() {
  return location.pathname;
};

/**
 * Couple a model with a view
 *
 * @method couple
 * @chainable
 * @param {Object} conf Configuration object
 *
 * conf: {
 *   model: String modelname
 *   view: String viewname
 *   route String routename
 * }
 */
Presenter.prototype.couple = function(view, model, conf) {
  conf = conf || {};

  if (model instanceof List) {
    this.coupleList(view, model, conf);
  }
  else {
    this.coupleModel(view, model, conf);
  }

  this.coupleView(view, model, conf);
};

Presenter.prototype.coupleComponent = function(cmp, model) {
  if (model instanceof List) {
    var list = model;
    list.on('item.push', function(item) {
      var val = item[0].get();
      cmp.push(val);
    });
  }
  else {
    if (cmp.$change) {
      cmp.$change(function(data, ev, curCmp) {
        model.set(data.name, data.value).then(function() {
          curCmp.errMessage = null;
        }).catch(function(err) {
          curCmp.errMessage = err.err[0].msg;
        });
      });
    }

    if (cmp.$click) {
      cmp.$click(function(data, ev, curCmp) {
        model.set(data.name, data.value).then(function() {
          curCmp.errMessage = null;
        }).catch(function(err) {
          curCmp.errMessage = err.err[0].msg;
        });
      });
    }

    if (cmp.$submit) {
      cmp.$submit(function(data, ev, curCmp) {
        model.save().then(function() {
          log.debug('Model saved!', model);
        }).catch(function(err) {
          curCmp.errMessage = err.err[0].msg;
        });
      });
    }

    cmp.on('value.change', function(data) {
      model.set(data.name, data.value).then(function() {
        cmp.errMessage = null;
      }).catch(function(err) {
        cmp.errMessage = err.err[0].msg;
      });
    });

    model.on('validation.error', function(validationResult, other) {
      cmp.state = 'invalid';
    });

    model.on('state.change', function(state) {
      cmp.state = state;
    });
  }
};

/**
 * Couples a view onto a model
 *
 * @method coupleModel
 * @param {Object} view XQCore.View instance
 * @param {Object} model XQCore.Model instance
 */
Presenter.prototype.coupleModel = function(view, model, conf) {
  conf = conf || {};

  if (!(view instanceof View)) {
    return log.error('Could not couple model with view. First arg is not a valid view!');
  }

  if (!(model instanceof Model)) {
    return log.error('Could not couple model with view. Second arg is not a valid model!');
  }

  if (model.__coupled) {
    model.__coupled.uncouple();
    // return log.error('View', view.name, 'already coupled with', view.__coupled.obj.name, '. Only one model or list can be coupled with a view!');
  }

  log.info('Couple model', model.name, 'with', view.name);

  model.__coupled = {
    obj: view,
    events: [],
    uncouple: function() {
      log.info('Uncouple model', model.name, 'from', view.name);
      model.__coupled.events.forEach(function(ev) {
        ev.remove();
      });

      delete model.__coupled;
    }
  };

  var eventsMap = {
    'data.replace': 'render',
    'data.set': 'render',
    'value.set': 'change',
    // 'item.insert': 'xrender',
    'item.remove': 'remove',
    'validation.error': 'validationFailed',
    'state.change': 'onStateChange'
  };

  var listener = function(listener, func) {
    var fn = typeof func === 'function' ? func : view[func].bind(view);
    var handler = model.on(listener, fn);
    model.__coupled.events.push(handler);
  };

  for (var key in eventsMap) {
    if (eventsMap.hasOwnProperty(key)) {
      listener(key, eventsMap[key]);
    }
  }

  //Initial view render with current model data
  view.render(model.get());

};

/**
 * Couples a listwith a view
 *
 * @method coupleList
 * @param {Object} view XQCore.View instance
 * @param {Object} model XQCore.Model instance
 */
Presenter.prototype.coupleList = function(view, list) {
  if (!(view instanceof View)) {
    return log.error('Could not couple list with view. First arg is not a valid view!');
  }

  if (!(list instanceof List)) {
    return log.error('Could not couple list with view. Second arg is not a valid list!');
  }

  if (list.__coupled) {
    list.__coupled.uncouple();
    // return log.error('View', view.name, 'already coupled with', view.__coupled.obj.name, '. Only one model or list can be coupled with a view!');
  }

  log.info('Couple list', list.name, 'with', view.name);

  list.__coupled = {
    obj: view,
    events: [],
    uncouple: function() {
      log.info('Uncouple list', list.name, 'from', view.name);
      list.__coupled.events.forEach(function(ev) {
        ev.remove();
      });

      delete list.__coupled;
    }
  };

  var eventsMap = {
    'item.push': function(data) {
      view.append('_ftl_root', data[0].toJSON());
    },
    'item.unshift': 'prepend',
    'item.pop': 'removeLast',
    'item.shift': 'removeFirst',
    'item.update': 'update',
    'item.remove': function(item, index) {
      view.remove('_ftl_root', index);
    },
    'state.change': 'onStateChange'
  };

  var listener = function(listener, func) {
    var fn = typeof func === 'function' ? func : view[func].bind(view);
    var handler = list.on(listener, fn);
    list.__coupled.events.push(handler);
  };

  for (var key in eventsMap) {
    if (eventsMap.hasOwnProperty(key)) {
      listener(key, eventsMap[key]);
    }
  }

  //Initial view render with current list data
  view.render(list.toArray());

};

/**
 * Couples a view with a model or a list
 *
 * @method coupleView
 * @param {Object} view View instance
 * @param {Object} model Model or List instance
 */
Presenter.prototype.coupleView = function(view, model) {
  if (!(view instanceof View)) {
    return log.error('Could not couple list with view. First arg is not a valid view!');
  }

  if (!(model instanceof Model) && !(model instanceof List)) {
    return log.error('Could not couple list with view. Second arg is not a valid model or list!');
  }

  if (view.__coupled) {
    view.__coupled.uncouple();
    // return log.error('Model or List', model.name, 'already coupled with', model.__coupled.obj.name, '. Only one view can be coupled with a model or a list !');
  }

  log.info('Couple view', view.name, 'with', model.name);

  view.__coupled = {
    obj: model,
    events: [],
    uncouple: function(onlySelf) {
      log.info('Uncouple view', view.name, 'from', model.name);
      view.__coupled.events.forEach(function(ev) {
        ev.remove();
      });

      delete view.__coupled;
    }
  };

  var eventsMap;
  if (model instanceof Model) {
    eventsMap = {
      'form.submit': 'submit',
      'input.change': 'set',
      'input.edit': function(key, value) {
        var check = model.checkValidation(key, value);
        if (check) {
          view.validationSucceeded(key, value);
        }
        else {
          view.validationFailed([{
            property: name
          }]);
        }
      }
    };
  }
  else {
    eventsMap = {
      'form.submit': 'submit'
    };
  }

  var listener = function(listener, func) {
    var fn = typeof func === 'function' ? func : model[func].bind(model);
    var handler = view.on(listener, fn);
    view.__coupled.events.push(handler);
  };

  for (var key in eventsMap) {
    if (eventsMap.hasOwnProperty(key)) {
      listener(key, eventsMap[key]);
    }
  }

};

/**
 * Initialize a new view into the presenter scope
 *
 * options: {
 *   mode: String       Insert mode, (append, prepend or replace) replace is default
 *   inject: Boolean    Set to false to disable injecting view into the DOM
 *   forms: Boolean|String     View has forms. Add a selector here or set this to true to find all forms
 * }
 *
 * @method initView
 * @public
 * @param  {String} viewName  Name of the view
 * @param  {String} container Container selector, default is 'body'
 * @param  {Object} options   View options
 * @return {Object}           Returns a view object
 */
Presenter.prototype.initView = function(viewName, container, options) {
  options = options || {};
  var tmplOptions = {};

  if (options.viewDir) {
    tmplOptions.viewDir = options.viewDir;
  }

  var view = new View(viewName, function(self) {
    self.template = Tmpl.getTemplate(viewName, tmplOptions);
    self.mode = options.mode || 'replace';
    self.container = container || 'body';
    self.hidden = !!options.hidden;
    self.forms = options.forms;
    if (options.inject === false) {
      self.autoInject = false;
    }
  });

  this.__views[viewName] = view;

  var self = this;
  if (XQCore.html5Routes) {
    view.on('xqcore.navigate', function(url) {
      self.router.callRoute(url);
    });
  }

  return view;
};

/**
 * Register a route listener
 *
 * @method route
 * @param {String|Array} route Route string
 * @param {Function} callback Callback function
 *
 * @chainable
 * @returns {Object} Returns this value
 */
Presenter.prototype.route = function(route, callback) {
  var self = this;

  if (typeof callback === 'string') {
    callback = this[callback];
  }

  if (typeof callback === 'function') {
    if (typeof route === 'string') {
      this.router.addRoute(route, callback);
    }
    else if (Array.isArray(route)) {
      route.forEach(function(r) {
        self.router.addRoute(r, callback);
      });
    }
  }
  else {
    log.warn('Router callback isn\'t a function', callback, 'of route', route);
  }

  return this;
};

Presenter.prototype.createView = function (viewTree) {
  log.debug('Render view tree', viewTree);

  var tree = XQCore.recurse([viewTree], function(data, next) {
    var tagName = data.name;
    var view = new View(tagName);
    var childs = next(data.childs);
    if (childs) {
      view.append(childs);
    }

    if (data.model) {
      var model = new XQCore.__models[data.model]();

      if (view.el.$change) {
        view.el.on('change', function(evData) {
          if (data.prop) {
            model.set(data.prop, evData);
          }
        });
      }
    }
    else if (data.list) {
      var list = new XQCore.__lists[data.list]();

      if (view.el.$change) {
        view.el.on('change', function(evData) {
          if (data.prop) {
            var listItem = {};
            listItem[data.prop] = evData;
            list.add(listItem);
          }
        });
      }

      if (view.el.push) {
        list.on('item.push', function(model) {
          view.el.push(model[0].get());
        });

        list.each(function(model) {
          view.el.push(model.get());
        });
      }
    }

    return view;
  });

  document.addEventListener('DOMContentLoaded', function() {
    tree[0].injectInto(document.body);
  });
};

// New supershitty methods

/**
 * Active method, called when presenter gets active
 *
 * @method active
 * @override
 * @version 1.0.0
 *
 * @param  {function} fn Callback function. First argument is a Router object
 *
 * @chainable
 * @return {object} Returns this value
 */
Presenter.prototype.active = function(fn) {
  log.debug('Activate presenter, no active() method was set for route ' + this.path);
  return this;
}

/**
 * Inactive method, called when presenter gets inactive
 *
 * @method inactive
 * @override
 * @version 1.0.0
 *
 * @param  {function} fn Callback function. First argument is a Router object
 *
 * @chainable
 * @return {object} Returns this value
 */
Presenter.prototype.inactive = function(fn) {
  log.debug('Inactivate presenter, no inactive() method was set for route ' + this.path);
  return this;
}

//--

module.exports = Presenter;

});
require.register('./src/router.js', function(module, exports, require) { /**
 * XQCore router
 *
 * Based on router.js v2.1.0
 * Copyright Aaron Blohowiak and TJ Holowaychuk 2011.
 * https://github.com/aaronblohowiak/routes.js
 *
 * @module  XQCore.Router
 *
 * @example
 *
 * var router = XQCore.Router.getInstance(); //Returns a singelton
 * router.addRoute('/index', function() {
 *     // index route was called
 * });
 *
 * router.addRoute('/foo/:name', function(data) {
 *     // data.name contains the name part
 * });
 *
 *
 */

'use strict';


var XQCore = require('./xqcore');
var Logger = require('./logger');

var $ = require('jquery');

var log = new XQCore.Logger('Router');

/**
 * Convert path to route object
 *
 * A string or RegExp should be passed,
 * will return { re, src, keys} obj
 *
 * @param  {String / RegExp} path
 * @return {Object}
 */

/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @ignore
 * @param  {String} path
 * @param  {Array} keys
 * @return {RegExp}
 */
var pathToRegExp = function(path, keys) {
  path = path
    .concat('/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?|\*/g, function(_, slash, format, key, capture, optional) {
      if (_ === '*') {
        keys.push(undefined);
        return _;
      }

      keys.push(key);
      slash = slash || '';
      return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || '([^/]+?)') + ')' + (optional || '');
    })
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.*)');
  return new RegExp('^' + path + '$', 'i');
};

var Route = function(path) {
  var src, re, keys = [];
  log.logLevel = XQCore.logLevel;

  if (path instanceof RegExp) {
    re = path;
    src = path.toString();
  } else {
    re = pathToRegExp(path, keys);
    src = path;
  }

  return {
    re: re,
    src: path.toString(),
    keys: keys
  };
};


/**
 * Attempt to match the given request to
 * one of the routes. When successful
 * a  {fn, params, splats} obj is returned
 *
 * @param  {Array} routes
 * @param  {String} uri
 * @return {Object}
 */
var match = function(routes, uri, startAt) {
  var captures, i = startAt || 0;

  for (var len = routes.length; i < len; ++i) {
    var route = routes[i],
      re = route.re,
      keys = route.keys,
      splats = [],
      params = {};

    captures = uri.match(re);
    if (captures) {
      for (var j = 1, cLen = captures.length; j < cLen; ++j) {
        var key = keys[j - 1],
          val = typeof captures[j] === 'string' ? unescape(captures[j]) : captures[j];
        if (key) {
          params[key] = val;
        } else {
          splats.push(val);
        }
      }
      return {
        params: params,
        splats: splats,
        route: route.src,
        next: i + 1
      };
    }
  }
};

/**
 * Router constructor
 *
 * @constructor
 */
var Router = function(options) {
  options = options || {};

  /**
   * Contains all registered routes
   *
   * @property {Array} routes
   * @private
   */
  this.routes = [];

  this.routeMap = {};

  if (!options.noListener) {
    this.registerListener();
  }

  var self = this;
  $(function() {
    //Call current page
    self.callRoute(self.getPath(), {
      initialCall: true
    });
  });
};

var instance;

/**
 * Returns a singelton instance of XQCore.Router
 * @return {[type]} [description]
 */
Router.getInstance = function() {
  if (!instance) {
    instance = new XQCore.Router();
  }

  return instance;
};

Router.prototype.registerListener = function() {
  if (XQCore.html5Routes) {
    window.addEventListener('popstate', this.onPopStateHandler.bind(this));
  }
  else {
    window.addEventListener('hashchange', this.onPopStateHandler.bind(this));
  }
};

Router.prototype.onPopStateHandler = function(e) {
  var path = this.getPath();
  this.callRoute(path, {
    noPush: true
  });
};

Router.prototype.getPath = function() {
  var path;
  if (XQCore.html5Routes) {
    path = location.pathname;
    return path.replace(new RegExp('^' + XQCore.basePath), '');
  }
  else {
    path = location.hash;
    path = path.replace(new RegExp('^' + XQCore.hashBang), '');
    path = '/' + path;
    return path;
  }
};

/**
 * Registers a new route
 *
 * @method addRoute
 * @param {String}   path Route path
 * @param {Function} fn   Function to be called when addRoute will be called
 * @returns {Object} Returns this value
 * @chainable
 */
Router.prototype.addRoute = function(path, fn) {
  log.info('Register new route:', path, fn);

  if (!path) {
    throw new Error(' route requires a path');
  }

  if (!fn) {
    throw new Error(' route ' + path.toString() + ' requires a callback');
  }

  if (this.routeMap[path]) {
    throw new Error('path is already defined: ' + path);
  }

  if (typeof path === 'string') {
    path = path.replace(/\/$/, '');
    if (path.charAt(0) !== '/') {
      path = '/' + path;
    }
  }

  var route = new Route(path);
  route.fn = fn;

  this.routes.push(route);
  this.routeMap[path] = fn;

  return this;
};

/**
 * Removes a route
 *
 * @method removeRoute
 * @param  {String} path Path to be removed
 * @return {Object}      Returns this value
 * @chainable
 */
Router.prototype.removeRoute = function(path) {
  if (!path) {
    throw new Error(' route requires a path');
  }

  if (!this.routeMap[path]) {
    log.warn('Can not remove route! Route does not exists: ' + path);
    return this;
  }

  for (var i = 0; i < this.routes.length; i++) {
    var route = this.routes[i];
    if (route.src === path) {
      this.routes.splice(i, 1);
    }
  }

  delete this.routeMap[path];
  return this;
};

Router.prototype.match = function(pathname, startAt) {
  var route = match(this.routes, pathname, startAt);
  if (route) {
    route.fn = this.routeMap[route.route];
    route.next = this.match.bind(this, pathname, route.next);
  }
  return route;
};

/**
 * Calls a route
 *
 * Options:
 * --------
 * **noRoute** Doesn't add a push state item
 * **replace** Add a replace state item
 *
 *
 * @method callRoute
 * @param  {String} path Route path
 * @param {Object} [options] Set options for route call
 *
 */
Router.prototype.callRoute = function(path, options) {
  options = options || {};

  log.info('Call route', path);

  if (path === undefined) {
    throw new Error('XQCore.Router error! Path is undefined in callRoute()!');
  }

  var route = this.match(path);
  if (!route) {
    log.warn('Could not call any route! No route were found! Called path: ' + path);
    return;
  }

  route.path = path;

  route.initialCall = !!options.initialCall;

  if (XQCore.html5Routes && !options.noPush && !options.replace) {
    history.pushState(null, '', path);
  }
  else if (XQCore.html5Routes && options.replace) {
    history.replaceState(null, '', path);
  }

  var next = function() {
    log.info('... trigger route', this.route, this.fn, this.next);
    this.fn.call(this, this.params, this.splats, function() {
      var nextRoute = this.next();
      if (nextRoute) {
        next.call(nextRoute);
      }
    }.bind(this));
  };

  next.call(route);

};

module.exports = Router;

});
require.register('./src/view.js', function(module, exports, require) { /**
 * XQCore View module
 *
 * A view renders a .fire or .hbs template and injects the result into the dom.
 *
 * @package XQCore
 * @module View
 * @returns {object} Returns a View prototype object
 */
'use strict';

var $ = require('jquery');
var log;

var XQCore = require('./xqcore');
var Logger = require('./logger');
var Tmpl = require('./tmpl');
var EventEmitter = require('./event');

/**
 * View
 *
 * @class View
 * @constructor
 *
 * @param {object} conf View configuration
 */
var View = function(name, conf) {
  //Call EventEmitter constructor
  EventEmitter.call(this);

  if (typeof arguments[0] === 'object' || typeof arguments[0] === 'function') {
    conf = name;
    name = null;
  }
  else if (typeof arguments[0] === 'string') {
    this.name = name;
  }

  /**
   * Logger instance
   * @ignore
   * @type {Object}
   */
  log = new Logger(this.name + 'View');

  /**
   * Sets the container element
   * @property container
   * @type Selector
   * @default 'body'
   */
  this.container = 'body';

  /**
   * Set the view element tag. If no tag are set, a tag dependent from its parent type will be created
   *
   * Tag types dependent from parent:
   *
   * | parent  | view tag |
   * ----------------------
   * | body    | section  |
   * | section | section  |
   * | ul      | li       |
   * | table   | tbody    |
   * | tbody   | tr       |
   * | tr      | td       |
   * | *       | div      |
   * ----------------------
   *
   * @property tag
   * @type {String}
   * @default '<parent dependent>'
   */
  this.tag = undefined;

  /**
   * Defines css class name(s) of the view element
   *
   * @property {string}
   * @default undefined
   */
  this.className = undefined;

  /**
   * Sets an id attribute
   *
   * @property {string}
   * @default undefined
   */
  this.id = undefined;

  /**
   * Set the insert mode
   *
   * @property mode
   * @type {String}
   * @default replace
   */
  this.mode = 'replace';

  /**
   * Enable/Disable autoInjection of the view into the DOM
   *
   * @property autoInject
   * @type {Boolean}
   * @default true
   */
  this.autoInject = true;

  /**
   * Holds the domReady state
   *
   * @property __domReady
   * @type {Boolean}
   * @default false
   * @private
   */
  this.__domReady = false;

  /**
   * Registered view events
   * @type {array}
   * @private
   */
  this.__viewEvents = [];

  var self = this;

  if (typeof conf === 'function') {
    conf.call(this, self);
  }
  else {
    XQCore.extend(this, conf);
  }

  /**
   * Set view name
   * @public
   * @type {String}
   */
  this.name = (this.name ? this.name.replace(/View$/, '') : 'Nameless') + 'View';

  this.__createView();

  $(function() {
    if (self.container.length > 0) {
      window.addEventListener('resize', function(e) {
        self.resize(e);
      }, false);

      log.info('Initialize view ' + this.name, ' with conf:', conf);
      log.info(' ... using Container:', self.container);
    }
    else {
      log.error('Can\'t initialize View, Container not found!', self.container);
    }
  });
};

XQCore.extend(View.prototype, EventEmitter.prototype);

/**
 * Show view if it is invisible
 *
 * @method show
 * @param {Boolean} hideOther Hide all other sibling views
 * @chainable
 * @fires view.show Fires a v`view.show` event
 * @returns {Object} Returns this value
 */
View.prototype.show = function(hideOther) {
  var self = this;

  if (hideOther) {
    self.$ct.children('.xq-view').each(function() {
      if (this !== self.el) {
        var view = $(this).data('view');
        view.hide();
      }
    });
  }

  this.$el.show().removeClass('xq-hidden');
  this.emit('view.show');
  return this;
};

/**
 * Hide view
 *
 * @method hide
 * @chainable
 * @fires view.hide Fires a v`view.hide` event
 * @return {Object} Returns this value
 */
View.prototype.hide = function() {
  this.$el.hide().addClass('xq-hidden');
  this.emit('view.hide');
  return this;
};

/**
 * Marks a view as active, optionally inactivates all other sibling views
 *
 * @method active
 * @param {Boolean} inactivateOther Makes all other sibling views inactive
 * @chainable
 * @fires view.active Fires a v`view.active` event
 * @returns {Object} Returns this value
 */
View.prototype.active = function(inactivateOther) {
  var self = this;

  if (inactivateOther) {
    self.$ct.children('.xq-view').each(function() {
      if (this !== self.el) {
        var view = $(this).data('view');
        view.inactive();
      }
    });
  }

  this.$el.addClass('xq-active').removeClass('xq-inactive');

  this.emit('view.active');
  return this;
};

/**
 * Marks a view as inactive
 *
 * @method inactivate
 * @chainable
 * @fires view.inactive Fires a v`view.inactive` event
 * @return {Object} Returns this value
 */
View.prototype.inactive = function() {
  this.$el.removeClass('xq-active').addClass('xq-inactive');
  this.emit('view.inactive');
  return this;
};

View.prototype.renderHTML = function(template, data) {
  log.log('Render html snippet', template, 'with data:', data);
  template = typeof template === 'function' ? template : Tmpl.compile(template);
  return template(data);
};

/**
 * To be called if window resizes
 * This is a placeholder method. Override this method if its needed
 *
 * @overridable
 * @return {Object} Returns this value
 */
View.prototype.resize = function() {
  return this;
};

/**
 * Gets the data of an element
 *
 * @param {Object} selector DOM el or a jQuery selector of the element
 *
 * @return {Object} Returns the data of an element or null
 */
View.prototype.getElementData = function(selector) {
  var el = $(selector, this.container);
  if (el.length) {
    var data = {},
      attrs = el.get(0).attributes,
      i;

    for (i = 0; i < attrs.length; i++) {
      if (attrs[i].name.indexOf('data-') === 0) {
        var name = attrs[i].name.substr(5),
          value = attrs[i].value;

        if (typeof value === 'string') {
          try {
            if (value === 'true' || value === 'TRUE') {
              value = true;
            }
            else if (value === 'false' || value === 'FALSE') {
              value = false;
            }
            else if (value === 'null' || value === 'NULL') {
              value = null;
            }
            else if (value === 'undefined') {
              value = undefined;
            }
            else if (+value + '' === value) {
              value = +value;
            }
            else {
              value = JSON.parse(value);
            }
          }
          catch(err) {
            // do nothing here
          }
        }

        data[name] = value;
      }
    }

    return data;
  }
  else {
    return null;
  }
};

/**
 * If a validation failed (Automatically called in a coupled view)
 *
 * @method validationFailed
 * @param {Object} err Validation error object
 */
View.prototype.validationFailed = function(err, data) {
  var self = this;

  err.forEach(function(item) {
    self.$el.find('[name="' + item.property + '"]').addClass('xq-invalid');
  });
};

/**
 * If a validation succeeds (Automatically called in a coupled view)
 *
 * @method validationSucceeded
 * @param {String} name Input name
 * @param {String} value Input value
 */
View.prototype.validationSucceeded = function(name, value) {
  var self = this;

  self.$el.find('[name="' + name + '"]').removeClass('xq-invalid');
};

/**
 * To be called when a state.change event from a coupled model was revived
 *
 * @param {String} state Model state
 * @override
 */
View.prototype.onStateChange = function(state) {
  if (!this.el) {
    this.__initialState = state;
    return;
  }

  var classNames = this.el.className.split(' ');
  classNames = classNames.filter(function(cssClass) {
    return !/^xq-state-/.test(cssClass);
  });

  classNames.push('xq-state-' + state);
  this.el.className = classNames.join(' ');
};

/**
 * Wait till view is ready
 *
 * @method ready
 * @param {Function} callback Callback
 */
View.prototype.ready = function(callback) {
  if (this.isReady) {
    callback.call(this);
  }
  else {
    if (!this.__readyCallbacks) {
      this.__readyCallbacks = [];
    }

    this.__readyCallbacks.push(callback);
  }
};

View.prototype.__setReadyState = function() {
  var self = this;

  this.isReady = true;
  if (this.__readyCallbacks) {
    this.__readyCallbacks.forEach(function(fn) {
      fn.call(self);
    });
    this.__readyCallbacks = [];
  }
};

/**
 * Inject element into the DOM
 *
 * @public
 * @method inject
 */
View.prototype.inject = function() {
  var isInDOM = this.isElementInDOM(this.ct);
  if (this.el.parentNode === this.ct && isInDOM) {
    return;
  }

  if (!isInDOM) {
    this.$ct = $(this.container);
    this.ct = this.$ct.get(0);
  }

  log.info('Inject view into container', this.$ct);

  if (this.mode === 'replace') {
    var childs = this.$ct.contents();
    childs.each(function() {
      var view = $(this).data('view');
      if (view) {
        view.detach();
      }
      else {
        $(this).detach();
      }
    });

    // this.$ct.contents().detach();
    this.$ct.append(this.$el);
  }
  else if (this.mode === 'append') {
    this.$ct.append(this.$el);
  }
  else if (this.mode === 'prepend') {
    this.$ct.prepend(this.$el);
  }
  else {
    throw new Error('Unknown insert mode in view constructor');
  }

};

/**
 * Parse a precompiled template and returns a html string
 *
 * @method parse
 *
 * @param {Function} template Precompiled template
 * @param {Object} data Data object
 *
 * @return {String} compiled html
 */
View.prototype.parse = function(template, data, __scopes) {
  var html,
    $newEl;

  template.scopeStore = {};
  template.scopes = __scopes || {};

  try {
    html = template(data || {}, template.scopes);
  }
  catch(err) {
    html = '<p class="renderError"><b>View render error!</b><br>' + err.message + '</p>';
    log.error('View render error!', err);
  }

  var parseScope = function(html, data, parent) {
    html = $.parseHTML(html);
    var $scopeEl = $(html);
    var els = $scopeEl.find('scope');

    var counter = {};

    els.each(function() {
      var scopeId = $(this).attr('id'),
        path = $(this).attr('path'),
        content;

      var dataPath = parent ? parent + '.' + path : path;

      if (Array.isArray(data)) {
        counter[path] = counter[path] || 0;
      }

      content = {};
      if (scopeId) {
        var scopeHTML = template.scopes[scopeId](data[path], data);
        content.value = scopeHTML ? parseScope(scopeHTML, data[path], dataPath) : document.createTextNode('');
        content.id = scopeId;
      }
      else {
        content.value = $.parseHTML(data[path]);
      }

      template.scopeStore[dataPath] = template.scopeStore[dataPath] || [];
      template.scopeStore[dataPath].push(content);

      $(this).replaceWith($(content.value));
    });

    return $scopeEl;
  };

  if (html) {
    $newEl = parseScope(html, data);
  }

  return $newEl;
};

/**
 * Render view
 *
 * @method render
 * @chainable
 * @emits content.change
 *
 * @param  {Object} data Render data
 * @returns {Object} Returns this value
 */
View.prototype._render = function(data) {
  if (this.__domReady === false) {
    this.__initialData = data || {};
    return this;
  }

  if (this.autoInject) {
    this.inject();
  }

  var html;

  log.info('Render view template of view ' + this.name, 'with data:', data);

  var template = typeof this.template === 'function' ? this.template : Tmpl.compile(this.template);
  this.scopes = {};

  try {
    html = template(data || {}, this.scopes);
  }
  catch(err) {
    html = '<p class="renderError"><b>View render error!</b><br>' + err.message + '</p>';
    log.error('View render error!', err);
  }

  this.el.innerHTML = html;
  this.emit('content.change', data);

  this.registerListener(this.$el);
  this.registerForms();

  return this;
};

/**
 * Render view
 *
 * @method render
 * @chainable
 * @emits content.change
 *
 * @param  {Object} data Render data
 * @returns {Object} Returns this value
 */
View.prototype.render = function(data) {
  if (this.__domReady === false) {
    this.__initialData = data || {};
    return this;
  }

  if (this.autoInject) {
    this.inject();
  }

  var html;

  log.info('Render view template of view ' + this.name, 'with data:', data);

  var template = typeof this.template === 'function' ? this.template : Tmpl.compile(this.template);

  this.scopes = {
    dataFn: function(path, data) {
      var d = data[path];
      if (d === null || d === undefined) {
        d = '';
      }

      return '<ftl path="' + path + '">'+d+'</ftl>';
    },
    scopeFn: function(scopeId, path, data) {
      if (path === 'data' && Array.isArray(data)) {
        path = '_ftl_root';
      }

      return '<ftl scope="' + scopeId + '" path="' + path + '"></ftl>';
    },
    attrFn: function(attr, value) {
      var val1 = value.replace(/<ftl path="([a-zA-Z0-9_.-]+)">(.+?)<\/ftl>/g, function(str, p1, p2) {
        return p2;
      });

      var val2 = value.replace(/<ftl path="([a-zA-Z0-9_.-]+)">(.+?)<\/ftl>/g, function(str, p1, p2) {
        return '%s';
      });

      var attrs = attr + '="' + val1 + '" xq-' + attr + '="' + val2 + '"';
      return attrs;
    }
  };

  try {
    html = template(data || {}, this.scopes);
  }
  catch(err) {
    html = '<p class="renderError"><b>View render error!</b><br>' + err.message + '</p>';
    log.error('View render error!', err);
  }

  this.el.innerHTML = html;
  var self = this;
  this.scopesMap = {};

  //Replace scopes
  this.$el.find('ftl').each(function() {
    var scope = $(this).attr('scope');
    var path = $(this).attr('path');
    if (scope) {
      self.replaceScopes($(this), scope, data, path, path);
    }
    else {
      self.replaceNode($(this), path);
    }
  });

  this.emit('content.change', data);

  this.registerListener(this.$el);
  this.registerForms();

  return this;
};

View.prototype.replaceScopes = function($el, scope, data, path, fullPath) {
  var self = this;
  var scopeData = path && path !== '_ftl_root' ? data[path] : data;
  var html = self.scopes[scope](scopeData, data);
  var $html = $($.parseHTML(html));
  var $parent = $el.parent();

  //Replace scopes
  $html.find('ftl').each(function() {
    var scope = $(this).attr('scope');
    var path = $(this).attr('path');
    if (scope) {
      self.replaceScopes($(this), scope, scopeData, path, fullPath + (Array.isArray(scopeData) ? '[].' : '.') + path);
    }
    else {
      self.replaceNode($(this), fullPath + (Array.isArray(scopeData) ? '[].' : '.') + path);
    }
  });

  $el.replaceWith($html);

  if (fullPath.indexOf('[].') !== -1) {
    return;
  }

  if (!(fullPath in self.scopesMap)) {
    self.scopesMap[fullPath] = [];
  }

  var splitItems = function($html) {
    if (!Array.isArray(scopeData)) {
      return [$html];
    }
    var len = $html.length / scopeData.length;
    var out = [];

    var next = [];
    $html.each(function() {
      next.push($(this).get(0));
      if (next.length === len) {
        out.push(next);
        next = [];
      }
    });

    return out;
  };

  self.scopesMap[fullPath].push({
    type: 'scope',
    fn: self.scopes[scope],
    childs: splitItems($html, scopeData),
    parentData: data,
    parent: $parent
  });
};

View.prototype.replaceNode = function($el, fullPath) {
  var self = this;
  var nodeData = $el.html();

  var node = document.createTextNode(nodeData);
  $el.replaceWith(node);

  if (fullPath.indexOf('[].') !== -1) {
    return;
  }

  if (!(fullPath in self.scopesMap)) {
    self.scopesMap[fullPath] = [];
  }

  self.scopesMap[fullPath].push({
    type: 'node',
    node: node
  });
};

View.prototype.renderScope = function(scope, path, data) {
  var self = this;
  var html = $.parseHTML(scope.fn(data, scope.parentData));
  var $html = $(html);
  $html.find('ftl').each(function() {
    var scope = $(this).attr('scope');
    var path = $(this).attr('path');
    if (scope) {
      self.replaceScopes($(this), scope, data, path, path);
    }
    else {
      self.replaceNode($(this), path);
    }
  });

  this.registerListener($html);

  return $html;
};

View.prototype.renderNode = function(scope, path, data) {
  scope.node.nodeValue = data;
};

View.prototype.registerListener = function($el) {
  var self = this;

  $el.find('[on]').addBack('[on]').each(function() {
    var $cur = $(this);
    var events = $(this).attr('on');
    var data = $(this).data();
    var listenerFunc;
    $cur.removeAttr('on');

    events = events.split(';');
    events.forEach(function(ev) {
      ev = ev.split(':');

      if (ev[0] === 'submit') {
        listenerFunc = function(e) {
          e.preventDefault();
          data = self.serializeForm(e.target);
          data = self.onSubmit(data, e.target);
          self.emit(ev[1], data, e);
        };
      }
      else {
        listenerFunc = function(e) {
          var value;

          if (e.originalEvent instanceof KeyboardEvent) {
            value = {
              key: e.key,
              code: e.keyCode,
              alt: e.altKey,
              ctrl: e.ctrlKey,
              meta: e.metaKey,
              shift: e.shiftKey
            };
          }
          else if (e.originalEvent instanceof MouseEvent) {
            e.preventDefault();
            value = {
              button: e.button,
              alt: e.altKey,
              ctrl: e.ctrlKey,
              meta: e.metaKey,
              shift: e.shiftKey
            };

            if (e.type === 'click' && e.currentTarget.href) {
              value.href = e.currentTarget.href;
            }

          } else {
            e.preventDefault();
            value = e.currentTarget.value || '';
          }

          self.emit(ev[1], value, data, e);
        };
      }

      $cur.bind(ev[0], listenerFunc);
    });
  });
};

/**
 * Serialize a form and return its values as JSON
 *
 * @param {Object} Form selector
 * @return {Object} FormData as JSON
 */
View.prototype.serializeForm = function(selector) {
  var formData = {},
    formSelector = $(selector);

  if (formSelector.get(0).tagName !== 'INPUT') {
    formSelector = formSelector.find(':input');
  }

  formSelector.serializeArray().forEach(function(item) {
    XQCore.dedotify(formData, item.name, item.value);
  });

  log.info('Serialize form of view ' + this.name, 'form selector:', formSelector, 'form data:', formData);

  return formData;
};

/**
 * Insert a subset
 * @param  {String} path  Data path
 * @param  {Number} index Index after which item the insert should be happen or use -1 to prepend
 * @param  {Object} data  Item data
 */
View.prototype.insert = function(path, index, data) {
  var self = this;
  if (path in this.scopesMap) {
    this.scopesMap[path].forEach(function(scope) {
      var $html = self.renderScope(scope, path, [data]);
      if (index === -1) {
        scope.parent.append($html);
        scope.childs.push([$html.get()]);
      }
      else if (index === 0) {
        scope.parent.prepend($html);
        scope.childs.unshift([$html.get()]);
      }
      else {
        var els = scope.childs[index];
        $(els[0]).before($html);
        var args = [index, 0].concat([$html.get()]);
        scope.childs.splice.apply(scope.childs, args);
      }
    });
  }
};

View.prototype.update = function(path, data) {
  log.warn('XQCore doesn`t support update events yet');
};

View.prototype.append = function(path, data) {
  if (arguments.length === 1) {
    data = path;
    path = 'data';
  }

  this.insert(path, -1, data);
};

View.prototype.prepend = function(path, data) {
  if (arguments.length === 1) {
    data = path;
    path = 'data';
  }

  this.insert(path, 0, data);
};

/**
 * Remove an item from a subset. Removes the item with the given index.
 * If index is negative number it will be removed from the end
 *
 * @param  {String} path  data path
 * @param  {Number} index Index of the item
 */
View.prototype.remove = function(path, index) {
  if (path in this.scopesMap) {
    this.scopesMap[path].forEach(function(scope) {
      var els = scope.childs[index];
      if (Array.isArray(els)) {
        els.forEach(function(el) {
          $(el).remove();
        });
      }
      else {
        $(els).remove();
      }

      scope.childs.splice(index, 1);
    });
  }
};

View.prototype.removeLast = function(path) {
  log.warn('XQCore doesn`t support pop events yet');
};

View.prototype.removeFirst = function(path) {
  log.warn('XQCore doesn`t support shift events yet');
};

View.prototype.change = function(path, value) {
  var self = this;

  this.ready(function() {
    if (path in this.scopesMap) {
      this.scopesMap[path].forEach(function(scope) {
        if (scope.type === 'node') {
          self.renderNode(scope, path, value);
        }
      });
    }
  });
};

/**
 * Seting up forms
 * It's wating till view is ready
 * @param  {Object} model Coupled model
 * @param  {Object} $el   Form element
 */
View.prototype.formSetup = function(model, $el) {
  var self = this;

  this.ready(function() {
    // var errClassName = 'xq-invalid',
      // disabledClass = 'xq-disabled';

    // if (!$el) {
    //     $el = this.$el.find('form');
    // }

    var changeHandler = function(e) {
      var value = e.target.value;
      var name = e.target.name;

      self.emit('input.change', name, value);
    };

    var keyUpHandler = function(e) {
      var value = e.target.value;
      var name = e.target.name;

      self.emit('input.edit', name, value);
    };

    var submitHandler = function(e) {
      e.preventDefault();
      var data = self.serializeForm(e.target);
      self.emit('form.submit', data);
    };

    this.addEvent(':input', 'change', changeHandler);
    this.addEvent(':input', 'keyup', keyUpHandler);
    this.addEvent('form', 'submit', submitHandler);
  });
};

/**
 * Called on submiting a form.
 *
 * @method onSubmit
 * @param {Object} data Form data
 * @param {Object} $form jQuery selector of the submited form
 * @returns {Object} Changed form data
 */
View.prototype.onSubmit = function(data, $form) {
  return data;
};

/**
 * Removes a view from dom but does not unreister its DOM event listener.
 * This is usefull if you wish to add this view later back into the DOM.
 * Uncouples itself from a coupled model or list.
 *
 * @method  detach
 *
 * @fires view.detach Fires a `view.detach` event before view is removing from dom.
 * @return {[type]} [description]
 */
View.prototype.detach = function() {
  log.info('Destroy view');

  this.emit('view.detach');

  this.$el.detach();

  if (this.__coupled) {
    //Uncouple other participate
    if (this.__coupled.obj.__coupled && this.__coupled.obj.__coupled.obj === this) {
      this.__coupled.obj.__coupled.uncouple();
    }

    this.__coupled.uncouple();
  }

  //TODO remove all events

  log.info('View ' + this.name + ' has been destroyed');
};

/**
 * Removes a view from dom and unregisters all its listener
 *
 * @fires view.destroy Fires a `view.destroy` event before view is removing from dom.
 * @return {[type]} [description]
 */
View.prototype.destroy = function() {
  log.info('Destroy view');

  this.emit('view.destroy');

  this.$el.remove();

  if (this.__coupled) {
    //Uncouple other participate
    if (this.__coupled.obj.__coupled && this.__coupled.obj.__coupled.obj === this) {
      this.__coupled.obj.__coupled.uncouple();
    }

    this.__coupled.uncouple();
  }

  //TODO remove all events

  log.info('View ' + this.name + ' has been destroyed');
};

/**
 * Register a DOM event listerner for a given element. The DOM element mustnt exists at this time. (Using jQuery.deleget() on the this.$el element)
 * @param {String}   selector A selector to the item that should trigger the event
 * @param {String}   events   A string of on ore more Javascript event handler. Use a space separated list for mor then one event. E.g: 'click mousedown'
 * @param {Function} callback Callback function to be called when event is triggered
 */
View.prototype.addEvent = function(selector, events, callback) {
  this.__viewEvents.push({
    events: events,
    selector: selector,
    callback: callback
  });

  if (this.$el) {
    this.$el.delegate(selector, events, callback);
  }
};


/**
 * Defines a container -> view tag type mapping
 *
 * @private true
 * @type {Object}
 */
View.prototype.__viewTagTypes = {
  '*': 'div',
  'body': 'section',
  'section': 'section',
  'ul': 'li',
  'table': 'tbody',
  'tbody': 'tr',
  'tr': 'td'
};

/**
 * Creates new view element, based on *tag* option
 *
 * @private true
 * @return {object} Returns a DOM element
 */
View.prototype.__createViewElement = function() {
  if (this.tag) {
    return document.createElement(this.tag);
  }

  var parentTag = this.ct ? this.ct.tagName.toLowerCase() : '*',
    viewTag = this.__viewTagTypes['*'];

  if (this.__viewTagTypes[parentTag]) {
    viewTag = this.__viewTagTypes[parentTag];
  }

  return document.createElement(viewTag);
};

/**
 * Creates a view and registers event listeners as soon as DOM is ready.
 *
 * @private true
 */
View.prototype.__createView = function() {
  var self = this,
    classNames = [];

  $(function() {
    //Create view element
    self.$ct = self.$ct || $(self.container);
    self.ct = self.$ct.get(0);

    self.el = self.__createViewElement();
    self.$el = $(self.el);
    self.$el.data('view', self);
    classNames.push('xq-view xq-' + self.name.replace(/View$/, '-view').toLowerCase());

    if (self.id) {
      self.el.setAttribute('id', self.id);
    }

    if (self.className) {
      classNames.push(self.className);
    }

    if (self.hidden === true) {
      classNames.push('xq-hidden');
      self.$el.hide();
    }

    self.el.className = classNames.join(' ');

    //Set DOM ready state
    self.__domReady = true;
    if (self.__initialData) {
      self.render(self.__initialData);
      delete self.__initialData;
    }

    // if (self.autoInject) {
    //     self.inject();
    // }

    //Set ready state
    self.__setReadyState();
    self.registerListener(self.$el);

    //Register view listener
    if (XQCore.html5Routes) {
      self.$el.on('click', 'a', function(e) {
        if (/^http(s)?:\/\//.test(e.currentTarget.href)) {
          return;
        }

        if (!/^\/?[a-z]/.test(e.currentTarget.href)) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        self.emit('xqcore.navigate', e.currentTarget.href);
      });
    }

    if (self.forms) {
      self.formSetup();
    }

    if (self.__initialState) {
      self.onStateChange(self.__initialState);
      delete self.__initialState;
    }
  });
};

View.prototype.registerForms = function() {
  if (this.forms) {
    var formSelector = 'form';
    if (typeof this.forms === 'string') {
      formSelector = this.forms;
    }

    this.ready(function() {
      this.$forms = this.$el.find(formSelector);
      this.$forms.addClass('xq-forms');
      this.$forms.find(':input').addClass('xq-input');
    });
  }
};

/**
 * Checks whether an element is in the DOM or not.
 *
 * @private
 * @param  {Object}  el DOM element wich sholld be checked
 * @return {Boolean}    Returns true if element is still in the DOM
 */
View.prototype.isElementInDOM = function(el) {
  while (el) {
    if (el === document.body) {
      return true;
    }

    el = el.parentNode;
  }

  return false;
};

//--

module.exports = View;

});
require.register('./src/tmpl.js', function(module, exports, require) { /**
 * Template module
 *
 * @package XQCore
 * @module Tmpl
 */

'use strict';

var XQCore = require('./xqcore');
var FireTPL = require('firetpl');

var Tmpl = {
  type: 'firetpl',
  compile: FireTPL.compile,
  getTemplate: function(viewName, options) {
    options = options || {};
    if (FireTPL.templateCache && FireTPL.templateCache[viewName]) {
      return FireTPL.templateCache[viewName];
    }
    else if(!FireTPL.loadFile) {
      throw new Error('FireTPL runtime is being used. Please preload the ' + viewName + 'View');
    }
    else {
      var viewDir = options.viewDir || XQCore.viewsDir;
      var tmpl = FireTPL.readFile(viewDir.replace(/\/$/, '') + '/' + viewName + '.' + XQCore.viewExt.replace(/^\./, ''));
      return FireTPL.compile(tmpl, {
        eventAttrs: true
      });
    }
  }
};

//--

module.exports = Tmpl;

});
require.alias['firetpl'] = 'firetpl/firetpl.js';
require.register('firetpl/firetpl.js', function(module, exports, require) { /*!
 * FireTPL template engine v0.6.2-22
 * 
 * FireTPL is a pretty Javascript template engine. FireTPL uses indention for scops and blocks, supports includes, helper and inline functions.
 *
 * FireTPL is licensed under MIT License
 * http://opensource.org/licenses/MIT
 *
 * Copyright (c) 2013 - 2016 Noname Media, http://noname-media.com
 * Author Andi Heinkelein <andi.oxidant@noname-media.com>
 *
 */

var FireTPL;

/**
 * FireTPL
 *
 * @module FireTPL
 */

(function (root, factory) {
    /*global define:false */
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define('firetpl', [], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.FireTPL = factory();
    }
}(this, function () {
    'use strict';

    /**
     * FireTPL template engine
     *
     * @module  FireTPL
     *
     * @example {js}
     * var fireTPL = new FireTPL();
     * var tmpl = fireTpl.compile('div $name');
     * var html = tmpl({
     *   name: 'Andi'
     * });
     *
     * // html = <div>Andi</div>
     */
    FireTPL = {
        /**
         * Contains current version
         * @property {String} version
         * @default v0.6.0
         */
        version: '0.6.2-22',

        /**
         * Defines the default language
         * @property {String} i18nDefault
         */
        i18nDefault: 'en',

        /**
         * Defines the current selected language
         * @property {String} i18nCurrent
         */
        i18nCurrent: 'en'
    };

    return FireTPL;
}));
'use strict';

/**
 * FireTPL error handler
 *
 * @module FireTPL Error handler
 */
(function(FireTPL) {

    var FireError = function(instance, msg) {
        if (typeof instance === 'object') {
            if (instance instanceof FireTPL.Parser) {
                var pos = instance.pos;
                msg = msg + '\n\n' + this.stripSource(pos, instance.inputStream);

                if (instance.fileName) {
                    msg += ' in file ' + instance.fileName;
                }
            }
        }
        else if (arguments.length) {
            msg = instance;
        }

        return new Error(msg);
    };

    FireError.prototype = Object.create(Error.prototype);
    FireError.prototype.constructor = FireError;

    FireError.prototype.stripSource = function(pos, tmpl) {
        var sourceStr,
            counter = 0,
            line = 0;

        var source = tmpl.split('\n');
        for (var i = 0, len = source.length; i < len; i++) {
            counter += source[i].length + 1; //Add +1 because line breaks
            ++line;
            if (counter > pos) {
                sourceStr = (source[i - 1] || '') + '\n' + (source[i]);
                sourceStr += '\n' + this.strRepeat(pos - (counter - source[i].length), ' ') + '^';
                break;
            }
        }

        sourceStr += '\nat line ' + line;

        return sourceStr;
    };

    FireError.prototype.strRepeat = function(num, str) {
        var out = '';

        while(--num) {
            out += str;

            if (num === -10) {
                throw 'Loop error';
            }
        }

        return out;
    };

    var ParseError = function(err, data, tmpl) {
        if (typeof err === 'string') {
            err = new Error(err);
        }

        this.name = 'FireTPL parse error';
        this.message = err.message;

        console.error('FireTPL parse error', err);
        console.error(err.stack);

        if (data) {
            console.log('Data: ', data);
        }

        if (tmpl) {
            console.log('----- Template source -----');
            console.log(tmpl);
            console.log('----- Template source -----');
        }
    };

    ParseError.prototype = Object.create(Error.prototype);
    ParseError.prototype.constructor = ParseError;

    FireTPL.Error = FireError;
    FireTPL.ParseError = ParseError;
})(FireTPL);
/**
 * FireTPL parser
 *
 * @module  FireTPL.Parser
 */
(function(FireTPL) {
    'use strict';

    /**
     * Parser constructor
     *
     * @constructor
     *
     * @example {js}
     * var parser = new FireTPL.Parser();
     * parser.parse('input string');
     * var parsedStr = parser.flush();
     *
     * Options:
     *
     * @arg eventTags {boolean}
     * Strip html event tags and add all into an `on` tag. The tag contains all event tags as a list seperated by a semicolon.
     * For example: `on="click:click-handler;mousedown:mouse-handler"`
     * 
     */
    var Parser = function(options) {
        options = options || {};

        this.tmplType = options.type || 'fire';
        this.voidElements = [
            'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen',
            'link', 'meta', 'param', 'track', 'source', 'wbr'
        ];

        this.indention = 0;
        this.closer = [];
        this.curScope = ['root'];
        this.out = { root: '' };
        this.lastTagPos = { 'root' : 4 };
        this.lastItemType = 'code';
        this.nextScope = 0;
        this.pos = 0;
        this.addEmptyCloseTags = false;
        this.indentionPattern = /\t| {1,4}/g;
        this.isNewLine = true;
        this.parseEventAttributes = options.eventAttrs || false;
        this.pretty = options.pretty || false;
        this.fileName = options.fileName;
        this.lastIndention = 0;

        this.syntax = this.getSyntaxConf(this.tmplType);
        this.includesPath = options.includesPath;
        this.templateCache = {};

        this.scopeTags = options.scopeTags || false;

        /**
         * Stores names of required includes
         * @property {Array}
         */
        this.includes = [];

        /**
         * Function to be called before include will be started.
         * Passe through the include name
         * @method beforeInclude
         * @param {String} include Name of current handled include
         * @returns {String} Must return the include name. Otherwis it will skip this include
         */
        this.beforeInclude = options.beforeInclude;
    };

    /**
     * Parses an input string
     * 
     * @param  {string} input Input string
     */
    Parser.prototype.parse = function(input) {
        var pat = this.patternBuilder();
        this.inputStream = input;

        if (this.logLevel & 4) {
            console.log('Parse a .' + type + ' Template');
        }

        var mapArgs = function(index) {
            return match[index];
        };

        this.addEmptyCloseTags = this.syntax.addEmptyCloseTags || false;

        // console.log('Funcs', pat.funcs);

        var reg = new RegExp(pat.pattern, pat.modifer);
        var d = 1000;

        var match;

        while (true) {
            if (--d === 0) {
                throw 'Infinite loop!';
            }

            reg.lastIndex = this.pos;
            match = reg.exec(this.inputStream);
            this.pos = reg.lastIndex;


            if (!match) {
                break;
            }

            // console.log(match[0]);// console.log(pat);
            for (var i = 0, len = pat.funcs.length; i < len; i++) {
                if (match[pat.funcs[i].index]) {
                    //Map args
                    var args = pat.funcs[i].args.map(mapArgs),
                        func = pat.funcs[i].func;

                    //Call parser func
                    // console.log('Call:', pat.funcs[i].func);
                    this[func].apply(this, args);
                    if (func !== 'parseIndention') {
                        this.isNewLine = false;
                    }
                    this.lastParserAction = func;
                    break;
                }
            }
        }
    };

    /**
     * Returns parsed data
     * 
     * @return {string} Returns parser result
     */
    Parser.prototype.flush = function() {
        while (this.closer.length > 0) {
            this.appendCloser();
        }

        var outStream = 'scopes=scopes||{};var root=data,parent=data,ctx={};';
        var keys = Object.keys(this.out);

        keys = keys.sort(function(a, b) {
            return b.localeCompare(a);
        });

        keys.forEach(function(key) {
            if (key === 'root') {
                return;
            }

            outStream += 'scopes.' + key + '=function(data,parent,ctx){var s=\'\';' + this.out[key] + 'return s;};';
        }.bind(this));

        outStream += 'var s=\'\';';
        outStream += this.out.root;

        if (this.lastItemType === 'str') {
            outStream += '\';';
        }

        //Clear data streams
        delete this.inputStream;
        delete this.out;

        return outStream;
    };

    Parser.prototype.parseEmptyLine = function(line) {
        // console.log('Empty line "%s"', line);
    };

    Parser.prototype.parseComment = function(comment) {
        var htmlComment;

        if (this.tmplType === 'fire') {
            if (/^\/\*!/.test(comment)) {
                htmlComment = comment.replace(/(^\/\*!|\*\/$)/g, '');
            }
        }
        else {
            if (/^\{\{!--/.test(comment)) {
                htmlComment = comment.replace(/(^\{\{!--|--\}\}$)/g, '');
            }
        }

        if (htmlComment) {
            htmlComment = '<!--' + htmlComment.replace(/\n/g, '\\n') + '-->';
            this.append('str', htmlComment);
            if (this.tmplType === 'fire') {
                this.closer.push('');
            }
        }
    };

    /**
     * Parse a tag
     * 
     * @private
     * @param  {string} tag Tag name
     * @param {string} tag attrs Tag attribute string
     */
    Parser.prototype.parseTag = function(tag, attrs) {
        attrs = this.matchAttributes(attrs);
        if (attrs) {
            attrs = ' ' + this.matchVariables(attrs);
        }

        if (this.lastItemType !== 'str') {
            //If last item type != str, s+=' is prexixed to string'
            this.lastTagPos[this.curScope[0]] = this.out[this.curScope[0]].length + 4;
        }
        else {
            this.lastTagPos[this.curScope[0]] = this.out[this.curScope[0]].length;
        }

        if (tag === 'dtd') {
            this.append('str', '<!DOCTYPE html>');
            this.closer.push('');
        }
        else {
            this.append('str', '<' + tag + attrs + '>');
            if (this.voidElements.indexOf(tag) === -1) {
                    this.closer.push('</' + tag + '>');
            }
            else {
                if (this.addEmptyCloseTags) {
                    this.closer.push('');
                }
            }
        }

    };

    Parser.prototype.parseIndention = function(indentionStr) {
        var indention = this.getIndention(indentionStr),
            newIndent = indention - this.indention,
            el;

        if (this.logLevel & 4) {
            console.log('  Parse indention:', indention, this.indention, newIndent);
        }

        if (newIndent === 0) {
            this.appendCloser();
        }
        else {
            while (newIndent < 1) {
                el = this.appendCloser();
                newIndent++;
            }
        }
                
        this.indention = indention;
        this.isNewLine = true;
    };

    /**
     * Parse a closing tag
     * 
     * @private
     * @param  {string} tag Tag name
     */
    Parser.prototype.parseCloseTag = function(tag) {
         var lastTag = this.closer.slice(-1)[0];
        if ('</' + tag + '>' !== lastTag) {
            throw new Error('Invalid closing tag! Expected </' + tag + '> but got a ' + lastTag);
        }

        this.appendCloser();
    };

    /**
     * Parse a closing helper tag
     * 
     * @private
     * @param  {string} tag Helper name
     */
    Parser.prototype.parseCloseHelper = function(helper) {
        var lastTag = this.closer.slice(-1)[0];
        if ('scope' !== lastTag) {
            throw new Error('Invalid closing helper! Expected </' + helper + '> but got a ' + lastTag);
        }

        this.appendCloser();
    };

    Parser.prototype.parseElseHelper = function() {
        this.parseCloseHelper('if');
        this.parseHelper('else');
    };

    /**
     * Parse a string
     * 
     * @private
     * @param  {string} str Tag name
     */
    Parser.prototype.parseString = function(str) {
        str = str.trim().replace(/\s+/g, ' ');
        str = this.matchVariables(str, false, true);
        
        if (this.tmplType === 'fire' && this.grepNextChar() === '"') {
            str += ' ';
        }

        this.append('str', str);
        if (this.addEmptyCloseTags && this.tmplType === 'fire' && this.isNewLine) {
            this.closer.push('');
        }
    };

    /**
     * Parse a html string
     * 
     * @private
     * @param  {string} str Tag name
     */
    Parser.prototype.parseHtmlString = function(str) {
        str = str.trim().replace(/\s+/g, ' ');
        str = this.matchVariables(str);
        
        if (this.tmplType === 'fire' && this.grepNextChar() === '\'') {
            str += ' ';
        }

        this.append('str', str);
        if (this.addEmptyCloseTags && this.tmplType === 'fire' && this.isNewLine) {
            this.closer.push('');
        }
    };

    /**
     * Parse a variable
     * 
     * @private
     * @param  {string} variable Tag name
     */
    Parser.prototype.parseVariable = function(variable) {
        this.append('str', this.matchVariables(variable));
        if (this.tmplType === 'fire' && this.isNewLine) {
            this.closer.push('');
        }
    };

    /**
     * Parse a helper
     * 
     * @private
     * @param  {string} helper Tag name
     */
    Parser.prototype.parseHelper = function(helper, expr, tag, tagAttrs) {
        var scopeId,
            tagStr = '';

        if (helper === 'else') {
            this.closer.push(['code', '']);
            this.newScope(this.lastIfScope);
            this.append('code', 'if(!r){s+=h(\'else\',c,parent,root,function(data){var s=\'\';');
            this.closer.push(['code', 'return s;});}']);
            this.closer.push('scope');
            return;
        }

        // this.lastIfScope = null;
        scopeId = this.getNextScope();

        if (tag) {
            tag = tag.trim();
            tagAttrs = tagAttrs || '';
            if (this.scopeTags) {
                tagAttrs += ' fire-scope="scope' + scopeId + '" fire-path="' + expr.replace(/^\$([a-zA-Z0-9_.-]+)/, '$1') + '"';
            }
            this.parseTag(tag, tagAttrs);
            tagStr = ',\'' + tag + '\',\'' + tagAttrs + '\'';
        }
        else {
            this.closer.push('');
        }

        if (expr) {
            expr = expr.trim();
            if (this.tmplType === 'hbs') {
                expr = '{{' + expr + '}}';
            }
            expr = this.matchVariables(expr, true);
        }

        if (this.scopeTags) {
            this.append('str', '<scope id="scope' + scopeId + '" path="' + expr + '"></scope>');
        }
        else {
            this.append('code', 's+=scopes.scope' + scopeId + '(' + expr + ',data,ctx);');
        }
        
        this.newScope('scope' + scopeId);

        if (helper === 'if') {
            // this.lastIfScope = scopeId;
            this.append('code', 'var c=data;var r=h(\'if\',c,parent,root,ctx,function(data){var s=\'\';');
            this.closer.push(['code', 'return s;});s+=r;']);
        }
        else {
            this.append('code', 's+=h(\'' + helper + '\',data,parent,root,ctx' + tagStr + ',function(data){var s=\'\';');
            this.closer.push(['code', 'return s;});']);
        }

        this.closer.push('scope');
        // this.appendCloser();
    };

    /**
     * Parse a sub helper
     * 
     * @private
     * @param {String} name Sub helper name
     * @param {Any} expr Expression
     * @param {String} tag Tag name
     * @param {String} attrs Attributes string
     */
    Parser.prototype.parseSubHelper = function(name, expr, tag, attrs) {
        if (attrs) {
            attrs = this.matchVariables(attrs);
        }
        
        this.append('code', 's+=ctx.' + name + '(' + this.matchVariables(expr, true, false) + ',\'' + tag + '\',\'' + attrs + '\',function(data){var s=\'\';');
        this.closer.push(['code', 'return s;});']);
    };

    /**
     * Parse a code block
     *
     * @private
     * @param  {string} type Source codetype
     * @param  {string} code Source code content
     */
    Parser.prototype.parseCodeBlock = function(type, code) {
        var self = this;
        var cssClass = 'class="' + ('codeBlock ' + type).trim() + '"';
        var pat = new RegExp(this.syntax.codeVariable, 'g');

        code = this.undent(this.indention + 1, code);
        code = this.escape(code).trim();

        // console.log('CODE', code, pat);
        code = code.replace(pat, function(match, p1) {
            if (p1.charAt(0) === '\\') {
                return p1.slice(1);
            }

            return self.matchVariables(p1.slice(1, -1));
        });

        code = this.htmlEscape(code).replace(/\n/g, '\\n\\\n');
        
        this.append('str', '<code ' + cssClass + '>' + code + '</code>');
        this.closer.push('');
    };

    /**
     * Parse a line option
     * @param  {String} str Line option
     */
    Parser.prototype.parseLineOption = function(str) {
        if (str === '.') {
            this.append('str', ' ');
        }
    };

    /**
     * Parse a attribute
     * 
     * @private
     * @param  {string} attribute Tag name
     */
    Parser.prototype.parseAttribute = function(attrName, attrValue) {
        if (attrValue.charAt(0) !== '"' && attrValue.charAt(0) !== '\'') {
            attrValue = '"' + attrValue + '"';
        }

        var attr = attrName + '=' + this.matchVariables(attrValue);

        if (this.parseEventAttributes && /^on?[A-Z]/.test(attrName)) {
            var val = attrName.substr(2).toLowerCase() + ':' + attrValue.slice(1, -1);
            this.injectAtribute('on', val, ';');
        }
        else if (this.out[this.curScope[0]].slice(-1) !== '>') {
            throw new FireTPL.Error(this, 'Attribute not allowed here. Tag expected!');
        }
        else {
            this.out[this.curScope[0]] = this.out[this.curScope[0]].replace(/\>$/, ' ' + attr + '>');
        }

        if (this.tmplType === 'fire' && this.isNewLine) {
            this.closer.push('');
        }
    };

    /**
     * Inject an attribute into the current tag
     * @method injectAtribute
     * @param  {String}       attrName Attribute name
     * @param  {String}       value    Attribute value
     * @param  {Boolean|String}       merge    If this argument is given and the attribut is already existing the values will be merged together. Separated by 'merge' property
     */
    Parser.prototype.injectAtribute = function(attrName, value, merge) {
        var re = new RegExp(' ' + attrName + '="(.+?)"', 'g');
        var curAttr = this.out[this.curScope[0]].slice(this.lastTagPos[this.curScope[0]]);
        var hasMatch = false;

        if (curAttr.charAt(0) !== '<') {
            this.out[this.curScope[0]] += curAttr;
            throw new FireTPL.Error('Inject attribut failed! Last item is not a valid tag!', this.out[this.curScope[0]]);
        }

        curAttr = curAttr.replace(re, function(match) {
            if (merge === undefined) {
                throw new FireTPL.Error('Attribute ' + attrName + ' already exists!');
            }

            var str = match.slice(0, -1) + merge + value + '"';

            hasMatch = true;
            return str;
        });

        if (!hasMatch) {
            curAttr = curAttr.replace(/>$/, ' ' + attrName + '="' + value + '"' + '>');
        }

        this.out[this.curScope[0]] = this.out[this.curScope[0]].substring(0, this.lastTagPos[this.curScope[0]]);
        this.out[this.curScope[0]] += curAttr;
    };

    /**
     * Match variables within a string
     * @param  {string} str Input string
     * @return {string}     Returns a variable replaced string
     */
    Parser.prototype.matchVariables = function(str, isCode, strEscape) {
        var opener = '',
            closer = '',
            lcOpener = '',
            lcCloser = '',
            altOpener = '',
            altCloser = '',
            prefix = 'data.',
            self = this;

        if (this.scopeTags && !isCode) {
            opener = '<scope path="';
            closer = '"></scope>';
            altOpener = '\'+';
            altCloser = '+\'';
            prefix = '';
        }
        else if (!this.scopeTags && !isCode) {
            opener = '\'+';
            closer = '+\'';
        }

        var mapArgs = function(arg) {
            arg = arg.replace(/^["']|["']$/g, '');
            if (!/^\d+/.test(arg)) {
                arg = '\'' + arg.replace(/\'/g, '\\\'') +'\'';
            }

            return arg;
        };

        var parseVar = function(m, escape) {
            if (isCode) {
                escape = false;
            }
            
            if (m === '') {
                if (self.scopeTags) {
                    return '\'+data+\'';
                }
                return escape ? opener + 'f.escape(data)' + closer : opener + 'data' + closer;
            }
            
            var chunks = m.split('.'),
                vars = [],
                funcs = [];
            
            for (var i = 0, len = chunks.length; i < len; i++) {
                if (i === 0) {
                    if (chunks[i] === 'parent' || chunks[i] === 'root') {
                        if (self.scopeTags) {
                            vars.push('$' + chunks[i]);
                            continue;
                        }
                    }
                    else if (!self.scopeTags) {
                        vars.push('data');
                    }
                }
                else if (/\)$/.test(chunks[i])) {
                    var split = chunks[i].split(/\(/, 2);
                    var func = split[0],
                        args = (split[1] || '').slice(0, -1);

                    if (args) {
                        args = args.match(/"[^"]*"|'[^']*'|\d+/g).map(mapArgs);
                    }

                    funcs.push([func, args]);
                    continue;
                }

                vars.push(chunks[i]);
            }
            
            m = vars.join('.');
            for (i = 0, len = funcs.length; i < len; i++) {
                m = 'f.' + funcs[i][0] + '(' + m + (funcs[i][1] ? ',' + funcs[i][1].join(',') : '') + ')';
            }

            if (self.curScope[0] === 'root' && !isCode) {
                if (self.scopeTags) {
                    return opener + m + closer;
                }
                else {
                    return escape ? opener + 'f.escape(' + m + ')' + closer : opener + m + closer;
                }
            }
            else if (self.scopeTags) {
                return opener + m + closer;
            }
            else {
                return escape ? opener + 'f.escape(' + m + ')' + closer : opener + m + closer;
            }
        };

        var pat = this.patternBuilder('variable');
        var reg = new RegExp(this.syntax.stringVariable, 'g');
        var split = str.split(reg);

        if (this.tmplType === 'fire') {
            split = split.map(function(item) {
                if (item.charAt(0) === '@') {
                    return altOpener + 'l(\'' + item.substr(1) + '\',data)' + altCloser;
                }
                else if(item.charAt(0) === '$') {
                    if (item.charAt(1) === '{') {
                        return parseVar(item.slice(2, -1).replace(/^this\.?/, ''), true);
                    }
                    else if(item.charAt(1) === '$') {
                        return parseVar(item.substr(2).replace(/^this\.?/, ''), false);
                    }
                    
                    return parseVar(item.substr(1).replace(/^this\.?/, ''), true);
                }
                else if (item.charAt(0) === '\\') {
                    return item.slice(1);
                }
                else if (strEscape) {
                    return self.htmlEscape(item.replace(/\'/g, '\\\''));
                }
                else {
                    return item.replace(/\'/g, '\\\'');
                }
            });
        }
        else {
            split = split.map(function(item) {
                if (item.charAt(0) === '@') {
                    return opener + 'l(\'' + item.substr(1) + '\',data)' + closer;
                }
                else if(item.charAt(0) === '{' && item.charAt(1) === '{' && item.charAt(2) === '{') {
                    return parseVar(item.replace(/^\{{3}|\}{3}$/g, '').replace(/^this\.?/, ''), false);
                }
                else if(item.charAt(0) === '{' && item.charAt(1) === '{') {
                    return parseVar(item.replace(/^\{{2}|\}{2}$/g, '').replace(/^this\.?/, ''), true);
                }
                else if (item.charAt(0) === '\\') {
                    return item.slice(1);
                }
                else if (strEscape) {
                    return self.htmlEscape(item.replace(/\'/g, '\\\''));
                }
                else {
                    return item.replace(/\'/g, '\\\'');
                }
            });
        }

        return split.join('');
    };

    Parser.prototype.matchAttributes = function(attrs) {
        if (!attrs) {
            return '';
        }

        var reg = new RegExp(this.syntax.tagAttributes, 'g');
        var res = [];
        var onAttr = [];

        while (true) {
            var match = reg.exec(attrs);
            if (match && match[1]) {
                if (this.parseEventAttributes && /^on?[A-Z]/.test(match[1])) {
                    var attr = /^(.+?)=["']?(.*?)["']?$/.exec(match[1]);
                    var val = attr[1].substr(2).toLowerCase() + ':' + attr[2];
                    onAttr.push(val);
                    continue;
                }
                
                res.push(match[1]);
                continue;
            }

            break;
        }

        if (onAttr.length) {
            res.push('on="' + onAttr.join(';') + '"');
        }

        return res.join(' ');
    };

    Parser.prototype.parseInclude = function(includeName) {
        includeName = includeName.replace(/\)$/, '');
        this.append('str', '\'+p(\'' + includeName + '\',data)+\'');
        if (this.includes.indexOf(includeName) === -1) {
            this.includes.push(includeName);
        }

        if (this.tmplType === 'fire') {
            this.closer.push('');
        }
    };

    Parser.prototype.parsePlain = function(code) {
        this.append('str', code);
        this.closer.push('');
    };

    /**
     * Creates all patterns from pattern conf
     *
     * @private
     */
    Parser.prototype.patternBuilder = function(subPatternName) {
        var pattern = [];
        var names = [];
        var funcs = [];

        var syntaxConf = this.syntax;

        var createSubPattern = function(parts) {
            var subpat = parts.map(function(part) {
                if (part.func) {
                    funcs.push({
                        func: part.func,
                        args: part.args || [],
                        index: index
                    });
                }

                var subpattern = '';
                names.push({
                    name: part.name,
                    index: index++
                });

                if (part.pattern.parts) {
                    subpattern = part.pattern.start;
                    subpattern += createSubPattern(part.pattern.parts);
                    subpattern += part.pattern.end;
                    return subpattern;
                }

                return part.pattern;
            });

            subpat = subpat.join('');
            return subpat;
        };

        var index = 1;
        syntaxConf.pattern.forEach(function(pat) {
            //Skip unmatched pattern if a sub pattern is required
            if (subPatternName && subPatternName !== pat.name) {
                return;
            }

            if (pat.func) {
                funcs.push({
                    func: pat.func,
                    args: pat.args || [],
                    index: index
                });
            }

            names.push({
                name: pat.name,
                index: index++
            });

            pattern.push(createSubPattern(pat.parts));
        });

        funcs.forEach(function(item) {
            item.args = item.args.map(function(argName) {
                for (var i = 0, len = names.length; i < len; i++) {
                    if (names[i].name === argName) {
                        return names[i].index;
                    }
                }
            });
        });

        return {
            pattern: '(' + pattern.join(')|(') + ')',
            names: names,
            funcs: funcs,
            modifer: syntaxConf.modifer
        };
    };

    /**
     * Gets required syntax conf
     *
     * @private
     * @param  {string} type Syntax type
     * @return {object}      Returns syntax conf object
     */
    Parser.prototype.getSyntaxConf = function(type) {
        return FireTPL.Syntax[type];
    };

    /**
     * Append something to the out String
     *
     * @method append
     * @private
     * @param String type Content type (str|code)
     * @param String str Output str
     */
    Parser.prototype.append = function(type, str) {
        if (type === this.lastItemType) {
            this.out[this.curScope[0]] += str;
        }
        else if(type === 'str') {
            this.out[this.curScope[0]] += 's+=\'' + str;
        }
        else if(type === 'code') {
            this.out[this.curScope[0]] += '\';' + str;
        }
        else {
            throw 'Wrong data type in .appand()';
        }

        this.lastItemType = type;

        return str;
    };

    /**
     * Append closer tag to outstr  
     *
     * @method appendCloser
     * @private
     */
    Parser.prototype.appendCloser = function() {
        var el = this.closer.pop() || '';
        if (!el) {
            return;
        }

        if (el === 'scope') {
            //Scope change
            this.appendCloser();
            this.append('code', '');
            var scope = this.curScope.shift();
            this.lastIfScope = scope;
            this.appendCloser();
        }
        else if (Array.isArray(el)) {
            this.append(el[0], el[1]);
        }
        else {
            this.append('str', el);
        }
    };

    /**
     * Get indention of current line
     * 
     * @method getIndention
     * @private
     * @param {String} str Line string
     * @returns {Number} Returns num of indention
     */
    Parser.prototype.getIndention = function(str) {
        var i = 0;

        this.indentionPattern.lastIndex = 0;
        while(true) {
            var match = this.indentionPattern.exec(str);
            if (!match) {
                break;
            }

            if (match[0] !== '\t' && match[0] !== '    ') {
                throw new FireTPL.Error(this, 'Invalid indention!');
            }
            
            i++;
        }

        // console.log('IND', this.lastIndention, 'CUR', i);
        if (this.lastIndention < i - 1) {
            throw new FireTPL.Error(this, 'Invalid indention! + ' + this.lastIndention + ':' + i);
        }

        this.lastIndention = i;
        return i;
    };

    /**
     * Get next scope id
     *
     * @method getNextScope
     */
    Parser.prototype.getNextScope = function() {
        return this.nextScope < 1000 ? '00' + String(++this.nextScope).substr(-3) : '' + (++this.nextScope);
    };

    /**
     * Add and change scope
     * @method newScope
     * @param {String} scope New scope
     */
    Parser.prototype.newScope = function(scope) {
        this.append('code', '');
        this.curScope.unshift(scope);
        this.out[scope] = this.out[scope] || '';
    };

    Parser.prototype.undent = function(dept, code) {
        var pattern = '^(\t| {4}){' + dept + '}';
        var reg = new RegExp(pattern);
        return code.replace(/^\n|\n$/g, '').split('\n').map(function(line) {
            return line.replace(reg, '');
        }).join('\n');
    };

    Parser.prototype.escape = function(str) {
        return str.replace(/\'/g, '\\\'');
    };

    Parser.prototype.htmlEscape = function(str) {
        var chars = {
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;'
        };

        return str.replace(/["&<>]/g, function(ch) {
            return chars[ch];
        });
    };

    Parser.prototype.grepNextChar = function() {
        var reg = /\S/g;
        reg.lastIndex = this.pos;
        var match = reg.exec(this.inputStream);
        if (match) {
            return match[0];
        }

        return null;
    };

    /**
     * Parse all includes. Returns an array of all includes
     * @return {Array} Returns an array with all parsed includes or null if no includes are present
     * [
     *   {
     *     include: 'Includename',
     *     source: Include source
     *   }
     * ]
     */
    Parser.prototype.includeParser = function() {
        var self = this,
            includeStore = [];

        // console.log('RUN INC PARSER', this.includes);

        if (!this.includes.length) {
            return null;
        }

        self.includesPath = self.includesPath || '';

        this.includes.forEach(function(include) {
            include = {
                src: self.includesPath.replace(/\/$/, '') + '/' + include + '.' + self.tmplType,
                name: include
            };

            if (this.beforeInclude) {
                include = this.beforeInclude.call(this, include);
                if (!include) {
                    return;
                }
            }

            var source = FireTPL.readFile(include.src);
            var subParser = new FireTPL.Parser({
                type: self.tmplType,
                includesPath: self.includesPath,
                fileName: include.src
            });
            subParser.parse(source);
            // console.log('RUN INC SUB PARSER', subParser.includes);

            includeStore.push({
                include: include.name,
                source: subParser.flush()
            });

            // subParser.includes = subParser.includes.filter(function(inc) {
            //     return this.includes.indexOf(inc) !== -1;
            // }, this);

            if (subParser.includes.length) {
                includeStore = includeStore.concat(subParser.includeParser());
            }
        }, this);

        // console.log('RES LENGTTH', includeStore.length);
        // console.log('RES', includeStore);
        return includeStore.length > 0 ? includeStore : null;
    };

    FireTPL.Parser = Parser;
})(FireTPL);
/**
 * FireTPL i18n parser
 *
 * @module  FireTPL.I18nParser
 */
(function(FireTPL) {
    'use strict';

    /**
     * I18nParser constructor
     *
     * @constructor
     *
     * @example {js}
     * var parser = new FireTPL.Parser();
     * parser.parse('input string');
     * var parsedStr = parser.flush();
     *
     * Options:
     *
     * @arg eventTags {boolean}
     * Strip html event tags and add all into an `on` tag. The tag contains all event tags as a list seperated by a semicolon.
     * For example: `on="click:click-handler;mousedown:mouse-handler"`
     * 
     */
    var I18nParser = function(options) {
        options = options || {};
        
        this.lang = {};
        this.varName = options.varName || 'FireTPL.locale';
    };

    /**
     * Add i18n data
     * @method add
     * @param  {String} lang Language code
     * @param  {Object} data Language data
     */
    I18nParser.prototype.add = function(lang, data) {
        this.flattn(data).forEach(function(item) {
            if (!this.lang[item[0]]) {
                this.lang[item[0]] = {};
            }

            this.lang[item[0]][lang] = item[1];
        }, this);
    };

    /**
     * Add one i18n item
     * @method addItem
     * @param  {String} lang  Language code
     * @param  {String} value Data key
     * @param  {String|Object} value Data value
     */
    I18nParser.prototype.addItem = function(lang, key, value) {
        if (!this.lang[key]) {
            this.lang[key] = {};
        }
        
        this.lang[key][lang] = value;
    };

    /**
     * Parse i18n data
     * @method parse
     * @return {String} Returns parser result
     */
    I18nParser.prototype.parse = function() {
        if (typeof this.lang !== 'object') {
            throw new FireTPL.ParseError('No i18n data found!');
        }

        var replaceVars = function(str) {
            return str.replace(/\$([a-zA-Z][a-zA-Z0-9_.-]*)/g, '\'+data.$1+\'');
        };

        var parseItem = function(val) {
            if (typeof val === 'string') {
                return '\'' + replaceVars(val) + '\'';
            }
            else if (!val) {
                throw new FireTPL.ParseError('Unsupported i18n item! (' + String(val) + ')');
            }
            else if (!val.key) {
                return '\'' + replaceVars(val.plur) || replaceVars(val.sing) + '\'';
            }

            return 'data.' + val.key.replace(/^\$/, '') + '===1?\'' + val.sing + '\':\'' + val.plur + '\'';
        };

        var fn = this.varName + '=function(key,data,lang){var curLang=lang||FireTPL.i18nCurrent;switch(key){';

        for (var el in this.lang) {
            if (this.lang.hasOwnProperty(el)) {
                var item = this.lang[el];

                fn += 'case\'' + el + '\':switch(curLang){';
                
                for (var l in item) {
                    if (l === FireTPL.i18nDefault) {
                        continue;
                    }
                    if (item.hasOwnProperty(l)) {
                        var langItem = item[l];
                        
                        fn += 'case\'' + l + '\':return ' + parseItem(langItem) + ';';
                    }
                }                
                
                if ((FireTPL.i18nDefault in item)) {
                    fn += 'default:return ' + parseItem(item[FireTPL.i18nDefault]) + ';';
                }

                fn += '}';
            }
        }

        fn += 'default:return FireTPL.i18nFallbackText;}};';
        return fn;
    };

    /**
     * Flattn a an i18n data object
     * 
     * @method flattn
     * @private
     * @param  {String} key  Key prefix
     * @param  {Object} data Data object
     * @return {Object}      Returns a flatted data object
     */
    I18nParser.prototype.flattn = function(key, data) {
        if (arguments.length === 1) {
            data = key;
            key = '';
        }

        var values = [];
        for (var el in data) {
            if (data.hasOwnProperty(el)) {
                var item = data[el];
                
                if (typeof item === 'object') {
                    if (typeof item.sing === 'string' || typeof item.plur === 'string') {
                        values.push([key + el, item.key ? item : (item.plur || item.sing)]);
                    }
                    else {
                        values = values.concat(this.flattn(key + el + '.', item));
                    }
                }
                else {
                    values.push([key + el, item]);
                }
            }
        }


        return values;
    };

    //--

    FireTPL.I18nParser = I18nParser;
})(FireTPL);
/**
 * FireTPL compiler node module
 *
 * Usage:
 * var fireTPLCompiler = new FireTPL.Compiler();
 * var precompiled = fireTPLCompiler.precompile('./views/template.ftl');
 *
 * @module FireTPL.Compiler
 */
(function(FireTPL) {
    'use strict';

    /**
     * FireTPL Compiler
     *
     * (pre)compiles firetpl templates
     * @method Compiler
     * @constructor
     */
    var Compiler = function() {
        
        /**
         * Set the log level.
         * 
         * Levels are:
         *
         * 4 DEBUG
         * 3 INFO
         * 2 WARN
         * 1 ERROR
         * @type {Number}
         */
        this.logLevel = 1;
    };

    /**
     * Precompiles a template string.
     * 
     * If template has any include tags, the include names are present in the `includes` property
     *
     * @describe options
     * commonjs     {Boolean}   Compile as an commonjs module
     * amd          {Boolean}   Compile as an amd module
     * moduleName   {String}    Defines an amd module name
     * scope        {Boolean}   Wrap outputed code into a function (Only if commonjs or amd isn't used)
     * pretty       {Boolean}   Makes output prettier
     * firetplModule {String}   Overrides firetpl module name, used by commionjs. Defaults to `firetpl`
     *     `
     * @method precompile
     * @param {String} tmpl Tmpl source
     * @param {String} name Tmpl name
     * @param {Object} options Precompile options
     *
     * @return {Function} Returns a parsed tmpl source as a function.
     */
    Compiler.prototype.precompile = function(tmpl, name, options) {
        options = options || {};

        if (typeof name !== 'string') {
            throw new FireTPL.Error('Precompilation not possible! The options.name flag must be set!');
        }

        options.firetplModule = options.firetplModule || 'firetpl';

        if (options.partial) {
            console.warn('Partials are no longer supported! Use includes instead!');
        }

        var parser = new FireTPL.Parser(options);
        
        parser.parse(tmpl);
        var precompiled = parser.flush();
        this.includes = parser.includes;

        if (options.verbose) {
            console.log('\n---------- begin of precompiled file ----------\n');
            console.log(precompiled);
            console.log('\n----------- end of precompiled file -----------\n');
            console.log('size: ', precompiled.length, 'chars\n');
        }

        var output = '';
        precompiled = 'FireTPL.templateCache[\'' + name + '\']=function(data,scopes) {var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude.bind(t);' + precompiled + 'return s;};';
        if (options.commonjs) {
            output = this.wrapCJS(precompiled, options.firetplModule);
        }
        else if (options.amd) {
            output = this.wrapAMD(precompiled, options.moduleName, options.firetplModule);
        }
        else if (options.scope) {
            output = this.wrapScope(precompiled);
        }
        else {
            output = precompiled;
        }
        // if (options.commonjs) {
        //     output += '(function(require) {var FireTPL = require(\'' + options.firetplModule + '\');';
        // }
        // else if (options.amd) {
        //     output += 'define(' + (options.moduleName ? '\'' + options.moduleName + '\',' : '') + '[\'' + options.firetplModule + '\'],function(FireTPL) {';
        // }
        // else if (options.scope) {
        //     output = '(function(FireTPL) {';
        // }


        // if (options.commonjs) {
        //     output += '})(require);';
        // }
        // else if(options.amd) {
        //     output += '});';
        // }
        // else if (options.scope) {
        //     output += '})(FireTPL);';
        // }

        return options.pretty ? this.prettifyJs(output) : output;
    };

    /**
     * Precompiles a template string.
     * 
     * If template has any include tags, the include names are present in the `includes` property
     *
     * @describe options
     * commonjs     {Boolean}   Compile as an commonjs module
     * amd          {Boolean}   Compile as an amd module
     * moduleName   {String}    Defines an amd module name
     * scope        {Boolean}   Wrap outputed code into a function (Only if commonjs or amd isn't used)
     * pretty       {Boolean}   Makes output prettier
     * firetplModule {String}   Overrides firetpl module name, used by commionjs. Defaults to `firetpl`
     *     `
     * @method precompile
     * @param {String} tmpl Tmpl source
     * @param {String} name Tmpl name
     * @param {Object} options Precompile options
     *
     * @return {Function} Returns a parsed tmpl source as a function.
     */
    Compiler.prototype.precompileFn = function(tmpl, name, options) {
        options = options || {};

        if (typeof name !== 'string') {
            throw new FireTPL.Error('Precompilation not possible! The options.name flag must be set!');
        }

        options.firetplModule = options.firetplModule || 'firetpl';

        if (options.partial) {
            console.warn('Partials are no longer supported! Use includes instead!');
        }

        var parser = new FireTPL.Parser(options);
        
        parser.parse(tmpl);
        var precompiled = parser.flush();
        this.includes = parser.includes;

        if (options.verbose) {
            console.log('\n---------- begin of precompiled file ----------\n');
            console.log(precompiled);
            console.log('\n----------- end of precompiled file -----------\n');
            console.log('size: ', precompiled.length, 'chars\n');
        }

        var output = '';
        precompiled = 'function(data,scopes) {var t=new FireTPL.Runtime()t.templateCache=this.templateCache,h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude.bind(t);' + precompiled + 'return s;};';
        if (options.commonjs) {
            output = this.wrapCJS(precompiled, options.firetplModule);
        }
        else if (options.amd) {
            output = this.wrapAMD(precompiled, options.moduleName, options.firetplModule);
        }
        else if (options.scope) {
            output = this.wrapScope(precompiled);
        }
        else {
            output = precompiled;
        }

        //jshint evil:true
        return eval(output);
    };

    /* +---------- FireTPL methods ---------- */

    /**
     * Precompiles a template
     * 
     * @method precompile
     * @static
     * @param  {String}   tmpl    Template as a string
     * @param  {String}   name    Template name
     * @param  {Object}   [options] Template options
     * @return {String}           Returns precompiled code
     */
    FireTPL.precompile = function(tmpl, name, options) {
        var compiler = new Compiler();
        return compiler.precompile(tmpl, name, options);
    };

    FireTPL.fire2html = function(tmpl, data, options) {
        data = data || {};
        options = options || {};

        var template = FireTPL.compile(tmpl, options);

        if (options.pretty) {
            return FireTPL.prettify(template(data));
        }

        return template(data);
    };

    /**
     * Prettify html output
     * @method prettify
     * @param  {String} html Input html str
     * @return {String}      Prettified html str
     */
    FireTPL.prettify = function(html) {
        var inlineTags = ['a', 'b', 'big', 'dd', 'dt', 'em', 'i', 's', 'small', 'span', 'sub', 'sup',
            'td', 'th', 'track', 'tt', 'u', 'var', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'br'];
        var voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen',
            'link', 'meta', 'param', 'track', 'source', 'wbr'];
        var inlineTagPattern = new RegExp('^<(' + inlineTags.join('|') + ')\\b');
        var voidTagPattern = new RegExp('^<(' + voidTags.join('|') + ')\\b');
        var indentStr = '    ';
        var indention = 0;
        var skipNewLine = 0;

        var getIndention = function() {
            var str = '';
            for (var i = 0; i < indention; i++) {
                str += indentStr;
            }

            return str;
        };

        var pat = /(<\/?[a-z][a-z0-9_]+.*?>)/g;
        var split = html.split(pat);

        split = split.map(function(item) {
            if (item === '') {
                return '';
            }

            if (item.charAt(1) === '/') {
                if (skipNewLine > 0) {
                    skipNewLine--;
                    return item + (skipNewLine === 0 ? '\n' : '');
                }

                indention--;
                return  getIndention() + item + '\n';
            }

            if (item.charAt(0) === '<') {
                if (inlineTagPattern.test(item)) {
                    item = (skipNewLine > 0 ? '' : getIndention()) + item;
                    
                    if (voidTagPattern.test(item)) {
                        return item;
                    }

                    skipNewLine++;
                    return item;
                }

                if (voidTagPattern.test(item)) {
                    return getIndention() + item + '\n';
                }
                
                item = getIndention() + item;
                indention++;
                return item + '\n';
            }

            return (skipNewLine === 0 ? getIndention() + item + '\n' : item);
        });


        return split.join('').trim();
    };

    Compiler.prototype.prettifyJs = function(str) {
        var indention = 0,
            out = '';

        var repeat = function(str, i) {
            var out = '';
            while (i > 0) {
                out += str;
                i--;
            }
            return out;
        };

        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            
            if(c === '}' && str.charAt(i - 1) !== '{') {
                indention--;
                out += '\n' + repeat('\t', indention);
            }

            out += c;

            if (c === '{' && str.charAt(i + 1) !== '}') {
                indention++;
                out += '\n' + repeat('\t', indention);
            }
            else if(c === ';') {
                out += '\n' + repeat('\t', indention);
            }
        }

        return out;
    };

    Compiler.prototype.wrapCJS = function(code, firetplModule) {
        var above = '(function(require) {var FireTPL = require(\'' + firetplModule + '\');';
        var below = '})(require);';

        return above + code + below;
    };

    Compiler.prototype.wrapAMD = function(code, moduleName, firetplModule) {
        var above = 'define(' + (moduleName ? '\'' + moduleName + '\',' : '') + '[\'' + firetplModule + '\'],function(FireTPL) {';
        var below = '});';

        return above + code + below;
    };

    Compiler.prototype.wrapScope = function(code) {
        var above = '(function(FireTPL) {';
        var below = '})(FireTPL);';

        return above + code + below;
    };

    /**
     * Compile locales
     *
     * @method compileLocales
     * @param  {Object} locales Compiles locales and register it in FireTPL.locale
     * @return {[type]}         [description]
     */
    FireTPL.compileLocales = function(locales) {
        var parser = new FireTPL.I18nParser();
        for (var l in locales) {
            if (locales.hasOwnProperty(l)) {
                var item = locales[l];
                parser.add(l, item);
            }
        }

        //jshint evil:true
        eval(parser.parse());
    };

    FireTPL.Compiler = Compiler;
})(FireTPL);
FireTPL.Syntax = FireTPL.Syntax || {};
FireTPL.Syntax["fire"] = {
    "name": "FireTPL",
    "modifer": "gm",
    "addEmptyCloseTags": true,
    "pattern": [
        {
            "name": "emptyLine",
            "func": "parseEmptyLine",
            "args": ["emptyLineString"],
            "parts": [
                {
                    "name": "emptyLineString",
                    "pattern": "^(\\s+)$"
                }
            ]
        }, {
            "name": "comment",
            "func": "parseComment",
            "args": ["commentLine"],
            "parts": [
                {
                    "name": "commentLine",
                    "pattern": "\\s*(\/\/.*)$"
                }
            ]
        }, {
            "name": "htmlComment",
            "func": "parseComment",
            "args": ["htmlCommentLine"],
            "parts": [
                {
                    "name": "htmlCommentLine",
                    "pattern": "\\s*(/\\*![^]*?\\*/)$"
                }
            ]
        }, {
            "name": "blockComment",
            "func": "parseComment",
            "args": ["commentBlock"],
            "parts": [
                {
                    "name": "commentBlock",
                    "pattern": "\\s*(/\\*[^]*?\\*/)$"
                }
            ]
        }, {
            "name": "indention",
            "func": "parseIndention",
            "args": ["indentionString"],
            "parts": [
                {
                    "name": "indentionString",
                    "pattern": "(^[ \\t]+|\\n^(?=\\S))"
                }
            ]
        }, {
            "name": "attribute",
            "func": "parseAttribute",
            "args": ["attributeName", "attributeValue"],
            "parts": [
                {
                    "name": "attributeName",
                    "pattern": "([a-zA-Z0-9_-]+)="
                }, {
                    "name": "attributeValue",
                    "pattern": "((?:\\\"[^\\\"]*\\\")|(?:\\'[^\\']*\\')|(?:\\S+))"
                }
            ]
        }, {
            "name": "include",
            "func": "parseInclude",
            "args": ["includeName"],
            "parts": [
                {
                    "name": "includeName",
                    "pattern": "(?:\\(?>\\s*(\\S+)\\)?)"
                }
            ]
        }, {
            "name": "tag",
            "func": "parseTag",
            "args": ["tag"],
            "parts": [
                {
                    "name": "tagName",
                    "pattern": "([a-zA-Z][a-zA-Z0-9:_-]*)"
                }
            ]
        }, {
            "name": "string",
            "func": "parseString",
            "args": ["stringValue"],
            "parts": [
                {
                    "name": "stringValue",
                    "pattern": "(?:\"([^]*?)(?:\"(?=\\.?\\s*(?:\\/\\/.+)?$)))"
                }
            ]
        }, {
            "name": "htmlString",
            "func": "parseHtmlString",
            "args": ["htmlStringValue"],
            "parts": [
                {
                    "name": "htmlStringValue",
                    "pattern": "(?:'([^]*?)(?:'(?=\\.?\\s*(?:\\/\\/.+)?$)))"
                }
            ]
        }, {
            "name": "helper",
            "func": "parseHelper",
            "args": ["helperName", "helperExpression", "helperTagName", "helperTagAttrs"],
            "parts": [
                {
                    "name": "helperName",
                    "pattern": ":([a-zA-Z][a-zA-Z0-9_-]*)"
                }, {
                    "name": "helperExpression",
                    "pattern": "(?:[\\t ]*([\\$](?:(?:\\{.+?\\})|(?:\\.?(?:[a-zA-Z][a-zA-Z0-9_-]*)(?:\\((?:[, ]*(?:\"[^\"]*\"|'[^']*'|\\d+))*\\))?)+)))?"
                }, {
                    "name": "helperTag",
                    "pattern": {
                        "start": "([\\t ]*:[\\t ]*",
                        "end": ")?",
                        "parts": [
                            {
                                "name": "helperTagName",
                                "pattern": "([a-zA-Z][a-zA-Z0-9_:-]*)"
                            }, {
                                "name": "helperTagAttrs",
                                "pattern": "(?:[\\t ]+([a-zA-Z0-9_-]+=(?:\\\"[^\\\"]*\\\")|(?:\\'[^\\']*\\')|(?:\\S+)))*"
                            }
                        ]
                    }
                }
            ]
        }, {
            "name": "subHelper",
            "func": "parseSubHelper",
            "args": ["subHelperName", "subHelperExpression", "subHelperTagName", "subHelperTagAttrs"],
            "parts": [
                {
                    "name": "subHelperName",
                    "pattern": "&([a-zA-Z][a-zA-Z0-9_-]*)"
                }, {
                    "name": "subHelperExpression",
                    "pattern": "(?:[\\t ]*([\\$](?:(?:\\{.+?\\})|(?:\\.?(?:[a-zA-Z][a-zA-Z0-9_-]*)(?:\\((?:[, ]*(?:\"[^\"]*\"|'[^']*'|\\d+))*\\))?)+)))?"
                }, {
                    "name": "subHelperTag",
                    "pattern": {
                        "start": "([\\t ]*:[\\t ]*",
                        "end": ")?",
                        "parts": [
                            {
                                "name": "subHelperTagName",
                                "pattern": "([a-zA-Z][a-zA-Z0-9_:-]*)"
                            }, {
                                "name": "subHelperTagAttrs",
                                "pattern": "(?:[\\t ]+([a-zA-Z0-9_-]+=(?:\\\"[^\\\"]*\\\")|(?:\\'[^\\']*\\')|(?:\\S+)))*"
                            }
                        ]
                    }
                }
            ]
        }, {
            "name": "variable",
            "func": "parseVariable",
            "args": ["variableString"],
            "parts": [
                {
                    "name": "variableString",
                    "pattern": "([@\\$]{1,2}(?:(?:\\{.+?\\})|(?:\\.?(?:[a-zA-Z][a-zA-Z0-9_-]*)(?:\\((?:[, ]*(?:\"[^\"]*\"|'[^']*'|\\d+))*\\))?)+))"
                }
            ]
        }, {
            "name": "code",
            "func": "parseCodeBlock",
            "args": ["codeType", "codeValue"],
            "parts": [
                {
                    "name": "codeType",
                    "pattern": "```(\\w+)?"
                }, {
                    "name": "codeValue",
                    "pattern": "((?:\\\\```|[^])*?)```(?=\\.?\\s*(?:\\/\\/.+)?$)"
                }
            ]
        }, {
            "name": "lineOption",
            "func": "parseLineOption",
            "args": ["stringLineOption"],
            "parts": [
                {
                    "name": "stringLineOption",
                    "pattern": "(\\.(?=(?:\\s*\\/\\/.+)?$))"
                }
            ]
        }, {
            "name": "doctype",
            "func": "parsePlain",
            "args": ["parseDocType"],
            "parts": [
                {
                    "name": "parseDocType",
                    "pattern": "(^<!DOCTYPE.+?>)"
                }
            ]
        }
    ],
    "stringVariable": "((?:\\\\[$\"'@\\\\<>&])|(?:[@\\$]{1,2}(?:(?:\\{.+?\\})|(?:\\.?(?:[a-zA-Z][a-zA-Z0-9_-]*)(?:\\((?:[, ]*(?:\"[^\"]*\"|'[^']*'|\\d+))*\\))?)+)))",
    "codeVariable": "((?:\\\\(?:```|\\$|@|\\\\))|(?:`[@\\$]{1,2}(?:(?:\\{.+?\\})|(?:\\.?(?:[a-zA-Z][a-zA-Z0-9_-]*)(?:\\((?:[, ]*(?:\"[^\"]*\"|'[^']*'|\\d+))*\\))?)+))`)",
    "tagAttributes": "([a-zA-Z0-9_]+(?:=(?:(?:\".*?\")|(?:'.*?')|(?:\\S+)))?)"
};
FireTPL.Syntax["hbs"] = {
    "name": "Handelbars",
    "modifer": "gm",
    "pattern": [
        {
            "name": "htmlComment",
            "func": "parseComment",
            "args": ["htmlCommentLine"],
            "parts": [
                {
                    "name": "htmlCommentLine",
                    "pattern": "((?:\\{\\{!--[^]*?--\\}\\})|(?:<!--[^]*?-->))"
                }
            ]
        }, {
            "name": "comment",
            "func": "parseComment",
            "args": ["commentLine"],
            "parts": [
                {
                    "name": "commentLine",
                    "pattern": "(\\{\\{![^]*?\\}\\})"
                }
            ]
        }, {
            "name": "helper",
            "func": "parseHelper",
            "args": ["helperName", "helperExpression"],
            "parts": [
                {
                    "name": "helperString",
                    "pattern": {
                        "start": "(\\{\\{#",
                        "end": "\\}\\})",
                        "parts": [
                            {
                                "name": "helperName",
                                "pattern": "([a-zA-Z][a-zA-Z0-9_-]*)"
                            }, {
                                "name": "helperExpression",
                                "pattern": "(?:[\\t| ]+([^\\}]*))?"
                            }
                        ]
                    }
                }
            ]
        }, {
            "name": "closeHelper",
            "func": "parseCloseHelper",
            "args": ["closeHelperName"],
            "parts": [
                {
                    "name": "closeHelperName",
                    "pattern": "(?:\\{\\{\\/([a-zA-Z][a-zA-Z0-9_-]*)\\}\\})"
                }
            ]
        }, {
            "name": "elseHelper",
            "func": "parseElseHelper",
            "args": ["elseHelperName"],
            "parts": [
                {
                    "name": "elseHelperName",
                    "pattern": "(?:\\{\\{(else)\\}\\})"
                }
            ]
        }, {
            "name": "closeTag",
            "func": "parseCloseTag",
            "args": ["closeTagString"],
            "parts": [
                {
                    "name": "closeTagString",
                    "pattern": "(?:<\\/([a-zA-Z][a-zA-Z0-9:_-]*)>)"
                }
            ]
        }, {
            "name": "include",
            "func": "parseInclude",
            "args": ["includeName"],
            "parts": [
                {
                    "name": "includeName",
                    "pattern": "(?:\\{\\{>\\s*(\\S+)\\s*\\}\\})"
                }
            ]
        }, {
            "name": "tag",
            "func": "parseTag",
            "args": ["tagName", "tagAttributes"],
            "parts": [
                {
                    "name": "tagString",
                    "pattern": {
                        "start": "(<",
                        "end": ">)",
                        "parts": [
                            {
                                "name": "tagName",
                                "pattern": "([a-zA-Z][a-zA-Z0-9:_-]*)"
                            }, {
                                "name": "tagAttributes",
                                "pattern": "(?:\\b\\s*([^>]+))?"
                            }
                        ]
                    }
                }
            ]
        }, {
            "name": "string",
            "func": "parseHtmlString",
            "args": ["stringValue"],
            "parts": [
                {
                    "name": "stringValue",
                    "pattern": "(\\S(?:[^](?!(?:<|\\{\\{(?:#|\\/|!|else\\}))))+[^])"
                }
            ]
        }, {
            "name": "variable",
            "func": "parseVariable",
            "args": ["variableString"],
            "parts": [
                {
                    "name": "variableString",
                    "pattern": "(\\{{2,3}(?:\\.?(?:[a-zA-Z][a-zA-Z0-9_-]*)(?:\\((?:[, ]*(?:\"[^\"]*\"|'[^']*'|\\d+))*\\))?)+\\}{2,3})"
                }
            ]
        }, {
            "name": "langVariable",
            "func": "parseVariable",
            "args": ["variableString"],
            "parts": [
                {
                    "name": "variableString",
                    "pattern": "(@(?:\\.?(?:[a-zA-Z][a-zA-Z0-9_-]*))+)"
                }
            ]
        }
    ],
    "stringVariable": "((?:\\\\(?:\\{{2,3}|@|\\\\))|(?:@[a-zA-Z0-9_]+(?:\\.[a-zA-Z0-9_]+)*)|(?:\\{{2,3}(?:\\.?(?:[a-zA-Z][a-zA-Z0-9_-]*)(?:\\((?:[, ]*(?:\"[^\"]*\"|'[^']*'|\\d+))*\\))?)+\\}{2,3}))",
    "codeVariable": "((?:\\\\(?:\\{{2,3}|@|\\\\)|(?:@[a-zA-Z0-9_]+(?:\\.[a-zA-Z0-9_]+)*)|(?:\\{{2,3}(?:\\.?(?:[a-zA-Z][a-zA-Z0-9_-]*)(?:\\((?:[, ]*(?:\"[^\"]*\"|'[^']*'|\\d+))*\\))?)+\\}{2,3}))",
    "tagAttributes": "([a-zA-Z0-9_]+(?:=(?:(?:\".*?\")|(?:'.*?')|(?:\\S+)))?)"
};
/**
 * FireTPL runtime
 *
 * @module  FireTPL.Runtime
 */
(function(FireTPL) {
    'use strict';

    FireTPL.helpers = {};
    FireTPL.fn = {};
    FireTPL.templateCache = {};

    /**
     * Register a block helper
     *
     * @method registerHelper
     * @param {String} helper Helper name
     * @param {Function} fn Helper function
     */
    FireTPL.registerHelper = function(helper, fn) {
        FireTPL.helpers[helper] = fn;
    };

    FireTPL.registerFunction = function(func, fn) {
        FireTPL.fn[func] = fn;
    };

    /**
     * Register a global include
     * @method registerPartial
     * @param  {String}   include Partial name
     * @param  {Function|String} fn      Precompiled include or a include string
     * @param  {Object}   options (Optional) If second arg is a string, add parser options here
     */
    FireTPL.registerInclude = function(include, fn, options) {
        if (typeof fn === 'string') {
            options = options || {};
            options.include = true;
            fn = FireTPL.compile(fn, options);
        }

        FireTPL.templateCache[include] = fn;
    };

    /**
     * Clears a global include cache
     *
     * @method clearIncludes
     * 
     */
    FireTPL.clearIncludes = function() {
        FireTPL.templateCache = [];
    };

    /**
     * Register core helper
     *
     * @private
     * @method registerCoreHelper
     */
    FireTPL.registerCoreHelper = function() {
        this.registerHelper('if', function(context, fn) {
            var s = '';

            if (context.data) {
                s += fn(context.parent, context.root);
            }

            return s;
        });
        
        this.registerHelper('else', function(context, fn) {
            return fn(context.parent);
        });

        this.registerHelper('unless', function(context, fn) {
            var s = '';

            if (!(context.data)) {
                s += fn(context.parent);
            }

            return s;
        });

        this.registerHelper('each', function(context, fn) {
            var s = '';

            if (context.data) {
                context.data.forEach(function(item) {
                    s += fn(item);
                });
            }

            return s;
        });
    };

    var Runtime = function() {
        this.templateCache = FireTPL.templateCache;
    };

    Runtime.prototype.exec = function(helper, data, parent, root, ctx, fn) {
        console.warn('FireTPL.Runtime.prototype.exec is deprecated! Please use execHelper instead!');
        if (!FireTPL.helpers[helper]) {
            throw new Error('Helper ' + helper + ' not registered!');
        }

        return FireTPL.helpers[helper]({
            data: data,
            parent: parent,
            root: root,
            ctx: ctx
        }, fn);
    };

    Runtime.prototype.execHelper = function(helper, data, parent, root, ctx, tag, attrs, fn) {
        if (!FireTPL.helpers[helper]) {
            throw new Error('Helper ' + helper + ' not registered!');
        }

        if (typeof tag === 'function') {
            fn = tag;
            tag = null;
            attrs = null;
        }

        return FireTPL.helpers[helper]({
            data: data,
            parent: parent,
            root: root,
            ctx: ctx,
            tag: tag,
            attrs: attrs
        }, fn);
    };

    Runtime.prototype.execInclude = function(includeName, data) {
        var include = this.templateCache[includeName];
        if (!include) {
            throw new FireTPL.Error('Include \'' + includeName + '\' was not registered!');
        }

        return include(data);
    };

    Runtime.prototype.registerInclude = function(include, fn) {
        this.templateCache[include] = fn;
    };

    /**
     * Compiles and executes a template string
     *
     * Uses fire syntax as default. If you pass a hbs template please set the type option to *hbs*
     * 
     * @param {String} template Template string or precompiled tempalte
     * @param {Object} options (Optional) Compiler options
     *
     * @example {fire}
     * var tmpl = 'div "Hello $name"';
     * var template = FireTPL.compile(tmpl);
     * var html = template({
     *   name: 'Andi'
     * });
     *
     * // html == <div>Hello Andi</div>
     * 
     * @example {hbs}
     * var tmpl = '<div>Hello {{name}}</div>';
     * var template = FireTPL.compile(tmpl, 'hbs');
     * var html = template({
     *   name: 'Andi'
     * });
     *
     * // html == <div>Hello Andi</div>
     * @returns {String} Returns executed template
     */
    FireTPL.compile = function(template, options) {
        options = options || {};

        var runTime = new FireTPL.Runtime();
                

        if (typeof options === 'string') {
            options = {
                type: options
            };
        }

        if (!/^scopes=scopes/.test(template)) {
            // var fireTpl = new FireTPL.Compiler(options);
            var parser = new FireTPL.Parser(options);
            
            parser.parse(template);
            template = parser.flush();

            if (!options.skipIncludes) {
                var includes = parser.includeParser();
                if (includes) {
                    includes.forEach(function(item) {
                        try {
                            runTime.registerInclude(item.include, 
                                //jshint evil:true
                                eval('(function(data,scopes) {var t = new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude.bind(t);' + item.source + 'return s;})')
                            );
                        }
                        catch(err) {
                            console.error('Pregister include error!', err, err.lineNumber);
                        }
                    });
                }
            }
        }

        return function(data, scopes) {
            var h = runTime.execHelper,
                l = FireTPL.locale,
                f = FireTPL.fn,
                p = runTime.execInclude.bind(runTime);

            var s;

            var tmpl;
            //jshint evil:true
            try {
                tmpl = '(function(data, scopes) {\n' + template + 'return s;})(data, scopes)';
                return eval(tmpl);
            }
            catch (err) {
                throw new FireTPL.ParseError(err, data, prettify(tmpl));
            }

            return s;
        };
    };

    FireTPL.Runtime = Runtime;

    var prettify = function(str) {
        var indention = 0,
            out = '';

        var repeat = function(str, i) {
            var out = '';
            while (i > 0) {
                out += str;
                i--;
            }
            return out;
        };

        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            
            if(c === '}' && str.charAt(i - 1) !== '{') {
                indention--;
                out += '\n' + repeat('\t', indention);
            }

            out += c;

            if (c === '{' && str.charAt(i + 1) !== '}') {
                indention++;
                out += '\n' + repeat('\t', indention);
            }
            else if(c === ';') {
                out += '\n' + repeat('\t', indention);
            }
        }

        return out;
    };

    FireTPL.registerCoreHelper();

})(FireTPL);
(function(FireTPL) {
    'use strict';
    
    FireTPL.registerFunction('byte', function(str, round) {
        var units = ['Byte', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'],
            size = parseFloat(str, 10),
            p = 0;

        round = round ? Math.pow(10, round) : 10;

        for (var i = 0, len = units.length; i < len; i++) {
            if (Math.pow(1024, i + 1) >= size) {
                break;
            }
        }

        return Math.round((size / Math.pow(1024, i) * round)) / round + ' ' + units[i];
    });
})(FireTPL);
/**
 * Comparison functions
 * @module Inline Functions (Comparison)
 */
(function(FireTPL) {
    'use strict';
    
        /**
     * Greater than comparison
     *
     * The property becomes true if property is greater than value.
     *
     * @group InlineFunctions
     * @method gt
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input is greater then value
     */
    FireTPL.registerFunction('gt', function(str, cmp) {
        return Number(str) > Number(cmp);
    });

    /**
     * Greater than comparison or equal
     *
     * The property becomes true if property is greater or equal than value.
     *
     * @group InlineFunctions
     * @method gte
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input is greater or equal then value
     */
    FireTPL.registerFunction('gte', function(str, cmp) {
        return Number(str) >= Number(cmp);
    });

    /**
     * Lesser than comparison
     *
     * The property becomes true if property is lesser than value.
     *
     * @group InlineFunctions
     * @method lt
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input is lesser then value
     */
    FireTPL.registerFunction('lt', function(str, cmp) {
        return Number(str) < Number(cmp);
    });

    /**
     * Lesser than comparison or equal
     *
     * The property becomes true if property is lesser or equal than value.
     *
     * @group InlineFunctions
     * @method gte
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input is lesser or equal then value
     */
    FireTPL.registerFunction('lte', function(str, cmp) {
        return Number(str) <= Number(cmp);
    });

    /**
     * Equal comparison
     *
     * The property becomes true if input and value are both identical
     *
     * @group InlineFunctions
     * @method eq
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input and value are identical
     */
    FireTPL.registerFunction('eq', function(str, cmp) {
        if (isNaN(str)) {
            return str === cmp;
        }
        else {
            return Number(str) === Number(cmp);
        }
    });

    /**
     * Not equal comparison
     *
     * The property becomes true if input and value aren't identical
     *
     * @group InlineFunctions
     * @method not
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input and value aren't identical
     */
    FireTPL.registerFunction('not', function(str, cmp) {
        if (isNaN(str)) {
            return str !== cmp;
        }
        else {
            return Number(str) !== Number(cmp);
        }
    });

    /**
     * Expression matching
     *
     * Returns value if expression is matching, otherwise altValue will be returned
     *
     * @group InlineFunctions
     * @method if
     * @param {string} expression Expression
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input and value aren't identical
     */
    FireTPL.registerFunction('if', function(str, expression, value, altValue) {
        if (String(str) === String(expression)) {
            return value;
        }

        return altValue;
    });

    /**
     * Returns str if it is truthy, otherwise altValue is returning
     *
     * @group InlineFunctions
     * @method or
     * @param  {String} altValue 
     * @return {String}    Returns instr or altValue
     * 
     * @example {fire}
     * $str.or('String is empty')
     */
    FireTPL.registerFunction('or', function(str, value, altValue) {
        if (str) {
            return str;
        }

        return altValue;
    });

    /**
     * Checks whether str is truthy or not
     *
     * Returns value if str is truthy, otherwise altValue will be returned.
     * If only one arg is passed and str becomes truthy the instr will be returned instead.
     *
     * @group InlineFunctions
     * @method ifTrue
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input and value aren't identical
     * @example {fire}
     * $str.ifTrue('Yes', 'No')
     *
     * @example {fire}
     * //$str == 'Yes'
     * $str.ifTrue('No')
     * //returns 'Yes'
     */
    FireTPL.registerFunction('ifTrue', function(str, value, altValue) {
        if (str) {
            return arguments.length === 2 ? str : value;
        }

        return arguments.length === 2 ? value : altValue;
    });

    /**
     * Checks whether str is falsy or not
     *
     * Returns value if str is falsy, otherwise altValue will be returned,
     * if altValue is not given, instr will be returned.
     *
     * @group InlineFunctions
     * @method ifFalse
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input and value aren't identical
     * @example {fire}
     * $str.ifFalse('Yes', 'No')
     * 
     * @example {fire}
     * //$str = 'No'
     * $str.ifFalse('Yes')
     * //returns 'No'
     */
    FireTPL.registerFunction('ifFalse', function(str, value, altValue) {
        if (!str) {
            return value;
        }

        return arguments.length === 2 ? str : altValue;
    });

    /**
     * Checks whether str has a value other than undefined or null
     *
     * Returns true if str is not undefined or null
     *
     * @group InlineFunctions
     * @method exists
     * @return {boolean}    Returns true if input is not undefined or null
     * @example {fire}
     * :if $str.exists()
     *     "Str exists!"
     */
    FireTPL.registerFunction('exists', function(str) {
        return str !== undefined && str !== null;
    });

    /**
     * Checks whether str matches agains a regular expression
     *
     * Returns true if str matches
     *
     * @group InlineFunctions
     * @method match
     * @return {boolean}    Returns true if input matches
     * @example {fire}
     * :if $str.match('foo|bar')
     *     "Str matches!"
     */
    FireTPL.registerFunction('match', function(str, pattern, modifier) {
        var reg = new RegExp(pattern, modifier);
        return reg.test(str);
    });
})(FireTPL);
(function(FireTPL) {
    'use strict';
    
    FireTPL.registerFunction('escape', function(str) {
        if (typeof str !== 'string') {
            return str;
        }

        var chars = {
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;'
        };

        return str.replace(/["&<>]/g, function(ch) {
            return chars[ch];
        });
    });
})(FireTPL);
(function(FireTPL) {
    'use strict';
    var getValue = function(path, obj) {
        if(path) {
            path = path.split('.');
            path.forEach(function(key) {
                obj = obj[key];
            });
        }

        return obj;
    };
    
    FireTPL.registerFunction('lang', function(lng, data) {
        console.log('LNG', lng);
        if (typeof lng === 'object') {
            if (lng.key) {
                var val = getValue(lng.key, data);
                console.log('VAL', val);
                if (val && val === 1) {
                    return lng.sing;
                }
            }

            return lng.plur || lng.sing;
        }

        return lng;
    });
})(FireTPL);
(function(FireTPL) {
    'use strict';

    /**
     * Concatenate String
     *
     * @group InlineFunctions
     * @method if
     * @param {String} separator Concatenates strings by using a separator
     * @return {String}    Returns a concatenated string
     *
     * @example
     * $str = 'foo'
     * $foo = 'bar'
     * 
     * $str.concat(' ', $foo, 'link')
     *
     * returns "foo bar link"
     */
    FireTPL.registerFunction('concat', function(str, sep) {
        var args = Array.prototype.slice.call(arguments, 2);
        args.unshift(str);
        return args.join(sep);
    });

})(FireTPL);
/**
 * Tree helper
 *
 * @module  Tree helper
 * @submodule  Helper
 */

(function() {
    'use strict';

    var helper = function(ctx, fn) {
        // console.log('Call helper', ctx, fn);
        var s = '';

        var ctxFuncs = {
            next: function(item, tag, attrs, itemFn) {
                var s = '';

                // console.log('Call next', item, itemFn);

                if (Array.isArray(item) && item.length) {
                    s = '';

                    if (tag) {
                        s += '<' + tag + (attrs ? ' ' + attrs : '') + '>';
                    }

                    s += helper({
                        data: item,
                        parent: ctx.parent,
                        root: ctx.root,
                        ctx: ctx.ctx,
                        tag: ctx.tag,
                        attrs: ctx.attrs
                    }, fn);

                    if (tag) {
                        s += '</' + tag + '>';
                    }
                }

                return s;
            }
        };

        ctx.ctx.next = ctxFuncs.next;
        if (ctx.data) {
            if (Array.isArray(ctx.data)) {
                ctx.data.forEach(function(d) {
                    s += fn(d,ctx.parent, ctx.root, ctx.ctx);
                });
            }
            else {
                s += fn(ctx.data,ctx.parent, ctx.root, ctx.ctx);
            }
        }

        return s;
    };

    FireTPL.registerHelper('tree', helper);
})();
/**
 * FireTPL browser extension
 *
 * @module FireTPL Browser extensions
 */
(function(FireTPL) {
    'use strict';

    FireTPL.readFile = function(src) {
        var content = '';

        if (typeof XMLHttpRequest === 'undefined') {
            console.warn('Don\'t use FireTPL.loadFile() on node.js');
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', src, false);
        xhr.send();

        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                content = xhr.responseText;
            }
            else if (xhr.status === 404) {
                console.error('Loading a FireTPL template failed! Template wasn\'t found!');
            }
            else {
                console.error('Loading a FireTPL template failed! Server response was: ' + xhr.status + ' ' + xhr.statusText);
            }
        }

        return content;
    };

    /**
     * Synchronous read file function to read a file from file system.
     * @param  {string} file File path
     * @return {String}      Returns file content
     */
    FireTPL.loadFile = function(file) {
        console.warn('FireTPL.loadFile is deprecated! Please use FireTPL.readFile instead!');
        return FireTPL.readFile(file);
    };
})(FireTPL);
});
require.register('./src/service.js', function(module, exports, require) { /**
 * XQCore Service
 *
 * This module organizes your data.
 * A model has different states and changes it on a specific action.
 *
 * States:
 * starting | Before initialization
 * ready    | Initial state
 * valid    | Validation was successfull
 * invalid  | Validation failed
 *
 * @package XQCore
 * @module Service
 * @requires Utils
 * @requires EventEmitter
 * @requires Logger
 */

'use strict';

var XQCore = require('./xqcore');
var Logger = require('./logger');
var ReadyState = require('./ready-state');
var EventEmitter = require('./event');

/**
 * Service base class
 *
 * @class Service
 * @constructor
 *
 * @uses Logger
 * @uses EventEmitter
 *
 * @param {Object} conf Service extend object
 */
var Service = function(name, conf) {
  //Call EventEmitter constructor
  EventEmitter.call(this);

  if (typeof arguments[0] === 'object') {
    conf = name;
    name = conf.name;
  }

  /**
   * Enable debug mode
   * @public
   * @type {Boolean}
   */
  this.logLevel = XQCore.logLevel;

  if (conf === undefined) {
    conf = {};
  }

  if (typeof conf === 'function') {
    conf.call(this, this);
  }
  else {
    XQCore.extend(this, conf);
  }

  this.conf = conf;

  this.name = (name ? name.replace(/Service$/, '') : 'Nameless') + 'Service';

  if (!this.model && !this.list) {
    throw new Error('Service is not connected to any model or list!');
  }

  if (this.model && this.list) {
    throw new Error('Service is connected to a model and a list. This is not allowed!');
  }

  this.isListService = false;
  if (this.model) {
    this.schema = this.schema || this.model.schema || null;
  } else {
    this.schema = this.schema || null;
    if (!this.schema && typeof this.list.model === 'function') {
      var model = new this.list.model();
      this.schema = model.schema;
    }
    this.isListService = true;
  }

  this.__state = 'ready';
};


//Extend with ready state
XQCore.extend(Service.prototype, ReadyState.prototype);
XQCore.extend(Service.prototype, EventEmitter.prototype);
XQCore.extend(Service.prototype, new Logger());

/**
 * Inherits a model prototype
 * @method inherit
 * @param  {String} name    model name
 * @param  {Object} options Service properties
 * @return {Object}         Returns a Service prototype
 */
Service.inherit = function(name, options) {
  if (typeof name === 'object') {
    options = name;
    name = undefined;
  }

  var Proto = function(_name, _options) {
    //TODO call this later, ready state will be set before _options had been run
    Service.call(this, name, options);

    if (_name) {
      if (typeof _name === 'string') {
        name = _name;
      }
      else {
        _options = _name;
      }

      if (typeof _options === 'function') {
        _options.call(this, this);
      }
      else if (typeof _options === 'object') {
        XQCore.extend(this, _options);
      }
    }
  };

  Proto.prototype = Object.create(Service.prototype);
  Proto.prototype.constructor = Proto;
  return Proto;
};

/**
 * Change the model state
 *
 * @method state
 * @param {String} state New state
 */
Service.prototype.state = function(state) {
  this.__state = state;
  this.emit('state.' + state);
  this.emit('state.change', state);
};

/**
 * Get the current model state
 *
 * @method getState
 */
Service.prototype.getState = function() {
  return this.__state;
};


// Service.prototype.toJSON = function() {
//     return {};
// };

//--

module.exports = Service;

});
require.register('./src/socket-connection.js', function(module, exports, require) { /**
 * Socket connection
 * Creates a socket connection to a socket server. Only one connection is used per server/port combination.
 *
 * @package XQCore
 * @module SocketConnection
 */

'use strict';

var SockJS = require('../lib/sockjs');
var Logger = require('./logger');

var log = new Logger('SocketConnection');

var instances = {};

/**
 * SocetConnection object
 * Handles a socket connection
 *
 * @singelton
 * @constructor
 *
 * @example {js}
 * var conn = new XQCore.SocketConnection('http://localhost:9889/xqsocket');
 * conn.ready(function() {
 *     //Connection was successfull
 * });
 */
var SocketConnection = function(url) {
  if (instances[url]) {
    return instances[url];
  }

  //Only one instance per socket server
  instances[url] = this;

  this.__isReady = false;
  this.__onReadyCallbacks = [];

  /**
   * Holds all registered channels
   * @type {Object} __channels
   */
  this.__channels = {};

  /**
   * Holds the SockJS instance
   * @private
   * @type {Object} SockJS instance
   */
  this.conn = null;

  this.connect(url);

  /**
   * Reconnect if connection gets lost
   * @property {Boolean} autoReconnect
   */
  this.autoReconnect = true;

  /**
   * Defines a reconnection interval
   * @type {Number}
   */
  this.reconnectionInterval = 1500;
};

/**
 * Connects to a socket server
 * @param  {String} url Socket server url
 */
SocketConnection.prototype.connect = function(url) {
  var self = this;

  if (!this.conn || this.connectionState === 'disconnected') {
    log.info('Connect to socket server ', url);
    this.conn = new SockJS(url, null, {
      debug: log.logLevel >= 4
    });

    this.connectionState = 'connecting';
    this.conn.onopen = function() {
      log.info('Connection was successful!');
      self.setReady();
      self.connectionState = 'connected';
    };

    this.conn.onmessage = function(e) {
      var msg;

      try {
        msg = JSON.parse(e.data);
      }
      catch(err) {
        log.warn('Could not parse socket message!', e.data);
      }

      if (!msg.channel) {
        throw new Error('No socket channel was sent!');
      }

      log.info('Got socket message', msg.eventName, 'in channel ' + msg.channel, msg.args);
      var args = msg.args || [];
      args.unshift(msg.eventName);
      if (self.__channels[msg.channel]) {
        self.__channels[msg.channel].emit.apply(self.__channels[msg.channel], args);
      }
      else {
        log.info(' ... channel not found!', msg.channel);
      }
    };

    this.conn.onclose = function(err) {
      self.connectionState = 'disconnected';
      self.unsetReady();
      log.warn('Connection to ' + url + ' closed!', err);

      if (self.autoReconnect) {
        log.info('Try to reconnect to ' + url);

        setTimeout(function() {
          self.connect(url);
        }, self.reconnectionInterval);
      }
    };
  }
};

/**
 * Register a channel
 * @param  {String} channel  Channel name
 * @param  {Object} listener Socket object
 */
SocketConnection.prototype.registerChannel = function(channel, listener) {
  log.info('Register new channel', channel);
  if (this.__channels[channel]) {
    log.info(' ... channel already registered!');
  } else {
    this.__channels[channel] = listener;
  }
};

/**
 * Unregister a channel
 * @param  {String} channel  Channel name
 * @param  {Object} listener Socket object
 */
SocketConnection.prototype.unregisterChannel = function(channel) {
  log.info('Unregister channel', channel);
  if (this.__channels[channel]) {
    delete this.__channels[channel];
  } else {
    log.info(' ... channel not found!');
  }
};

/**
 * Sends a socket message to a connected socket server
 *
 * @method send
 * @param {String} channel   Channel name
 * @param {String} eventName EventEmitter name
 * @param {Object} data      Data
 *
 */
SocketConnection.prototype.send = function(channel, eventName, data) {
  var self = this;

  var args = Array.prototype.slice.call(arguments, 2);

  this.ready(function() {
    log.info('Send socket message to channel ' + channel, eventName, args);
    self.conn.send(JSON.stringify({
      channel: channel,
      eventName: eventName,
      args: args
    }));
  });
};

/**
 * Call function fn when socket is connected
 *
 * @method ready
 * @param  {Function} fn Function to be called if socket is ready
 */
SocketConnection.prototype.ready = function(fn) {
  if (this.__isReady) {
    fn.call(this);
  }
  else {
    this.__onReadyCallbacks.push(fn);
  }
};

/**
 * Sets readyState and calls all queued functions
 *
 * @method setReady
 * @private
 */
SocketConnection.prototype.setReady = function() {
  var self = this;

  this.__isReady = true;
  this.__onReadyCallbacks.forEach(function(fn) {
    fn.call(self);
  });

  this.__onReadyCallbacks = [];
};

SocketConnection.prototype.unsetReady = function() {
  this.__isReady = false;
};

//--

module.exports = SocketConnection;

});
require.register('./lib/sockjs.js', function(module, exports, require) { /* SockJS client, version 0.3.4, http://sockjs.org, MIT License

Copyright (c) 2011-2012 VMware, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOF THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// JSON2 by Douglas Crockford (minified).
var JSON;JSON||(JSON={}),function(){function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g;return e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g;return e}}function quote(a){escapable.lastIndex=0;return escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function f(a){return a<10?"0"+a:a}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver=="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")})}()


//     [*] Including lib/index.js
// Public object
SockJS = (function(){
              var _document = document;
              var _window = window;
              var utils = {};


//         [*] Including lib/reventtarget.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

/* Simplified implementation of DOM2 EventTarget.
 *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
 */
var REventTarget = function() {};
REventTarget.prototype.addEventListener = function (eventType, listener) {
    if(!this._listeners) {
         this._listeners = {};
    }
    if(!(eventType in this._listeners)) {
        this._listeners[eventType] = [];
    }
    var arr = this._listeners[eventType];
    if(utils.arrIndexOf(arr, listener) === -1) {
        arr.push(listener);
    }
    return;
};

REventTarget.prototype.removeEventListener = function (eventType, listener) {
    if(!(this._listeners && (eventType in this._listeners))) {
        return;
    }
    var arr = this._listeners[eventType];
    var idx = utils.arrIndexOf(arr, listener);
    if (idx !== -1) {
        if(arr.length > 1) {
            this._listeners[eventType] = arr.slice(0, idx).concat( arr.slice(idx+1) );
        } else {
            delete this._listeners[eventType];
        }
        return;
    }
    return;
};

REventTarget.prototype.dispatchEvent = function (event) {
    var t = event.type;
    var args = Array.prototype.slice.call(arguments, 0);
    if (this['on'+t]) {
        this['on'+t].apply(this, args);
    }
    if (this._listeners && t in this._listeners) {
        for(var i=0; i < this._listeners[t].length; i++) {
            this._listeners[t][i].apply(this, args);
        }
    }
};
//         [*] End of lib/reventtarget.js


//         [*] Including lib/simpleevent.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var SimpleEvent = function(type, obj) {
    this.type = type;
    if (typeof obj !== 'undefined') {
        for(var k in obj) {
            if (!obj.hasOwnProperty(k)) continue;
            this[k] = obj[k];
        }
    }
};

SimpleEvent.prototype.toString = function() {
    var r = [];
    for(var k in this) {
        if (!this.hasOwnProperty(k)) continue;
        var v = this[k];
        if (typeof v === 'function') v = '[function]';
        r.push(k + '=' + v);
    }
    return 'SimpleEvent(' + r.join(', ') + ')';
};
//         [*] End of lib/simpleevent.js


//         [*] Including lib/eventemitter.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var EventEmitter = function(events) {
    var that = this;
    that._events = events || [];
    that._listeners = {};
};
EventEmitter.prototype.emit = function(type) {
    var that = this;
    that._verifyType(type);
    if (that._nuked) return;

    var args = Array.prototype.slice.call(arguments, 1);
    if (that['on'+type]) {
        that['on'+type].apply(that, args);
    }
    if (type in that._listeners) {
        for(var i = 0; i < that._listeners[type].length; i++) {
            that._listeners[type][i].apply(that, args);
        }
    }
};

EventEmitter.prototype.on = function(type, callback) {
    var that = this;
    that._verifyType(type);
    if (that._nuked) return;

    if (!(type in that._listeners)) {
        that._listeners[type] = [];
    }
    that._listeners[type].push(callback);
};

EventEmitter.prototype._verifyType = function(type) {
    var that = this;
    if (utils.arrIndexOf(that._events, type) === -1) {
        utils.log('Event ' + JSON.stringify(type) +
                  ' not listed ' + JSON.stringify(that._events) +
                  ' in ' + that);
    }
};

EventEmitter.prototype.nuke = function() {
    var that = this;
    that._nuked = true;
    for(var i=0; i<that._events.length; i++) {
        delete that[that._events[i]];
    }
    that._listeners = {};
};
//         [*] End of lib/eventemitter.js


//         [*] Including lib/utils.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var random_string_chars = 'abcdefghijklmnopqrstuvwxyz0123456789_';
utils.random_string = function(length, max) {
    max = max || random_string_chars.length;
    var i, ret = [];
    for(i=0; i < length; i++) {
        ret.push( random_string_chars.substr(Math.floor(Math.random() * max),1) );
    }
    return ret.join('');
};
utils.random_number = function(max) {
    return Math.floor(Math.random() * max);
};
utils.random_number_string = function(max) {
    var t = (''+(max - 1)).length;
    var p = Array(t+1).join('0');
    return (p + utils.random_number(max)).slice(-t);
};

// Assuming that url looks like: http://asdasd:111/asd
utils.getOrigin = function(url) {
    url += '/';
    var parts = url.split('/').slice(0, 3);
    return parts.join('/');
};

utils.isSameOriginUrl = function(url_a, url_b) {
    // location.origin would do, but it's not always available.
    if (!url_b) url_b = _window.location.href;

    return (url_a.split('/').slice(0,3).join('/')
                ===
            url_b.split('/').slice(0,3).join('/'));
};

utils.getParentDomain = function(url) {
    // ipv4 ip address
    if (/^[0-9.]*$/.test(url)) return url;
    // ipv6 ip address
    if (/^\[/.test(url)) return url;
    // no dots
    if (!(/[.]/.test(url))) return url;

    var parts = url.split('.').slice(1);
    return parts.join('.');
};

utils.objectExtend = function(dst, src) {
    for(var k in src) {
        if (src.hasOwnProperty(k)) {
            dst[k] = src[k];
        }
    }
    return dst;
};

var WPrefix = '_jp';

utils.polluteGlobalNamespace = function() {
    if (!(WPrefix in _window)) {
        _window[WPrefix] = {};
    }
};

utils.closeFrame = function (code, reason) {
    return 'c'+JSON.stringify([code, reason]);
};

utils.userSetCode = function (code) {
    return code === 1000 || (code >= 3000 && code <= 4999);
};

// See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
// and RFC 2988.
utils.countRTO = function (rtt) {
    var rto;
    if (rtt > 100) {
        rto = 3 * rtt; // rto > 300msec
    } else {
        rto = rtt + 200; // 200msec < rto <= 300msec
    }
    return rto;
}

utils.log = function() {
    if (_window.console && console.log && console.log.apply) {
        console.log.apply(console, arguments);
    }
};

utils.bind = function(fun, that) {
    if (fun.bind) {
        return fun.bind(that);
    } else {
        return function() {
            return fun.apply(that, arguments);
        };
    }
};

utils.flatUrl = function(url) {
    return url.indexOf('?') === -1 && url.indexOf('#') === -1;
};

utils.amendUrl = function(url) {
    var dl = _document.location;
    if (!url) {
        throw new Error('Wrong url for SockJS');
    }
    if (!utils.flatUrl(url)) {
        throw new Error('Only basic urls are supported in SockJS');
    }

    //  '//abc' --> 'http://abc'
    if (url.indexOf('//') === 0) {
        url = dl.protocol + url;
    }
    // '/abc' --> 'http://localhost:80/abc'
    if (url.indexOf('/') === 0) {
        url = dl.protocol + '//' + dl.host + url;
    }
    // strip trailing slashes
    url = url.replace(/[/]+$/,'');
    return url;
};

// IE doesn't support [].indexOf.
utils.arrIndexOf = function(arr, obj){
    for(var i=0; i < arr.length; i++){
        if(arr[i] === obj){
            return i;
        }
    }
    return -1;
};

utils.arrSkip = function(arr, obj) {
    var idx = utils.arrIndexOf(arr, obj);
    if (idx === -1) {
        return arr.slice();
    } else {
        var dst = arr.slice(0, idx);
        return dst.concat(arr.slice(idx+1));
    }
};

// Via: https://gist.github.com/1133122/2121c601c5549155483f50be3da5305e83b8c5df
utils.isArray = Array.isArray || function(value) {
    return {}.toString.call(value).indexOf('Array') >= 0
};

utils.delay = function(t, fun) {
    if(typeof t === 'function') {
        fun = t;
        t = 0;
    }
    return setTimeout(fun, t);
};


// Chars worth escaping, as defined by Douglas Crockford:
//   https://github.com/douglascrockford/JSON-js/blob/47a9882cddeb1e8529e07af9736218075372b8ac/json2.js#L196
var json_escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    json_lookup = {
"\u0000":"\\u0000","\u0001":"\\u0001","\u0002":"\\u0002","\u0003":"\\u0003",
"\u0004":"\\u0004","\u0005":"\\u0005","\u0006":"\\u0006","\u0007":"\\u0007",
"\b":"\\b","\t":"\\t","\n":"\\n","\u000b":"\\u000b","\f":"\\f","\r":"\\r",
"\u000e":"\\u000e","\u000f":"\\u000f","\u0010":"\\u0010","\u0011":"\\u0011",
"\u0012":"\\u0012","\u0013":"\\u0013","\u0014":"\\u0014","\u0015":"\\u0015",
"\u0016":"\\u0016","\u0017":"\\u0017","\u0018":"\\u0018","\u0019":"\\u0019",
"\u001a":"\\u001a","\u001b":"\\u001b","\u001c":"\\u001c","\u001d":"\\u001d",
"\u001e":"\\u001e","\u001f":"\\u001f","\"":"\\\"","\\":"\\\\",
"\u007f":"\\u007f","\u0080":"\\u0080","\u0081":"\\u0081","\u0082":"\\u0082",
"\u0083":"\\u0083","\u0084":"\\u0084","\u0085":"\\u0085","\u0086":"\\u0086",
"\u0087":"\\u0087","\u0088":"\\u0088","\u0089":"\\u0089","\u008a":"\\u008a",
"\u008b":"\\u008b","\u008c":"\\u008c","\u008d":"\\u008d","\u008e":"\\u008e",
"\u008f":"\\u008f","\u0090":"\\u0090","\u0091":"\\u0091","\u0092":"\\u0092",
"\u0093":"\\u0093","\u0094":"\\u0094","\u0095":"\\u0095","\u0096":"\\u0096",
"\u0097":"\\u0097","\u0098":"\\u0098","\u0099":"\\u0099","\u009a":"\\u009a",
"\u009b":"\\u009b","\u009c":"\\u009c","\u009d":"\\u009d","\u009e":"\\u009e",
"\u009f":"\\u009f","\u00ad":"\\u00ad","\u0600":"\\u0600","\u0601":"\\u0601",
"\u0602":"\\u0602","\u0603":"\\u0603","\u0604":"\\u0604","\u070f":"\\u070f",
"\u17b4":"\\u17b4","\u17b5":"\\u17b5","\u200c":"\\u200c","\u200d":"\\u200d",
"\u200e":"\\u200e","\u200f":"\\u200f","\u2028":"\\u2028","\u2029":"\\u2029",
"\u202a":"\\u202a","\u202b":"\\u202b","\u202c":"\\u202c","\u202d":"\\u202d",
"\u202e":"\\u202e","\u202f":"\\u202f","\u2060":"\\u2060","\u2061":"\\u2061",
"\u2062":"\\u2062","\u2063":"\\u2063","\u2064":"\\u2064","\u2065":"\\u2065",
"\u2066":"\\u2066","\u2067":"\\u2067","\u2068":"\\u2068","\u2069":"\\u2069",
"\u206a":"\\u206a","\u206b":"\\u206b","\u206c":"\\u206c","\u206d":"\\u206d",
"\u206e":"\\u206e","\u206f":"\\u206f","\ufeff":"\\ufeff","\ufff0":"\\ufff0",
"\ufff1":"\\ufff1","\ufff2":"\\ufff2","\ufff3":"\\ufff3","\ufff4":"\\ufff4",
"\ufff5":"\\ufff5","\ufff6":"\\ufff6","\ufff7":"\\ufff7","\ufff8":"\\ufff8",
"\ufff9":"\\ufff9","\ufffa":"\\ufffa","\ufffb":"\\ufffb","\ufffc":"\\ufffc",
"\ufffd":"\\ufffd","\ufffe":"\\ufffe","\uffff":"\\uffff"};

// Some extra characters that Chrome gets wrong, and substitutes with
// something else on the wire.
var extra_escapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g,
    extra_lookup;

// JSON Quote string. Use native implementation when possible.
var JSONQuote = (JSON && JSON.stringify) || function(string) {
    json_escapable.lastIndex = 0;
    if (json_escapable.test(string)) {
        string = string.replace(json_escapable, function(a) {
            return json_lookup[a];
        });
    }
    return '"' + string + '"';
};

// This may be quite slow, so let's delay until user actually uses bad
// characters.
var unroll_lookup = function(escapable) {
    var i;
    var unrolled = {}
    var c = []
    for(i=0; i<65536; i++) {
        c.push( String.fromCharCode(i) );
    }
    escapable.lastIndex = 0;
    c.join('').replace(escapable, function (a) {
        unrolled[ a ] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        return '';
    });
    escapable.lastIndex = 0;
    return unrolled;
};

// Quote string, also taking care of unicode characters that browsers
// often break. Especially, take care of unicode surrogates:
//    http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
utils.quote = function(string) {
    var quoted = JSONQuote(string);

    // In most cases this should be very fast and good enough.
    extra_escapable.lastIndex = 0;
    if(!extra_escapable.test(quoted)) {
        return quoted;
    }

    if(!extra_lookup) extra_lookup = unroll_lookup(extra_escapable);

    return quoted.replace(extra_escapable, function(a) {
        return extra_lookup[a];
    });
}

var _all_protocols = ['websocket',
                      'xdr-streaming',
                      'xhr-streaming',
                      'iframe-eventsource',
                      'iframe-htmlfile',
                      'xdr-polling',
                      'xhr-polling',
                      'iframe-xhr-polling',
                      'jsonp-polling'];

utils.probeProtocols = function() {
    var probed = {};
    for(var i=0; i<_all_protocols.length; i++) {
        var protocol = _all_protocols[i];
        // User can have a typo in protocol name.
        probed[protocol] = SockJS[protocol] &&
                           SockJS[protocol].enabled();
    }
    return probed;
};

utils.detectProtocols = function(probed, protocols_whitelist, info) {
    var pe = {},
        protocols = [];
    if (!protocols_whitelist) protocols_whitelist = _all_protocols;
    for(var i=0; i<protocols_whitelist.length; i++) {
        var protocol = protocols_whitelist[i];
        pe[protocol] = probed[protocol];
    }
    var maybe_push = function(protos) {
        var proto = protos.shift();
        if (pe[proto]) {
            protocols.push(proto);
        } else {
            if (protos.length > 0) {
                maybe_push(protos);
            }
        }
    }

    // 1. Websocket
    if (info.websocket !== false) {
        maybe_push(['websocket']);
    }

    // 2. Streaming
    if (pe['xhr-streaming'] && !info.null_origin) {
        protocols.push('xhr-streaming');
    } else {
        if (pe['xdr-streaming'] && !info.cookie_needed && !info.null_origin) {
            protocols.push('xdr-streaming');
        } else {
            maybe_push(['iframe-eventsource',
                        'iframe-htmlfile']);
        }
    }

    // 3. Polling
    if (pe['xhr-polling'] && !info.null_origin) {
        protocols.push('xhr-polling');
    } else {
        if (pe['xdr-polling'] && !info.cookie_needed && !info.null_origin) {
            protocols.push('xdr-polling');
        } else {
            maybe_push(['iframe-xhr-polling',
                        'jsonp-polling']);
        }
    }
    return protocols;
}
//         [*] End of lib/utils.js


//         [*] Including lib/dom.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// May be used by htmlfile jsonp and transports.
var MPrefix = '_sockjs_global';
utils.createHook = function() {
    var window_id = 'a' + utils.random_string(8);
    if (!(MPrefix in _window)) {
        var map = {};
        _window[MPrefix] = function(window_id) {
            if (!(window_id in map)) {
                map[window_id] = {
                    id: window_id,
                    del: function() {delete map[window_id];}
                };
            }
            return map[window_id];
        }
    }
    return _window[MPrefix](window_id);
};



utils.attachMessage = function(listener) {
    utils.attachEvent('message', listener);
};
utils.attachEvent = function(event, listener) {
    if (typeof _window.addEventListener !== 'undefined') {
        _window.addEventListener(event, listener, false);
    } else {
        // IE quirks.
        // According to: http://stevesouders.com/misc/test-postmessage.php
        // the message gets delivered only to 'document', not 'window'.
        _document.attachEvent("on" + event, listener);
        // I get 'window' for ie8.
        _window.attachEvent("on" + event, listener);
    }
};

utils.detachMessage = function(listener) {
    utils.detachEvent('message', listener);
};
utils.detachEvent = function(event, listener) {
    if (typeof _window.addEventListener !== 'undefined') {
        _window.removeEventListener(event, listener, false);
    } else {
        _document.detachEvent("on" + event, listener);
        _window.detachEvent("on" + event, listener);
    }
};


var on_unload = {};
// Things registered after beforeunload are to be called immediately.
var after_unload = false;

var trigger_unload_callbacks = function() {
    for(var ref in on_unload) {
        on_unload[ref]();
        delete on_unload[ref];
    };
};

var unload_triggered = function() {
    if(after_unload) return;
    after_unload = true;
    trigger_unload_callbacks();
};

// 'unload' alone is not reliable in opera within an iframe, but we
// can't use `beforeunload` as IE fires it on javascript: links.
utils.attachEvent('unload', unload_triggered);

utils.unload_add = function(listener) {
    var ref = utils.random_string(8);
    on_unload[ref] = listener;
    if (after_unload) {
        utils.delay(trigger_unload_callbacks);
    }
    return ref;
};
utils.unload_del = function(ref) {
    if (ref in on_unload)
        delete on_unload[ref];
};


utils.createIframe = function (iframe_url, error_callback) {
    var iframe = _document.createElement('iframe');
    var tref, unload_ref;
    var unattach = function() {
        clearTimeout(tref);
        // Explorer had problems with that.
        try {iframe.onload = null;} catch (x) {}
        iframe.onerror = null;
    };
    var cleanup = function() {
        if (iframe) {
            unattach();
            // This timeout makes chrome fire onbeforeunload event
            // within iframe. Without the timeout it goes straight to
            // onunload.
            setTimeout(function() {
                if(iframe) {
                    iframe.parentNode.removeChild(iframe);
                }
                iframe = null;
            }, 0);
            utils.unload_del(unload_ref);
        }
    };
    var onerror = function(r) {
        if (iframe) {
            cleanup();
            error_callback(r);
        }
    };
    var post = function(msg, origin) {
        try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(msg, origin);
            }
        } catch (x) {};
    };

    iframe.src = iframe_url;
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.onerror = function(){onerror('onerror');};
    iframe.onload = function() {
        // `onload` is triggered before scripts on the iframe are
        // executed. Give it few seconds to actually load stuff.
        clearTimeout(tref);
        tref = setTimeout(function(){onerror('onload timeout');}, 2000);
    };
    _document.body.appendChild(iframe);
    tref = setTimeout(function(){onerror('timeout');}, 15000);
    unload_ref = utils.unload_add(cleanup);
    return {
        post: post,
        cleanup: cleanup,
        loaded: unattach
    };
};

utils.createHtmlfile = function (iframe_url, error_callback) {
    var doc = new ActiveXObject('htmlfile');
    var tref, unload_ref;
    var iframe;
    var unattach = function() {
        clearTimeout(tref);
    };
    var cleanup = function() {
        if (doc) {
            unattach();
            utils.unload_del(unload_ref);
            iframe.parentNode.removeChild(iframe);
            iframe = doc = null;
            CollectGarbage();
        }
    };
    var onerror = function(r)  {
        if (doc) {
            cleanup();
            error_callback(r);
        }
    };
    var post = function(msg, origin) {
        try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(msg, origin);
            }
        } catch (x) {};
    };

    doc.open();
    doc.write('<html><s' + 'cript>' +
              'document.domain="' + document.domain + '";' +
              '</s' + 'cript></html>');
    doc.close();
    doc.parentWindow[WPrefix] = _window[WPrefix];
    var c = doc.createElement('div');
    doc.body.appendChild(c);
    iframe = doc.createElement('iframe');
    c.appendChild(iframe);
    iframe.src = iframe_url;
    tref = setTimeout(function(){onerror('timeout');}, 15000);
    unload_ref = utils.unload_add(cleanup);
    return {
        post: post,
        cleanup: cleanup,
        loaded: unattach
    };
};
//         [*] End of lib/dom.js


//         [*] Including lib/dom2.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var AbstractXHRObject = function(){};
AbstractXHRObject.prototype = new EventEmitter(['chunk', 'finish']);

AbstractXHRObject.prototype._start = function(method, url, payload, opts) {
    var that = this;

    try {
        that.xhr = new XMLHttpRequest();
    } catch(x) {};

    if (!that.xhr) {
        try {
            that.xhr = new _window.ActiveXObject('Microsoft.XMLHTTP');
        } catch(x) {};
    }
    if (_window.ActiveXObject || _window.XDomainRequest) {
        // IE8 caches even POSTs
        url += ((url.indexOf('?') === -1) ? '?' : '&') + 't='+(+new Date);
    }

    // Explorer tends to keep connection open, even after the
    // tab gets closed: http://bugs.jquery.com/ticket/5280
    that.unload_ref = utils.unload_add(function(){that._cleanup(true);});
    try {
        that.xhr.open(method, url, true);
    } catch(e) {
        // IE raises an exception on wrong port.
        that.emit('finish', 0, '');
        that._cleanup();
        return;
    };

    if (!opts || !opts.no_credentials) {
        // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
        // "This never affects same-site requests."
        that.xhr.withCredentials = 'true';
    }
    if (opts && opts.headers) {
        for(var key in opts.headers) {
            that.xhr.setRequestHeader(key, opts.headers[key]);
        }
    }

    that.xhr.onreadystatechange = function() {
        if (that.xhr) {
            var x = that.xhr;
            switch (x.readyState) {
            case 3:
                // IE doesn't like peeking into responseText or status
                // on Microsoft.XMLHTTP and readystate=3
                try {
                    var status = x.status;
                    var text = x.responseText;
                } catch (x) {};
                // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
                if (status === 1223) status = 204;

                // IE does return readystate == 3 for 404 answers.
                if (text && text.length > 0) {
                    that.emit('chunk', status, text);
                }
                break;
            case 4:
                var status = x.status;
                // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
                if (status === 1223) status = 204;

                that.emit('finish', status, x.responseText);
                that._cleanup(false);
                break;
            }
        }
    };
    that.xhr.send(payload);
};

AbstractXHRObject.prototype._cleanup = function(abort) {
    var that = this;
    if (!that.xhr) return;
    utils.unload_del(that.unload_ref);

    // IE needs this field to be a function
    that.xhr.onreadystatechange = function(){};

    if (abort) {
        try {
            that.xhr.abort();
        } catch(x) {};
    }
    that.unload_ref = that.xhr = null;
};

AbstractXHRObject.prototype.close = function() {
    var that = this;
    that.nuke();
    that._cleanup(true);
};

var XHRCorsObject = utils.XHRCorsObject = function() {
    var that = this, args = arguments;
    utils.delay(function(){that._start.apply(that, args);});
};
XHRCorsObject.prototype = new AbstractXHRObject();

var XHRLocalObject = utils.XHRLocalObject = function(method, url, payload) {
    var that = this;
    utils.delay(function(){
        that._start(method, url, payload, {
            no_credentials: true
        });
    });
};
XHRLocalObject.prototype = new AbstractXHRObject();



// References:
//   http://ajaxian.com/archives/100-line-ajax-wrapper
//   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx
var XDRObject = utils.XDRObject = function(method, url, payload) {
    var that = this;
    utils.delay(function(){that._start(method, url, payload);});
};
XDRObject.prototype = new EventEmitter(['chunk', 'finish']);
XDRObject.prototype._start = function(method, url, payload) {
    var that = this;
    var xdr = new XDomainRequest();
    // IE caches even POSTs
    url += ((url.indexOf('?') === -1) ? '?' : '&') + 't='+(+new Date);

    var onerror = xdr.ontimeout = xdr.onerror = function() {
        that.emit('finish', 0, '');
        that._cleanup(false);
    };
    xdr.onprogress = function() {
        that.emit('chunk', 200, xdr.responseText);
    };
    xdr.onload = function() {
        that.emit('finish', 200, xdr.responseText);
        that._cleanup(false);
    };
    that.xdr = xdr;
    that.unload_ref = utils.unload_add(function(){that._cleanup(true);});
    try {
        // Fails with AccessDenied if port number is bogus
        that.xdr.open(method, url);
        that.xdr.send(payload);
    } catch(x) {
        onerror();
    }
};

XDRObject.prototype._cleanup = function(abort) {
    var that = this;
    if (!that.xdr) return;
    utils.unload_del(that.unload_ref);

    that.xdr.ontimeout = that.xdr.onerror = that.xdr.onprogress =
        that.xdr.onload = null;
    if (abort) {
        try {
            that.xdr.abort();
        } catch(x) {};
    }
    that.unload_ref = that.xdr = null;
};

XDRObject.prototype.close = function() {
    var that = this;
    that.nuke();
    that._cleanup(true);
};

// 1. Is natively via XHR
// 2. Is natively via XDR
// 3. Nope, but postMessage is there so it should work via the Iframe.
// 4. Nope, sorry.
utils.isXHRCorsCapable = function() {
    if (_window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()) {
        return 1;
    }
    // XDomainRequest doesn't work if page is served from file://
    if (_window.XDomainRequest && _document.domain) {
        return 2;
    }
    if (IframeTransport.enabled()) {
        return 3;
    }
    return 4;
};
//         [*] End of lib/dom2.js


//         [*] Including lib/sockjs.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var SockJS = function(url, dep_protocols_whitelist, options) {
    if (this === _window) {
        // makes `new` optional
        return new SockJS(url, dep_protocols_whitelist, options);
    }
    
    var that = this, protocols_whitelist;
    that._options = {devel: false, debug: false, protocols_whitelist: [],
                     info: undefined, rtt: undefined};
    if (options) {
        utils.objectExtend(that._options, options);
    }
    that._base_url = utils.amendUrl(url);
    that._server = that._options.server || utils.random_number_string(1000);
    if (that._options.protocols_whitelist &&
        that._options.protocols_whitelist.length) {
        protocols_whitelist = that._options.protocols_whitelist;
    } else {
        // Deprecated API
        if (typeof dep_protocols_whitelist === 'string' &&
            dep_protocols_whitelist.length > 0) {
            protocols_whitelist = [dep_protocols_whitelist];
        } else if (utils.isArray(dep_protocols_whitelist)) {
            protocols_whitelist = dep_protocols_whitelist
        } else {
            protocols_whitelist = null;
        }
        if (protocols_whitelist) {
            that._debug('Deprecated API: Use "protocols_whitelist" option ' +
                        'instead of supplying protocol list as a second ' +
                        'parameter to SockJS constructor.');
        }
    }
    that._protocols = [];
    that.protocol = null;
    that.readyState = SockJS.CONNECTING;
    that._ir = createInfoReceiver(that._base_url);
    that._ir.onfinish = function(info, rtt) {
        that._ir = null;
        if (info) {
            if (that._options.info) {
                // Override if user supplies the option
                info = utils.objectExtend(info, that._options.info);
            }
            if (that._options.rtt) {
                rtt = that._options.rtt;
            }
            that._applyInfo(info, rtt, protocols_whitelist);
            that._didClose();
        } else {
            that._didClose(1002, 'Can\'t connect to server', true);
        }
    };
};
// Inheritance
SockJS.prototype = new REventTarget();

SockJS.version = "0.3.4";

SockJS.CONNECTING = 0;
SockJS.OPEN = 1;
SockJS.CLOSING = 2;
SockJS.CLOSED = 3;

SockJS.prototype._debug = function() {
    if (this._options.debug)
        utils.log.apply(utils, arguments);
};

SockJS.prototype._dispatchOpen = function() {
    var that = this;
    if (that.readyState === SockJS.CONNECTING) {
        if (that._transport_tref) {
            clearTimeout(that._transport_tref);
            that._transport_tref = null;
        }
        that.readyState = SockJS.OPEN;
        that.dispatchEvent(new SimpleEvent("open"));
    } else {
        // The server might have been restarted, and lost track of our
        // connection.
        that._didClose(1006, "Server lost session");
    }
};

SockJS.prototype._dispatchMessage = function(data) {
    var that = this;
    if (that.readyState !== SockJS.OPEN)
            return;
    that.dispatchEvent(new SimpleEvent("message", {data: data}));
};

SockJS.prototype._dispatchHeartbeat = function(data) {
    var that = this;
    if (that.readyState !== SockJS.OPEN)
        return;
    that.dispatchEvent(new SimpleEvent('heartbeat', {}));
};

SockJS.prototype._didClose = function(code, reason, force) {
    var that = this;
    if (that.readyState !== SockJS.CONNECTING &&
        that.readyState !== SockJS.OPEN &&
        that.readyState !== SockJS.CLOSING)
            throw new Error('INVALID_STATE_ERR');
    if (that._ir) {
        that._ir.nuke();
        that._ir = null;
    }

    if (that._transport) {
        that._transport.doCleanup();
        that._transport = null;
    }

    var close_event = new SimpleEvent("close", {
        code: code,
        reason: reason,
        wasClean: utils.userSetCode(code)});

    if (!utils.userSetCode(code) &&
        that.readyState === SockJS.CONNECTING && !force) {
        if (that._try_next_protocol(close_event)) {
            return;
        }
        close_event = new SimpleEvent("close", {code: 2000,
                                                reason: "All transports failed",
                                                wasClean: false,
                                                last_event: close_event});
    }
    that.readyState = SockJS.CLOSED;

    utils.delay(function() {
                   that.dispatchEvent(close_event);
                });
};

SockJS.prototype._didMessage = function(data) {
    var that = this;
    var type = data.slice(0, 1);
    switch(type) {
    case 'o':
        that._dispatchOpen();
        break;
    case 'a':
        var payload = JSON.parse(data.slice(1) || '[]');
        for(var i=0; i < payload.length; i++){
            that._dispatchMessage(payload[i]);
        }
        break;
    case 'm':
        var payload = JSON.parse(data.slice(1) || 'null');
        that._dispatchMessage(payload);
        break;
    case 'c':
        var payload = JSON.parse(data.slice(1) || '[]');
        that._didClose(payload[0], payload[1]);
        break;
    case 'h':
        that._dispatchHeartbeat();
        break;
    }
};

SockJS.prototype._try_next_protocol = function(close_event) {
    var that = this;
    if (that.protocol) {
        that._debug('Closed transport:', that.protocol, ''+close_event);
        that.protocol = null;
    }
    if (that._transport_tref) {
        clearTimeout(that._transport_tref);
        that._transport_tref = null;
    }

    while(1) {
        var protocol = that.protocol = that._protocols.shift();
        if (!protocol) {
            return false;
        }
        // Some protocols require access to `body`, what if were in
        // the `head`?
        if (SockJS[protocol] &&
            SockJS[protocol].need_body === true &&
            (!_document.body ||
             (typeof _document.readyState !== 'undefined'
              && _document.readyState !== 'complete'))) {
            that._protocols.unshift(protocol);
            that.protocol = 'waiting-for-load';
            utils.attachEvent('load', function(){
                that._try_next_protocol();
            });
            return true;
        }

        if (!SockJS[protocol] ||
              !SockJS[protocol].enabled(that._options)) {
            that._debug('Skipping transport:', protocol);
        } else {
            var roundTrips = SockJS[protocol].roundTrips || 1;
            var to = ((that._options.rto || 0) * roundTrips) || 5000;
            that._transport_tref = utils.delay(to, function() {
                if (that.readyState === SockJS.CONNECTING) {
                    // I can't understand how it is possible to run
                    // this timer, when the state is CLOSED, but
                    // apparently in IE everythin is possible.
                    that._didClose(2007, "Transport timeouted");
                }
            });

            var connid = utils.random_string(8);
            var trans_url = that._base_url + '/' + that._server + '/' + connid;
            that._debug('Opening transport:', protocol, ' url:'+trans_url,
                        ' RTO:'+that._options.rto);
            that._transport = new SockJS[protocol](that, trans_url,
                                                   that._base_url);
            return true;
        }
    }
};

SockJS.prototype.close = function(code, reason) {
    var that = this;
    if (code && !utils.userSetCode(code))
        throw new Error("INVALID_ACCESS_ERR");
    if(that.readyState !== SockJS.CONNECTING &&
       that.readyState !== SockJS.OPEN) {
        return false;
    }
    that.readyState = SockJS.CLOSING;
    that._didClose(code || 1000, reason || "Normal closure");
    return true;
};

SockJS.prototype.send = function(data) {
    var that = this;
    if (that.readyState === SockJS.CONNECTING)
        throw new Error('INVALID_STATE_ERR');
    if (that.readyState === SockJS.OPEN) {
        that._transport.doSend(utils.quote('' + data));
    }
    return true;
};

SockJS.prototype._applyInfo = function(info, rtt, protocols_whitelist) {
    var that = this;
    that._options.info = info;
    that._options.rtt = rtt;
    that._options.rto = utils.countRTO(rtt);
    that._options.info.null_origin = !_document.domain;
    var probed = utils.probeProtocols();
    that._protocols = utils.detectProtocols(probed, protocols_whitelist, info);
};
//         [*] End of lib/sockjs.js


//         [*] Including lib/trans-websocket.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var WebSocketTransport = SockJS.websocket = function(ri, trans_url) {
    var that = this;
    var url = trans_url + '/websocket';
    if (url.slice(0, 5) === 'https') {
        url = 'wss' + url.slice(5);
    } else {
        url = 'ws' + url.slice(4);
    }
    that.ri = ri;
    that.url = url;
    var Constructor = _window.WebSocket || _window.MozWebSocket;

    that.ws = new Constructor(that.url);
    that.ws.onmessage = function(e) {
        that.ri._didMessage(e.data);
    };
    // Firefox has an interesting bug. If a websocket connection is
    // created after onunload, it stays alive even when user
    // navigates away from the page. In such situation let's lie -
    // let's not open the ws connection at all. See:
    // https://github.com/sockjs/sockjs-client/issues/28
    // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
    that.unload_ref = utils.unload_add(function(){that.ws.close()});
    that.ws.onclose = function() {
        that.ri._didMessage(utils.closeFrame(1006, "WebSocket connection broken"));
    };
};

WebSocketTransport.prototype.doSend = function(data) {
    this.ws.send('[' + data + ']');
};

WebSocketTransport.prototype.doCleanup = function() {
    var that = this;
    var ws = that.ws;
    if (ws) {
        ws.onmessage = ws.onclose = null;
        ws.close();
        utils.unload_del(that.unload_ref);
        that.unload_ref = that.ri = that.ws = null;
    }
};

WebSocketTransport.enabled = function() {
    return !!(_window.WebSocket || _window.MozWebSocket);
};

// In theory, ws should require 1 round trip. But in chrome, this is
// not very stable over SSL. Most likely a ws connection requires a
// separate SSL connection, in which case 2 round trips are an
// absolute minumum.
WebSocketTransport.roundTrips = 2;
//         [*] End of lib/trans-websocket.js


//         [*] Including lib/trans-sender.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var BufferedSender = function() {};
BufferedSender.prototype.send_constructor = function(sender) {
    var that = this;
    that.send_buffer = [];
    that.sender = sender;
};
BufferedSender.prototype.doSend = function(message) {
    var that = this;
    that.send_buffer.push(message);
    if (!that.send_stop) {
        that.send_schedule();
    }
};

// For polling transports in a situation when in the message callback,
// new message is being send. If the sending connection was started
// before receiving one, it is possible to saturate the network and
// timeout due to the lack of receiving socket. To avoid that we delay
// sending messages by some small time, in order to let receiving
// connection be started beforehand. This is only a halfmeasure and
// does not fix the big problem, but it does make the tests go more
// stable on slow networks.
BufferedSender.prototype.send_schedule_wait = function() {
    var that = this;
    var tref;
    that.send_stop = function() {
        that.send_stop = null;
        clearTimeout(tref);
    };
    tref = utils.delay(25, function() {
        that.send_stop = null;
        that.send_schedule();
    });
};

BufferedSender.prototype.send_schedule = function() {
    var that = this;
    if (that.send_buffer.length > 0) {
        var payload = '[' + that.send_buffer.join(',') + ']';
        that.send_stop = that.sender(that.trans_url, payload, function(success, abort_reason) {
            that.send_stop = null;
            if (success === false) {
                that.ri._didClose(1006, 'Sending error ' + abort_reason);
            } else {
                that.send_schedule_wait();
            }
        });
        that.send_buffer = [];
    }
};

BufferedSender.prototype.send_destructor = function() {
    var that = this;
    if (that._send_stop) {
        that._send_stop();
    }
    that._send_stop = null;
};

var jsonPGenericSender = function(url, payload, callback) {
    var that = this;

    if (!('_send_form' in that)) {
        var form = that._send_form = _document.createElement('form');
        var area = that._send_area = _document.createElement('textarea');
        area.name = 'd';
        form.style.display = 'none';
        form.style.position = 'absolute';
        form.method = 'POST';
        form.enctype = 'application/x-www-form-urlencoded';
        form.acceptCharset = "UTF-8";
        form.appendChild(area);
        _document.body.appendChild(form);
    }
    var form = that._send_form;
    var area = that._send_area;
    var id = 'a' + utils.random_string(8);
    form.target = id;
    form.action = url + '/jsonp_send?i=' + id;

    var iframe;
    try {
        // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
        iframe = _document.createElement('<iframe name="'+ id +'">');
    } catch(x) {
        iframe = _document.createElement('iframe');
        iframe.name = id;
    }
    iframe.id = id;
    form.appendChild(iframe);
    iframe.style.display = 'none';

    try {
        area.value = payload;
    } catch(e) {
        utils.log('Your browser is seriously broken. Go home! ' + e.message);
    }
    form.submit();

    var completed = function(e) {
        if (!iframe.onerror) return;
        iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
        // Opera mini doesn't like if we GC iframe
        // immediately, thus this timeout.
        utils.delay(500, function() {
                       iframe.parentNode.removeChild(iframe);
                       iframe = null;
                   });
        area.value = '';
        // It is not possible to detect if the iframe succeeded or
        // failed to submit our form.
        callback(true);
    };
    iframe.onerror = iframe.onload = completed;
    iframe.onreadystatechange = function(e) {
        if (iframe.readyState == 'complete') completed();
    };
    return completed;
};

var createAjaxSender = function(AjaxObject) {
    return function(url, payload, callback) {
        var xo = new AjaxObject('POST', url + '/xhr_send', payload);
        xo.onfinish = function(status, text) {
            callback(status === 200 || status === 204,
                     'http status ' + status);
        };
        return function(abort_reason) {
            callback(false, abort_reason);
        };
    };
};
//         [*] End of lib/trans-sender.js


//         [*] Including lib/trans-jsonp-receiver.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// Parts derived from Socket.io:
//    https://github.com/LearnBoost/socket.io/blob/0.6.17/lib/socket.io/transports/jsonp-polling.js
// and jQuery-JSONP:
//    https://code.google.com/p/jquery-jsonp/source/browse/trunk/core/jquery.jsonp.js
var jsonPGenericReceiver = function(url, callback) {
    var tref;
    var script = _document.createElement('script');
    var script2;  // Opera synchronous load trick.
    var close_script = function(frame) {
        if (script2) {
            script2.parentNode.removeChild(script2);
            script2 = null;
        }
        if (script) {
            clearTimeout(tref);
            // Unfortunately, you can't really abort script loading of
            // the script.
            script.parentNode.removeChild(script);
            script.onreadystatechange = script.onerror =
                script.onload = script.onclick = null;
            script = null;
            callback(frame);
            callback = null;
        }
    };

    // IE9 fires 'error' event after orsc or before, in random order.
    var loaded_okay = false;
    var error_timer = null;

    script.id = 'a' + utils.random_string(8);
    script.src = url;
    script.type = 'text/javascript';
    script.charset = 'UTF-8';
    script.onerror = function(e) {
        if (!error_timer) {
            // Delay firing close_script.
            error_timer = setTimeout(function() {
                if (!loaded_okay) {
                    close_script(utils.closeFrame(
                        1006,
                        "JSONP script loaded abnormally (onerror)"));
                }
            }, 1000);
        }
    };
    script.onload = function(e) {
        close_script(utils.closeFrame(1006, "JSONP script loaded abnormally (onload)"));
    };

    script.onreadystatechange = function(e) {
        if (/loaded|closed/.test(script.readyState)) {
            if (script && script.htmlFor && script.onclick) {
                loaded_okay = true;
                try {
                    // In IE, actually execute the script.
                    script.onclick();
                } catch (x) {}
            }
            if (script) {
                close_script(utils.closeFrame(1006, "JSONP script loaded abnormally (onreadystatechange)"));
            }
        }
    };
    // IE: event/htmlFor/onclick trick.
    // One can't rely on proper order for onreadystatechange. In order to
    // make sure, set a 'htmlFor' and 'event' properties, so that
    // script code will be installed as 'onclick' handler for the
    // script object. Later, onreadystatechange, manually execute this
    // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
    // set. For reference see:
    //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
    // Also, read on that about script ordering:
    //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
    if (typeof script.async === 'undefined' && _document.attachEvent) {
        // According to mozilla docs, in recent browsers script.async defaults
        // to 'true', so we may use it to detect a good browser:
        // https://developer.mozilla.org/en/HTML/Element/script
        if (!/opera/i.test(navigator.userAgent)) {
            // Naively assume we're in IE
            try {
                script.htmlFor = script.id;
                script.event = "onclick";
            } catch (x) {}
            script.async = true;
        } else {
            // Opera, second sync script hack
            script2 = _document.createElement('script');
            script2.text = "try{var a = document.getElementById('"+script.id+"'); if(a)a.onerror();}catch(x){};";
            script.async = script2.async = false;
        }
    }
    if (typeof script.async !== 'undefined') {
        script.async = true;
    }

    // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
    tref = setTimeout(function() {
                          close_script(utils.closeFrame(1006, "JSONP script loaded abnormally (timeout)"));
                      }, 35000);

    var head = _document.getElementsByTagName('head')[0];
    head.insertBefore(script, head.firstChild);
    if (script2) {
        head.insertBefore(script2, head.firstChild);
    }
    return close_script;
};
//         [*] End of lib/trans-jsonp-receiver.js


//         [*] Including lib/trans-jsonp-polling.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// The simplest and most robust transport, using the well-know cross
// domain hack - JSONP. This transport is quite inefficient - one
// mssage could use up to one http request. But at least it works almost
// everywhere.
// Known limitations:
//   o you will get a spinning cursor
//   o for Konqueror a dumb timer is needed to detect errors


var JsonPTransport = SockJS['jsonp-polling'] = function(ri, trans_url) {
    utils.polluteGlobalNamespace();
    var that = this;
    that.ri = ri;
    that.trans_url = trans_url;
    that.send_constructor(jsonPGenericSender);
    that._schedule_recv();
};

// Inheritnace
JsonPTransport.prototype = new BufferedSender();

JsonPTransport.prototype._schedule_recv = function() {
    var that = this;
    var callback = function(data) {
        that._recv_stop = null;
        if (data) {
            // no data - heartbeat;
            if (!that._is_closing) {
                that.ri._didMessage(data);
            }
        }
        // The message can be a close message, and change is_closing state.
        if (!that._is_closing) {
            that._schedule_recv();
        }
    };
    that._recv_stop = jsonPReceiverWrapper(that.trans_url + '/jsonp',
                                           jsonPGenericReceiver, callback);
};

JsonPTransport.enabled = function() {
    return true;
};

JsonPTransport.need_body = true;


JsonPTransport.prototype.doCleanup = function() {
    var that = this;
    that._is_closing = true;
    if (that._recv_stop) {
        that._recv_stop();
    }
    that.ri = that._recv_stop = null;
    that.send_destructor();
};


// Abstract away code that handles global namespace pollution.
var jsonPReceiverWrapper = function(url, constructReceiver, user_callback) {
    var id = 'a' + utils.random_string(6);
    var url_id = url + '?c=' + escape(WPrefix + '.' + id);

    // Unfortunately it is not possible to abort loading of the
    // script. We need to keep track of frake close frames.
    var aborting = 0;

    // Callback will be called exactly once.
    var callback = function(frame) {
        switch(aborting) {
        case 0:
            // Normal behaviour - delete hook _and_ emit message.
            delete _window[WPrefix][id];
            user_callback(frame);
            break;
        case 1:
            // Fake close frame - emit but don't delete hook.
            user_callback(frame);
            aborting = 2;
            break;
        case 2:
            // Got frame after connection was closed, delete hook, don't emit.
            delete _window[WPrefix][id];
            break;
        }
    };

    var close_script = constructReceiver(url_id, callback);
    _window[WPrefix][id] = close_script;
    var stop = function() {
        if (_window[WPrefix][id]) {
            aborting = 1;
            _window[WPrefix][id](utils.closeFrame(1000, "JSONP user aborted read"));
        }
    };
    return stop;
};
//         [*] End of lib/trans-jsonp-polling.js


//         [*] Including lib/trans-xhr.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var AjaxBasedTransport = function() {};
AjaxBasedTransport.prototype = new BufferedSender();

AjaxBasedTransport.prototype.run = function(ri, trans_url,
                                            url_suffix, Receiver, AjaxObject) {
    var that = this;
    that.ri = ri;
    that.trans_url = trans_url;
    that.send_constructor(createAjaxSender(AjaxObject));
    that.poll = new Polling(ri, Receiver,
                            trans_url + url_suffix, AjaxObject);
};

AjaxBasedTransport.prototype.doCleanup = function() {
    var that = this;
    if (that.poll) {
        that.poll.abort();
        that.poll = null;
    }
};

// xhr-streaming
var XhrStreamingTransport = SockJS['xhr-streaming'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr_streaming', XhrReceiver, utils.XHRCorsObject);
};

XhrStreamingTransport.prototype = new AjaxBasedTransport();

XhrStreamingTransport.enabled = function() {
    // Support for CORS Ajax aka Ajax2? Opera 12 claims CORS but
    // doesn't do streaming.
    return (_window.XMLHttpRequest &&
            'withCredentials' in new XMLHttpRequest() &&
            (!/opera/i.test(navigator.userAgent)));
};
XhrStreamingTransport.roundTrips = 2; // preflight, ajax

// Safari gets confused when a streaming ajax request is started
// before onload. This causes the load indicator to spin indefinetely.
XhrStreamingTransport.need_body = true;


// According to:
//   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
//   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/


// xdr-streaming
var XdrStreamingTransport = SockJS['xdr-streaming'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr_streaming', XhrReceiver, utils.XDRObject);
};

XdrStreamingTransport.prototype = new AjaxBasedTransport();

XdrStreamingTransport.enabled = function() {
    return !!_window.XDomainRequest;
};
XdrStreamingTransport.roundTrips = 2; // preflight, ajax



// xhr-polling
var XhrPollingTransport = SockJS['xhr-polling'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr', XhrReceiver, utils.XHRCorsObject);
};

XhrPollingTransport.prototype = new AjaxBasedTransport();

XhrPollingTransport.enabled = XhrStreamingTransport.enabled;
XhrPollingTransport.roundTrips = 2; // preflight, ajax


// xdr-polling
var XdrPollingTransport = SockJS['xdr-polling'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr', XhrReceiver, utils.XDRObject);
};

XdrPollingTransport.prototype = new AjaxBasedTransport();

XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
XdrPollingTransport.roundTrips = 2; // preflight, ajax
//         [*] End of lib/trans-xhr.js


//         [*] Including lib/trans-iframe.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// Few cool transports do work only for same-origin. In order to make
// them working cross-domain we shall use iframe, served form the
// remote domain. New browsers, have capabilities to communicate with
// cross domain iframe, using postMessage(). In IE it was implemented
// from IE 8+, but of course, IE got some details wrong:
//    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
//    http://stevesouders.com/misc/test-postmessage.php

var IframeTransport = function() {};

IframeTransport.prototype.i_constructor = function(ri, trans_url, base_url) {
    var that = this;
    that.ri = ri;
    that.origin = utils.getOrigin(base_url);
    that.base_url = base_url;
    that.trans_url = trans_url;

    var iframe_url = base_url + '/iframe.html';
    if (that.ri._options.devel) {
        iframe_url += '?t=' + (+new Date);
    }
    that.window_id = utils.random_string(8);
    iframe_url += '#' + that.window_id;

    that.iframeObj = utils.createIframe(iframe_url, function(r) {
                                            that.ri._didClose(1006, "Unable to load an iframe (" + r + ")");
                                        });

    that.onmessage_cb = utils.bind(that.onmessage, that);
    utils.attachMessage(that.onmessage_cb);
};

IframeTransport.prototype.doCleanup = function() {
    var that = this;
    if (that.iframeObj) {
        utils.detachMessage(that.onmessage_cb);
        try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            if (that.iframeObj.iframe.contentWindow) {
                that.postMessage('c');
            }
        } catch (x) {}
        that.iframeObj.cleanup();
        that.iframeObj = null;
        that.onmessage_cb = that.iframeObj = null;
    }
};

IframeTransport.prototype.onmessage = function(e) {
    var that = this;
    if (e.origin !== that.origin) return;
    var window_id = e.data.slice(0, 8);
    var type = e.data.slice(8, 9);
    var data = e.data.slice(9);

    if (window_id !== that.window_id) return;

    switch(type) {
    case 's':
        that.iframeObj.loaded();
        that.postMessage('s', JSON.stringify([SockJS.version, that.protocol, that.trans_url, that.base_url]));
        break;
    case 't':
        that.ri._didMessage(data);
        break;
    }
};

IframeTransport.prototype.postMessage = function(type, data) {
    var that = this;
    that.iframeObj.post(that.window_id + type + (data || ''), that.origin);
};

IframeTransport.prototype.doSend = function (message) {
    this.postMessage('m', message);
};

IframeTransport.enabled = function() {
    // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
    // huge delay, or not at all.
    var konqueror = navigator && navigator.userAgent && navigator.userAgent.indexOf('Konqueror') !== -1;
    return ((typeof _window.postMessage === 'function' ||
            typeof _window.postMessage === 'object') && (!konqueror));
};
//         [*] End of lib/trans-iframe.js


//         [*] Including lib/trans-iframe-within.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var curr_window_id;

var postMessage = function (type, data) {
    if(parent !== _window) {
        parent.postMessage(curr_window_id + type + (data || ''), '*');
    } else {
        utils.log("Can't postMessage, no parent window.", type, data);
    }
};

var FacadeJS = function() {};
FacadeJS.prototype._didClose = function (code, reason) {
    postMessage('t', utils.closeFrame(code, reason));
};
FacadeJS.prototype._didMessage = function (frame) {
    postMessage('t', frame);
};
FacadeJS.prototype._doSend = function (data) {
    this._transport.doSend(data);
};
FacadeJS.prototype._doCleanup = function () {
    this._transport.doCleanup();
};

utils.parent_origin = undefined;

SockJS.bootstrap_iframe = function() {
    var facade;
    curr_window_id = _document.location.hash.slice(1);
    var onMessage = function(e) {
        if(e.source !== parent) return;
        if(typeof utils.parent_origin === 'undefined')
            utils.parent_origin = e.origin;
        if (e.origin !== utils.parent_origin) return;

        var window_id = e.data.slice(0, 8);
        var type = e.data.slice(8, 9);
        var data = e.data.slice(9);
        if (window_id !== curr_window_id) return;
        switch(type) {
        case 's':
            var p = JSON.parse(data);
            var version = p[0];
            var protocol = p[1];
            var trans_url = p[2];
            var base_url = p[3];
            if (version !== SockJS.version) {
                utils.log("Incompatibile SockJS! Main site uses:" +
                          " \"" + version + "\", the iframe:" +
                          " \"" + SockJS.version + "\".");
            }
            if (!utils.flatUrl(trans_url) || !utils.flatUrl(base_url)) {
                utils.log("Only basic urls are supported in SockJS");
                return;
            }

            if (!utils.isSameOriginUrl(trans_url) ||
                !utils.isSameOriginUrl(base_url)) {
                utils.log("Can't connect to different domain from within an " +
                          "iframe. (" + JSON.stringify([_window.location.href, trans_url, base_url]) +
                          ")");
                return;
            }
            facade = new FacadeJS();
            facade._transport = new FacadeJS[protocol](facade, trans_url, base_url);
            break;
        case 'm':
            facade._doSend(data);
            break;
        case 'c':
            if (facade)
                facade._doCleanup();
            facade = null;
            break;
        }
    };

    // alert('test ticker');
    // facade = new FacadeJS();
    // facade._transport = new FacadeJS['w-iframe-xhr-polling'](facade, 'http://host.com:9999/ticker/12/basd');

    utils.attachMessage(onMessage);

    // Start
    postMessage('s');
};
//         [*] End of lib/trans-iframe-within.js


//         [*] Including lib/info.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var InfoReceiver = function(base_url, AjaxObject) {
    var that = this;
    utils.delay(function(){that.doXhr(base_url, AjaxObject);});
};

InfoReceiver.prototype = new EventEmitter(['finish']);

InfoReceiver.prototype.doXhr = function(base_url, AjaxObject) {
    var that = this;
    var t0 = (new Date()).getTime();
    var xo = new AjaxObject('GET', base_url + '/info');

    var tref = utils.delay(8000,
                           function(){xo.ontimeout();});

    xo.onfinish = function(status, text) {
        clearTimeout(tref);
        tref = null;
        if (status === 200) {
            var rtt = (new Date()).getTime() - t0;
            var info = JSON.parse(text);
            if (typeof info !== 'object') info = {};
            that.emit('finish', info, rtt);
        } else {
            that.emit('finish');
        }
    };
    xo.ontimeout = function() {
        xo.close();
        that.emit('finish');
    };
};

var InfoReceiverIframe = function(base_url) {
    var that = this;
    var go = function() {
        var ifr = new IframeTransport();
        ifr.protocol = 'w-iframe-info-receiver';
        var fun = function(r) {
            if (typeof r === 'string' && r.substr(0,1) === 'm') {
                var d = JSON.parse(r.substr(1));
                var info = d[0], rtt = d[1];
                that.emit('finish', info, rtt);
            } else {
                that.emit('finish');
            }
            ifr.doCleanup();
            ifr = null;
        };
        var mock_ri = {
            _options: {},
            _didClose: fun,
            _didMessage: fun
        };
        ifr.i_constructor(mock_ri, base_url, base_url);
    }
    if(!_document.body) {
        utils.attachEvent('load', go);
    } else {
        go();
    }
};
InfoReceiverIframe.prototype = new EventEmitter(['finish']);


var InfoReceiverFake = function() {
    // It may not be possible to do cross domain AJAX to get the info
    // data, for example for IE7. But we want to run JSONP, so let's
    // fake the response, with rtt=2s (rto=6s).
    var that = this;
    utils.delay(function() {
        that.emit('finish', {}, 2000);
    });
};
InfoReceiverFake.prototype = new EventEmitter(['finish']);

var createInfoReceiver = function(base_url) {
    if (utils.isSameOriginUrl(base_url)) {
        // If, for some reason, we have SockJS locally - there's no
        // need to start up the complex machinery. Just use ajax.
        return new InfoReceiver(base_url, utils.XHRLocalObject);
    }
    switch (utils.isXHRCorsCapable()) {
    case 1:
        // XHRLocalObject -> no_credentials=true
        return new InfoReceiver(base_url, utils.XHRLocalObject);
    case 2:
        return new InfoReceiver(base_url, utils.XDRObject);
    case 3:
        // Opera
        return new InfoReceiverIframe(base_url);
    default:
        // IE 7
        return new InfoReceiverFake();
    };
};


var WInfoReceiverIframe = FacadeJS['w-iframe-info-receiver'] = function(ri, _trans_url, base_url) {
    var ir = new InfoReceiver(base_url, utils.XHRLocalObject);
    ir.onfinish = function(info, rtt) {
        ri._didMessage('m'+JSON.stringify([info, rtt]));
        ri._didClose();
    }
};
WInfoReceiverIframe.prototype.doCleanup = function() {};
//         [*] End of lib/info.js


//         [*] Including lib/trans-iframe-eventsource.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var EventSourceIframeTransport = SockJS['iframe-eventsource'] = function () {
    var that = this;
    that.protocol = 'w-iframe-eventsource';
    that.i_constructor.apply(that, arguments);
};

EventSourceIframeTransport.prototype = new IframeTransport();

EventSourceIframeTransport.enabled = function () {
    return ('EventSource' in _window) && IframeTransport.enabled();
};

EventSourceIframeTransport.need_body = true;
EventSourceIframeTransport.roundTrips = 3; // html, javascript, eventsource


// w-iframe-eventsource
var EventSourceTransport = FacadeJS['w-iframe-eventsource'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/eventsource', EventSourceReceiver, utils.XHRLocalObject);
}
EventSourceTransport.prototype = new AjaxBasedTransport();
//         [*] End of lib/trans-iframe-eventsource.js


//         [*] Including lib/trans-iframe-xhr-polling.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var XhrPollingIframeTransport = SockJS['iframe-xhr-polling'] = function () {
    var that = this;
    that.protocol = 'w-iframe-xhr-polling';
    that.i_constructor.apply(that, arguments);
};

XhrPollingIframeTransport.prototype = new IframeTransport();

XhrPollingIframeTransport.enabled = function () {
    return _window.XMLHttpRequest && IframeTransport.enabled();
};

XhrPollingIframeTransport.need_body = true;
XhrPollingIframeTransport.roundTrips = 3; // html, javascript, xhr


// w-iframe-xhr-polling
var XhrPollingITransport = FacadeJS['w-iframe-xhr-polling'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr', XhrReceiver, utils.XHRLocalObject);
};

XhrPollingITransport.prototype = new AjaxBasedTransport();
//         [*] End of lib/trans-iframe-xhr-polling.js


//         [*] Including lib/trans-iframe-htmlfile.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// This transport generally works in any browser, but will cause a
// spinning cursor to appear in any browser other than IE.
// We may test this transport in all browsers - why not, but in
// production it should be only run in IE.

var HtmlFileIframeTransport = SockJS['iframe-htmlfile'] = function () {
    var that = this;
    that.protocol = 'w-iframe-htmlfile';
    that.i_constructor.apply(that, arguments);
};

// Inheritance.
HtmlFileIframeTransport.prototype = new IframeTransport();

HtmlFileIframeTransport.enabled = function() {
    return IframeTransport.enabled();
};

HtmlFileIframeTransport.need_body = true;
HtmlFileIframeTransport.roundTrips = 3; // html, javascript, htmlfile


// w-iframe-htmlfile
var HtmlFileTransport = FacadeJS['w-iframe-htmlfile'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/htmlfile', HtmlfileReceiver, utils.XHRLocalObject);
};
HtmlFileTransport.prototype = new AjaxBasedTransport();
//         [*] End of lib/trans-iframe-htmlfile.js


//         [*] Including lib/trans-polling.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var Polling = function(ri, Receiver, recv_url, AjaxObject) {
    var that = this;
    that.ri = ri;
    that.Receiver = Receiver;
    that.recv_url = recv_url;
    that.AjaxObject = AjaxObject;
    that._scheduleRecv();
};

Polling.prototype._scheduleRecv = function() {
    var that = this;
    var poll = that.poll = new that.Receiver(that.recv_url, that.AjaxObject);
    var msg_counter = 0;
    poll.onmessage = function(e) {
        msg_counter += 1;
        that.ri._didMessage(e.data);
    };
    poll.onclose = function(e) {
        that.poll = poll = poll.onmessage = poll.onclose = null;
        if (!that.poll_is_closing) {
            if (e.reason === 'permanent') {
                that.ri._didClose(1006, 'Polling error (' + e.reason + ')');
            } else {
                that._scheduleRecv();
            }
        }
    };
};

Polling.prototype.abort = function() {
    var that = this;
    that.poll_is_closing = true;
    if (that.poll) {
        that.poll.abort();
    }
};
//         [*] End of lib/trans-polling.js


//         [*] Including lib/trans-receiver-eventsource.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var EventSourceReceiver = function(url) {
    var that = this;
    var es = new EventSource(url);
    es.onmessage = function(e) {
        that.dispatchEvent(new SimpleEvent('message',
                                           {'data': unescape(e.data)}));
    };
    that.es_close = es.onerror = function(e, abort_reason) {
        // ES on reconnection has readyState = 0 or 1.
        // on network error it's CLOSED = 2
        var reason = abort_reason ? 'user' :
            (es.readyState !== 2 ? 'network' : 'permanent');
        that.es_close = es.onmessage = es.onerror = null;
        // EventSource reconnects automatically.
        es.close();
        es = null;
        // Safari and chrome < 15 crash if we close window before
        // waiting for ES cleanup. See:
        //   https://code.google.com/p/chromium/issues/detail?id=89155
        utils.delay(200, function() {
                        that.dispatchEvent(new SimpleEvent('close', {reason: reason}));
                    });
    };
};

EventSourceReceiver.prototype = new REventTarget();

EventSourceReceiver.prototype.abort = function() {
    var that = this;
    if (that.es_close) {
        that.es_close({}, true);
    }
};
//         [*] End of lib/trans-receiver-eventsource.js


//         [*] Including lib/trans-receiver-htmlfile.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var _is_ie_htmlfile_capable;
var isIeHtmlfileCapable = function() {
    if (_is_ie_htmlfile_capable === undefined) {
        if ('ActiveXObject' in _window) {
            try {
                _is_ie_htmlfile_capable = !!new ActiveXObject('htmlfile');
            } catch (x) {}
        } else {
            _is_ie_htmlfile_capable = false;
        }
    }
    return _is_ie_htmlfile_capable;
};


var HtmlfileReceiver = function(url) {
    var that = this;
    utils.polluteGlobalNamespace();

    that.id = 'a' + utils.random_string(6, 26);
    url += ((url.indexOf('?') === -1) ? '?' : '&') +
        'c=' + escape(WPrefix + '.' + that.id);

    var constructor = isIeHtmlfileCapable() ?
        utils.createHtmlfile : utils.createIframe;

    var iframeObj;
    _window[WPrefix][that.id] = {
        start: function () {
            iframeObj.loaded();
        },
        message: function (data) {
            that.dispatchEvent(new SimpleEvent('message', {'data': data}));
        },
        stop: function () {
            that.iframe_close({}, 'network');
        }
    };
    that.iframe_close = function(e, abort_reason) {
        iframeObj.cleanup();
        that.iframe_close = iframeObj = null;
        delete _window[WPrefix][that.id];
        that.dispatchEvent(new SimpleEvent('close', {reason: abort_reason}));
    };
    iframeObj = constructor(url, function(e) {
                                that.iframe_close({}, 'permanent');
                            });
};

HtmlfileReceiver.prototype = new REventTarget();

HtmlfileReceiver.prototype.abort = function() {
    var that = this;
    if (that.iframe_close) {
        that.iframe_close({}, 'user');
    }
};
//         [*] End of lib/trans-receiver-htmlfile.js


//         [*] Including lib/trans-receiver-xhr.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var XhrReceiver = function(url, AjaxObject) {
    var that = this;
    var buf_pos = 0;

    that.xo = new AjaxObject('POST', url, null);
    that.xo.onchunk = function(status, text) {
        if (status !== 200) return;
        while (1) {
            var buf = text.slice(buf_pos);
            var p = buf.indexOf('\n');
            if (p === -1) break;
            buf_pos += p+1;
            var msg = buf.slice(0, p);
            that.dispatchEvent(new SimpleEvent('message', {data: msg}));
        }
    };
    that.xo.onfinish = function(status, text) {
        that.xo.onchunk(status, text);
        that.xo = null;
        var reason = status === 200 ? 'network' : 'permanent';
        that.dispatchEvent(new SimpleEvent('close', {reason: reason}));
    }
};

XhrReceiver.prototype = new REventTarget();

XhrReceiver.prototype.abort = function() {
    var that = this;
    if (that.xo) {
        that.xo.close();
        that.dispatchEvent(new SimpleEvent('close', {reason: 'user'}));
        that.xo = null;
    }
};
//         [*] End of lib/trans-receiver-xhr.js


//         [*] Including lib/test-hooks.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// For testing
SockJS.getUtils = function(){
    return utils;
};

SockJS.getIframeTransport = function(){
    return IframeTransport;
};
//         [*] End of lib/test-hooks.js

                  return SockJS;
          })();
if ('_sockjs_onload' in window) setTimeout(_sockjs_onload, 1);

// AMD compliance
if (typeof define === 'function' && define.amd) {
    define('sockjs', [], function(){return SockJS;});
}
else if (typeof module === 'object' && module.exports) {
    module.exports = SockJS;
}
//     [*] End of lib/index.js

// [*] End of lib/all.js


});
require.register('./src/socket.js', function(module, exports, require) { /**
 * XQCore socket module handles socket connections to a socket server
 *
 * @module Socket
 * @requires Logger
 * @requires sockJS-client
 *
 */

'use strict';

var XQCore = require('./xqcore');
var Logger = require('./logger');
var EventEmitter = require('./event');
var SocketConnection = require('./socket-connection');

var log = new Logger('Socket');
log.logLevel = 5;

/**
 * Socket connection module
 * @param {String} url     Socket server uri
 * @param {String} channel Socket channel
 *
 *
 * @example {js}
 * var socket = new XQCore.Socket('http://mysocket.io:9889', 'mychannel');
 * socket.on('data', function() {
 *   console.log('Got data from server');
 * });
 */
var Socket = function(url, channel) {
  //Call EventEmitter constructor
  EventEmitter.call(this);

  this.__isReady = false;
  this.__onReadyCallbacks = [];

  this.channel = channel;
  this.socket = new SocketConnection(url);
  this.socket.registerChannel(channel, this);
  // this.connect(url, channel);
};

XQCore.extend(Socket.prototype, EventEmitter.prototype);

/**
 * Sends a socket message to a connected socket server
 *
 * @method send
 * @param {String} eventName EventEmitter name
 * @param {Object} data      EventEmitter data, multiple args are allowed
 */
Socket.prototype.send = function(eventName, data) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this.channel);
  this.socket.send.apply(this.socket, args);
};

//--

module.exports = Socket;

});
require.register('./src/synclist.js', function(module, exports, require) { /**
 * XQCore SyncList - Syncronized list
 *
 * @package XQCore
 * @module  SyncList
 * @requires List
 * @requires Socket
 *
 * @example {js}
 * var syncList = new XQCore.SyncList('mylist', {
 *     port: 3434,
 *     server: 'http://socket.xqcore.com'
 * });
 *
 * This call connects to a socket server
 * http://socket.xqcore.com/xqsocket/mylist
 *
 * A <code>synclist.register</code> event will be fiered to the socket server
 * These data will be send:
 * <code class="json">
 * {
 *     name: this.name
 * }
 *
 * Registers a few listeners:
 * synclist.push, synclist.shift, synclist.pop, synclist.unshift
 *
 * </code>
 */
'use strict';

var XQCore = require('./xqcore');
var Logger = require('./logger');
var List = require('./list');
var Socket = require('./socket');

var log;

var SyncList = function(name, conf) {
  /**
   * @property {Boolean} noAutoRegister Disables auto registration. SyncList.register() must be called manually to register the list at the socket server.
   */
  this.noAutoRegister = false;

  //Call List constructor
  List.call(this, name, conf);
  log = new Logger(this.name + 'SyncList');

  this.server = this.server || location.protocol + '//' + location.hostname;
  this.port = this.port || XQCore.socketPort;
  this.path = this.path || 'xqsocket';
  this.channel = this.channel || this.name.toLowerCase();
  this.syncEnabled = false;
  this.connectToSocket();
  if (!this.noAutoRegister) {
    this.register();
  }
};

SyncList.prototype = Object.create(List.prototype);
SyncList.prototype.constructor = SyncList;


/**
 * Inherits a sync model prototype
 * @method inherit
 * @param  {String} name    model name
 * @param  {Object} options SyncList properties
 * @return {Object}         Returns a SyncList prototype
 */
SyncList.inherit = function(name, options) {
  if (typeof name === 'object') {
    options = name;
    name = undefined;
  }

  var Proto = function() {
    SyncList.call(this, name, options);
  };

  Proto.prototype = Object.create(SyncList.prototype);
  Proto.prototype.constructor = Proto;
  return Proto;
};
/**
 * Connect to a socket server
 *
 * @method connectToSocket
 */
SyncList.prototype.connectToSocket = function() {
  var socketServer = this.server + ':' + this.port + '/' + this.path;
  if (!this.socket) {
    log.debug('Connect to socket:', socketServer);
    this.socket = new Socket(socketServer, this.channel);
  }
};

/**
 * Register a sync list at the socket server. This action is called automatically except the noAutoRegister option is set.
 * @param  {Boolean} enableSync Enables/Disables the initial sync. Defaults to false
 */
SyncList.prototype.register = function(enableSync) {
  var self = this;
  if (typeof enableSync === 'boolean') {
    this.syncEnabled = enableSync;
  }

  log.debug('Register synclist at server:', self.name);

  var opts = {
    noSync: true
  };

  self.socket.on('synclist.push', function(data) {
    self.push(data, opts);
  });

  self.socket.on('synclist.unshift', function(data) {
    self.push(data, opts);
  });

  self.socket.on('synclist.pop', function() {
    self.push(opts);
  });

  self.socket.on('synclist.shift', function() {
    self.push(opts);
  });

  self.socket.on('synclist.update', function(match, data) {
    self.update(match, data, opts);
  });

  self.socket.on('synclist.clear', function() {
    self.clear(opts);
  });

  self.socket.on('synclist.init', function(data) {
    self.push(data, opts);
  });

  self.socket.send('synclist.register', {
    name: self.name
  });
};

SyncList.prototype.unregister = function() {
  log.debug('Unregister synclist at server:', this.name);
  this.socket.send('synclist.unregister', {
    name: this.name
  });

  this.socket.off('synclist.push');
  this.socket.off('synclist.unshift');
  this.socket.off('synclist.pop');
  this.socket.off('synclist.shift');
  this.socket.off('synclist.update');
  this.socket.off('synclist.clear');
  this.socket.off('synclist.init');
};

/**
 * Send a socket message to the server
 * @param  {String} eventName EventEmitter name
 * @param  {Object} data      Data object
 */
SyncList.prototype.emitRemote = function(eventName, data) {
  this.socket.send(eventName, data);
};

SyncList.prototype.sync = function(method) {
  if (!this.syncEnabled) {
    return;
  }

  var args = Array.prototype.slice.call(arguments, 1);
  args.unshift('syncmodel.' + method);
  this.emitRemote.apply(this, args);
};

SyncList.prototype.fetchList = function() {
  this.emitRemote('synclist.fetch');
};

//--

module.exports = SyncList;

});
require.register('./src/syncmodel.js', function(module, exports, require) { /**
 * XQCore SyncModel - Syncronniced module module
 *
 * @package XQCore
 * @module SyncModel
 * @requires Model
 * @requires Socket
 */
'use strict';
var XQCore = require('./xqcore');
var Logger = require('./logger');
var Model = require('./model');
var Socket = require('./socket');

var log;
var SyncModel = function(name, conf) {
  /**
   * @property {Boolean} noAutoRegister Disables auto registration. SyncList.register() must be called manually to register the list at the socket server.
   */
  this.noAutoRegister = false;

  //Call Model constructor
  Model.call(this, name, conf);
  log = new Logger(this.name + 'SyncModel');
  log.setLevel(4);

  this.server = this.server || location.protocol + '//' + location.hostname;
  this.port = this.port || XQCore.socketPort;
  this.path = this.path || 'xqsocket';
  this.channel = this.channel || this.name.toLowerCase();
  this.syncEnabled = false;
  this.connectToSocket();
  if (!this.noAutoRegister) {
    this.register();
  }
};

SyncModel.prototype = Object.create(Model.prototype);
SyncModel.prototype.constructor = SyncModel;

/**
 * Inherits a sync model prototype
 * @method inherit
 * @param  {String} name    model name
 * @param  {Object} options SyncModel properties
 * @return {Object}         Returns a SyncModel prototype
 */
SyncModel.inherit = function(name, options) {
  if (typeof name === 'object') {
    options = name;
    name = undefined;
  }

  var Proto = function() {
    SyncModel.call(this, name, options);
  };

  Proto.prototype = Object.create(SyncModel.prototype);
  Proto.prototype.constructor = Proto;
  return Proto;
};

/**
 * Connect to a socket server
 *
 * @method connectToSocket
 */
SyncModel.prototype.connectToSocket = function() {
  var socketServer = this.server + ':' + this.port + '/' + this.path;
  if (!this.socket) {
    log.debug('Connect to socket:', socketServer);
    this.socket = new Socket(socketServer, this.channel);
  }
};

SyncModel.prototype.register = function(enableSync) {
  var self = this;

  this.syncEnabled = !!enableSync;

  log.debug('Register syncmodel at server:', self.name);

  var opts = {
    noSync: true
  };

  self.socket.on('syncmodel.set', function(data) {
    self.set(data, opts);
  });

  self.socket.on('syncmodel.replace', function(data) {
    opts.replace = true;
    self.set(data, opts);
  });

  self.socket.on('syncmodel.value', function(key, value) {
    self.set(key, value, opts);
  });

  self.socket.on('syncmodel.insert', function(path, index, data) {
    self.insert(path, index, data, opts);
  });

  self.socket.on('syncmodel.remove', function(path, index, data) {
    self.remove(path, index, data, opts);
  });

  self.socket.on('syncmodel.reset', function() {
    self.reset(opts);
  });

  self.socket.on('syncmodel.init', function(data) {
    self.set(data, opts);
  });

  self.socket.send('syncmodel.register', {
    name: self.name
  });
};

SyncModel.prototype.unregister = function() {
  var modelName = this.conf.syncWith || this.name.replace(/Model$/,'');
  this.socket.send('syncmodel.unregister', {
    name: modelName
  });

  this.socket.off('syncmodel.set');
  this.socket.off('syncmodel.replace');
  this.socket.off('syncmodel.value');
  this.socket.off('syncmodel.insert');
  this.socket.off('syncmodel.remove');
  this.socket.off('syncmodel.reset');
  this.socket.off('syncmodel.init');
};

/**
 * Send a socket message to the server
 * @param  {String} eventName EventEmitter name
 * @param  {Object} data      Data object
 */
SyncModel.prototype.emitRemote = function(eventName, data) {
  this.socket.send(eventName, data);
};

SyncModel.prototype.sync = function(method) {
  if (!this.syncEnabled) {
    return;
  }

  var args = Array.prototype.slice.call(arguments, 1);
  args.unshift('syncmodel.' + method);
  this.emitRemote.apply(this, args);
};

SyncModel.prototype.fetchModel = function() {
  this.emitRemote('syncmodel.fetch');
};

//--

module.exports = SyncModel;

});
require.register('./src/component.js', function(module, exports, require) { /**
 * XQCore Component module
 *
 * A view renders a .fire or .hbs template and injects the result into the dom.
 *
 * @module Component
 * @returns {object} Returns a XQCore.Component prototype object
 */

'use strict';

var XQCore = require('./xqcore');
var Logger = require('./logger');

var cmpElements = {
  Core: require('./components/core'),
  Button: require('./components/button'),
  Counter: require('./components/counter'),
  Form: require('./components/form'),
  Grid: require('./components/grid'),
  Input: require('./components/input'),
  List: require('./components/list'),
  ProgressBar: require('./components/progressBar'),
  Table: require('./components/table'),
  Text: require('./components/text'),
  Tooltip: require('./components/tooltip')
};

var log = new Logger('Component');

/**
 * XQCore.Component
 *
 * @class Component
 * @constructor
 *
 * @param {object} conf Component configuration
 */
function Component(tag, name) {
  var Cmp = XQCore.getComponent(tag);
  if (!Cmp) {
    throw new Error('Component ' + tag + ' not found!');
  }

  var el = new Cmp(name);
  el.create();
  return el;

  // this.registerEventListener();
}

Component.prototype.registerEventListener = function() {
  var self = this;
  if (self.$change) {
    self.$change(function(data, ev) {
      self.emit('value.change', data);
    });
  }
}

Component.prototype.couple = function(model, prop) {
  if (model instanceof XQCore.List) {
    // var list = model;
    // list.on('item.push', function(item) {
    //   console.log('push item', item);
    //   var val = item[0].get();
    //   console.log('value', val);
    //   this.push(val);
    // });
  }
  else {
    return this.coupleModel(model, prop);
    //
  }
}

Component.prototype.coupleModel = function(model, prop) {
  var self = this;
  model.on('data.change', function() {
    self.value = model.get(prop);
  });

  this.on('value.change', function(data) {
    console.log('CMP CHANGE', data);
    model.set(data.name, data.value).then(function() {
      this.errMessage = null;
    }).catch(function(err) {
      console.log('RES', err);
      this.errMessage = err.err[0].msg;
    });
  });

  model.on('validation.error', function(validationResult, other) {
    console.log('VALIDATION', validationResult, other);
    this.state = 'invalid';
  });

  model.on('state.change', function(state) {
    this.state = state;
  });
}

Component.prototype.appendTo = function(container) {
  container.appendChild(this.domEl);
};

/*
class XQComponent {
  constructor(tag) {
    log = new Logger(tag + 'Component');

    log.debug('Create new view');
    if (!HTMLElements[tag]) {
      tag = 'NotFoundElement';
    }

    let el = new HTMLElements[tag]();
    el.create();
    this.el = el;
  }

  injectInto(domSelector) {
    domSelector.appendChild(this.el.el);
  }

  append(el) {
    if (Array.isArray(el)) {
      for (var i = 0; i < el.length; i++) {
        this.el.el.appendChild(el[i].el.el);
      }

      return;
    }

    this.el.el.appendChild(el.el.el);
  }

  static registerHTMLComponent(name, component) {
    HTMLElements[name] = component;
  }
}
*/
//--
//



Component.registerComponent = function(name, cmp) {
  log.info('Register new component', name);
  cmpElements[name] = cmp;
};

Component.getComponent = function(name) {
  if (!cmpElements.hasOwnProperty(name)) {
    throw new Error('Component ' + name + ' not found!');
  }

  return cmpElements[name];
};

module.exports = Component;

});
require.register('./src/components/core.js', function(module, exports, require) { /**
 * Core element
 * Represents the root element. All elements inherits from this element
 *
 * @package XQCore
 * @module ViewElements
 * @submodule Core
 * @class Core
 */

var XQCore = require('../xqcore');
var EventEmitter = require('../event');

function Core() {
  EventEmitter.call(this);

  this.tag = 'section';
  this.__active = true;
}


XQCore.assign(Core.prototype, EventEmitter.prototype);

/**
 * Creates the element
 * @method create
 * @chainable
 * @return {object} Returns this value
 */
Core.prototype.create = function() {
  var tagName = this.constructor.name;
  this.domEl = document.createElement(this.tag);
  var cssClass = tagName;
  if (this.cssClass) {
    cssClass += ' ' + this.cssClass;
  }

  if (this.attrs) {
    for (var attr in this.attrs) {
      if (this.attrs.hasOwnProperty(attr)) {
        this.domEl.setAttribute(attr, this.attrs[attr]);
      }
    }
  }

  this.domEl.className = cssClass;
  this.render({});
  if (this.onElementReady) {
    this.onElementReady();
  }
}

/**
 * Renders the elements content
 * @method render
 *
 * @param {object} data Render data
 *
 * @chainable
 * @return {object} Returns this value
 */
Core.prototype.render = function(data) {
  var html = '';
  if (this.tmpl) {
    html = this.tmpl;
  }

  if (typeof html === 'function') {
    html = html(data);
  }

  if (typeof html === 'object') {
    while (this.domEl.firstChild) {
      this.domEl.removeChild(this.domEl.firstChild);
    }

    this.domEl.appendChild(html);
  } else {
    this.domEl.innerHTML = html;
  }

  return this;
}

/**
 * Append one or multiple elements
 *
 * @method append
 * @param  {Object|Array} el Elements to been append
 *
 * @chainable
 * @return {Object}    Returns this value
 */
Core.prototype.append = function(el) {
  var i;

  if (Array.isArray(el)) {
    for (i = 0; i < el.length; i++) {
      this.domEl.appendChild(el[i].domEl);
    }

    return;
  }
  else if (typeof el === 'string') {
    var docFrac = document.createDocumentFragment();
    var elType = /^<tr/.test(el) ? 'table' : 'div';
    var div = document.createElement(elType);
    div.innerHTML = el;
    for (i = 0; i < div.children.length; i++) {
      docFrac.appendChild(div.children[i]);
    }

    this.domEl.appendChild(docFrac);
  }
  else {
    this.domEl.appendChild(el.domEl);
  }

  return this;
}

Core.prototype.appendTo = function(container) {
  container.appendChild(this.domEl);
};

Core.prototype.hasClass = function(className) {
  var classList = this.domEl.className;
  if (!classList) {
    this.domEl.className = className;
    return false;
  }

  var reg = new RegExp('\\b' + className + '\\b');
  return reg.test(classList);
};

Core.prototype.addClass = function(className) {
  var classList = this.domEl.className;
  if (!classList) {
    this.domEl.className = className;
    return;
  }

  var reg = new RegExp('\\b' + className + '\\b');
  if (!reg.test(classList)) {
    this.domEl.className += ' ' + className
  }
};

Core.prototype.addAttribute = function(key, value) {
  if (typeof key === 'object') {
    Object.keys(key).forEach(function(name) {
      this.domEl.setAttribute(name, key[name]);
    });

    return;
  }

  this.domEl.setAttribute(key, value);
};

Core.prototype.removeClass = function(className) {
  var classList = this.domEl.className;
  var reg = new RegExp(' ?\\b' + className + '\\b ?');
  this.domEl.className = classList.replace(reg, '');
};

Core.prototype.listen = function(event, fn) {
  this.domEl.addEventListener(event, fn);
};

Core.prototype.toHTML = function() {
  return this.domEl.outerHTML;
};

Core.prototype.listenOnce = function(event, fn) {
  var self = this;
  var listener = function(ev) {
    self.domEl.removeEventListener(event, listener);
    fn(ev);
  };

  this.domEl.addEventListener(event, listener);
};

Object.defineProperty(Core.prototype, 'state', {
  get: function() {
    return this.__state;
  },
  set: function(state) {
    this.removeClass('xq-' + this.__state);
    this.addClass('xq-' + state);
    this.__state = state;
  }
});

Object.defineProperty(Core.prototype, 'active', {
  get: function() {
    return this.__active;
  },
  set: function(active) {
    if (active) {
      this.domEl.style.display = '';
      this.removeClass('xq-inactive');
      this.__active = true;
    }
    else {
      this.addClass('xq-inactive');
      this.__active = false;
    }
  }
});

module.exports = Core;

});
require.register('./src/components/button.js', function(module, exports, require) { var Core = require('./core');

/**
 * Renders a Button element
 *
 * @method Button
 *
 * @param  {[type]} name [description]
 */
function Button (name) {
  Core.call(this);

  this.tag = 'button';
  this.name = name || 'button';
  this.cssClass = 'xq-button';
  this.attrs = {
    type: 'button'
  };

  this.action = 'none';
}

Button.prototype = Object.create(Core.prototype);
Button.prototype.constructor = Button;

Button.prototype.$click = function(fn) {
  var self = this;
  this.listen('click', function(ev) {
    console.log('CLICK', ev);
    fn({
      name: ev.target.name,
      form: ev.target.form
    }, ev, self);
  });
}

Button.prototype.onElementReady = function() {
  var self = this;
  if (self.action === 'submit') {
    self.addAttribute('type', 'submit');

    return;
  }
}

Button.prototype.setError = function (err) {
  this.errorLabel.content = err;
};

Button.prototype.getValue = function () {
  return this.inputField.value;
};

Button.prototype.setValue = function (value) {
  return this.inputField.value = value;
};

Object.defineProperty(Button.prototype, 'content', {
  get: function() {
    return this.__content;
  },
  set: function(content) {
    this.domEl.textContent = content;
    this.__content = content;
  }
});

module.exports = Button;

});
require.register('./src/components/counter.js', function(module, exports, require) { /**
 * Counter component
 *
 * @package XQCore
 * @subpackage Components
 * @module Counter
 *
 * @example {js}
 * var cmp = new XQCore.Component('myCounter');
 * cmp.value = 3;
 */

'use strict';

var Core = require('./core');

function Counter () {
  Core.call(this);

  this.tag = 'span';
  this.cssClass = 'xq-counter';
  this.__value = 0;
}

Counter.prototype = Object.create(Core.prototype);
Counter.prototype.constructor = Counter

Object.defineProperty(Counter.prototype, 'value', {
  get: function() {
    return this.__value;
  },
  set: function(value) {
    this.__value = value;
    this.domEl.textContent = value;
  }
});

module.exports = Counter;

});
require.register('./src/components/form.js', function(module, exports, require) { /**
 * Form component renders a form based on a FormSchema
 *
 * FormSchema:
 * { name: 'title', type: 'string', min: 3, max: 20 },
 * { name: 'description', type: 'text', min: 3, max: 2000 },
 * { name: 'category', type: 'category', min: 3, max: 200 },
 * { name: 'timer', type: 'string', min: 3, max: 200, multiple: true },
 *
 */

'use strict';

var Core = require('./core');
var Input = require('./input');
var Text = require('./text');
var Button = require('./button');

function Form (schema) {
  Core.call(this);

  this.tag = 'form';
  this.cssClass = 'xq-form';
  this.__items = [];

  this.schema = schema;
}

Form.prototype = Object.create(Core.prototype);
Form.prototype.constructor = Form;

/**
 * Renders a form based on a FormSchema
 * @method render
 *
 * @param {object} data Form data
 *
 * @chainable
 * @return {object} Returns this value
 */
Form.prototype.render = function(data) {
  var html = '';
  if (this.schema) {
    html = this.renderForm(data);
  }
  else if (this.tmpl) {
    html = this.tmpl;
  }

  if (typeof html === 'function') {
    html = html(data);
  }

  if (typeof html === 'object') {
    while (this.domEl.firstChild) {
      this.domEl.removeChild(this.domEl.firstChild);
    }

    this.domEl.appendChild(html);
  }
  else {
    this.domEl.innerHTML = html;
  }

  return this;
};

Form.prototype.renderForm = function(data) {
  var form = document.createDocumentFragment();
  this.inputs = {};

  this.schema.forEach(function(item) {
    var div = document.createElement('div');
    var label = document.createElement('label');

    label.setAttribute('for', item.name);
    label.textContent = item.label === undefined ? item.name.charAt(0).toUpperCase() + item.name.slice(1) : item.label;

    var input;
    if (item.type === 'string') {
      input = new Input(item.name);
      input.create();
      this.inputs[item.name] = input;
    }
    else if (item.type === 'text') {
      input = new Text(item.name);
      input.create();
      this.inputs[item.name] = input;
    }
    else if (item.type === 'button') {
      input = new Button(item.name);
      if (item.action) {
        input.action = item.action;
      }

      input.create();

      if (item.content) {
        input.content = item.content;
      }

      this.inputs[item.name] = input;
    }
    else {
      throw new Error('Input of type ' + item.type + 'isn\'t supported!');
    }

    div.appendChild(label);
    div.appendChild(input.domEl);
    form.appendChild(div);
  }, this);

  return form;
};

Form.prototype.$change = function(fn) {
  var self = this;
  this.listen('change', function(ev) {
    console.log('FORM CHANGE', ev, ev.target.name);
    fn({
      name: ev.target.name,
      value: ev.target.value
    }, ev, self.inputs[ev.target.name]);
  });
};

Form.prototype.$submit = function(fn) {
  this.listen('submit', function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    console.log('FORM SUBMIT', ev, ev.target.name);
    fn({
      name: ev.target.name,
      value: ev.target.value
    }, ev);
  });
};

module.exports = Form;

});
require.register('./src/components/input.js', function(module, exports, require) { var Core = require('./core');
var Tooltip = require('./tooltip');

/**
 * Renders an Input element
 *
 * @method Input
 *
 * @param  {[type]} name [description]
 */
function Input (name) {
  Core.call(this);

  var self = this;
  this.tag = 'div';
  this.tmpl = function(data) {
    self.errorLabel = new Tooltip();
    self.errorLabel.create();
    self.errorLabel.active = false;
    self.errorLabel.appendix = self.domEl;

    self.inputField = document.createElement('input');
    self.inputField.className = 'xq-input-field';
    self.inputField.setAttribute('type', self.type);
    self.inputField.setAttribute('name', self.name);

    var docFrag = document.createDocumentFragment();
    docFrag.appendChild(self.errorLabel.domEl);
    docFrag.appendChild(self.inputField);
    return docFrag;
  }

  this.name = name || 'input';
  this.type = 'text';
  this.cssClass = 'xq-input';
}

Input.prototype = Object.create(Core.prototype);
Input.prototype.constructor = Input;

Input.prototype.$change = function(fn) {
  var self = this;
  this.listen('change', function(ev) {
    fn({
      name: ev.target.name,
      value: ev.target.value
    }, ev, self);
  });
}

Input.prototype.setError = function (err) {
  this.errorLabel.content = err;
};

Input.prototype.getValue = function () {
  return this.inputField.value;
};

Input.prototype.setValue = function (value) {
  return this.inputField.value = value;
};

Object.defineProperty(Input.prototype, 'errMessage', {
  get: function() {
    return this.__errMessage;
  },
  set: function(errMessage) {
    this.errorLabel.active = !!errMessage;
    this.errorLabel.content = errMessage;
    this.__errMessage = errMessage;
  }
});

module.exports = Input;

});
require.register('./src/components/tooltip.js', function(module, exports, require) { /**
 * Tooltip component
 *
 * @package XQCore
 * @subpackage Components
 * @model Tooltip
 */

'use strict';

var Core = require('./core');

function Tooltip () {
  Core.call(this);

  this.tag = 'div';
  this.cssClass = 'xq-tooltip';
}

Tooltip.prototype = Object.create(Core.prototype);
Tooltip.prototype.constructor = Tooltip

Tooltip.prototype.setPosition = function() {
  this.domEl.style.top = -this.domEl.offsetHeight + this.appendix.offsetTop - 10 + 'px';
};

Object.defineProperty(Tooltip.prototype, 'content', {
  get: function() {
    return this.__content;
  },
  set: function(content) {
    this.domEl.textContent = content;
    this.__content = content;
    this.setPosition();
  }
});

module.exports = Tooltip;

});
require.register('./src/components/text.js', function(module, exports, require) { var Core = require('./core');
var Tooltip = require('./tooltip');

/**
 * Renders an Text element
 *
 * @method Text
 *
 * @param  {[type]} name [description]
 */
function Text (name) {
  Core.call(this);

  var self = this;
  this.tag = 'div';
  this.tmpl = function(data) {
    self.errorLabel = new Tooltip();
    self.errorLabel.create();
    self.errorLabel.active = false;
    self.errorLabel.appendix = self.domEl;

    self.inputField = document.createElement('textarea');
    self.inputField.className = 'xq-text-field';
    self.inputField.setAttribute('name', self.name);

    var docFrag = document.createDocumentFragment();
    docFrag.appendChild(self.errorLabel.domEl);
    docFrag.appendChild(self.inputField);
    return docFrag;
  }

  this.name = name || 'text';
  this.cssClass = 'xq-text';
}

Text.prototype = Object.create(Core.prototype);
Text.prototype.constructor = Text;

Text.prototype.$change = function(fn) {
  var self = this;
  this.listen('change', function(ev) {
    fn({
      name: ev.target.name,
      value: ev.target.value
    }, ev, self);
  });
}

Text.prototype.setError = function (err) {
  this.errorLabel.content = err;
};

Text.prototype.getValue = function () {
  return this.inputField.value;
};

Text.prototype.setValue = function (value) {
  return this.inputField.value = value;
};

Object.defineProperty(Text.prototype, 'errMessage', {
  get: function() {
    return this.__errMessage;
  },
  set: function(errMessage) {
    this.errorLabel.active = !!errMessage;
    this.errorLabel.content = errMessage;
    this.__errMessage = errMessage;
  }
});

module.exports = Text;

});
require.register('./src/components/grid.js', function(module, exports, require) { /**
 * Grid component
 *
 * @package XQCore
 * @subpackage Components
 * @model Grid
 */

'use strict';

var Core = require('./core');

function Grid () {
  Core.call(this);

  this.tag = 'div';
  this.cssClass = 'xq-grid';
  this.__items = [];
  this.child = function(data) {
    return '<div class="item">' + data.value + '</div>';
  };
}

Grid.prototype = Object.create(Core.prototype);
Grid.prototype.constructor = Grid;

Grid.prototype.push = function(data) {
  this.__items.push(data);
  this.append(this.child(data));
}

Grid.prototype.child = function (el) {
  if (typeof el === 'string') {
    this.item = function(data) {
      return '<div>' + data.value + '</div>';
    };
  }
  else {
    this.item = el.render;
  }
};

Object.defineProperty(Grid.prototype, 'items', {
  get: function() {
    return this.__items;
  }
});

Object.defineProperty(Grid.prototype, 'length', {
  get: function() {
    return this.__items.length;
  }
});

module.exports = Grid;

});
require.register('./src/components/list.js', function(module, exports, require) { /**
 * List component
 *
 * @package XQCore
 * @subpackage Components
 * @model List
 */

'use strict';

var Core = require('./core');

function List() {
  Core.call(this);

  this.tag = 'ul';
  this.cssClass = 'xq-list';

  this.attrs = {
    type: 'text'
  };

  this.item = function(data) {
    return '<li class="item">' + data.value + '</li>';
  };
}

List.prototype = Object.create(Core.prototype);
List.prototype.constructor = List;

List.prototype.render = function(data) {
  if (Array.isArray(data)) {
    data.forEach(function(item) {
      this.push(item);
    }, this);
  }
}

List.prototype.push = function(data) {
  var item = this.item;
  this.append(item(data));
}

List.prototype.child = function (el) {
  if (typeof el === 'string') {
    this.item = function(data) {
      return '<li>' + data.value + '</li>';
    };
  }
  else {
    this.item = el.render;
  }
};

module.exports = List;

});
require.register('./src/components/progressBar.js', function(module, exports, require) { /**
 * ProgressBar component
 *
 * @package XQCore
 * @subpackage Components
 * @model ProgressBar
 */

'use strict';

var Core = require('./core');

function ProgressBar () {
  Core.call(this);

  this.tag = 'span';
  this.cssClass = 'xq-progress-bar';
  this.__value = 0;

  var self = this;
  this.tmpl = function() {
    self.bar = document.createElement('span');
    self.bar.className = 'bar';
    self.drawBar();

    return self.bar;
  }
}

ProgressBar.prototype = Object.create(Core.prototype);
ProgressBar.prototype.constructor = ProgressBar;

ProgressBar.prototype.drawBar = function() {
  if (this.hasClass('vertical')) {
    this.bar.style.height = this.__value + '%';
  }
  else {
    this.bar.style.width = this.__value + '%';
  }
};

Object.defineProperty(ProgressBar.prototype, 'value', {
  get: function() {
    return this.__value;
  },
  set: function(value) {
    this.__value = Math.min(100, Math.max(value, 0));
    this.drawBar();
  }
});

module.exports = ProgressBar;

});
require.register('./src/components/table.js', function(module, exports, require) { /**
 * Table component
 *
 * @package XQCore
 * @subpackage Components
 * @model Table
 */

'use strict';

var Core = require('./core');

function Table () {
  Core.call(this);

  this.tag = 'table';
  this.cssClass = 'xq-table';
  this.__items = [];
  this.child = function(data) {
    return '<tr><td>' + data.value + '</td></tr>';
  };
}

Table.prototype = Object.create(Core.prototype);
Table.prototype.constructor = Table;

Table.prototype.push = function(data) {
  this.__items.push(data);
  this.append(this.child(data));
}

Object.defineProperty(Table.prototype, 'items', {
  get: function() {
    return this.__items;
  }
});

Object.defineProperty(Table.prototype, 'length', {
  get: function() {
    return this.__items.length;
  }
});


module.exports = Table;

});
return require('./xqcore-init.js');

}));
