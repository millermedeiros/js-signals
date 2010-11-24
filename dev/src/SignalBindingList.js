	
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
