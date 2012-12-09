var signals = signals || require('../../dist/signals');

describe('Add / Add Once', function () {

    beforeEach(function(){
        this.signal = new signals.Signal();
    });


    describe('Signal.add()', function () {

        it('should increase number of listeners', function () {
            var s = this.signal;
            expect( s.getNumListeners() ).toBe( 0 );
            s.add(function(){});
            expect( s.getNumListeners() ).toBe( 1 );
            s.add(function(){});
            expect( s.getNumListeners() ).toBe( 2 );
        });

        it('should not add same listener twice', function () {
            var s = this.signal;
            var l = function(){};
            s.add(l);
            s.add(l);
            expect( s.getNumListeners() ).toBe( 1 );
        });

        it('should add same listener if diff context', function () {
            var s = this.signal;
            var l = function(){};
            s.add(l);
            s.add(l, {});
            expect( s.getNumListeners() ).toBe( 2 );
        });

        it('should throw error if listener isn\'t a function', function () {
            var s = this.signal;
            expect( function(){ s.add(); } ).toThrow( 'listener is a required param of add() and should be a Function.' );
            expect( function(){ s.add(123); } ).toThrow( 'listener is a required param of add() and should be a Function.' );
            expect( function(){ s.add(true); } ).toThrow( 'listener is a required param of add() and should be a Function.' );
            expect( s.getNumListeners() ).toBe( 0 );
        });

    });


    //--------------------------- Add / Has ---------------------------------//

    describe('Signal.has()', function () {

        it('it should check if signal has listener', function () {
            var s = this.signal;
            var l = function(){};
            expect( s.has(l) ).toBe( false );
            s.add(l);
            expect( s.has(l) ).toBe( true );
        });

    });


    //--------------------------- Add Once ---------------------------------//

    describe('Signal.addOnce()', function () {

        it('add listener', function () {
            var s = this.signal;
            s.addOnce(function(){});
            expect( s.getNumListeners() ).toBe( 1 );
            s.addOnce(function(){});
            expect( s.getNumListeners() ).toBe( 2 );
        });

        it('should not add same listener twice', function () {
            var s = this.signal;
            var l = function(){};
            expect( s.getNumListeners() ).toBe( 0 );
            s.addOnce(l);
            s.addOnce(l);
            expect( s.getNumListeners() ).toBe( 1 );
        });

        it('should throw error if listener isn\'t a function', function () {
            var s = this.signal;
            expect( function(){ s.addOnce(); } ).toThrow( 'listener is a required param of addOnce() and should be a Function.' );
            expect( function(){ s.addOnce(true); } ).toThrow( 'listener is a required param of addOnce() and should be a Function.' );
            expect( function(){ s.addOnce(123); } ).toThrow( 'listener is a required param of addOnce() and should be a Function.' );
            expect( s.getNumListeners() ).toBe( 0 );
        });

    });


    //--------------------------- Add Mixed ---------------------------------//

    describe('Signal.add() + Signal.addOnce()', function () {

        it('should throw error if same listener add followed by addOnce', function () {
            var s = this.signal;
            var l = function(){};
            expect( function(){
                s.add(l);
                s.addOnce(l);
            } ).toThrow( 'You cannot add() then addOnce() the same listener without removing the relationship first.' );
        });

        it('should throw error if same listener addOnce followed by add', function () {
            var s = this.signal;
            var l = function(){};
            expect( function(){
                s.addOnce(l);
                s.add(l);
            } ).toThrow( 'You cannot addOnce() then add() the same listener without removing the relationship first.' );
        });

    });


});
