	
	/**
	 * Object that represents a binding between a Signal and a listener function.
	 * <br />- <strong>Constructor shouldn't be called by regular user, used internally.</strong>
	 * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
	 * @author Miller Medeiros
	 * @constructor
	 * @param {Function} listener	Handler function bound to the signal.
	 * @param {boolean} isOnce	If binding should be executed just once.
	 * @param {?Object} listenerContext	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	 * @param {signals.Signal} signal	Reference to Signal object that listener is currently bound to.
	 */
	signals.SignalBinding = function(listener, isOnce, listenerContext, signal){
		
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
		 * @type Object
		 */
		this.context = listenerContext;
		
		/**
		 * Reference to Signal object that listener is currently bound to.
		 * @type signals.Signal
		 * @private
		 */
		this._signal = signal;
	};
	
	
	signals.SignalBinding.prototype = {
		
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
				if(this._isOnce) this.detach();
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
		 * <br /> - calling methods on the binding instance after calling dispose will throw errors.
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
