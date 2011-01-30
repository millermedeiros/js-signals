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
_yuitest_coverage["/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js"].code=["/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */","","/*!!"," * JS Signals <http://millermedeiros.github.com/js-signals/>"," * Released under the MIT license <http://www.opensource.org/licenses/mit-license.php>"," * @author Miller Medeiros <http://millermedeiros.com/>"," * @version 0.5.1"," * @build 126 (01/30/2011 01:55 AM)"," */","(function(window){","	","	/**","	 * @namespace Signals Namespace - Custom event/messaging system based on AS3 Signals","	 * @name signals","	 */","	var signals = window.signals = {};","	","	/**","	 * Signals Version Number","	 * @type string","	 * @const","	 */","	signals.VERSION = '0.5.1';","	","	","	/**","	 * Object that represents a binding between a Signal and a listener function.","	 * <br />- <strong>This is an internall constructor and shouldn't be called by regular user.</strong>","	 * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.","	 * @author Miller Medeiros","	 * @constructor","	 * @name signals.SignalBinding","	 * @param {signals.Signal} signal	Reference to Signal object that listener is currently bound to.","	 * @param {Function} listener	Handler function bound to the signal.","	 * @param {boolean} isOnce	If binding should be executed just once.","	 * @param {Object} [listenerContext]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).","	 */","	 function SignalBinding(signal, listener, isOnce, listenerContext){","		","		/**","		 * Handler function bound to the signal.","		 * @type Function","		 * @private","		 */","		this._listener = listener;","		","		/**","		 * If binding should be executed just once.","		 * @type boolean","		 * @private","		 */","		this._isOnce = isOnce;","		","		/**","		 * Context on which listener will be executed (object that should represent the `this` variable inside listener function).","		 * @memberOf signals.SignalBinding.prototype","		 * @name context","		 * @type {Object|undefined}","		 */","		this.context = listenerContext;","		","		/**","		 * Reference to Signal object that listener is currently bound to.","		 * @type signals.Signal","		 * @private","		 */","		this._signal = signal;","	}","	","	SignalBinding.prototype = /** @lends signals.SignalBinding.prototype */ {","		","		/**","		 * @type boolean","		 * @private","		 */","		_isEnabled : true,","		","		/**","		 * Call listener passing arbitrary parameters.","		 * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p> ","		 * @param {Array} [paramsArr]	Array of parameters that should be passed to the listener","		 * @return {*} Value returned by the listener.","		 */","		execute : function(paramsArr){","			var r;","			if(this._isEnabled){","				r = this._listener.apply(this.context, paramsArr);","				if(this._isOnce){","					this.detach();","				}","			}","			return r; //avoid warnings on some editors","		},","		","		/**","		 * Detach binding from signal.","		 * - alias to: mySignal.remove(myBinding.getListener());","		 * @return {Function} Handler function bound to the signal.","		 */","		detach : function(){","			return this._signal.remove(this._listener);","		},","		","		/**","		 * @return {Function} Handler function bound to the signal.","		 */","		getListener : function(){","			return this._listener;","		},","		","		/**","		 * Remove binding from signal and destroy any reference to external Objects (destroy SignalBinding object).","		 * <p><strong>IMPORTANT:</strong> calling methods on the binding instance after calling dispose will throw errors.</p>","		 */","		dispose : function(){","			this.detach();","			this._destroy();","		},","		","		/**","		 * Delete all instance properties","		 * @private","		 */","		_destroy : function(){","			delete this._signal;","			delete this._isOnce;","			delete this._listener;","			delete this.context;","		},","		","		/**","		 * Disable SignalBinding, block listener execution. Listener will only be executed after calling `enable()`.  ","		 * @see signals.SignalBinding.enable()","		 */","		disable : function(){","			this._isEnabled = false;","		},","		","		/**","		 * Enable SignalBinding. Enable listener execution.","		 * @see signals.SignalBinding.disable()","		 */","		enable : function(){","			this._isEnabled = true;","		},","		","		/**","		 * @return {boolean} If SignalBinding is currently paused and won't execute listener during dispatch.","		 */","		isEnabled : function(){","			return this._isEnabled;","		},","		","		/**","		 * @return {boolean} If SignalBinding will only be executed once.","		 */","		isOnce : function(){","			return this._isOnce;","		},","		","		/**","		 * @return {string} String representation of the object.","		 */","		toString : function(){","			return '[SignalBinding isOnce: '+ this._isOnce +', isEnabled: '+ this._isEnabled +']';","		}","		","	};","","	/**","	 * Custom event broadcaster","	 * <br />- inspired by Robert Penner's AS3 Signals.","	 * @author Miller Medeiros","	 * @constructor","	 */","	signals.Signal = function(){","		/**","		 * @type Array.<SignalBinding>","		 * @private","		 */","		this._bindings = [];","	};","	","	","	signals.Signal.prototype = {","		","		/**","		 * @type boolean","		 * @private","		 */","		_shouldPropagate : true,","		","		/**","		 * @type boolean","		 * @private","		 */","		_isEnabled : true,","		","		/**","		 * @param {Function} listener","		 * @param {boolean} isOnce","		 * @param {Object} [scope]","		 * @return {SignalBinding}","		 * @private","		 */","		_registerListener : function(listener, isOnce, scope){","			","			if(typeof listener !== 'function'){","				throw new Error('listener is a required param of add() and addOnce().');","			}","			","			var prevIndex = this._indexOfListener(listener),","				binding;","			","			if(prevIndex !== -1){ //avoid creating a new Binding for same listener if already added to list","				binding = this._bindings[prevIndex];","				if(binding.isOnce() !== isOnce){","					throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');","				}","			} else {","				binding = new SignalBinding(this, listener, isOnce, scope);","				this._addBinding(binding);","			}","			","			return binding;","		},","		","		/**","		 * @param {SignalBinding} binding","		 * @private","		 */","		_addBinding : function(binding){","			this._bindings.push(binding);","		},","		","		/**","		 * @param {Function} listener","		 * @return {number}","		 * @private","		 */","		_indexOfListener : function(listener){","			var n = this._bindings.length;","			while(n--){","				if(this._bindings[n]._listener === listener){","					return n;","				}","			}","			return -1;","		},","		","		/**","		 * Add a listener to the signal.","		 * @param {Function} listener	Signal handler function.","		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).","		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.","		 */","		add : function(listener, scope){","			return this._registerListener(listener, false, scope);","		},","		","		/**","		 * Add listener to the signal that should be removed after first execution (will be executed only once).","		 * @param {Function} listener	Signal handler function.","		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).","		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.","		 */","		addOnce : function(listener, scope){","			return this._registerListener(listener, true, scope);","		},","		","		/**","		 * @private","		 */","		_removeByIndex : function(i){","			this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal","			this._bindings.splice(i, 1);","		},","		","		/**","		 * Remove a single listener from the dispatch queue.","		 * @param {Function} listener	Handler function that should be removed.","		 * @return {Function} Listener handler function.","		 */","		remove : function(listener){","			if(typeof listener !== 'function'){","				throw new Error('listener is a required param of remove().');","			}","			","			var i = this._indexOfListener(listener);","			if(i !== -1){","				this._removeByIndex(i);","			}","			return listener;","		},","		","		/**","		 * Remove all listeners from the Signal.","		 */","		removeAll : function(){","			var n = this._bindings.length;","			while(n--){","				this._removeByIndex(n);","			}","		},","		","		/**","		 * @return {number} Number of listeners attached to the Signal.","		 */","		getNumListeners : function(){","			return this._bindings.length;","		},","		","		/**","		 * Disable Signal. Block dispatch to listeners until `enable()` is called.","		 * <p><strong>IMPORTANT:</strong> If this method is called during a dispatch it will only have effect on the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>","		 * @see signals.Signal.prototype.enable","		 * @see signals.Signal.prototype.halt","		 */","		disable : function(){","			this._isEnabled = false;","		},","		","		/**","		 * Enable broadcast to listeners.","		 * @see signals.Signal.prototype.disable","		 */","		enable : function(){","			this._isEnabled = true;","		}, ","		","		/**","		 * @return {boolean} If Signal is currently enabled and will broadcast message to listeners.","		 */","		isEnabled : function(){","			return this._isEnabled;","		},","		","		/**","		 * Stop propagation of the event, blocking the dispatch to next listeners on the queue.","		 * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>","		 * @see signals.Signal.prototype.disable ","		 */","		halt : function(){","			this._shouldPropagate = false;","		},","		","		/**","		 * Dispatch/Broadcast Signal to all listeners added to the queue. ","		 * @param {...*} [params]	Parameters that should be passed to each handler.","		 */","		dispatch : function(params){","			if(! this._isEnabled){","				return;","			}","			","			var paramsArr = Array.prototype.slice.call(arguments),","				bindings = this._bindings.slice(), //clone array in case add/remove items during dispatch","				i,","				n = this._bindings.length;","			","			this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.","						","			for(i=0; i<n; i++){","				//execute all callbacks until end of the list or until a callback returns `false` or stops propagation","				if(bindings[i].execute(paramsArr) === false || !this._shouldPropagate){","					break;","				}","			}","		},","		","		/**","		 * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).","		 * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>","		 */","		dispose : function(){","			this.removeAll();","			delete this._bindings;","		},","		","		/**","		 * @return {string} String representation of the object.","		 */","		toString : function(){","			return '[Signal isEnabled: '+ this._isEnabled +' numListeners: '+ this.getNumListeners() +']';","		}","		","	};","}(this));"];
/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */

