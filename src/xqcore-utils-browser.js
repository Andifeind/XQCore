/**
 * Extends XQCore with some usefull functions
 *
 * @group  XQCore.Utils
 */
(function(XQCore, undefined) {
    'use strict';

    /**
     * Returns one or all queries
     * Converts all numberic items to a Number
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

})(XQCore);