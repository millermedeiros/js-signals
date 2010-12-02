
	/**
	 * Signal - custom event broadcaster inpired by Robert Penner's AS3Signals <https://github.com/robertpenner/as3-signals/>
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
		 * @param {Object} scope
		 * @return {signals.SignalBinding}
		 * @private
		 */
		_registerListener : function(listener, isOnce, scope){
			var prevIndex = this._indexOfListener(listener),
				binding;
			
			if(prevIndex !== -1){ //avoid creating a new Binding for same listener if already added to list
				binding = this._bindings[prevIndex];
				if(binding.isOnce() !== isOnce){
					throw new Error('You cannot '+ (isOnce? 'add()' : 'addOnce()') +' then '+ (!isOnce? 'add()' : 'addOnce()') +' the same listener without removing the relationship first.');
				}
			} else {
				binding = new signals.SignalBinding(listener, isOnce, scope, this);
				this._addBinding(binding);
			}
			
			return binding;
		},
		
		/**
		 * @param {signals.SignalBinding} binding
		 * @private
		 */
		_addBinding : function(binding){
			this._bindings.push(binding);
		},
		
		/**
		 * @param {Function} listener
		 * @return {int}
		 * @private
		 */
		_indexOfListener : function(listener){
			var n = this._bindings.length;
			while(n--){
				if(this._bindings[n].listener === listener) return n;
			}
			return -1;
		},
		
		/**
		 * Add a listener to the signal.
		 * @param {Function} listener	Signal handler function.
		 * @param {Object} scope	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @return {signals.SignalBinding} An Object representing the binding between the Signal and listener.
		 */
		add : function(listener, scope){
			return this._registerListener(listener, false, scope);
		},
		
		/**
		 * Add listener to the signal that should be removed after first execution (will be executed only once).
		 * @param {Function} listener	Signal handler function.
		 * @param {Object} scope	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @return {signals.SignalBinding} An Object representing the binding between the Signal and listener.
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
			var i = this._indexOfListener(listener);
			if(i !== -1){
				this._bindings.splice(i, 1);
			}
			return listener;
		},
		
		/**
		 * Remove all listeners from the Signal.
		 */
		removeAll : function(){
			this._bindings.length = 0;
		},
		
		/**
		 * @return {uint} Number of listeners attached to the Signal.
		 */
		getNumListeners : function(){
			return this._bindings.length;
		},
		
		/**
		 * Disable Signal, will block dispatch to listeners until `enable()` is called.
		 * @see signals.Signal.prototype.enable
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
		 * - should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast. 
		 */
		halt : function(){
			this._shouldPropagate = false;
		},
		
		/**
		 * Dispatch/Broadcast Signal to all listeners added to the queue. 
		 * @param {...*} params	Parameters that should be passed to each handler.
		 */
		dispatch : function(params){
			if(! this._isEnabled) return;
			
			var paramsArr = Array.prototype.slice.call(arguments),
				bindings = this._bindings.slice(), //clone array in case add/remove items during dispatch
				i = 0,
				cur;
			
			this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.
						
			while(cur = bindings[i++]){
				if(cur.execute(paramsArr) === false || !this._shouldPropagate) break; //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
			}
		},
		
		/**
		 * @return {string} String representation of the object.
		 */
		toString : function(){
			return '[Signal isEnabled: '+ this._isEnabled +' numListeners: '+ this.getNumListeners() +']';
		}
		
	};