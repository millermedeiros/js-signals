	
	/**
	 * @namespace Signals Namespace - Custom event/messaging system based on AS3 Signals
	 * @name signals
	 */
	var signals = window.signals = {};
	
	/**
	 * Signals Version Number
	 * @type string
	 * @const
	 */
	signals.VERSION = '::VERSION_NUMBER::';
	
	/**
	 * @param {*} param	Parameter to check.
	 * @return {boolean} `true` if parameter is different than `undefined`.
	 */
	signals.isDef = function(param){
		return typeof param !== 'undefined';
	};