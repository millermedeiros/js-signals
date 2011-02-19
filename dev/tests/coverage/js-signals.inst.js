if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "C:\\Miller\\Personal\\open_source_projects\\js-signals\\dist\\js-signals.js",
    code: []
};
_yuitest_coverage["C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js"].code=["/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */","","/*!!"," * JS Signals <http://millermedeiros.github.com/js-signals/>"," * Released under the MIT license <http://www.opensource.org/licenses/mit-license.php>"," * @author Miller Medeiros <http://millermedeiros.com/>"," * @version 0.5.2"," * @build 138 (02/18/2011 07:22 PM)"," */","var signals = (function(){","","	/**","	 * @namespace Signals Namespace - Custom event/messaging system based on AS3 Signals","	 * @name signals","	 */","	var signals = {};","","	/**","	 * Signals Version Number","	 * @type string","	 * @const","	 */","	signals.VERSION = '0.5.2';","","	","	// SignalBinding -------------------------------------------------","	//================================================================","	","	/**","	 * Object that represents a binding between a Signal and a listener function.","	 * <br />- <strong>This is an internall constructor and shouldn't be called by regular user.</strong>","	 * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.","	 * @author Miller Medeiros","	 * @constructor","	 * @name signals.SignalBinding","	 * @param {signals.Signal} signal	Reference to Signal object that listener is currently bound to.","	 * @param {Function} listener	Handler function bound to the signal.","	 * @param {boolean} isOnce	If binding should be executed just once.","	 * @param {Object} [listenerContext]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).","	 */","	 function SignalBinding(signal, listener, isOnce, listenerContext){","		","		/**","		 * Handler function bound to the signal.","		 * @type Function","		 * @private","		 */","		this._listener = listener;","		","		/**","		 * If binding should be executed just once.","		 * @type boolean","		 * @private","		 */","		this._isOnce = isOnce;","		","		/**","		 * Context on which listener will be executed (object that should represent the `this` variable inside listener function).","		 * @memberOf signals.SignalBinding.prototype","		 * @name context","		 * @type {Object|undefined}","		 */","		this.context = listenerContext;","		","		/**","		 * Reference to Signal object that listener is currently bound to.","		 * @type signals.Signal","		 * @private","		 */","		this._signal = signal;","	}","	","	SignalBinding.prototype = /** @lends signals.SignalBinding.prototype */ {","		","		/**","		 * @type boolean","		 * @private","		 */","		_isEnabled : true,","		","		/**","		 * Call listener passing arbitrary parameters.","		 * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p> ","		 * @param {Array} [paramsArr]	Array of parameters that should be passed to the listener","		 * @return {*} Value returned by the listener.","		 */","		execute : function(paramsArr){","			var r;","			if(this._isEnabled){","				r = this._listener.apply(this.context, paramsArr);","				if(this._isOnce){","					this.detach();","				}","			}","			return r; //avoid warnings on some editors","		},","		","		/**","		 * Detach binding from signal.","		 * - alias to: mySignal.remove(myBinding.getListener());","		 * @return {Function} Handler function bound to the signal.","		 */","		detach : function(){","			return this._signal.remove(this._listener);","		},","		","		/**","		 * @return {Function} Handler function bound to the signal.","		 */","		getListener : function(){","			return this._listener;","		},","		","		/**","		 * Remove binding from signal and destroy any reference to external Objects (destroy SignalBinding object).","		 * <p><strong>IMPORTANT:</strong> calling methods on the binding instance after calling dispose will throw errors.</p>","		 */","		dispose : function(){","			this.detach();","			this._destroy();","		},","		","		/**","		 * Delete all instance properties","		 * @private","		 */","		_destroy : function(){","			delete this._signal;","			delete this._isOnce;","			delete this._listener;","			delete this.context;","		},","		","		/**","		 * Disable SignalBinding, block listener execution. Listener will only be executed after calling `enable()`.  ","		 * @see signals.SignalBinding.enable()","		 */","		disable : function(){","			this._isEnabled = false;","		},","		","		/**","		 * Enable SignalBinding. Enable listener execution.","		 * @see signals.SignalBinding.disable()","		 */","		enable : function(){","			this._isEnabled = true;","		},","		","		/**","		 * @return {boolean} If SignalBinding is currently paused and won't execute listener during dispatch.","		 */","		isEnabled : function(){","			return this._isEnabled;","		},","		","		/**","		 * @return {boolean} If SignalBinding will only be executed once.","		 */","		isOnce : function(){","			return this._isOnce;","		},","		","		/**","		 * @return {string} String representation of the object.","		 */","		toString : function(){","			return '[SignalBinding isOnce: '+ this._isOnce +', isEnabled: '+ this._isEnabled +']';","		}","		","	};","	","	// Signal --------------------------------------------------------","	//================================================================","	","	/**","	 * Custom event broadcaster","	 * <br />- inspired by Robert Penner's AS3 Signals.","	 * @author Miller Medeiros","	 * @constructor","	 */","	signals.Signal = function(){","		/**","		 * @type Array.<SignalBinding>","		 * @private","		 */","		this._bindings = [];","	};","	","	signals.Signal.prototype = {","		","		/**","		 * @type boolean","		 * @private","		 */","		_shouldPropagate : true,","		","		/**","		 * @type boolean","		 * @private","		 */","		_isEnabled : true,","		","		/**","		 * @param {Function} listener","		 * @param {boolean} isOnce","		 * @param {Object} [scope]","		 * @return {SignalBinding}","		 * @private","		 */","		_registerListener : function(listener, isOnce, scope){","			","			if(typeof listener !== 'function'){","				throw new Error('listener is a required param of add() and addOnce() and should be a Function.');","			}","			","			var prevIndex = this._indexOfListener(listener),","				binding;","			","			if(prevIndex !== -1){ //avoid creating a new Binding for same listener if already added to list","				binding = this._bindings[prevIndex];","				if(binding.isOnce() !== isOnce){","					throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');","				}","			} else {","				binding = new SignalBinding(this, listener, isOnce, scope);","				this._bindings.push(binding);","			}","			","			return binding;","		},","		","		/**","		 * @param {Function} listener","		 * @return {number}","		 * @private","		 */","		_indexOfListener : function(listener){","			var n = this._bindings.length;","			while(n--){","				if(this._bindings[n]._listener === listener){","					return n;","				}","			}","			return -1;","		},","		","		/**","		 * Add a listener to the signal.","		 * @param {Function} listener	Signal handler function.","		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).","		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.","		 */","		add : function(listener, scope){","			return this._registerListener(listener, false, scope);","		},","		","		/**","		 * Add listener to the signal that should be removed after first execution (will be executed only once).","		 * @param {Function} listener	Signal handler function.","		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).","		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.","		 */","		addOnce : function(listener, scope){","			return this._registerListener(listener, true, scope);","		},","		","		/**","		 * Remove a single listener from the dispatch queue.","		 * @param {Function} listener	Handler function that should be removed.","		 * @return {Function} Listener handler function.","		 */","		remove : function(listener){","			if(typeof listener !== 'function'){","				throw new Error('listener is a required param of remove() and should be a Function.');","			}","			","			var i = this._indexOfListener(listener);","			if(i !== -1){","				this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal","				this._bindings.splice(i, 1);","			}","			return listener;","		},","		","		/**","		 * Remove all listeners from the Signal.","		 */","		removeAll : function(){","			var n = this._bindings.length;","			while(n--){","				this._bindings[n]._destroy();","			}","			this._bindings.length = 0;","		},","		","		/**","		 * @return {number} Number of listeners attached to the Signal.","		 */","		getNumListeners : function(){","			return this._bindings.length;","		},","		","		/**","		 * Disable Signal. Block dispatch to listeners until `enable()` is called.","		 * <p><strong>IMPORTANT:</strong> If this method is called during a dispatch it will only have effect on the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>","		 * @see signals.Signal.prototype.enable","		 * @see signals.Signal.prototype.halt","		 */","		disable : function(){","			this._isEnabled = false;","		},","		","		/**","		 * Enable broadcast to listeners.","		 * @see signals.Signal.prototype.disable","		 */","		enable : function(){","			this._isEnabled = true;","		}, ","		","		/**","		 * @return {boolean} If Signal is currently enabled and will broadcast message to listeners.","		 */","		isEnabled : function(){","			return this._isEnabled;","		},","		","		/**","		 * Stop propagation of the event, blocking the dispatch to next listeners on the queue.","		 * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>","		 * @see signals.Signal.prototype.disable ","		 */","		halt : function(){","			this._shouldPropagate = false;","		},","		","		/**","		 * Dispatch/Broadcast Signal to all listeners added to the queue. ","		 * @param {...*} [params]	Parameters that should be passed to each handler.","		 */","		dispatch : function(params){","			if(! this._isEnabled){","				return;","			}","			","			var paramsArr = Array.prototype.slice.call(arguments),","				bindings = this._bindings.slice(), //clone array in case add/remove items during dispatch","				i,","				n = this._bindings.length;","			","			this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.","						","			for(i=0; i<n; i++){","				//execute all callbacks until end of the list or until a callback returns `false` or stops propagation","				if(bindings[i].execute(paramsArr) === false || !this._shouldPropagate){","					break;","				}","			}","		},","		","		/**","		 * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).","		 * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>","		 */","		dispose : function(){","			this.removeAll();","			delete this._bindings;","		},","		","		/**","		 * @return {string} String representation of the object.","		 */","		toString : function(){","			return '[Signal isEnabled: '+ this._isEnabled +' numListeners: '+ this.getNumListeners() +']';","		}","		","	};","","	return signals;","	","}());"];
/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */

