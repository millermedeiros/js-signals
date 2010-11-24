YUI().use('console', function (Y){
		
	var basic = new YUITest.TestCase({
	
		//name of the test case - if not provided, one is auto-generated
		name : "Basic Test",
		
		//---------------------------------------------------------------------
		// setUp and tearDown methods - optional
		//---------------------------------------------------------------------
		
		/*
		 * Sets up data that is needed by each test.
		 */
		setUp : function(){
			this.dispatched = new signals.Signal();
		},
		
		/*
		 * Cleans up everything that was created by setUp().
		 */
		tearDown : function(){
			delete this.dispatched;
		},
		
		//---------------------------------------------------------------------
		// Test methods - names must begin with "test"
		//---------------------------------------------------------------------
		
		testSignalType : function(){			
			var signal = this.dispatched;
			
			YUITest.Assert.isObject(signal);
			YUITest.Assert.isInstanceOf(signals.Signal, signal);
		},
		
		testNumListeners0 : function(){
			var signal = this.dispatched;
			
			YUITest.Assert.areSame(0, signal.getNumListeners());
		},
		
		testAddSingle : function(){
			var signal = this.dispatched;
			
			signal.add(function(){return true});
			
			YUITest.Assert.areSame(1, signal.getNumListeners());
		},
		
		testAddDouble : function(){
			var signal = this.dispatched;
			
			signal.add(function(){return true});
			signal.add(function(){return true});
			
			YUITest.Assert.areSame(2, signal.getNumListeners());
		},
		
		testRemoveSingle : function(){
			var signal = this.dispatched;
			
			var listener = function(){return true};
			
			signal.add(listener);
			YUITest.Assert.areSame(1, signal.getNumListeners());
			
			signal.remove(listener);
			YUITest.Assert.areSame(0, signal.getNumListeners());
		},
	
	});
	
	
	//==============================================================================
	// INIT ------------------------------------------------------------------------
	
	var suite = new YUITest.TestSuite("JS Signals");
	suite.add(basic);
	
	var TestRunner = YUITest.TestRunner;
	TestRunner.add(suite);
	TestRunner.run();

});