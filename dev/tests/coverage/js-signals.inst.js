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
_yuitest_coverage["C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js"].code=["/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */","","/*!!"," * JS Signals <http://millermedeiros.github.com/js-signals/>"," * Released under the MIT license <http://www.opensource.org/licenses/mit-license.php>"," * @author Miller Medeiros <http://millermedeiros.com/>"," * @version 0.5.2"," * @build 142 (02/21/2011 06:05 PM)"," */","","/**"," * @namespace Signals Namespace - Custom event/messaging system based on AS3 Signals"," */","var signals = (function(){","	","	var signals = /** @lends signals */{","		/**","		 * Signals Version Number","		 * @type string","		 * @const","		 */","		VERSION : '0.5.2'","	};","","	// SignalBinding -------------------------------------------------","	//================================================================","	","	/**","	 * Object that represents a binding between a Signal and a listener function.","	 * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>","	 * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.","	 * @author Miller Medeiros","	 * @constructor","	 * @internal","	 * @name signals.SignalBinding","	 * @param {signals.Signal} signal	Reference to Signal object that listener is currently bound to.","	 * @param {Function} listener	Handler function bound to the signal.","	 * @param {boolean} isOnce	If binding should be executed just once.","	 * @param {Object} [listenerContext]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).","	 * @param {Number} [priority]	The priority level of the event listener. (default = 0).","	 */","	 function SignalBinding(signal, listener, isOnce, listenerContext, priority){","		","		/**","		 * Handler function bound to the signal.","		 * @type Function","		 * @private","		 */","		this._listener = listener;","		","		/**","		 * If binding should be executed just once.","		 * @type boolean","		 * @private","		 */","		this._isOnce = isOnce;","		","		/**","		 * Context on which listener will be executed (object that should represent the `this` variable inside listener function).","		 * @memberOf signals.SignalBinding.prototype","		 * @name context","		 * @type {Object|undefined}","		 */","		this.context = listenerContext;","		","		/**","		 * Reference to Signal object that listener is currently bound to.","		 * @type signals.Signal","		 * @private","		 */","		this._signal = signal;","		","		/**","		 * Listener priority","		 * @type Number","		 * @private","		 */","		this._priority = priority || 0;","	}","	","	SignalBinding.prototype = /** @lends signals.SignalBinding.prototype */ {","		","		/**","		 * @type boolean","		 * @private","		 */","		_isEnabled : true,","		","		/**","		 * Call listener passing arbitrary parameters.","		 * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p> ","		 * @param {Array} [paramsArr]	Array of parameters that should be passed to the listener","		 * @return {*} Value returned by the listener.","		 */","		execute : function(paramsArr){","			var r;","			if(this._isEnabled){","				r = this._listener.apply(this.context, paramsArr);","				if(this._isOnce){","					this.detach();","				}","			}","			return r;","		},","		","		/**","		 * Detach binding from signal.","		 * - alias to: mySignal.remove(myBinding.getListener());","		 * @return {Function} Handler function bound to the signal.","		 */","		detach : function(){","			return this._signal.remove(this._listener);","		},","		","		/**","		 * @return {Function} Handler function bound to the signal.","		 */","		getListener : function(){","			return this._listener;","		},","		","		/**","		 * Remove binding from signal and destroy any reference to external Objects (destroy SignalBinding object).","		 * <p><strong>IMPORTANT:</strong> calling methods on the binding instance after calling dispose will throw errors.</p>","		 */","		dispose : function(){","			this.detach();","			this._destroy();","		},","		","		/**","		 * Delete all instance properties","		 * @private","		 */","		_destroy : function(){","			delete this._signal;","			delete this._isOnce;","			delete this._listener;","			delete this.context;","		},","		","		/**","		 * Disable SignalBinding, block listener execution. Listener will only be executed after calling `enable()`.  ","		 * @see signals.SignalBinding.enable()","		 */","		disable : function(){","			this._isEnabled = false;","		},","		","		/**","		 * Enable SignalBinding. Enable listener execution.","		 * @see signals.SignalBinding.disable()","		 */","		enable : function(){","			this._isEnabled = true;","		},","		","		/**","		 * @return {boolean} If SignalBinding is currently paused and won't execute listener during dispatch.","		 */","		isEnabled : function(){","			return this._isEnabled;","		},","		","		/**","		 * @return {boolean} If SignalBinding will only be executed once.","		 */","		isOnce : function(){","			return this._isOnce;","		},","		","		/**","		 * @return {string} String representation of the object.","		 */","		toString : function(){","			return '[SignalBinding isOnce: '+ this._isOnce +', isEnabled: '+ this._isEnabled +']';","		}","		","	};","","/*global signals:true, SignalBinding:true*/","	","	// Signal --------------------------------------------------------","	//================================================================","	","	/**","	 * Custom event broadcaster","	 * <br />- inspired by Robert Penner's AS3 Signals.","	 * @author Miller Medeiros","	 * @constructor","	 */","	signals.Signal = function(){","		/**","		 * @type Array.<SignalBinding>","		 * @private","		 */","		this._bindings = [];","	};","	","	signals.Signal.prototype = {","		","		/**","		 * @type boolean","		 * @private","		 */","		_shouldPropagate : true,","		","		/**","		 * @type boolean","		 * @private","		 */","		_isEnabled : true,","		","		/**","		 * @param {Function} listener","		 * @param {boolean} isOnce","		 * @param {Object} [scope]","		 * @param {Number} [priority]","		 * @return {SignalBinding}","		 * @private","		 */","		_registerListener : function(listener, isOnce, scope, priority){","			","			if(typeof listener !== 'function'){","				throw new Error('listener is a required param of add() and addOnce() and should be a Function.');","			}","			","			var prevIndex = this._indexOfListener(listener),","				binding;","			","			if(prevIndex !== -1){ //avoid creating a new Binding for same listener if already added to list","				binding = this._bindings[prevIndex];","				if(binding.isOnce() !== isOnce){","					throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');","				}","			} else {","				binding = new SignalBinding(this, listener, isOnce, scope, priority);","				this._addBinding(binding);","			}","			","			return binding;","		},","		","		/**","		 * @param {Function} binding","		 * @private","		 */","		_addBinding : function(binding){","			//simplified insertion sort","			var n = this._bindings.length;","			do { --n; } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);","			this._bindings.splice(n+1, 0, binding);","		},","		","		/**","		 * @param {Function} listener","		 * @return {number}","		 * @private","		 */","		_indexOfListener : function(listener){","			var n = this._bindings.length;","			while(n--){","				if(this._bindings[n]._listener === listener){","					return n;","				}","			}","			return -1;","		},","		","		/**","		 * Add a listener to the signal.","		 * @param {Function} listener	Signal handler function.","		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).","		 * @param {Number} [priority]	The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)","		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.","		 */","		add : function(listener, scope, priority){","			return this._registerListener(listener, false, scope, priority);","		},","		","		/**","		 * Add listener to the signal that should be removed after first execution (will be executed only once).","		 * @param {Function} listener	Signal handler function.","		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).","		 * @param {Number} [priority]	The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)","		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.","		 */","		addOnce : function(listener, scope, priority){","			return this._registerListener(listener, true, scope, priority);","		},","		","		/**","		 * Remove a single listener from the dispatch queue.","		 * @param {Function} listener	Handler function that should be removed.","		 * @return {Function} Listener handler function.","		 */","		remove : function(listener){","			if(typeof listener !== 'function'){","				throw new Error('listener is a required param of remove() and should be a Function.');","			}","			","			var i = this._indexOfListener(listener);","			if(i !== -1){","				this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal","				this._bindings.splice(i, 1);","			}","			return listener;","		},","		","		/**","		 * Remove all listeners from the Signal.","		 */","		removeAll : function(){","			var n = this._bindings.length;","			while(n--){","				this._bindings[n]._destroy();","			}","			this._bindings.length = 0;","		},","		","		/**","		 * @return {number} Number of listeners attached to the Signal.","		 */","		getNumListeners : function(){","			return this._bindings.length;","		},","		","		/**","		 * Disable Signal. Block dispatch to listeners until `enable()` is called.","		 * <p><strong>IMPORTANT:</strong> If this method is called during a dispatch it will only have effect on the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>","		 * @see signals.Signal.prototype.enable","		 * @see signals.Signal.prototype.halt","		 */","		disable : function(){","			this._isEnabled = false;","		},","		","		/**","		 * Enable broadcast to listeners.","		 * @see signals.Signal.prototype.disable","		 */","		enable : function(){","			this._isEnabled = true;","		}, ","		","		/**","		 * @return {boolean} If Signal is currently enabled and will broadcast message to listeners.","		 */","		isEnabled : function(){","			return this._isEnabled;","		},","		","		/**","		 * Stop propagation of the event, blocking the dispatch to next listeners on the queue.","		 * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>","		 * @see signals.Signal.prototype.disable ","		 */","		halt : function(){","			this._shouldPropagate = false;","		},","		","		/**","		 * Dispatch/Broadcast Signal to all listeners added to the queue. ","		 * @param {...*} [params]	Parameters that should be passed to each handler.","		 */","		dispatch : function(params){","			if(! this._isEnabled){","				return;","			}","			","			var paramsArr = Array.prototype.slice.call(arguments),","				bindings = this._bindings.slice(), //clone array in case add/remove items during dispatch","				n = this._bindings.length;","			","			this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.","			","			//execute all callbacks until end of the list or until a callback returns `false` or stops propagation","			//reverse loop since listeners with higher priority will be added at the end of the list","			do { n--; } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);","		},","		","		/**","		 * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).","		 * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>","		 */","		dispose : function(){","			this.removeAll();","			delete this._bindings;","		},","		","		/**","		 * @return {string} String representation of the object.","		 */","		toString : function(){","			return '[Signal isEnabled: '+ this._isEnabled +' numListeners: '+ this.getNumListeners() +']';","		}","		","	};","","	return signals;","	","}());"];
/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */

