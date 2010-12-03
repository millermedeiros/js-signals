
	/**
	 * @namespace Signals Namespace - Custom event/messaging system based on AS3 Signals
	 * @name signals
	 */
	var signals = window.signals = {
		
		/**
		 * @param {*} param	Parameter to check.
		 * @return {boolean} `true` if parameter is different than `undefined`.
		 */
		isDef : function(param){
			return typeof param !== 'undefined';
		}
		
	};