/*!
 * XQCore Minimal - <%= pkg.version %>
 * 
 * <%= pkg.description %>
 *
 * XQCore is licenced under MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Copyright (c) 2012 - <%= grunt.template.today("yyyy") %> Noname Media, http://noname-media.com
 * Author Andi Heinkelein
 *
 * Creation Date: <%= grunt.template.today("yyyy-mm-dd") %>
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('xqcore', ['jquery'], factory);
    } else {
        root.XQCore = factory(root.jQuery);
    }
}(this, function (jQuery) {