/*!!
 * JS Signals <http://millermedeiros.github.com/js-signals/>
 * Released under the MIT license <http://www.opensource.org/licenses/mit-license.php>
 * @author Miller Medeiros <http://millermedeiros.com/>
 * @version 0.5.2
 * @build 142 (02/21/2011 06:05 PM)
 */

/**
 * @namespace Signals Namespace - Custom event/messaging system based on AS3 Signals
 */
_yuitest_coverage["C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js"].lines = {"14":0,"16":0,"42":0,"49":0,"56":0,"64":0,"71":0,"78":0,"81":0,"96":0,"97":0,"98":0,"99":0,"100":0,"103":0,"112":0,"119":0,"127":0,"128":0,"136":0,"137":0,"138":0,"139":0,"147":0,"155":0,"162":0,"169":0,"176":0,"192":0,"197":0,"200":0,"224":0,"225":0,"228":0,"231":0,"232":0,"233":0,"234":0,"237":0,"238":0,"241":0,"250":0,"251":0,"252":0,"261":0,"262":0,"263":0,"264":0,"267":0,"278":0,"289":0,"298":0,"299":0,"302":0,"303":0,"304":0,"305":0,"307":0,"314":0,"315":0,"316":0,"318":0,"325":0,"335":0,"343":0,"350":0,"359":0,"367":0,"368":0,"371":0,"375":0,"379":0,"387":0,"388":0,"395":0,"400":0};
_yuitest_coverage["C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js"].functions = {"SignalBinding:42":0,"execute:95":0,"detach:111":0,"getListener:118":0,"dispose:126":0,"_destroy:135":0,"disable:146":0,"enable:154":0,"isEnabled:161":0,"isOnce:168":0,"toString:175":0,"Signal:192":0,"_registerListener:222":0,"_addBinding:248":0,"_indexOfListener:260":0,"add:277":0,"addOnce:288":0,"remove:297":0,"removeAll:313":0,"getNumListeners:324":0,"disable:334":0,"enable:342":0,"isEnabled:349":0,"halt:358":0,"dispatch:366":0,"dispose:386":0,"toString:394":0,"(anonymous 1):14":0};
_yuitest_coverage["C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js"].coveredLines = 76;
_yuitest_coverage["C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js"].coveredFunctions = 28;
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 14); var signals = (function(){
	
	_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "(anonymous 1)", 14);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 16); var signals = /** @lends signals */{
		/**
		 * Signals Version Number
		 * @type string
		 * @const
		 */
		VERSION : '0.5.2'
	};

	// SignalBinding -------------------------------------------------
	//================================================================
	
	/**
	 * Object that represents a binding between a Signal and a listener function.
	 * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
	 * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
	 * @author Miller Medeiros
	 * @constructor
	 * @internal
	 * @name signals.SignalBinding
	 * @param {signals.Signal} signal	Reference to Signal object that listener is currently bound to.
	 * @param {Function} listener	Handler function bound to the signal.
	 * @param {boolean} isOnce	If binding should be executed just once.
	 * @param {Object} [listenerContext]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	 * @param {Number} [priority]	The priority level of the event listener. (default = 0).
	 */
	 _yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 42); function SignalBinding(signal, listener, isOnce, listenerContext, priority){
		
		/**
		 * Handler function bound to the signal.
		 * @type Function
		 * @private
		 */
		_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "SignalBinding", 42);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 49); this._listener = listener;
		
		/**
		 * If binding should be executed just once.
		 * @type boolean
		 * @private
		 */
		_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 56); this._isOnce = isOnce;
		
		/**
		 * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @memberOf signals.SignalBinding.prototype
		 * @name context
		 * @type {Object|undefined}
		 */
		_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 64); this.context = listenerContext;
		
		/**
		 * Reference to Signal object that listener is currently bound to.
		 * @type signals.Signal
		 * @private
		 */
		_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 71); this._signal = signal;
		
		/**
		 * Listener priority
		 * @type Number
		 * @private
		 */
		_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 78); this._priority = priority || 0;
	}
	
	_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 81); SignalBinding.prototype = /** @lends signals.SignalBinding.prototype */ {
		
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
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "execute", 95);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 96); var r;
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 97); if(this._isEnabled){
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 98); r = this._listener.apply(this.context, paramsArr);
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 99); if(this._isOnce){
					_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 100); this.detach();
				}
			}
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 103); return r;
		},
		
		/**
		 * Detach binding from signal.
		 * - alias to: mySignal.remove(myBinding.getListener());
		 * @return {Function} Handler function bound to the signal.
		 */
		detach : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "detach", 111);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 112); return this._signal.remove(this._listener);
		},
		
		/**
		 * @return {Function} Handler function bound to the signal.
		 */
		getListener : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "getListener", 118);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 119); return this._listener;
		},
		
		/**
		 * Remove binding from signal and destroy any reference to external Objects (destroy SignalBinding object).
		 * <p><strong>IMPORTANT:</strong> calling methods on the binding instance after calling dispose will throw errors.</p>
		 */
		dispose : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "dispose", 126);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 127); this.detach();
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 128); this._destroy();
		},
		
		/**
		 * Delete all instance properties
		 * @private
		 */
		_destroy : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "_destroy", 135);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 136); delete this._signal;
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 137); delete this._isOnce;
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 138); delete this._listener;
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 139); delete this.context;
		},
		
		/**
		 * Disable SignalBinding, block listener execution. Listener will only be executed after calling `enable()`.  
		 * @see signals.SignalBinding.enable()
		 */
		disable : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "disable", 146);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 147); this._isEnabled = false;
		},
		
		/**
		 * Enable SignalBinding. Enable listener execution.
		 * @see signals.SignalBinding.disable()
		 */
		enable : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "enable", 154);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 155); this._isEnabled = true;
		},
		
		/**
		 * @return {boolean} If SignalBinding is currently paused and won't execute listener during dispatch.
		 */
		isEnabled : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "isEnabled", 161);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 162); return this._isEnabled;
		},
		
		/**
		 * @return {boolean} If SignalBinding will only be executed once.
		 */
		isOnce : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "isOnce", 168);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 169); return this._isOnce;
		},
		
		/**
		 * @return {string} String representation of the object.
		 */
		toString : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "toString", 175);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 176); return '[SignalBinding isOnce: '+ this._isOnce +', isEnabled: '+ this._isEnabled +']';
		}
		
	};

