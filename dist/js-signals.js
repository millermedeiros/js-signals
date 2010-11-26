/*!
 * JS Signals <https://github.com/millermedeiros/js-signals>
 * Released under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 * @author Miller Medeiros <http://millermedeiros.com>
 * @version 0.0.2
 * @build 45 11/26/2010 05:05 PM
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
		
		_shouldPropagate : true,
		
		_isPaused : false,
		
		_registerListener : function _registerListener(listener, isOnce, scope){
			var prevIndex = this._indexOfListener(listener),
				binding;
			
			if(prevIndex !== -1){ //avoid creating a new Binding for same listener if already added to list
				binding = this._bindings[prevIndex];
				
				if(binding.isOnce() && !isOnce){
					throw new Error('You cannot addOnce() then add() the same listener without removing the relationship first.');
				}else if(!binding.isOnce() && isOnce){
					throw new Error('You cannot add() then addOnce() the same listener without removing the relationship first.');
				}
				
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
		
		add : function add(listener, scope){
			return this._registerListener(listener, false, scope);
		},
		
		addOnce : function addOnce(listener, scope){
			return this._registerListener(listener, true, scope);
		},
		
		remove : function remove(listener){
			var i = this._indexOfListener(listener);
			if(i !== -1){
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
		
		pause : function pause(){
			this._isPaused = true;
		},
		
		resume : function resume(){
			this._isPaused = false;
		},
		
		isPaused : function isPaused(){
			return this._isPaused;
		},
		
		stopPropagation : function stopPropagation(){
			this._shouldPropagate = false;
		},
		
		dispatch : function dispatch(params){
			if(this._isPaused) return;
			
			var paramsArr = Array.prototype.slice.call(arguments),
				bindings = this._bindings.slice(), //clone array in case add/remove items during dispatch
				i = 0,
				cur;
				
			while(cur = bindings[i++]){
				if(cur.execute(paramsArr) === false || !this._shouldPropagate) break; //execute all callbacks until end of the list or until a callback returns `false`
			}
			
			this._shouldPropagate = true;
		},
		
		toString : function toString(){
			return '[Signal isPaused: '+ this._isPaused +' numListeners: '+ this.getNumListeners() +']';
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
}());
