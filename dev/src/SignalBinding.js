	
	/**
	 * Class that represents a Signal Binding
	 * - inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
	 * @author Miller Medeiros
	 * @constructor
	 */
	signals.SignalBinding = function SignalBinding(listener, isOnce, listenerScope, signal){
		this.listener = listener;
		this._isOnce = isOnce;
		this._signal = signal;
		this.listenerScope = listenerScope;
	};
	
	
	signals.SignalBinding.prototype = {
		
		_isPaused : false,
		
		execute : function execute(paramsArr){
			if(! this._isPaused){
				if(this._isOnce) this._signal.remove(this.listener);
				return this.listener.apply(this.listenerScope, paramsArr);
			}
		},
		
		pause : function pause(){
			this._isPaused = true;
		},
		
		resume : function resume(){
			this._isPaused = false;
		},
		
		isPaused : function isPaused(){
			return this._isPaused;
		},
		
		isOnce : function isOnce(){
			return this._isOnce;
		},
		
		toString : function toString(){
			return '[SignalBinding listener: '+ this.listener +', isOnce: '+ this._isOnce +', isPaused: '+ this._isPaused +', listenerScope: '+ this.listenerScope +']';
		}
		
	};
