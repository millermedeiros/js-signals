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
_yuitest_coverage["/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js",
    code: []
};
_yuitest_coverage["/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js"].code=["/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */","","/*!!"," * JS Signals <http://millermedeiros.github.com/js-signals/>"," * Released under the MIT license <http://www.opensource.org/licenses/mit-license.php>"," * @author Miller Medeiros <http://millermedeiros.com/>"," * @version 0.5.4a"," * @build 170 (04/09/2011 04:54 PM)"," */","","/**"," * @namespace Signals Namespace - Custom event/messaging system based on AS3 Signals"," */","var signals = (function(){","	","	/**","	 * @namespace Signals Namespace - Custom event/messaging system based on AS3 Signals","	 * @name signals","	 */","	var signals = /** @lends signals */{","		/**","		 * Signals Version Number","		 * @type String","		 * @const","		 */","		VERSION : '0.5.4a'","	};","","	// SignalBinding -------------------------------------------------","	//================================================================","	","	/**","	 * Object that represents a binding between a Signal and a listener function.","	 * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>","	 * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.","	 * @author Miller Medeiros","	 * @constructor","	 * @internal","	 * @name signals.SignalBinding","	 * @param {signals.Signal} signal	Reference to Signal object that listener is currently bound to.","	 * @param {Function} listener	Handler function bound to the signal.","	 * @param {boolean} isOnce	If binding should be executed just once.","	 * @param {Object} [listenerContext]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).","	 * @param {Number} [priority]	The priority level of the event listener. (default = 0).","	 */","	 function SignalBinding(signal, listener, isOnce, listenerContext, priority){","		","		/**","		 * Handler function bound to the signal.","		 * @type Function","		 * @private","		 */","		this._listener = listener;","		","		/**","		 * If binding should be executed just once.","		 * @type boolean","		 * @private","		 */","		this._isOnce = isOnce;","		","		/**","		 * Context on which listener will be executed (object that should represent the `this` variable inside listener function).","		 * @memberOf signals.SignalBinding.prototype","		 * @name context","		 * @type Object|undefined|null","		 */","		this.context = listenerContext;","		","		/**","		 * Reference to Signal object that listener is currently bound to.","		 * @type signals.Signal","		 * @private","		 */","		this._signal = signal;","		","		/**","		 * Listener priority","		 * @type Number","		 * @private","		 */","		this._priority = priority || 0;","	}","	","	SignalBinding.prototype = /** @lends signals.SignalBinding.prototype */ {","		","		/**","		 * If binding is active and should be executed.","		 * @type boolean","		 */","		active : true,","		","		/**","		 * Call listener passing arbitrary parameters.","		 * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p> ","		 * @param {Array} [paramsArr]	Array of parameters that should be passed to the listener","		 * @return {*} Value returned by the listener.","		 */","		execute : function(paramsArr){","			var r;","			if(this.active){","				r = this._listener.apply(this.context, paramsArr);","				if(this._isOnce){","					this.detach();","				}","			}","			return r;","		},","		","		/**","		 * Detach binding from signal.","		 * - alias to: mySignal.remove(myBinding.getListener());","		 * @return {Function} Handler function bound to the signal.","		 */","		detach : function(){","			return this._signal.remove(this._listener);","		},","		","		/**","		 * @return {Function} Handler function bound to the signal.","		 */","		getListener : function(){","			return this._listener;","		},","		","		/**","		 * Remove binding from signal and destroy any reference to external Objects (destroy SignalBinding object).","		 * <p><strong>IMPORTANT:</strong> calling methods on the binding instance after calling dispose will throw errors.</p>","		 */","		dispose : function(){","			this.detach();","			this._destroy();","		},","		","		/**","		 * Delete all instance properties","		 * @private","		 */","		_destroy : function(){","			delete this._signal;","			delete this._isOnce;","			delete this._listener;","			delete this.context;","		},","		","		/**","		 * @return {boolean} If SignalBinding will only be executed once.","		 */","		isOnce : function(){","			return this._isOnce;","		},","		","		/**","		 * @return {string} String representation of the object.","		 */","		toString : function(){","			return '[SignalBinding isOnce: '+ this._isOnce +', active: '+ this.active +']';","		}","		","	};","","/*global signals:true, SignalBinding:true*/","	","	// Signal --------------------------------------------------------","	//================================================================","	","	/**","	 * Custom event broadcaster","	 * <br />- inspired by Robert Penner's AS3 Signals.","	 * @author Miller Medeiros","	 * @constructor","	 */","	signals.Signal = function(){","		/**","		 * @type Array.<SignalBinding>","		 * @private","		 */","		this._bindings = [];","	};","	","	signals.Signal.prototype = {","		","		/**","		 * @type boolean","		 * @private","		 */","		_shouldPropagate : true,","		","		/**","		 * If Signal is active and should broadcast events.","		 * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>","		 * @type boolean","		 */","		active : true,","		","		/**","		 * @param {Function} listener","		 * @param {boolean} isOnce","		 * @param {Object} [scope]","		 * @param {Number} [priority]","		 * @return {SignalBinding}","		 * @private","		 */","		_registerListener : function(listener, isOnce, scope, priority){","			","			if(typeof listener !== 'function'){","				throw new Error('listener is a required param of add() and addOnce() and should be a Function.');","			}","			","			var prevIndex = this._indexOfListener(listener),","				binding;","			","			if(prevIndex !== -1){ //avoid creating a new Binding for same listener if already added to list","				binding = this._bindings[prevIndex];","				if(binding.isOnce() !== isOnce){","					throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');","				}","			} else {","				binding = new SignalBinding(this, listener, isOnce, scope, priority);","				this._addBinding(binding);","			}","			","			return binding;","		},","		","		/**","		 * @param {Function} binding","		 * @private","		 */","		_addBinding : function(binding){","			//simplified insertion sort","			var n = this._bindings.length;","			do { --n; } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);","			this._bindings.splice(n+1, 0, binding);","		},","		","		/**","		 * @param {Function} listener","		 * @return {number}","		 * @private","		 */","		_indexOfListener : function(listener){","			var n = this._bindings.length;","			while(n--){","				if(this._bindings[n]._listener === listener){","					return n;","				}","			}","			return -1;","		},","		","		/**","		 * Add a listener to the signal.","		 * @param {Function} listener	Signal handler function.","		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).","		 * @param {Number} [priority]	The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)","		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.","		 */","		add : function(listener, scope, priority){","			return this._registerListener(listener, false, scope, priority);","		},","		","		/**","		 * Add listener to the signal that should be removed after first execution (will be executed only once).","		 * @param {Function} listener	Signal handler function.","		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).","		 * @param {Number} [priority]	The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)","		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.","		 */","		addOnce : function(listener, scope, priority){","			return this._registerListener(listener, true, scope, priority);","		},","		","		/**","		 * Remove a single listener from the dispatch queue.","		 * @param {Function} listener	Handler function that should be removed.","		 * @return {Function} Listener handler function.","		 */","		remove : function(listener){","			if(typeof listener !== 'function'){","				throw new Error('listener is a required param of remove() and should be a Function.');","			}","			","			var i = this._indexOfListener(listener);","			if(i !== -1){","				this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal","				this._bindings.splice(i, 1);","			}","			return listener;","		},","		","		/**","		 * Remove all listeners from the Signal.","		 */","		removeAll : function(){","			var n = this._bindings.length;","			while(n--){","				this._bindings[n]._destroy();","			}","			this._bindings.length = 0;","		},","		","		/**","		 * @return {number} Number of listeners attached to the Signal.","		 */","		getNumListeners : function(){","			return this._bindings.length;","		},","		","		/**","		 * Stop propagation of the event, blocking the dispatch to next listeners on the queue.","		 * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>","		 * @see signals.Signal.prototype.disable ","		 */","		halt : function(){","			this._shouldPropagate = false;","		},","		","		/**","		 * Dispatch/Broadcast Signal to all listeners added to the queue. ","		 * @param {...*} [params]	Parameters that should be passed to each handler.","		 */","		dispatch : function(params){","			if(! this.active){","				return;","			}","			","			var paramsArr = Array.prototype.slice.call(arguments),","				bindings = this._bindings.slice(), //clone array in case add/remove items during dispatch","				n = this._bindings.length;","			","			this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.","			","			//execute all callbacks until end of the list or until a callback returns `false` or stops propagation","			//reverse loop since listeners with higher priority will be added at the end of the list","			do { n--; } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);","		},","		","		/**","		 * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).","		 * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>","		 */","		dispose : function(){","			this.removeAll();","			delete this._bindings;","		},","		","		/**","		 * @return {string} String representation of the object.","		 */","		toString : function(){","			return '[Signal active: '+ this.active +' numListeners: '+ this.getNumListeners() +']';","		}","		","	};","","	return signals;","	","}());"];
/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */

