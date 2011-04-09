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
	 function SignalBinding(signal, listener, isOnce, listenerContext, priority){
		
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
		 * @type Object|undefined|null
		 */
		this.context = listenerContext;
		
		/**
		 * Reference to Signal object that listener is currently bound to.
		 * @type signals.Signal
		 * @private
		 */
		this._signal = signal;
		
		/**
		 * Listener priority
		 * @type Number
		 * @private
		 */
		this._priority = priority || 0;
	}
	
	SignalBinding.prototype = /** @lends signals.SignalBinding.prototype */ {
		
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
			var r;
			if(this.active){
				r = this._listener.apply(this.context, paramsArr);
				if(this._isOnce){
					this.detach();
				}
			}
			return r;
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
		 * @return {boolean} If SignalBinding will only be executed once.
		 */
		isOnce : function(){
			return this._isOnce;
		},
		
		/**
		 * @return {string} String representation of the object.
		 */
		toString : function(){
			return '[SignalBinding isOnce: '+ this._isOnce +', active: '+ this.active +']';
		}
		
	};