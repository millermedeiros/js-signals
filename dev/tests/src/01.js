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
				testAddSameListenerMixed1 : true,
				testAddSameListenerMixed2 : true
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
		
		//------------------------ Remove ----------------------------------//
		
		testRemoveSingle : function(){
			var s = this.signal;
			
			var l = function(){Y.Assert.fail();};
			
			s.add(l);
			s.remove(l);
			Y.Assert.areSame(0, s.getNumListeners());
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
	 
	//run the tests
	Y.Test.Runner.run();

});