/*!!
 * JS Signals <http://millermedeiros.github.com/js-signals/>
 * Released under the MIT license <http://www.opensource.org/licenses/mit-license.php>
 * @author Miller Medeiros <http://millermedeiros.com/>
 * @version 0.5.1
 * @build 126 (01/30/2011 01:55 AM)
 */
_yuitest_coverage["/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js"].lines = {"10":0,"16":0,"23":0,"38":0,"45":0,"52":0,"60":0,"67":0,"70":0,"85":0,"86":0,"87":0,"88":0,"89":0,"92":0,"101":0,"108":0,"116":0,"117":0,"125":0,"126":0,"127":0,"128":0,"136":0,"144":0,"151":0,"158":0,"165":0,"176":0,"181":0,"185":0,"208":0,"209":0,"212":0,"215":0,"216":0,"217":0,"218":0,"221":0,"222":0,"225":0,"233":0,"242":0,"243":0,"244":0,"245":0,"248":0,"258":0,"268":0,"275":0,"276":0,"285":0,"286":0,"289":0,"290":0,"291":0,"293":0,"300":0,"301":0,"302":0,"310":0,"320":0,"328":0,"335":0,"344":0,"352":0,"353":0,"356":0,"361":0,"363":0,"365":0,"366":0,"376":0,"377":0,"384":0};
_yuitest_coverage["/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js"].functions = {"SignalBinding:38":0,"execute:84":0,"detach:100":0,"getListener:107":0,"dispose:115":0,"_destroy:124":0,"disable:135":0,"enable:143":0,"isEnabled:150":0,"isOnce:157":0,"toString:164":0,"Signal:176":0,"_registerListener:206":0,"_addBinding:232":0,"_indexOfListener:241":0,"add:257":0,"addOnce:267":0,"_removeByIndex:274":0,"remove:284":0,"removeAll:299":0,"getNumListeners:309":0,"disable:319":0,"enable:327":0,"isEnabled:334":0,"halt:343":0,"dispatch:351":0,"dispose:375":0,"toString:383":0,"(anonymous 1):10":0};
_yuitest_coverage["/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js"].coveredLines = 75;
_yuitest_coverage["/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js"].coveredFunctions = 29;
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 10); (function(window){
	
	/**
	 * @namespace Signals Namespace - Custom event/messaging system based on AS3 Signals
	 * @name signals
	 */
	_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "(anonymous 1)", 10);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 16); var signals = window.signals = {};
	
	/**
	 * Signals Version Number
	 * @type string
	 * @const
	 */
	_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 23); signals.VERSION = '0.5.1';
	
	
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
	 _yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 38); function SignalBinding(signal, listener, isOnce, listenerContext){
		
		/**
		 * Handler function bound to the signal.
		 * @type Function
		 * @private
		 */
		_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "SignalBinding", 38);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 45); this._listener = listener;
		
		/**
		 * If binding should be executed just once.
		 * @type boolean
		 * @private
		 */
		_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 52); this._isOnce = isOnce;
		
		/**
		 * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @memberOf signals.SignalBinding.prototype
		 * @name context
		 * @type {Object|undefined}
		 */
		_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 60); this.context = listenerContext;
		
		/**
		 * Reference to Signal object that listener is currently bound to.
		 * @type signals.Signal
		 * @private
		 */
		_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 67); this._signal = signal;
	}
	
	_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 70); SignalBinding.prototype = /** @lends signals.SignalBinding.prototype */ {
		
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
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "execute", 84);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 85); var r;
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 86); if(this._isEnabled){
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 87); r = this._listener.apply(this.context, paramsArr);
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 88); if(this._isOnce){
					_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 89); this.detach();
				}
			}
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 92); return r; //avoid warnings on some editors
		},
		
		/**
		 * Detach binding from signal.
		 * - alias to: mySignal.remove(myBinding.getListener());
		 * @return {Function} Handler function bound to the signal.
		 */
		detach : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "detach", 100);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 101); return this._signal.remove(this._listener);
		},
		
		/**
		 * @return {Function} Handler function bound to the signal.
		 */
		getListener : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "getListener", 107);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 108); return this._listener;
		},
		
		/**
		 * Remove binding from signal and destroy any reference to external Objects (destroy SignalBinding object).
		 * <p><strong>IMPORTANT:</strong> calling methods on the binding instance after calling dispose will throw errors.</p>
		 */
		dispose : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "dispose", 115);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 116); this.detach();
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 117); this._destroy();
		},
		
		/**
		 * Delete all instance properties
		 * @private
		 */
		_destroy : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "_destroy", 124);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 125); delete this._signal;
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 126); delete this._isOnce;
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 127); delete this._listener;
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 128); delete this.context;
		},
		
		/**
		 * Disable SignalBinding, block listener execution. Listener will only be executed after calling `enable()`.  
		 * @see signals.SignalBinding.enable()
		 */
		disable : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "disable", 135);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 136); this._isEnabled = false;
		},
		
		/**
		 * Enable SignalBinding. Enable listener execution.
		 * @see signals.SignalBinding.disable()
		 */
		enable : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "enable", 143);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 144); this._isEnabled = true;
		},
		
		/**
		 * @return {boolean} If SignalBinding is currently paused and won't execute listener during dispatch.
		 */
		isEnabled : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "isEnabled", 150);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 151); return this._isEnabled;
		},
		
		/**
		 * @return {boolean} If SignalBinding will only be executed once.
		 */
		isOnce : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "isOnce", 157);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 158); return this._isOnce;
		},
		
		/**
		 * @return {string} String representation of the object.
		 */
		toString : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "toString", 164);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 165); return '[SignalBinding isOnce: '+ this._isOnce +', isEnabled: '+ this._isEnabled +']';
		}
		
	};

	/**
	 * Custom event broadcaster
	 * <br />- inspired by Robert Penner's AS3 Signals.
	 * @author Miller Medeiros
	 * @constructor
	 */
	_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 176); signals.Signal = function(){
		/**
		 * @type Array.<SignalBinding>
		 * @private
		 */
		_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "Signal", 176);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 181); this._bindings = [];
	};
	
	
	_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 185); signals.Signal.prototype = {
		
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
			
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "_registerListener", 206);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 208); if(typeof listener !== 'function'){
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 209); throw new Error('listener is a required param of add() and addOnce().');
			}
			
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 212); var prevIndex = this._indexOfListener(listener),
				binding;
			
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 215); if(prevIndex !== -1){ //avoid creating a new Binding for same listener if already added to list
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 216); binding = this._bindings[prevIndex];
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 217); if(binding.isOnce() !== isOnce){
					_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 218); throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');
				}
			} else {
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 221); binding = new SignalBinding(this, listener, isOnce, scope);
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 222); this._addBinding(binding);
			}
			
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 225); return binding;
		},
		
		/**
		 * @param {SignalBinding} binding
		 * @private
		 */
		_addBinding : function(binding){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "_addBinding", 232);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 233); this._bindings.push(binding);
		},
		
		/**
		 * @param {Function} listener
		 * @return {number}
		 * @private
		 */
		_indexOfListener : function(listener){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "_indexOfListener", 241);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 242); var n = this._bindings.length;
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 243); while(n--){
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 244); if(this._bindings[n]._listener === listener){
					_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 245); return n;
				}
			}
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 248); return -1;
		},
		
		/**
		 * Add a listener to the signal.
		 * @param {Function} listener	Signal handler function.
		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.
		 */
		add : function(listener, scope){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "add", 257);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 258); return this._registerListener(listener, false, scope);
		},
		
		/**
		 * Add listener to the signal that should be removed after first execution (will be executed only once).
		 * @param {Function} listener	Signal handler function.
		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.
		 */
		addOnce : function(listener, scope){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "addOnce", 267);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 268); return this._registerListener(listener, true, scope);
		},
		
		/**
		 * @private
		 */
		_removeByIndex : function(i){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "_removeByIndex", 274);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 275); this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 276); this._bindings.splice(i, 1);
		},
		
		/**
		 * Remove a single listener from the dispatch queue.
		 * @param {Function} listener	Handler function that should be removed.
		 * @return {Function} Listener handler function.
		 */
		remove : function(listener){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "remove", 284);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 285); if(typeof listener !== 'function'){
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 286); throw new Error('listener is a required param of remove().');
			}
			
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 289); var i = this._indexOfListener(listener);
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 290); if(i !== -1){
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 291); this._removeByIndex(i);
			}
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 293); return listener;
		},
		
		/**
		 * Remove all listeners from the Signal.
		 */
		removeAll : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "removeAll", 299);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 300); var n = this._bindings.length;
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 301); while(n--){
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 302); this._removeByIndex(n);
			}
		},
		
		/**
		 * @return {number} Number of listeners attached to the Signal.
		 */
		getNumListeners : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "getNumListeners", 309);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 310); return this._bindings.length;
		},
		
		/**
		 * Disable Signal. Block dispatch to listeners until `enable()` is called.
		 * <p><strong>IMPORTANT:</strong> If this method is called during a dispatch it will only have effect on the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
		 * @see signals.Signal.prototype.enable
		 * @see signals.Signal.prototype.halt
		 */
		disable : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "disable", 319);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 320); this._isEnabled = false;
		},
		
		/**
		 * Enable broadcast to listeners.
		 * @see signals.Signal.prototype.disable
		 */
		enable : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "enable", 327);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 328); this._isEnabled = true;
		}, 
		
		/**
		 * @return {boolean} If Signal is currently enabled and will broadcast message to listeners.
		 */
		isEnabled : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "isEnabled", 334);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 335); return this._isEnabled;
		},
		
		/**
		 * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
		 * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
		 * @see signals.Signal.prototype.disable 
		 */
		halt : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "halt", 343);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 344); this._shouldPropagate = false;
		},
		
		/**
		 * Dispatch/Broadcast Signal to all listeners added to the queue. 
		 * @param {...*} [params]	Parameters that should be passed to each handler.
		 */
		dispatch : function(params){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "dispatch", 351);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 352); if(! this._isEnabled){
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 353); return;
			}
			
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 356); var paramsArr = Array.prototype.slice.call(arguments),
				bindings = this._bindings.slice(), //clone array in case add/remove items during dispatch
				i,
				n = this._bindings.length;
			
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 361); this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.
						
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 363); for(i=0; i<n; i++){
				//execute all callbacks until end of the list or until a callback returns `false` or stops propagation
				_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 365); if(bindings[i].execute(paramsArr) === false || !this._shouldPropagate){
					_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 366); break;
				}
			}
		},
		
		/**
		 * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
		 * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
		 */
		dispose : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "dispose", 375);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 376); this.removeAll();
			_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 377); delete this._bindings;
		},
		
		/**
		 * @return {string} String representation of the object.
		 */
		toString : function(){
			_yuitest_coverfunc("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", "toString", 383);
_yuitest_coverline("/Users/millermedeiros/Documents/Projects/_open_source/js-signals/dist/js-signals.js", 384); return '[Signal isEnabled: '+ this._isEnabled +' numListeners: '+ this.getNumListeners() +']';
		}
		
	};
}(this));
