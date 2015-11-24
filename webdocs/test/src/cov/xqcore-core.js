if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	__$coverObject[name] = {__code: code}
}
var __$coverInitRange = function(name, range){
	__$coverObject[name][range] = 0;
}
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
}
__$coverInit("webdocs/test/src/lib/xqcore-core.js", "var XQCore = {\n\tversion: 0.1\n};\n\n/**\n * Implement include support\n *\n * File must be absolute to the document root\n *\n * @param {String} file Filename to be load\n */\nif (!window.include) {\n\twindow.include = function(file, callback) {\n\t\tvar url = location.protocol + '//' + location.host + file;\n\t\t$.ajax({\n\t\t\turl: url,\n\t\t\tdataType: \"script\",\n\t\t\tsuccess: callback,\n\t\t\tasync: false\n\t\t});\n\t};\n}\n");
__$coverInitRange("webdocs/test/src/lib/xqcore-core.js", "0:30");
__$coverInitRange("webdocs/test/src/lib/xqcore-core.js", "166:390");
__$coverInitRange("webdocs/test/src/lib/xqcore-core.js", "190:388");
__$coverInitRange("webdocs/test/src/lib/xqcore-core.js", "236:293");
__$coverInitRange("webdocs/test/src/lib/xqcore-core.js", "297:384");
__$coverCall('webdocs/test/src/lib/xqcore-core.js', '0:30');
var XQCore = { version: 0.1 };
__$coverCall('webdocs/test/src/lib/xqcore-core.js', '166:390');
if (!window.include) {
    __$coverCall('webdocs/test/src/lib/xqcore-core.js', '190:388');
    window.include = function (file, callback) {
        __$coverCall('webdocs/test/src/lib/xqcore-core.js', '236:293');
        var url = location.protocol + '//' + location.host + file;
        __$coverCall('webdocs/test/src/lib/xqcore-core.js', '297:384');
        $.ajax({
            url: url,
            dataType: 'script',
            success: callback,
            async: false
        });
    };
}