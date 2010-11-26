	
	/**
	 * Class that represents a Signal Binding.
	 * <br />- Constructor probably won't need to be called by end-user.
	 * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
	 * @author Miller Medeiros
	 * @constructor
	 * @param {Function} listener	Handler function binded to the signal.
	 * @param {boolean} isOnce	If binding should be executed just once.
	 * @param {Object} listenerScope	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	 * @param {signals.Signal} signal	Reference to Signal object that listener is currently binded to.
	 */
	signals.SignalBinding = function SignalBinding(listener, isOnce, listenerScope, signal){
		
		/**
		 * Handler function binded to the signal.
		 * @type Function
		 */
		this.listener = listener;
		
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
		this.listenerScope = listenerScope;
		
		/**
		 * Reference to Signal object that listener is currently binded to.
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
		_isPaused : false,
		
		/**
		 * Call listener passing arbitrary parameters.
		 * @param {Array} paramsArr	Array of parameters that should be passed to the listener
		 * @return {*} Value returned by the listener.
		 */
		execute : function execute(paramsArr){
			if(! this._isPaused){
				if(this._isOnce) this._signal.remove(this.listener);
				return this.listener.apply(this.listenerScope, paramsArr);
			}
		},
		
		/**
		 * Pause SignalBinding, block listener execution. Listener will only be executed after calling `resume()`.  
		 * @see signals.SignalBinding.resume()
		 */
		pause : function pause(){
			this._isPaused = true;
		},
		
		/**
		 * Resume SignalBinding, enable listener execution.
		 * @see signals.SignalBinding.pause()
		 */
		resume : function resume(){
			this._isPaused = false;
		},
		
		/**
		 * @return {boolean} If SignalBinding is currently paused and won't execute listener during dispatch.
		 */
		isPaused : function isPaused(){
			return this._isPaused;
		},
		
		/**
		 * @return {boolean} If SignalBinding will only be executed once.
		 */
		isOnce : function isOnce(){
			return this._isOnce;
		},
		
		/**
		 * @return {string} String representation of the object.
		 */
		toString : function toString(){
			return '[SignalBinding listener: '+ this.listener +', isOnce: '+ this._isOnce +', isPaused: '+ this._isPaused +', listenerScope: '+ this.listenerScope +']';
		}
		
	};
