	
	/**
	 * Class that represents a Signal Binding
	 * - inspired on Joa Ebert AS3 Signal Binding and Robert Penner's Slot
	 * @author Miller Medeiros
	 * @version 0.1 (2010/11/24)
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
				if(this._isOnce) this.remove();
				this.listener.apply(this.listenerScope, paramsArr);
			}
		},
		
		pause : function pause(){
			this._isPaused = true;
		},
		
		resume : function resume(){
			this._isPaused = false;
		},
		
		isPaused : function isPaused(){
			return this._paused;
		},
		
		isOnce : function isOnce(){
			return this._isOnce;
		},
		
		remove : function remove(){
			this._signal.remove(this.listener);
		},
		
		toString : function toString(){
			return '[SignalBinding listener: '+ this.listener +', isOnce: '+ this._isOnce +', isPaused: '+ this._isPaused +', listenerScope: '+ this.listenerScope +']';
		}
		
	};
