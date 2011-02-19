	
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