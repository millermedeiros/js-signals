/*!
 * JS Signals <https://github.com/millermedeiros/js-signals>
 * Released under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 * @author Miller Medeiros <http://millermedeiros.com>
 * @version 0.0.1
 * @build 14 11/24/2010 01:58 AM
 */
(function(){
	
	/**
	 * @namespace Signals Namespace - Custom event/messaging system based on AS3 Signals
	 */
	var signals = window.signals = {};

	/**
	 * Simple Signal "Class" inpired by Robert Penner's AS3Signals <https://github.com/robertpenner/as3-signals/>
	 * @author Miller Medeiros
	 * @version 0.1 (2010/11/24)
	 * @constructor
	 */
	signals.Signal = function(){
		/** 
		 * Event Handlers
		 * @type signals.BindingList
		 */
		this._bindingList = new signals.SignalBindingList();
	};
	
	
	signals.Signal.prototype = {
		
		_registerListener : function(listener, isOnce, scope){
			var list = this._bindingList,
				prevIndex = list.indexOfListener(listener),
				binding;
			
			if(prevIndex != -1){ //avoid creating a new Binding if already added to list
				//TODO: throw errors based on isOnce
				binding = list[prevIndex];
			} else {
				binding = new signals.SignalBinding(listener, isOnce, scope, this);
				list.add(binding);
			}
			
			return binding;
		},
		
		add : function(listener, scope){
			return this._registerListener(listener, false, scope);
		},
		
		addOnce : function(listener, scope){
			return this._registerListener(listener, true, scope);
		},
		
		remove : function remove(listener){
			this._bindingList.removeByListener(listener);
			return listener;
		},
		
		removeAll : function removeAll(){
			this._bindingList.removeAll();
		},
		
		getNumListeners : function getNumListeners(){
			return this._bindingList.length;
		},
		
		dispatch : function(){
			var params = Array.prototype.slice.call(arguments);
			this._bindingList.execute(params);
		},
		
		toString : function toString(){
			return '[Signal numListeners: '+ this.getNumListeners() +']';
		}
		
	};
	
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
	
	/**
	 * Object representing a Collection of SignalBinds (Pseudo-Array Object).
	 * - name inspired by Joa Ebert AS3 SignalBindingList but with complete different implementation.
	 * @author Miller Medeiros
	 * @constructor
	 * @private
	 * @version 0.1 (2010/11/24)
	 */
	signals.SignalBindingList = function SignalBindingList(){};
	
	
	signals.SignalBindingList.prototype = {
		
		length : 0,
		
		add : function add(binding){
			Array.prototype.push.call(this, binding);
		},
		
		execute : function execute(paramsArr){
			var i,
				n = this.length;
			for(i = 0; i < n; i++){
				this[i].execute(paramsArr);
			}
		},
		
		indexOfListener : function indexOfListener(listener){
			var n = this.length;
			while(n--){
				if(this[n].listener === listener) return n;
			}
			return -1;
		},
		
		removeByListener : function removeByListener(listener){
			var i = this.indexOfListener(listener);
			if(i != -1){
				delete this[i];
				this.length--;
			}
		},
		
		removeAll : function removeAll(){
			while(this.length--){
				delete this[this.length];
			}
		}
		
	};
}());
