
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