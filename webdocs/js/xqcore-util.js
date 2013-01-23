/**
 * A bunch of helpfull functions
 *
 * @return {Object} Returns a singelton object instance of XQCore.Util
 */
XQCore.Util = (function($) {

	var util = {
		name: 'XQCore.Util',
		debug: true
	};

	/**
	 * Serialize a form and return its values as JSON
	 *
	 * @param {Object} Form selector
	 * @return {Object} FormData as JSON
	 */
	util.serializeForm = function(selector) {
		var formData = {},
			formSelector = $(selector);

		if (formSelector.get(0).tagName === 'INPUT') {

		}
		else {
			formSelector = formSelector.find(':input');
		}

		formSelector.serializeArray().forEach(function(item) {
			formData[item.name] = item.value;
		});

		if (this.debug) {
			console.log('XQCore - Serialize form:', formSelector, formData);
		}

		return formData;
	};

	/**
	 * Check length of a string or number
	 *
	 * @param {String or Number} input this will be checked
	 * @param {Number} min String can't be shorter than n, Number can't be lower than n
	 * @param {Number} max String can't be longer than n, Number can't be greater than n
	 *
	 * @returns {String} errorMessage on invalid or void on valid
	 */
	util.checkLength = function(input, min, max) {
		if (typeof input === 'Number') {
			if (input < min) {
				return 'num-to-small';
			}
			else if (input > max) {
				return 'num-to-large';
			}
		}
		else {
			console.log(input, input.length);
			if (input.length < min) {
				return 'str-to-short';
			}
			else if (input.length > max) {
				return 'str-to-long';
			}
		}
	};

	/**
	 * Checks the equality of two strings
	 *
	 * @param {String} str1 First string
	 * @param {String} str2 Second string
	 *
	 * @returns {String} errorMessage on invalid or void on valid
	 */
	util.checkEqual = function(str1, str2) {
		if (str1 !== str2) {
			return 'str-not-equal';
		}
	};

	/**
	 * Checks the validity of an email address
	 *
	 * @param {String} email e-Mail address
	 */
	util.checkEmail = function(email) {
		if (!/^\S+\@\S+\.[a-z]{2,10}$/.test(email)) {
			return 'invalid-email';
		}
	};

	/**
	 * Checks the validity of an url
	 *
	 * @param {String} url URL
	 */
	util.checkUrl = function(url) {

		if (!/^http(s)?:\/\/\S\.[a-zA-Z]{2,10}\/?$/.test(url)) {
			return 'invalid-url';
		}
	};

	return util;

})(jQuery);