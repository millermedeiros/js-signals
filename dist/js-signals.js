/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */

/*!!
 * JS Signals <http://millermedeiros.github.com/js-signals/>
 * Released under the MIT license <http://www.opensource.org/licenses/mit-license.php>
 * @author Miller Medeiros <http://millermedeiros.com/>
 * @version 0.5.1
 * @build 137 (02/18/2011 07:12 PM)
 */
var signals = (function(){

	/**
	 * @namespace Signals Namespace - Custom event/messaging system based on AS3 Signals
	 * @name signals
	 */
	var signals = {};

	/**
	 * Signals Version Number
	 * @type string
	 * @const
	 */
	signals.VERSION = '0.5.1';

	
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
	 function SignalBinding(signal, listener, isOnce, listenerContext){
		
		/**
		 * Handler function bound to the signal.
		 * @type Function
		 * @private
		 */
		this._listener = listener;
		
		/**
		 * If binding should be executed just once.
		 * @type boolean
		 * @private
		 */
		this._isOnce = isOnce;
		
		/**
		 * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @memberOf signals.SignalBinding.prototype
		 * @name context
		 * @type {Object|undefined}
		 */
		this.context = listenerContext;
		
		/**
		 * Reference to Signal object that listener is currently bound to.
		 * @type signals.Signal
		 * @private
		 */
		this._signal = signal;
	}
	
	SignalBinding.prototype = /** @lends signals.SignalBinding.prototype */ {
		
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
			var r;
			if(this._isEnabled){
				r = this._listener.apply(this.context, paramsArr);
				if(this._isOnce){
					this.detach();
				}
			}
			return r; //avoid warnings on some editors
		},
		
		/**
		 * Detach binding from signal.
		 * - alias to: mySignal.remove(myBinding.getListener());
		 * @return {Function} Handler function bound to the signal.
		 */
		detach : function(){
			return this._signal.remove(this._listener);
		},
		
		/**
		 * @return {Function} Handler function bound to the signal.
		 */
		getListener : function(){
			return this._listener;
		},
		
		/**
		 * Remove binding from signal and destroy any reference to external Objects (destroy SignalBinding object).
		 * <p><strong>IMPORTANT:</strong> calling methods on the binding instance after calling dispose will throw errors.</p>
		 */
		dispose : function(){
			this.detach();
			this._destroy();
		},
		
		/**
		 * Delete all instance properties
		 * @private
		 */
		_destroy : function(){
			delete this._signal;
			delete this._isOnce;
			delete this._listener;
			delete this.context;
		},
		
		/**
		 * Disable SignalBinding, block listener execution. Listener will only be executed after calling `enable()`.  
		 * @see signals.SignalBinding.enable()
		 */
		disable : function(){
			this._isEnabled = false;
		},
		
		/**
		 * Enable SignalBinding. Enable listener execution.
		 * @see signals.SignalBinding.disable()
		 */
		enable : function(){
			this._isEnabled = true;
		},
		
		/**
		 * @return {boolean} If SignalBinding is currently paused and won't execute listener during dispatch.
		 */
		isEnabled : function(){
			return this._isEnabled;
		},
		
		/**
		 * @return {boolean} If SignalBinding will only be executed once.
		 */
		isOnce : function(){
			return this._isOnce;
		},
		
		/**
		 * @return {string} String representation of the object.
		 */
		toString : function(){
			return '[SignalBinding isOnce: '+ this._isOnce +', isEnabled: '+ this._isEnabled +']';
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
	signals.Signal = function(){
		/**
		 * @type Array.<SignalBinding>
		 * @private
		 */
		this._bindings = [];
	};
	
	signals.Signal.prototype = {
		
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
			
			if(typeof listener !== 'function'){
				throw new Error('listener is a required param of add() and addOnce() and should be a Function.');
			}
			
			var prevIndex = this._indexOfListener(listener),
				binding;
			
			if(prevIndex !== -1){ //avoid creating a new Binding for same listener if already added to list
				binding = this._bindings[prevIndex];
				if(binding.isOnce() !== isOnce){
					throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');
				}
			} else {
				binding = new SignalBinding(this, listener, isOnce, scope);
				this._bindings.push(binding);
			}
			
			return binding;
		},
		
		/**
		 * @param {Function} listener
		 * @return {number}
		 * @private
		 */
		_indexOfListener : function(listener){
			var n = this._bindings.length;
			while(n--){
				if(this._bindings[n]._listener === listener){
					return n;
				}
			}
			return -1;
		},
		
		/**
		 * Add a listener to the signal.
		 * @param {Function} listener	Signal handler function.
		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.
		 */
		add : function(listener, scope){
			return this._registerListener(listener, false, scope);
		},
		
		/**
		 * Add listener to the signal that should be removed after first execution (will be executed only once).
		 * @param {Function} listener	Signal handler function.
		 * @param {Object} [scope]	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @return {SignalBinding} An Object representing the binding between the Signal and listener.
		 */
		addOnce : function(listener, scope){
			return this._registerListener(listener, true, scope);
		},
		
		/**
		 * Remove a single listener from the dispatch queue.
		 * @param {Function} listener	Handler function that should be removed.
		 * @return {Function} Listener handler function.
		 */
		remove : function(listener){
			if(typeof listener !== 'function'){
				throw new Error('listener is a required param of remove() and should be a Function.');
			}
			
			var i = this._indexOfListener(listener);
			if(i !== -1){
				this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
				this._bindings.splice(i, 1);
			}
			return listener;
		},
		
		/**
		 * Remove all listeners from the Signal.
		 */
		removeAll : function(){
			var n = this._bindings.length;
			while(n--){
				this._bindings[n]._destroy();
			}
			this._bindings.length = 0;
		},
		
		/**
		 * @return {number} Number of listeners attached to the Signal.
		 */
		getNumListeners : function(){
			return this._bindings.length;
		},
		
		/**
		 * Disable Signal. Block dispatch to listeners until `enable()` is called.
		 * <p><strong>IMPORTANT:</strong> If this method is called during a dispatch it will only have effect on the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
		 * @see signals.Signal.prototype.enable
		 * @see signals.Signal.prototype.halt
		 */
		disable : function(){
			this._isEnabled = false;
		},
		
		/**
		 * Enable broadcast to listeners.
		 * @see signals.Signal.prototype.disable
		 */
		enable : function(){
			this._isEnabled = true;
		}, 
		
		/**
		 * @return {boolean} If Signal is currently enabled and will broadcast message to listeners.
		 */
		isEnabled : function(){
			return this._isEnabled;
		},
		
		/**
		 * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
		 * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
		 * @see signals.Signal.prototype.disable 
		 */
		halt : function(){
			this._shouldPropagate = false;
		},
		
		/**
		 * Dispatch/Broadcast Signal to all listeners added to the queue. 
		 * @param {...*} [params]	Parameters that should be passed to each handler.
		 */
		dispatch : function(params){
			if(! this._isEnabled){
				return;
			}
			
			var paramsArr = Array.prototype.slice.call(arguments),
				bindings = this._bindings.slice(), //clone array in case add/remove items during dispatch
				i,
				n = this._bindings.length;
			
			this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.
						
			for(i=0; i<n; i++){
				//execute all callbacks until end of the list or until a callback returns `false` or stops propagation
				if(bindings[i].execute(paramsArr) === false || !this._shouldPropagate){
					break;
				}
			}
		},
		
		/**
		 * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
		 * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
		 */
		dispose : function(){
			this.removeAll();
			delete this._bindings;
		},
		
		/**
		 * @return {string} String representation of the object.
		 */
		toString : function(){
			return '[Signal isEnabled: '+ this._isEnabled +' numListeners: '+ this.getNumListeners() +']';
		}
		
	};

	return signals;
	
}());