/*global signals:true, SignalBinding:true*/
	
	// Signal --------------------------------------------------------
	//================================================================
	
	/**
	 * Custom event broadcaster
	 * <br />- inspired by Robert Penner's AS3 Signals.
	 * @author Miller Medeiros
	 * @constructor
	 */
	_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 192); signals.Signal = function(){
		/**
		 * @type Array.<SignalBinding>
		 * @private
		 */
		_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "Signal", 192);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 197); this._bindings = [];
	};
	
	_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 200); signals.Signal.prototype = {
		
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
		 * @param {Number} [priority]
		 * @return {SignalBinding}
		 * @private
		 */
		_registerListener : function(listener, isOnce, scope, priority){
			
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "_registerListener", 222);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 224); if(typeof listener !== 'function'){
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 225); throw new Error('listener is a required param of add() and addOnce() and should be a Function.');
			}
			
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 228); var prevIndex = this._indexOfListener(listener),
				binding;
			
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 231); if(prevIndex !== -1){ //avoid creating a new Binding for same listener if already added to list
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 232); binding = this._bindings[prevIndex];
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 233); if(binding.isOnce() !== isOnce){
					_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 234); throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');
				}
			} else {
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 237); binding = new SignalBinding(this, listener, isOnce, scope, priority);
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 238); this._addBinding(binding);
			}
			
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 241); return binding;
		},
		
		/**
		 * @param {Function} binding
		 * @private
		 */
		_addBinding : function(binding){
			//simplified insertion sort
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "_addBinding", 248);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 250); var n = this._bindings.length;
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 251); do { --n; }while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 252); this._bindings.splice(n+1, 0, binding);
		},
		
		/**
		 * @param {Function} listener
		 * @return {number}
		 * @private
		 */
		_indexOfListener : function(listener){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "_indexOfListener", 260);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 261); var n = this._bindings.length;
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 262); while(n--){
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 263); if(this._bindings[n]._listener === listener){
					_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 264); return n;
				}
			}
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 267); return -1;
		},
		
		/**
		 * Add a listener to the signal.
		 * @param {Function} listener	Signal handler function.
		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @param {Number} [priority]	The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.
		 */
		add : function(listener, scope, priority){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "add", 277);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 278); return this._registerListener(listener, false, scope, priority);
		},
		
		/**
		 * Add listener to the signal that should be removed after first execution (will be executed only once).
		 * @param {Function} listener	Signal handler function.
		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @param {Number} [priority]	The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.
		 */
		addOnce : function(listener, scope, priority){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "addOnce", 288);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 289); return this._registerListener(listener, true, scope, priority);
		},
		
		/**
		 * Remove a single listener from the dispatch queue.
		 * @param {Function} listener	Handler function that should be removed.
		 * @return {Function} Listener handler function.
		 */
		remove : function(listener){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "remove", 297);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 298); if(typeof listener !== 'function'){
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 299); throw new Error('listener is a required param of remove() and should be a Function.');
			}
			
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 302); var i = this._indexOfListener(listener);
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 303); if(i !== -1){
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 304); this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 305); this._bindings.splice(i, 1);
			}
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 307); return listener;
		},
		
		/**
		 * Remove all listeners from the Signal.
		 */
		removeAll : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "removeAll", 313);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 314); var n = this._bindings.length;
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 315); while(n--){
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 316); this._bindings[n]._destroy();
			}
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 318); this._bindings.length = 0;
		},
		
		/**
		 * @return {number} Number of listeners attached to the Signal.
		 */
		getNumListeners : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "getNumListeners", 324);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 325); return this._bindings.length;
		},
		
		/**
		 * Disable Signal. Block dispatch to listeners until `enable()` is called.
		 * <p><strong>IMPORTANT:</strong> If this method is called during a dispatch it will only have effect on the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
		 * @see signals.Signal.prototype.enable
		 * @see signals.Signal.prototype.halt
		 */
		disable : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "disable", 334);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 335); this._isEnabled = false;
		},
		
		/**
		 * Enable broadcast to listeners.
		 * @see signals.Signal.prototype.disable
		 */
		enable : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "enable", 342);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 343); this._isEnabled = true;
		}, 
		
		/**
		 * @return {boolean} If Signal is currently enabled and will broadcast message to listeners.
		 */
		isEnabled : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "isEnabled", 349);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 350); return this._isEnabled;
		},
		
		/**
		 * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
		 * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
		 * @see signals.Signal.prototype.disable 
		 */
		halt : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "halt", 358);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 359); this._shouldPropagate = false;
		},
		
		/**
		 * Dispatch/Broadcast Signal to all listeners added to the queue. 
		 * @param {...*} [params]	Parameters that should be passed to each handler.
		 */
		dispatch : function(params){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "dispatch", 366);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 367); if(! this._isEnabled){
				_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 368); return;
			}
			
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 371); var paramsArr = Array.prototype.slice.call(arguments),
				bindings = this._bindings.slice(), //clone array in case add/remove items during dispatch
				n = this._bindings.length;
			
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 375); this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.
			
			//execute all callbacks until end of the list or until a callback returns `false` or stops propagation
			//reverse loop since listeners with higher priority will be added at the end of the list
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 379); do { n--; }while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
		},
		
		/**
		 * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
		 * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
		 */
		dispose : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "dispose", 386);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 387); this.removeAll();
			_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 388); delete this._bindings;
		},
		
		/**
		 * @return {string} String representation of the object.
		 */
		toString : function(){
			_yuitest_coverfunc("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", "toString", 394);
_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 395); return '[Signal isEnabled: '+ this._isEnabled +' numListeners: '+ this.getNumListeners() +']';
		}
		
	};

	_yuitest_coverline("C:\Miller\Personal\open_source_projects\js-signals\dist\js-signals.js", 400); return signals;
	
}());