/*!!
 * JS Signals <http://millermedeiros.github.com/js-signals/>
 * Released under the MIT license <http://www.opensource.org/licenses/mit-license.php>
 * @author Miller Medeiros <http://millermedeiros.com/>
 * @version 0.5.2
 * @build 138 (02/18/2011 07:22 PM)
 */
_yuitest_coverage["C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js"].lines = {"10":0,"16":0,"23":0,"41":0,"48":0,"55":0,"63":0,"70":0,"73":0,"88":0,"89":0,"90":0,"91":0,"92":0,"95":0,"104":0,"111":0,"119":0,"120":0,"128":0,"129":0,"130":0,"131":0,"139":0,"147":0,"154":0,"161":0,"168":0,"182":0,"187":0,"190":0,"213":0,"214":0,"217":0,"220":0,"221":0,"222":0,"223":0,"226":0,"227":0,"230":0,"239":0,"240":0,"241":0,"242":0,"245":0,"255":0,"265":0,"274":0,"275":0,"278":0,"279":0,"280":0,"281":0,"283":0,"290":0,"291":0,"292":0,"294":0,"301":0,"311":0,"319":0,"326":0,"335":0,"343":0,"344":0,"347":0,"352":0,"354":0,"356":0,"357":0,"367":0,"368":0,"375":0,"380":0};
_yuitest_coverage["C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js"].functions = {"SignalBinding:41":0,"execute:87":0,"detach:103":0,"getListener:110":0,"dispose:118":0,"_destroy:127":0,"disable:138":0,"enable:146":0,"isEnabled:153":0,"isOnce:160":0,"toString:167":0,"Signal:182":0,"_registerListener:211":0,"_indexOfListener:238":0,"add:254":0,"addOnce:264":0,"remove:273":0,"removeAll:289":0,"getNumListeners:300":0,"disable:310":0,"enable:318":0,"isEnabled:325":0,"halt:334":0,"dispatch:342":0,"dispose:366":0,"toString:374":0,"(anonymous 1):10":0};
_yuitest_coverage["C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js"].coveredLines = 75;
_yuitest_coverage["C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js"].coveredFunctions = 27;
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 10); var signals = (function(){

	/**
	 * @namespace Signals Namespace - Custom event/messaging system based on AS3 Signals
	 * @name signals
	 */
	_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "(anonymous 1)", 10);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 16); var signals = {};

	/**
	 * Signals Version Number
	 * @type string
	 * @const
	 */
	_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 23); signals.VERSION = '0.5.2';

	
	// SignalBinding -------------------------------------------------
	//================================================================
	
	/**
	 * Object that represents a binding between a Signal and a listener function.
	 * <br />- <strong>This is an internall constructor and shouldn't be called by regular user.</strong>
	 * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
	 * @author Miller Medeiros
	 * @constructor
	 * @name signals.SignalBinding
	 * @param {signals.Signal} signal	Reference to Signal object that listener is currently bound to.
	 * @param {Function} listener	Handler function bound to the signal.
	 * @param {boolean} isOnce	If binding should be executed just once.
	 * @param {Object} [listenerContext]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	 */
	 _yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 41); function SignalBinding(signal, listener, isOnce, listenerContext){
		
		/**
		 * Handler function bound to the signal.
		 * @type Function
		 * @private
		 */
		_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "SignalBinding", 41);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 48); this._listener = listener;
		
		/**
		 * If binding should be executed just once.
		 * @type boolean
		 * @private
		 */
		_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 55); this._isOnce = isOnce;
		
		/**
		 * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @memberOf signals.SignalBinding.prototype
		 * @name context
		 * @type {Object|undefined}
		 */
		_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 63); this.context = listenerContext;
		
		/**
		 * Reference to Signal object that listener is currently bound to.
		 * @type signals.Signal
		 * @private
		 */
		_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 70); this._signal = signal;
	}
	
	_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 73); SignalBinding.prototype = /** @lends signals.SignalBinding.prototype */ {
		
		/**
		 * @type boolean
		 * @private
		 */
		_isEnabled : true,
		
		/**
		 * Call listener passing arbitrary parameters.
		 * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p> 
		 * @param {Array} [paramsArr]	Array of parameters that should be passed to the listener
		 * @return {*} Value returned by the listener.
		 */
		execute : function(paramsArr){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "execute", 87);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 88); var r;
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 89); if(this._isEnabled){
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 90); r = this._listener.apply(this.context, paramsArr);
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 91); if(this._isOnce){
					_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 92); this.detach();
				}
			}
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 95); return r; //avoid warnings on some editors
		},
		
		/**
		 * Detach binding from signal.
		 * - alias to: mySignal.remove(myBinding.getListener());
		 * @return {Function} Handler function bound to the signal.
		 */
		detach : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "detach", 103);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 104); return this._signal.remove(this._listener);
		},
		
		/**
		 * @return {Function} Handler function bound to the signal.
		 */
		getListener : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "getListener", 110);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 111); return this._listener;
		},
		
		/**
		 * Remove binding from signal and destroy any reference to external Objects (destroy SignalBinding object).
		 * <p><strong>IMPORTANT:</strong> calling methods on the binding instance after calling dispose will throw errors.</p>
		 */
		dispose : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "dispose", 118);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 119); this.detach();
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 120); this._destroy();
		},
		
		/**
		 * Delete all instance properties
		 * @private
		 */
		_destroy : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "_destroy", 127);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 128); delete this._signal;
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 129); delete this._isOnce;
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 130); delete this._listener;
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 131); delete this.context;
		},
		
		/**
		 * Disable SignalBinding, block listener execution. Listener will only be executed after calling `enable()`.  
		 * @see signals.SignalBinding.enable()
		 */
		disable : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "disable", 138);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 139); this._isEnabled = false;
		},
		
		/**
		 * Enable SignalBinding. Enable listener execution.
		 * @see signals.SignalBinding.disable()
		 */
		enable : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "enable", 146);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 147); this._isEnabled = true;
		},
		
		/**
		 * @return {boolean} If SignalBinding is currently paused and won't execute listener during dispatch.
		 */
		isEnabled : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "isEnabled", 153);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 154); return this._isEnabled;
		},
		
		/**
		 * @return {boolean} If SignalBinding will only be executed once.
		 */
		isOnce : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "isOnce", 160);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 161); return this._isOnce;
		},
		
		/**
		 * @return {string} String representation of the object.
		 */
		toString : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "toString", 167);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 168); return '[SignalBinding isOnce: '+ this._isOnce +', isEnabled: '+ this._isEnabled +']';
		}
		
	};
	
	// Signal --------------------------------------------------------
	//================================================================
	
	/**
	 * Custom event broadcaster
	 * <br />- inspired by Robert Penner's AS3 Signals.
	 * @author Miller Medeiros
	 * @constructor
	 */
	_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 182); signals.Signal = function(){
		/**
		 * @type Array.<SignalBinding>
		 * @private
		 */
		_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "Signal", 182);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 187); this._bindings = [];
	};
	
	_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 190); signals.Signal.prototype = {
		
		/**
		 * @type boolean
		 * @private
		 */
		_shouldPropagate : true,
		
		/**
		 * @type boolean
		 * @private
		 */
		_isEnabled : true,
		
		/**
		 * @param {Function} listener
		 * @param {boolean} isOnce
		 * @param {Object} [scope]
		 * @return {SignalBinding}
		 * @private
		 */
		_registerListener : function(listener, isOnce, scope){
			
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "_registerListener", 211);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 213); if(typeof listener !== 'function'){
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 214); throw new Error('listener is a required param of add() and addOnce() and should be a Function.');
			}
			
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 217); var prevIndex = this._indexOfListener(listener),
				binding;
			
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 220); if(prevIndex !== -1){ //avoid creating a new Binding for same listener if already added to list
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 221); binding = this._bindings[prevIndex];
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 222); if(binding.isOnce() !== isOnce){
					_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 223); throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');
				}
			} else {
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 226); binding = new SignalBinding(this, listener, isOnce, scope);
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 227); this._bindings.push(binding);
			}
			
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 230); return binding;
		},
		
		/**
		 * @param {Function} listener
		 * @return {number}
		 * @private
		 */
		_indexOfListener : function(listener){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "_indexOfListener", 238);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 239); var n = this._bindings.length;
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 240); while(n--){
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 241); if(this._bindings[n]._listener === listener){
					_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 242); return n;
				}
			}
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 245); return -1;
		},
		
		/**
		 * Add a listener to the signal.
		 * @param {Function} listener	Signal handler function.
		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.
		 */
		add : function(listener, scope){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "add", 254);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 255); return this._registerListener(listener, false, scope);
		},
		
		/**
		 * Add listener to the signal that should be removed after first execution (will be executed only once).
		 * @param {Function} listener	Signal handler function.
		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.
		 */
		addOnce : function(listener, scope){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "addOnce", 264);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 265); return this._registerListener(listener, true, scope);
		},
		
		/**
		 * Remove a single listener from the dispatch queue.
		 * @param {Function} listener	Handler function that should be removed.
		 * @return {Function} Listener handler function.
		 */
		remove : function(listener){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "remove", 273);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 274); if(typeof listener !== 'function'){
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 275); throw new Error('listener is a required param of remove() and should be a Function.');
			}
			
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 278); var i = this._indexOfListener(listener);
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 279); if(i !== -1){
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 280); this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 281); this._bindings.splice(i, 1);
			}
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 283); return listener;
		},
		
		/**
		 * Remove all listeners from the Signal.
		 */
		removeAll : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "removeAll", 289);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 290); var n = this._bindings.length;
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 291); while(n--){
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 292); this._bindings[n]._destroy();
			}
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 294); this._bindings.length = 0;
		},
		
		/**
		 * @return {number} Number of listeners attached to the Signal.
		 */
		getNumListeners : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "getNumListeners", 300);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 301); return this._bindings.length;
		},
		
		/**
		 * Disable Signal. Block dispatch to listeners until `enable()` is called.
		 * <p><strong>IMPORTANT:</strong> If this method is called during a dispatch it will only have effect on the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
		 * @see signals.Signal.prototype.enable
		 * @see signals.Signal.prototype.halt
		 */
		disable : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "disable", 310);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 311); this._isEnabled = false;
		},
		
		/**
		 * Enable broadcast to listeners.
		 * @see signals.Signal.prototype.disable
		 */
		enable : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "enable", 318);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 319); this._isEnabled = true;
		}, 
		
		/**
		 * @return {boolean} If Signal is currently enabled and will broadcast message to listeners.
		 */
		isEnabled : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "isEnabled", 325);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 326); return this._isEnabled;
		},
		
		/**
		 * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
		 * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
		 * @see signals.Signal.prototype.disable 
		 */
		halt : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "halt", 334);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 335); this._shouldPropagate = false;
		},
		
		/**
		 * Dispatch/Broadcast Signal to all listeners added to the queue. 
		 * @param {...*} [params]	Parameters that should be passed to each handler.
		 */
		dispatch : function(params){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "dispatch", 342);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 343); if(! this._isEnabled){
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 344); return;
			}
			
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 347); var paramsArr = Array.prototype.slice.call(arguments),
				bindings = this._bindings.slice(), //clone array in case add/remove items during dispatch
				i,
				n = this._bindings.length;
			
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 352); this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.
						
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 354); for(i=0; i<n; i++){
				//execute all callbacks until end of the list or until a callback returns `false` or stops propagation
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 356); if(bindings[i].execute(paramsArr) === false || !this._shouldPropagate){
					_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 357); break;
				}
			}
		},
		
		/**
		 * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
		 * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
		 */
		dispose : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "dispose", 366);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 367); this.removeAll();
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 368); delete this._bindings;
		},
		
		/**
		 * @return {string} String representation of the object.
		 */
		toString : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "toString", 374);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 375); return '[Signal isEnabled: '+ this._isEnabled +' numListeners: '+ this.getNumListeners() +']';
		}
		
	};

	_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 380); return signals;
	
}());
