YUI().use('node', 'console', 'test', function (Y){
	
	//==============================================================================
	// BASIC TEST ------------------------------------------------------------------
	
	var basic = new Y.Test.Case({
	
		//name of the test case - if not provided, one is auto-generated
		name : "Basic Test",
		
		//---------------------------------------------------------------------
		// Special instructions
		//---------------------------------------------------------------------
		
		_should: {
			ignore: {},
			error : {
				testAddNull : 'listener is a required param of add() and addOnce() and should be a Function.',
				testAddOnceNull : 'listener is a required param of add() and addOnce() and should be a Function.',
				testAddSameListenerMixed1 : 'You cannot add() then addOnce() the same listener without removing the relationship first.',
				testAddSameListenerMixed2 : 'You cannot addOnce() then add() the same listener without removing the relationship first.',
				testRemoveNull : 'listener is a required param of remove() and should be a Function.',
				testDispose1 : true,
				testDispose2 : true,
				testDispose3 : true,
				testDispose4 : true
			}
		},
		
		//---------------------------------------------------------------------
		// setUp and tearDown
		//---------------------------------------------------------------------
		
		/*
		 * Sets up data that is needed by each test.
		 */
		setUp : function(){
			this.signal = new signals.Signal();
		},
		
		/*
		 * Cleans up everything that was created by setUp().
		 */
		tearDown : function(){
			delete this.signal;
		},
		
		//---------------------------------------------------------------------
		// Test methods - names must begin with "test"
		//---------------------------------------------------------------------
		
		testSignalType : function(){			
			var s = this.signal;
			
			Y.Assert.isObject(s);
			Y.Assert.isInstanceOf(signals.Signal, s);
		},
		
		testNumListeners0 : function(){
			var s = this.signal;
			
			Y.Assert.areSame(0, s.getNumListeners());
		},
		
		//-------------------------- Add ---------------------------------------//
		
		testAddSingle : function(){
			var s = this.signal;
			
			s.add(function(){});

			Y.Assert.areSame(1, s.getNumListeners());
		},
		
		testAddDouble : function(){
			var s = this.signal;
			
			s.add(function(){});
			s.add(function(){});
			
			Y.Assert.areSame(2, s.getNumListeners());
		},
		
		testAddDoubleSameListener : function(){
			var s = this.signal;
			
			var l = function(){};
			
			s.add(l);
			s.add(l); //shouldn't add same listener twice
			
			Y.Assert.areSame(1, s.getNumListeners());
		},
		
		testAddNull : function(){
			var s = this.signal;
			
			s.add(); //should throw error
			Y.Assert.areSame(0, s.getNumListeners());
		},
		
		//--------------------------- Add Once ---------------------------------//
		
		testAddOnce : function(){
			var s = this.signal;
			
			s.addOnce(function(){});
			Y.Assert.areSame(1, s.getNumListeners());
		},
		
		testAddOnceDouble : function(){
			var s = this.signal;
			
			s.addOnce(function(){});
			s.addOnce(function(){});
			Y.Assert.areSame(2, s.getNumListeners());
		},
		
		testAddOnceSameDouble : function(){
			var s = this.signal;
			
			var l = function(){};
			s.addOnce(l);
			s.addOnce(l);
			Y.Assert.areSame(1, s.getNumListeners());
		},
		
		testAddOnceNull : function(){
			var s = this.signal;
			
			s.addOnce(); //should throw error
			Y.Assert.areSame(0, s.getNumListeners());
		},
		
		//--------------------------- Add Mixed ---------------------------------//
		
		testAddSameListenerMixed1 : function(){
			var s = this.signal;
			var l = function(){};
			s.add(l);
			s.addOnce(l); //should throw error
		},
		
		testAddSameListenerMixed2 : function(){
			var s = this.signal;
			var l = function(){};
			s.addOnce(l);
			s.add(l); //should throw error
		},
		
		//----------------------- Dispatch -------------------------------------//
		
		testDispatchSingleListener : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(){n++};
			
			s.add(l1);
			s.dispatch();
			
			Y.Assert.areSame(1, n);
		},
		
		testDispatchDoubleListeners : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(){n++};
			var l2 = function(){n++};
			
			s.add(l1);
			s.add(l2);
			s.dispatch();
			
			Y.Assert.areSame(2, n);
		},
		
		testDispatchDoubleListeners2 : function(){
			var s = this.signal;
			
			var str = '';
			var l1 = function(){str += 'a'};
			var l2 = function(){str += 'b'};
			
			s.add(l1);
			s.add(l2);
			s.dispatch();
			//ensure dispatch happened on proper order
			Y.Assert.areSame('ab', str);
		},
		
		testDispatchMultipleListenersPriority : function(){
			var s = this.signal;
			
			var str = '';
			var l1 = function(){str += 'a'};
			var l2 = function(){str += 'b'};
			var l3 = function(){str += 'c'};
			
			s.add(l1);
			s.add(l2, null, 1);
			s.add(l3);
			s.dispatch();
			//ensure dispatch happened on proper order
			Y.Assert.areSame('bac', str);
		},
		
		testDispatchMultipleListenersPriority2 : function(){
			var s = this.signal;
			
			var str = '';
			var l1 = function(){str += 'a'};
			var l2 = function(){str += 'b'};
			var l3 = function(){str += 'c'};
			
			s.add(l1, null, 1);
			s.add(l2, null, 12);
			s.add(l3, null, 2);
			s.dispatch();
			//ensure dispatch happened on proper order
			Y.Assert.areSame('bca', str);
		},
		
		testDispatchSingleListenerTwice : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(){n++};
			
			s.add(l1);
			s.dispatch();
			s.dispatch();
			
			Y.Assert.areSame(2, n);
		},
		
		testDispatchDoubleListenersTwice : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(){n++};
			var l2 = function(){n++};
			
			s.add(l1);
			s.add(l2);
			s.dispatch();
			s.dispatch();
			
			Y.Assert.areSame(4, n);
		},
		
		testDispatchScope : function(){
			var s = this.signal;
			
			var scope = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			var l1 = function(){this.sum()};
			
			s.add(l1, scope);
			s.dispatch();
			
			Y.Assert.areSame(1, scope.n);
		},
		
		testDispatchScopeDouble : function(){
			var s = this.signal;
			
			var scope = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			
			var l1 = function(){this.sum()};
			var l2 = function(){this.sum()};
			
			s.add(l1, scope);
			s.add(l2, scope);
			s.dispatch();
			
			Y.Assert.areSame(2, scope.n);
		},
		
		testDispatchScopeDouble2 : function(){
			var s = this.signal;
			
			var scope1 = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			
			var scope2 = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			
			var l1 = function(){this.sum()};
			var l2 = function(){this.sum()};
			
			s.add(l1, scope1);
			s.add(l2, scope2);
			s.dispatch();
			
			Y.Assert.areSame(1, scope1.n);
			Y.Assert.areSame(1, scope2.n);
		},
		
		testDispatchScopeTwice : function(){
			var s = this.signal;
			
			var scope = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			var l1 = function(){this.sum()};
			
			s.add(l1, scope);
			s.dispatch();
			s.dispatch();
			
			Y.Assert.areSame(2, scope.n);
		},
		
		testDispatchScopeDoubleTwice : function(){
			var s = this.signal;
			
			var scope = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			
			var l1 = function(){this.sum()};
			var l2 = function(){this.sum()};
			
			s.add(l1, scope);
			s.add(l2, scope);
			s.dispatch();
			s.dispatch();
			
			Y.Assert.areSame(4, scope.n);
		},
		
		testDispatchScopeDouble2Twice : function(){
			var s = this.signal;
			
			var scope1 = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			
			var scope2 = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			
			var l1 = function(){this.sum()};
			var l2 = function(){this.sum()};
			
			s.add(l1, scope1);
			s.add(l2, scope2);
			s.dispatch();
			s.dispatch();
			
			Y.Assert.areSame(2, scope1.n);
			Y.Assert.areSame(2, scope2.n);
		},
		
		
		testDispatchAddOnceSingleListener : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(){n++};
			
			s.addOnce(l1);
			s.dispatch();
			
			Y.Assert.areSame(1, n);
		},
		
		testDispatchAddOnceSingleListenerTwice : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(){n++};
			
			s.addOnce(l1);
			s.dispatch();
			s.dispatch();
			
			Y.Assert.areSame(1, n);
		},
		
		testDispatchAddOnceDoubleListener : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(){n++};
			var l2 = function(){n++};
			
			s.addOnce(l1);
			s.addOnce(l2);
			s.dispatch();
			
			Y.Assert.areSame(2, n);
		},
		
		testDispatchAddOnceDoubleListenerTwice : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(){n++};
			var l2 = function(){n++};
			
			s.addOnce(l1);
			s.addOnce(l2);
			Y.Assert.areSame(2, s.getNumListeners());
			s.dispatch();
			s.dispatch();
			
			Y.Assert.areSame(2, n);
		},
		
		testDispatchAddOnceScope : function(){
			var s = this.signal;
			
			var scope = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			var l1 = function(){this.sum()};
			
			s.addOnce(l1, scope);
			s.dispatch();
			
			Y.Assert.areSame(1, scope.n);
		},
		
		testDispatchAddOnceScopeDouble : function(){
			var s = this.signal;
			
			var scope = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			
			var l1 = function(){this.sum()};
			var l2 = function(){this.sum()};
			
			s.addOnce(l1, scope);
			s.addOnce(l2, scope);
			s.dispatch();
			
			Y.Assert.areSame(2, scope.n);
		},
		
		testDispatchAddOnceScopeDouble2 : function(){
			var s = this.signal;
			
			var scope1 = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			
			var scope2 = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			
			var l1 = function(){this.sum()};
			var l2 = function(){this.sum()};
			
			s.addOnce(l1, scope1);
			s.addOnce(l2, scope2);
			s.dispatch();
			
			Y.Assert.areSame(1, scope1.n);
			Y.Assert.areSame(1, scope2.n);
		},
		
		testDispatchAddOnceScopeTwice : function(){
			var s = this.signal;
			
			var scope = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			var l1 = function(){this.sum()};
			
			s.addOnce(l1, scope);
			s.dispatch();
			s.dispatch();
			
			Y.Assert.areSame(1, scope.n);
		},
		
		testDispatchAddOnceScopeDoubleTwice : function(){
			var s = this.signal;
			
			var scope = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			
			var l1 = function(){this.sum()};
			var l2 = function(){this.sum()};
			
			s.addOnce(l1, scope);
			s.addOnce(l2, scope);
			s.dispatch();
			s.dispatch();
			
			Y.Assert.areSame(2, scope.n);
		},
		
		testDispatchAddOnceScopeDouble2Twice : function(){
			var s = this.signal;
			
			var scope1 = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			
			var scope2 = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			
			var l1 = function(){this.sum()};
			var l2 = function(){this.sum()};
			
			s.addOnce(l1, scope1);
			s.addOnce(l2, scope2);
			s.dispatch();
			s.dispatch();
			
			Y.Assert.areSame(1, scope1.n);
			Y.Assert.areSame(1, scope2.n);
		},
		
		//--------------------- Dispatch with params ------------------------//
		
		testDispatchSingleListenerParams : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(param){n += param};
			
			s.add(l1);
			s.dispatch(1);
			
			Y.Assert.areSame(1, n);
		},
		
		testDispatchDoubleListenersParams : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(param){n += param};
			var l2 = function(param){n += param};
			
			s.add(l1);
			s.add(l2);
			s.dispatch(1);
			
			Y.Assert.areSame(2, n);
		},
		
		testDispatchSingleListenerTwiceParams : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(param1, param2){n += param1 + param2};
			
			s.add(l1);
			s.dispatch(1,2);
			s.dispatch(3,4);
			
			Y.Assert.areSame(10, n);
		},
		
		testDispatchDoubleListenersTwiceParams : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(param1, param2){n += param1 + param2};
			var l2 = function(param1, param2){n += param1 + param2};
			
			s.add(l1);
			s.add(l2);
			s.dispatch(2,2);
			s.dispatch(3,3);
			
			Y.Assert.areSame(20, n);
		},
		
		testDispatchScopeParams : function(){
			var s = this.signal;
			
			var scope = {
				n : 0,
				sum : function(param1,param2,param3){
					this.n = param1 + param2 + param3;
				}
			};
			var l1 = function(param1,param2,param3){this.sum(param1,param2,param3);};
			
			s.add(l1, scope);
			s.dispatch(10,20,5);
			
			Y.Assert.areSame(35, scope.n);
		},
		
		testDispatchAddOnceSingleListenerParams : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(param){n += param};
			
			s.addOnce(l1);
			s.dispatch(1);
			
			Y.Assert.areSame(1, n);
		},
		
		testDispatchAddOnceDoubleListenersParams : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(param){n += param};
			var l2 = function(param){n += param};
			
			s.addOnce(l1);
			s.addOnce(l2);
			s.dispatch(1);
			
			Y.Assert.areSame(2, n);
		},
		
		testDispatchAddOnceSingleListenerTwiceParams : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(param1, param2){n += param1 + param2};
			
			s.addOnce(l1);
			s.dispatch(1,2);
			s.dispatch(3,4);
			
			Y.Assert.areSame(3, n);
		},
		
		testDispatchAddOnceDoubleListenersTwiceParams : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(param1, param2){n += param1 + param2};
			var l2 = function(param1, param2){n += param1 + param2};
			
			s.addOnce(l1);
			s.addOnce(l2);
			s.dispatch(2,2);
			s.dispatch(3,3);
			
			Y.Assert.areSame(8, n);
		},
		
		testDispatchAddOnceScopeParams : function(){
			var s = this.signal;
			
			var scope = {
				n : 0,
				add : function(param1,param2,param3){
					this.n = param1 + param2 + param3;
				}
			};
			var l1 = function(param1,param2,param3){this.add(param1,param2,param3);};
			
			s.addOnce(l1, scope);
			s.dispatch(10,20,5);
			
			Y.Assert.areSame(35, scope.n);
		},
		
		//-------------------- Stop Propagation -----------------------------//
		
		testStopPropagation : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(){n++};
			var l2 = function(){return false};
			var l3 = function(){n++};
			
			s.add(l1);
			s.add(l2);
			s.add(l3);
			s.dispatch();
			
			Y.Assert.areSame(1, n);
		},
		
		testStopPropagation2 : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(){n++};
			var l2 = function(){s.halt()};
			var l3 = function(){n++};
			
			s.add(l1);
			s.add(l2);
			s.add(l3);
			s.dispatch();
			
			Y.Assert.areSame(1, n);
		},
		
		testStopPropagation3 : function(){
			var s = this.signal;
			
			s.halt();
			
			var n = 0;
			var l1 = function(){n++};
			var l2 = function(){n++};
			var l3 = function(){n++};
			
			s.add(l1);
			s.add(l2);
			s.add(l3);
			s.dispatch();
			
			Y.Assert.areSame(3, n);
		},
		
		//--------------------------- Enable/Disable -------------------------------//
		
		testEnableDisableSignal : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(){n++};
			var l2 = function(){n++};
			var l3 = function(){n++};
			
			s.add(l1);
			s.add(l2);
			s.add(l3);
			
			Y.Assert.areSame(true, s.active);
			s.dispatch();
			
			s.active = false;
			Y.Assert.areSame(false, s.active);
			s.dispatch();
			
			s.active = true;
			Y.Assert.areSame(true, s.active);
			s.dispatch();
			
			Y.Assert.areSame(6, n);
		},
		
		testEnableDisableBinding : function(){
			var s = this.signal;
			
			var n = 0;
			var l1 = function(){n++};
			var l2 = function(){n++};
			var l3 = function(){n++};
			
			var b1 = s.add(l1);
			var b2 = s.add(l2);
			var b3 = s.add(l3);
			
			Y.Assert.areSame(true, s.active);
			Y.Assert.areSame(true, b2.active);
			s.dispatch();
			
			b2.active = false;
			Y.Assert.areSame(true, s.active);
			Y.Assert.areSame(false, b2.active);
			s.dispatch();
			
			b2.active = true;
			Y.Assert.areSame(true, s.active);
			Y.Assert.areSame(true, b2.active);
			s.dispatch();
			
			Y.Assert.areSame(8, n);
		},
		
		//------------------------ Bindings ----------------------------------//
		
		testBindingsIsOnce : function(){
			var s = this.signal;
			var b1 = s.addOnce(function(){});
			Y.Assert.areSame(1, s.getNumListeners());
			Y.Assert.areSame(true, b1.isOnce());
		},
		
		testBindingsIsOnce2 : function(){
			var s = this.signal;
			var b1 = s.addOnce(function(){});
			var b2 = s.addOnce(function(){});
			Y.Assert.areSame(2, s.getNumListeners());
			Y.Assert.areSame(true, b1.isOnce());
			Y.Assert.areSame(true, b2.isOnce());
			Y.Assert.areNotSame(b1, b2);
		},
		
		testBindingsIsOnce3 : function(){
			var s = this.signal;
			var l = function(){};
			var b1 = s.addOnce(l);
			var b2 = s.addOnce(l);
			Y.Assert.areSame(1, s.getNumListeners());
			Y.Assert.areSame(true, b1.isOnce());
			Y.Assert.areSame(true, b2.isOnce());
			Y.Assert.areSame(b1, b2);
		},
		
		testBindingsIsNotOnce : function(){
			var s = this.signal;
			var b1 = s.add(function(){});
			Y.Assert.areSame(1, s.getNumListeners());
			Y.Assert.areSame(false, b1.isOnce());
		},
		
		testBindingsIsNotOnce2 : function(){
			var s = this.signal;
			var b1 = s.add(function(){});
			var b2 = s.add(function(){});
			Y.Assert.areSame(2, s.getNumListeners());
			Y.Assert.areSame(false, b1.isOnce());
			Y.Assert.areSame(false, b2.isOnce());
			Y.Assert.areNotSame(b1, b2);
		},
		
		testBindingsIsNotOnce3 : function(){
			var s = this.signal;
			var l = function(){};
			var b1 = s.add(l);
			var b2 = s.add(l);
			Y.Assert.areSame(1, s.getNumListeners());
			Y.Assert.areSame(false, b1.isOnce());
			Y.Assert.areSame(false, b2.isOnce());
			Y.Assert.areSame(b1, b2);
		},
		
		testBindingDetach : function(){
			var s = this.signal;
			var b1 = s.add(function(){
				Y.Assert.fail();
			});
			Y.Assert.areSame(1, s.getNumListeners());
			b1.detach();
			Y.Assert.areSame(0, s.getNumListeners());
			s.dispatch();
		},
		
		testBindingGetListener : function(){
			var s = this.signal;
			var l1 = function(){};
			var b1 = s.add(l1);
			Y.Assert.isUndefined(b1.listener); //make sure it's private
			Y.Assert.areSame(1, s.getNumListeners());
			Y.Assert.areSame(l1, b1.getListener());
		},
		
		testBindingContext : function(){
			var s = this.signal;
			
			var scope1 = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			
			var scope2 = {
				n : 0,
				sum : function(){
					this.n++;
				}
			};
			
			var l1 = function(){this.sum()};
			var l2 = function(){this.sum()};
			
			var b1 = s.add(l1, scope1);
			var b2 = s.add(l2, scope2);
			s.dispatch();
			
			Y.Assert.areSame(1, scope1.n);
			Y.Assert.areSame(1, scope2.n);
			
			b1.context = scope2;
			s.dispatch();
			
			Y.Assert.areSame(1, scope1.n);
			Y.Assert.areSame(3, scope2.n);
		},
		
		testBindingDispose : function(){
			var s = this.signal;
			var b1 = s.add(function(){}, {});
			Y.Assert.areSame(1, s.getNumListeners());
			b1.dispose();
			Y.Assert.areSame(0, s.getNumListeners());
			Y.Assert.isUndefined(b1.listener);
			Y.Assert.isUndefined(b1.getListener());
			Y.Assert.isUndefined(b1.context);
		},
		
		
		//------------------------ Remove ----------------------------------//
		
		testRemoveSingle : function(){
			var s = this.signal;
			
			var l1 = function(){Y.Assert.fail();};
			
			var b1 = s.add(l1);
			s.remove(l1);
			Y.Assert.areSame(0, s.getNumListeners());
			s.dispatch();
		},
		
		testRemoveSingle2 : function(){
			var s = this.signal;
			
			var l1 = function(){Y.Assert.fail();};
			
			var b1 = s.add(l1);
			s.remove(l1);
			Y.Assert.areSame(0, s.getNumListeners());
			Y.Assert.isUndefined(b1.listener);
			Y.Assert.isUndefined(b1.getListener());
			Y.Assert.isUndefined(b1.context);
			s.dispatch();
		},
		
		testRemoveSingleTwice : function(){
			var s = this.signal;
			
			var l = function(){Y.Assert.fail();};
			
			s.add(l);
			s.remove(l);
			s.remove(l);
			Y.Assert.areSame(0, s.getNumListeners());
			s.dispatch();
		},
		
		testRemoveSingleTwice2 : function(){
			var s = this.signal;
			
			var l = function(){Y.Assert.fail();};
			
			s.add(l);
			s.remove(l);
			Y.Assert.areSame(0, s.getNumListeners());
			s.dispatch();
			
			s.remove(l);
			s.dispatch();
		},
		
		testRemoveDouble : function(){
			var s = this.signal;
			
			var l1 = function(){Y.Assert.fail();};
			var l2 = function(){Y.Assert.fail();};
			
			s.add(l1);
			s.addOnce(l2);
			
			s.remove(l1);
			Y.Assert.areSame(1, s.getNumListeners());
			s.remove(l2);
			Y.Assert.areSame(0, s.getNumListeners());
			s.dispatch();
		},
		
		testRemoveDoubleTwice : function(){
			var s = this.signal;
			
			var l1 = function(){Y.Assert.fail();};
			var l2 = function(){Y.Assert.fail();};
			
			s.add(l1);
			s.add(l2);
			
			s.remove(l1);
			s.remove(l1);
			Y.Assert.areSame(1, s.getNumListeners());
			s.remove(l2);
			s.remove(l2);
			Y.Assert.areSame(0, s.getNumListeners());
			s.dispatch();
		},
		
		testRemoveDoubleTwice2 : function(){
			var s = this.signal;
			
			var l1 = function(){Y.Assert.fail();};
			var l2 = function(){Y.Assert.fail();};
			
			s.add(l1);
			s.addOnce(l2);
			
			s.remove(l1);
			Y.Assert.areSame(1, s.getNumListeners());
			s.remove(l2);
			Y.Assert.areSame(0, s.getNumListeners());
			s.dispatch();
			
			s.remove(l1);
			s.remove(l2);
			s.dispatch();
		},
		
		testRemoveAll : function(){
			var s = this.signal;
			
			s.add(function(){Y.Assert.fail();});
			s.add(function(){Y.Assert.fail();});
			s.addOnce(function(){Y.Assert.fail();});
			s.add(function(){Y.Assert.fail();});
			s.addOnce(function(){Y.Assert.fail();});
			Y.Assert.areSame(5, s.getNumListeners());
			
			s.removeAll();
			Y.Assert.areSame(0, s.getNumListeners());
			s.dispatch();
		},
		
		testRemoveAll2 : function(){
			var s = this.signal;
			
			var b1 = s.add(function(){Y.Assert.fail();});
			var b2 = s.add(function(){Y.Assert.fail();});
			var b3 = s.addOnce(function(){Y.Assert.fail();});
			var b4 = s.add(function(){Y.Assert.fail();});
			var b5 = s.addOnce(function(){Y.Assert.fail();});
			
			Y.Assert.areSame(5, s.getNumListeners());
			s.removeAll();
			Y.Assert.areSame(0, s.getNumListeners());
			
			Y.Assert.isUndefined(b1.listener);
			Y.Assert.isUndefined(b1.getListener());
			Y.Assert.isUndefined(b1.context);
			
			Y.Assert.isUndefined(b2.listener);
			Y.Assert.isUndefined(b2.getListener());
			Y.Assert.isUndefined(b2.context);
			
			Y.Assert.isUndefined(b3.listener);
			Y.Assert.isUndefined(b3.getListener());
			Y.Assert.isUndefined(b3.context);
			
			Y.Assert.isUndefined(b4.listener);
			Y.Assert.isUndefined(b4.getListener());
			Y.Assert.isUndefined(b4.context);
			
			Y.Assert.isUndefined(b5.listener);
			Y.Assert.isUndefined(b5.getListener());
			Y.Assert.isUndefined(b5.context);
			
			s.dispatch();
		},
		
		testRemoveAllTwice : function(){
			var s = this.signal;
			
			s.addOnce(function(){Y.Assert.fail();});
			s.addOnce(function(){Y.Assert.fail();});
			s.add(function(){Y.Assert.fail();});
			s.add(function(){Y.Assert.fail();});
			s.add(function(){Y.Assert.fail();});
			Y.Assert.areSame(5, s.getNumListeners());
			
			s.removeAll();
			s.removeAll();
			Y.Assert.areSame(0, s.getNumListeners());
			s.dispatch();
		},
		
		testRemoveNull : function(){
			var s = this.signal;
			
			var l1 = function(){Y.Assert.fail();};
			
			var b1 = s.add(l1);
			s.remove(); //should throw error
			Y.Assert.areSame(0, s.getNumListeners());
			s.dispatch();
		},
		
	//--------------------- Dispose --------------------------//
	
		testDispose1 : function(){
			var s = this.signal;
			
			s.addOnce(function(){});
			s.add(function(){});
			Y.Assert.areSame(2, s.getNumListeners());
			
			s.dispose();
			s.dispatch(); //will throw error
		},
		
		testDispose2 : function(){
			var s = this.signal;
			
			s.addOnce(function(){});
			s.add(function(){});
			Y.Assert.areSame(2, s.getNumListeners());
			
			s.dispose();
			s.add(function(){}); //will throw error
		},
		
		testDispose3 : function(){
			var s = this.signal;
			
			s.addOnce(function(){});
			s.add(function(){});
			Y.Assert.areSame(2, s.getNumListeners());
			
			s.dispose();
			s.remove(function(){}); //will throw error
		},
		
		testDispose4 : function(){
			var s = this.signal;
			
			s.addOnce(function(){});
			s.add(function(){});
			Y.Assert.areSame(2, s.getNumListeners());
			
			s.dispose();
			s.getNumListeners(); //will throw error
		}
		
	});
	
	
	//==============================================================================
	// INIT ------------------------------------------------------------------------
	
	//create the console
	var r = new Y.Console({
	    verbose : true,
	    newestOnTop : false
	});
	 
	r.render('#testLogger');
	 
	Y.Test.Runner.add(basic);
	
	Y.Test.Runner.on('complete', function(){
		var c = document.getElementById('coverageOutput');
		if(c) c.value = Y.Test.Runner.getCoverage(Y.Coverage.Format.JSON);
	});
	
	//run the tests
	Y.Test.Runner.run();
	
});