/*!!
 * JS Signals <http://millermedeiros.github.com/js-signals/>
 * Released under the MIT license <http://www.opensource.org/licenses/mit-license.php>
 * @author Miller Medeiros <http://millermedeiros.com/>
 * @version 0.5.4a
 * @build 170 (04/09/2011 04:54 PM)
 */

/**
 * @namespace Signals Namespace - Custom event/messaging system based on AS3 Signals
 */
_yuitest_coverage["/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js"].lines = {"14":0,"20":0,"46":0,"53":0,"60":0,"68":0,"75":0,"82":0,"85":0,"100":0,"101":0,"102":0,"103":0,"104":0,"107":0,"116":0,"123":0,"131":0,"132":0,"140":0,"141":0,"142":0,"143":0,"150":0,"157":0,"173":0,"178":0,"181":0,"206":0,"207":0,"210":0,"213":0,"214":0,"215":0,"216":0,"219":0,"220":0,"223":0,"232":0,"233":0,"234":0,"243":0,"244":0,"245":0,"246":0,"249":0,"260":0,"271":0,"280":0,"281":0,"284":0,"285":0,"286":0,"287":0,"289":0,"296":0,"297":0,"298":0,"300":0,"307":0,"316":0,"324":0,"325":0,"328":0,"332":0,"336":0,"344":0,"345":0,"352":0,"357":0};
_yuitest_coverage["/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js"].functions = {"SignalBinding:46":0,"execute:99":0,"detach:115":0,"getListener:122":0,"dispose:130":0,"_destroy:139":0,"isOnce:149":0,"toString:156":0,"Signal:173":0,"_registerListener:204":0,"_addBinding:230":0,"_indexOfListener:242":0,"add:259":0,"addOnce:270":0,"remove:279":0,"removeAll:295":0,"getNumListeners:306":0,"halt:315":0,"dispatch:323":0,"dispose:343":0,"toString:351":0,"(anonymous 1):14":0};
_yuitest_coverage["/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js"].coveredLines = 70;
_yuitest_coverage["/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js"].coveredFunctions = 22;
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 14); var signals = (function(){
	
	/**
	 * @namespace Signals Namespace - Custom event/messaging system based on AS3 Signals
	 * @name signals
	 */
	_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "(anonymous 1)", 14);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 20); var signals = /** @lends signals */{
		/**
		 * Signals Version Number
		 * @type String
		 * @const
		 */
		VERSION : '0.5.4a'
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
	 _yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 46); function SignalBinding(signal, listener, isOnce, listenerContext, priority){
		
		/**
		 * Handler function bound to the signal.
		 * @type Function
		 * @private
		 */
		_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "SignalBinding", 46);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 53); this._listener = listener;
		
		/**
		 * If binding should be executed just once.
		 * @type boolean
		 * @private
		 */
		_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 60); this._isOnce = isOnce;
		
		/**
		 * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @memberOf signals.SignalBinding.prototype
		 * @name context
		 * @type Object|undefined|null
		 */
		_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 68); this.context = listenerContext;
		
		/**
		 * Reference to Signal object that listener is currently bound to.
		 * @type signals.Signal
		 * @private
		 */
		_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 75); this._signal = signal;
		
		/**
		 * Listener priority
		 * @type Number
		 * @private
		 */
		_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 82); this._priority = priority || 0;
	}
	
	_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 85); SignalBinding.prototype = /** @lends signals.SignalBinding.prototype */ {
		
		/**
		 * If binding is active and should be executed.
		 * @type boolean
		 */
		active : true,
		
		/**
		 * Call listener passing arbitrary parameters.
		 * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p> 
		 * @param {Array} [paramsArr]	Array of parameters that should be passed to the listener
		 * @return {*} Value returned by the listener.
		 */
		execute : function(paramsArr){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "execute", 99);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 100); var r;
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 101); if(this.active){
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 102); r = this._listener.apply(this.context, paramsArr);
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 103); if(this._isOnce){
					_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 104); this.detach();
				}
			}
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 107); return r;
		},
		
		/**
		 * Detach binding from signal.
		 * - alias to: mySignal.remove(myBinding.getListener());
		 * @return {Function} Handler function bound to the signal.
		 */
		detach : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "detach", 115);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 116); return this._signal.remove(this._listener);
		},
		
		/**
		 * @return {Function} Handler function bound to the signal.
		 */
		getListener : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "getListener", 122);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 123); return this._listener;
		},
		
		/**
		 * Remove binding from signal and destroy any reference to external Objects (destroy SignalBinding object).
		 * <p><strong>IMPORTANT:</strong> calling methods on the binding instance after calling dispose will throw errors.</p>
		 */
		dispose : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "dispose", 130);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 131); this.detach();
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 132); this._destroy();
		},
		
		/**
		 * Delete all instance properties
		 * @private
		 */
		_destroy : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "_destroy", 139);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 140); delete this._signal;
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 141); delete this._isOnce;
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 142); delete this._listener;
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 143); delete this.context;
		},
		
		/**
		 * @return {boolean} If SignalBinding will only be executed once.
		 */
		isOnce : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "isOnce", 149);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 150); return this._isOnce;
		},
		
		/**
		 * @return {string} String representation of the object.
		 */
		toString : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "toString", 156);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 157); return '[SignalBinding isOnce: '+ this._isOnce +', active: '+ this.active +']';
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
	_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 173); signals.Signal = function(){
		/**
		 * @type Array.<SignalBinding>
		 * @private
		 */
		_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "Signal", 173);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 178); this._bindings = [];
	};
	
	_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 181); signals.Signal.prototype = {
		
		/**
		 * @type boolean
		 * @private
		 */
		_shouldPropagate : true,
		
		/**
		 * If Signal is active and should broadcast events.
		 * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
		 * @type boolean
		 */
		active : true,
		
		/**
		 * @param {Function} listener
		 * @param {boolean} isOnce
		 * @param {Object} [scope]
		 * @param {Number} [priority]
		 * @return {SignalBinding}
		 * @private
		 */
		_registerListener : function(listener, isOnce, scope, priority){
			
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "_registerListener", 204);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 206); if(typeof listener !== 'function'){
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 207); throw new Error('listener is a required param of add() and addOnce() and should be a Function.');
			}
			
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 210); var prevIndex = this._indexOfListener(listener),
				binding;
			
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 213); if(prevIndex !== -1){ //avoid creating a new Binding for same listener if already added to list
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 214); binding = this._bindings[prevIndex];
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 215); if(binding.isOnce() !== isOnce){
					_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 216); throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');
				}
			} else {
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 219); binding = new SignalBinding(this, listener, isOnce, scope, priority);
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 220); this._addBinding(binding);
			}
			
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 223); return binding;
		},
		
		/**
		 * @param {Function} binding
		 * @private
		 */
		_addBinding : function(binding){
			//simplified insertion sort
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "_addBinding", 230);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 232); var n = this._bindings.length;
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 233); do { --n; }while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 234); this._bindings.splice(n+1, 0, binding);
		},
		
		/**
		 * @param {Function} listener
		 * @return {number}
		 * @private
		 */
		_indexOfListener : function(listener){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "_indexOfListener", 242);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 243); var n = this._bindings.length;
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 244); while(n--){
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 245); if(this._bindings[n]._listener === listener){
					_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 246); return n;
				}
			}
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 249); return -1;
		},
		
		/**
		 * Add a listener to the signal.
		 * @param {Function} listener	Signal handler function.
		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @param {Number} [priority]	The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.
		 */
		add : function(listener, scope, priority){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "add", 259);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 260); return this._registerListener(listener, false, scope, priority);
		},
		
		/**
		 * Add listener to the signal that should be removed after first execution (will be executed only once).
		 * @param {Function} listener	Signal handler function.
		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @param {Number} [priority]	The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.
		 */
		addOnce : function(listener, scope, priority){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "addOnce", 270);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 271); return this._registerListener(listener, true, scope, priority);
		},
		
		/**
		 * Remove a single listener from the dispatch queue.
		 * @param {Function} listener	Handler function that should be removed.
		 * @return {Function} Listener handler function.
		 */
		remove : function(listener){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "remove", 279);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 280); if(typeof listener !== 'function'){
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 281); throw new Error('listener is a required param of remove() and should be a Function.');
			}
			
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 284); var i = this._indexOfListener(listener);
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 285); if(i !== -1){
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 286); this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 287); this._bindings.splice(i, 1);
			}
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 289); return listener;
		},
		
		/**
		 * Remove all listeners from the Signal.
		 */
		removeAll : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "removeAll", 295);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 296); var n = this._bindings.length;
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 297); while(n--){
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 298); this._bindings[n]._destroy();
			}
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 300); this._bindings.length = 0;
		},
		
		/**
		 * @return {number} Number of listeners attached to the Signal.
		 */
		getNumListeners : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "getNumListeners", 306);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 307); return this._bindings.length;
		},
		
		/**
		 * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
		 * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
		 * @see signals.Signal.prototype.disable 
		 */
		halt : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "halt", 315);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 316); this._shouldPropagate = false;
		},
		
		/**
		 * Dispatch/Broadcast Signal to all listeners added to the queue. 
		 * @param {...*} [params]	Parameters that should be passed to each handler.
		 */
		dispatch : function(params){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "dispatch", 323);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 324); if(! this.active){
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 325); return;
			}
			
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 328); var paramsArr = Array.prototype.slice.call(arguments),
				bindings = this._bindings.slice(), //clone array in case add/remove items during dispatch
				n = this._bindings.length;
			
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 332); this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.
			
			//execute all callbacks until end of the list or until a callback returns `false` or stops propagation
			//reverse loop since listeners with higher priority will be added at the end of the list
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 336); do { n--; }while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
		},
		
		/**
		 * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
		 * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
		 */
		dispose : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "dispose", 343);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 344); this.removeAll();
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 345); delete this._bindings;
		},
		
		/**
		 * @return {string} String representation of the object.
		 */
		toString : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "toString", 351);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 352); return '[Signal active: '+ this.active +' numListeners: '+ this.getNumListeners() +']';
		}
		
	};

	_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 357); return signals;
	
}());
