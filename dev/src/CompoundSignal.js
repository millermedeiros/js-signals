/*global signals:false, SignalBinding:false, inheritPrototype:false*/

    // CompoundSignal ---------------------------------------------------
    //================================================================

    (function(){

        var _signalProto = signals.Signal.prototype,
            _compoundProto = new signals.Signal();

        function slice(arr, offset){
            return Array.prototype.slice.call(arr, offset || 0);
        }

        // --

        /**
         * CompoundSignal works like a group of signals which should be
         * dispatched automatically after all the signals contained by the
         * group are dispatched. Arguments are passed to listeners as Arrays on
         * the same order as the signals were passed on the constructor.
         * <br><br>
         * If you are familiar with Promise/Deferred think of it as Promise
         * which will be resolved after all the signals on the group are
         * dispatched.
         * @name signals.CompoundSignal
         * @param {...signal.Signal} signals Signals that should be grouped.
         * @constructor
         * @extends signals.Signal
         */
        function CompoundSignal(params){
            signals.Signal.call(this);

            var sigs = slice(arguments),
                n = sigs.length,
                binding;

            while(n--){
                binding = sigs[n].add(this._registerDispatch, this);
                binding.params = [n]; //use index to register params..
            }

            this._signals = sigs;
            this._params = [];
            this._resolved = false;
        }

        CompoundSignal.prototype = _compoundProto;
        CompoundSignal.prototype.constructor = CompoundSignal;

        /**
         * Sets if multiple dispatches of same signal should override
         * previously registered parameters. Default value is `false`.
         * @name signals.CompoundSignal.prototype.override
         * @type boolean
         */
        _compoundProto.override = false;

        /**
         * If `true` CompoundSignal will act like a "Promise", after first
         * dispatch, subsequent dispatches will always pass same arguments. It
         * will also remove all the listeners automatically after dispatch.
         * Default value is `true`.
         * @name signals.CompoundSignal.prototype.unique
         * @type boolean
         */
        _compoundProto.unique = true;

        /**
         * If `true` it will store a reference to previously dispatched
         * arguments and will automatically execute callbacks during
         * `add()`/`addOnce()` (similar to a "Promise"). Default value
         * is `true`.
         * @name signals.CompoundSignal.prototype.memorize
         * @type boolean
         */
        _compoundProto.memorize = true;

        _compoundProto._registerDispatch = function(idx, args){

            if(!this._params[idx] || this.override){
                this._params[idx] = slice(arguments, 1);
            }

            if( this._registeredAll() && (!this._resolved || !this.unique)){
                this.dispatch.apply(this, this._params);
            }
        };

        _compoundProto._registeredAll = function(){
            if(this._params.length !== this._signals.length){
                return false;
            } else {
                //check if any item is undefined, dispatched signals will
                //store an empty array if no param passed on dispatch..
                for(var i = 0, n = this._params.length; i < n; i += 1){
                    if(! this._params[i]){
                        return false;
                    }
                }
                return true;
            }
        };

        /**
         * Works similar to a regular Signal `dispatch()` method but if
         * CompoundSignal was already "resolved" and it is `unique`, it will
         * always dispatch the same arguments, no mather which parameters are
         * passed to the `dispatch` method.
         * @name signals.CompoundSignal.prototype.dispatch
         * @function
         * @see signals.Signal.dispatch
         * @see signals.CompoundSignal.unique
         */
        _compoundProto.dispatch = function(params){

            //if unique it should always dispatch same parameters
            //will act like a promise...
            params = (this._resolved && this.unique)? this._params : slice(arguments);
            this._resolved = true;

            _signalProto.dispatch.apply(this, params);

            if(this.unique){
                this.removeAll();
            } else {
                this.reset();
            }
        };

        /**
         * Restore CompoundSignal to it's original state. Will consider as if
         * no signals was dispatched yet and will mark CompoundSignal as
         * unresolved.
         * @name signals.CompoundSignal.prototype.reset
         * @function
         */
        _compoundProto.reset = function(){
            this._params.length = 0;
            this._resolved = false;
        };

        /**
         * Check if CompoundSignal did resolved.
         * @name signals.CompoundSignal.prototype.isResolved
         * @function
         * @return {boolean} if CompoundSignal is resolved.
         */
        _compoundProto.isResolved = function(){
            return this._resolved;
        };

        _compoundProto.dispose = function(){
            _signalProto.dispose.call(this);
            delete this._signals;
            delete this._params;
        };

        _compoundProto.toString = function(){
            return '[CompoundSignal active:'+ this.active +' numListeners:'+ this.getNumListeners() +']';
        };

        //expose
        signals.CompoundSignal = CompoundSignal;

    }());
