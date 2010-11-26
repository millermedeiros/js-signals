/*!
 * JS Signals <https://github.com/millermedeiros/js-signals>
 * Released under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 * @author Miller Medeiros <http://millermedeiros.com>
 * @version 0.0.1
 * @build 29 11/26/2010 03:47 AM
 */
(function(){
	
	/**
	 * @namespace Signals Namespace - Custom event/messaging system based on AS3 Signals
	 */
	var signals = window.signals = {};

	/**
	 * Simple Signal "Class" inpired by Robert Penner's AS3Signals <https://github.com/robertpenner/as3-signals/>
	 * @author Miller Medeiros
	 * @constructor
	 */
	signals.Signal = function(){
		/** 
		 * Event Handlers
		 * @type Array.<SignalBinding>
		 * @private
		 */
		this._bindings = [];
	};
	
	
	signals.Signal.prototype = {
		
		_registerListener : function(listener, isOnce, scope){
			var prevBinding,
				prevIndex = this._indexOfListener(listener),
				binding;
			
			if(prevIndex != -1){ //avoid creating a new Binding if already added to list
				prevBinding = this._bindings[prevIndex];
				
				if(prevBinding.isOnce() && !isOnce){
					throw new Error('You cannot addOnce() then add() the same listener without removing the relationship first.');
				}else if(!prevBinding.isOnce() && isOnce){
					throw new Error('You cannot add() then addOnce() the same listener without removing the relationship first.');
				}
				
				binding = prevBinding;
			} else {
				binding = new signals.SignalBinding(listener, isOnce, scope, this);
				this._bindings.push(binding);
			}
			
			return binding;
		},
		
		_indexOfListener : function _indexOfListener(listener){
			var n = this._bindings.length;
			while(n--){
				if(this._bindings[n].listener === listener) return n;
			}
			return -1;
		},
		
		add : function(listener, scope){
			return this._registerListener(listener, false, scope);
		},
		
		addOnce : function(listener, scope){
			return this._registerListener(listener, true, scope);
		},
		
		remove : function remove(listener){
			var i = this._indexOfListener(listener);
			if(i != -1){
				this._bindings.splice(i, 1);
			}
			return listener;
		},
		
		removeAll : function removeAll(){
			this._bindings.length = 0;
		},
		
		getNumListeners : function getNumListeners(){
			return this._bindings.length;
		},
		
		dispatch : function(){
			var paramsArr = Array.prototype.slice.call(arguments),
				i = 0,
				bindings = this._bindings.slice(), //clone array in case add/remove items during dispatch
				cur;
			while(cur = bindings[i++]){
				cur.execute(paramsArr);
			}
			
		},
		
		toString : function toString(){
			return '[Signal numListeners: '+ this.getNumListeners() +']';
		}
		
	};
	
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
		
		toString : function toString(){
			return '[SignalBinding listener: '+ this.listener +', isOnce: '+ this._isOnce +', isPaused: '+ this._isPaused +', listenerScope: '+ this.listenerScope +']';
		}
		
	};
}());
