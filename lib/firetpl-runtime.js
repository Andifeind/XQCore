/*!
 * FireTPL template engine v0.6.0-42
 * 
 * FireTPL is a pretty Javascript template engine. FireTPL uses indention for scops and blocks, supports partials, helper and inline functions.
 *
 * FireTPL is licensed under MIT License
 * http://opensource.org/licenses/MIT
 *
 * Copyright (c) 2013 - 2015 Noname Media, http://noname-media.com
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
        version: '0.6.0-42',

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
            // console.log(prettify(tmpl));
            console.log('----- Template source -----');
        }
    };

    ParseError.prototype = Object.create(Error.prototype);
    ParseError.prototype.constructor = ParseError;

    FireTPL.Error = FireError;
    FireTPL.ParseError = ParseError;
})(FireTPL);
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
    FireTPL.partialCache = {};

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
     * Register a global partial
     * @method registerPartial
     * @param  {String}   partial Partial name
     * @param  {Function|String} fn      Precompiled partial or a partial string
     * @param  {Object}   options (Optional) If second arg is a string, add parser options here
     */
    FireTPL.registerPartial = function(partial, fn, options) {
        if (typeof fn === 'string') {
            options = options || {};
            options.partial = true;
            fn = FireTPL.compile(fn, options);
        }

        FireTPL.partialCache[partial] = fn;
    };

    /**
     * Clears a global partial cache
     *
     * @method clearPartials
     * 
     */
    FireTPL.clearPartials = function() {
        FireTPL.partialCache = [];
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
        this.partialCache = FireTPL.partialCache;
    };

    Runtime.prototype.exec = function(helper, data, parent, root, fn) {
        console.warn('FireTPL.Runtime.prototype.exec is deprecated! Please use execHelper instead!');
        if (!FireTPL.helpers[helper]) {
            throw new Error('Helper ' + helper + ' not registered!');
        }

        return FireTPL.helpers[helper]({
            data: data,
            parent: parent,
            root: root
        }, fn);
    };

    Runtime.prototype.execHelper = function(helper, data, parent, root, tag, attrs, fn) {
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
            tag: tag,
            attrs: attrs
        }, fn);
    };

    Runtime.prototype.execPartial = function(partialName, data) {
        var partial = this.partialCache[partialName];
        if (!partial) {
            throw new FireTPL.Error('Partial \'' + partialName + '\' was not registered!');
        }

        return partial(data);
    };

    Runtime.prototype.registerPartial = function(partial, fn) {
        this.partialCache[partial] = fn;
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

            var partials = parser.partialParser();
            if (partials) {
                partials.forEach(function(item) {
                    try {
                        runTime.registerPartial(item.partial, 
                            //jshint evil:true
                            eval('(function(data,scopes) {var t = new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execPartial;' + item.source + 'return s;})')
                        );
                    }
                    catch(err) {
                        console.error('Pregister partial error!', err, err.lineNumber);
                    }
                });
            }
        }

        return function(data, scopes) {
            var h = runTime.execHelper,
                l = FireTPL.locale,
                f = FireTPL.fn,
                p = runTime.execPartial.bind(runTime);

            var s;

            //jshint evil:true
            try {
                var tmpl = '(function(data, scopes) {\n' + template + 'return s;})(data, scopes)';
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
        return Number(str) === Number(cmp);
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
        return Number(str) !== Number(cmp);
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

        if (ctx.data) {
            if (Array.isArray(ctx.data)) {
                ctx.data.forEach(function(d) {
                    s += fn.bind(ctxFuncs)(d,ctx.parent, ctx.root);
                });
            }
            else {
                s += fn.bind(ctxFuncs)(ctx.data,ctx.parent, ctx.root);
            }
        }

        return s;
    };

    FireTPL.registerHelper('tree', helper);
})();