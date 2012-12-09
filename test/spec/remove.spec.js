var signals = signals || require('../../dist/signals');

// ---

describe('Remove', function () {

    beforeEach(function(){
        this.signal = new signals.Signal();
    });

    // ---


    describe('remove()', function () {

        it('should remove listener and update bindings', function () {
            var s = this.signal;

            var l1 = function(){expect(null).toEqual('fail: ');};
            var l2 = function(){expect(null).toEqual('fail: ');};

            var b1 = s.add(l1);
            var b2 = s.add(l2);
            s.remove(l1);
            expect( s.getNumListeners() ).toBe( 1 );
            expect( b1.listener ).toBeUndefined();
            expect( b1.getListener() ).toBeUndefined();
            expect( b1.context ).toBeUndefined();

            s.remove(l2);
            expect( s.getNumListeners() ).toBe( 0 );
            expect( b2.listener ).toBeUndefined();
            expect( b2.getListener() ).toBeUndefined();
            expect( b2.context ).toBeUndefined();

            expect( s.getNumListeners() ).toBe( 0 );
            s.dispatch();
        });


        it('should not fail if called twice in a row', function () {
            var s = this.signal;
            var l = function(){expect(null).toEqual('fail: ');};
            s.add(l);
            s.remove(l);
            s.remove(l);
            expect( s.getNumListeners() ).toBe( 0 );
            s.dispatch();
        });


        it('should throw error if trying to remove a listener that isn\'t a function', function () {
            var s = this.signal;
            var l1 = function(){expect(null).toEqual('fail: ');};
            var b1 = s.add(l1);
            expect( function(){ s.remove() } ).toThrow( 'listener is a required param of remove() and should be a Function.' );
            expect( function(){ s.remove(123) } ).toThrow( 'listener is a required param of remove() and should be a Function.' );
            expect( function(){ s.remove(true) } ).toThrow( 'listener is a required param of remove() and should be a Function.' );
            expect( function(){ s.remove('bar') } ).toThrow( 'listener is a required param of remove() and should be a Function.' );
            expect( s.getNumListeners() ).toBe( 1 );
        });

    });


    describe('removeAll()', function () {
        it('should remove all listeners', function () {
            var s = this.signal;

            var b1 = s.add(function(){expect(null).toEqual('fail: ')});
            var b2 = s.add(function(){expect(null).toEqual('fail: ')});
            var b3 = s.addOnce(function(){expect(null).toEqual('fail: ')});
            var b4 = s.add(function(){expect(null).toEqual('fail: ')});
            var b5 = s.addOnce(function(){expect(null).toEqual('fail: ')});

            expect( s.getNumListeners() ).toBe( 5 );
            s.removeAll();
            expect( s.getNumListeners() ).toBe( 0 );

            expect( b1.listener ).toBeUndefined();
            expect( b1.getListener() ).toBeUndefined();
            expect( b1.context ).toBeUndefined();

            expect( b2.listener ).toBeUndefined();
            expect( b2.getListener() ).toBeUndefined();
            expect( b2.context ).toBeUndefined();

            expect( b3.listener ).toBeUndefined();
            expect( b3.getListener() ).toBeUndefined();
            expect( b3.context ).toBeUndefined();

            expect( b4.listener ).toBeUndefined();
            expect( b4.getListener() ).toBeUndefined();
            expect( b4.context ).toBeUndefined();

            expect( b5.listener ).toBeUndefined();
            expect( b5.getListener() ).toBeUndefined();
            expect( b5.context ).toBeUndefined();

            s.dispatch();
            s.removeAll();
            expect( s.getNumListeners() ).toBe( 0 );
        });
    });


    describe('diff context', function () {

        it('should remove listener based on context', function () {
            var s = this.signal;

            var l1 = function(){expect(null).toEqual('fail: ');};
            var obj = {};

            var b1 = s.add(l1);
            var b2 = s.add(l1, obj);
            expect( s.getNumListeners() ).toBe( 2 );

            expect( b1.context ).toBeUndefined();
            expect( b1.getListener() ).toBe( l1 );
            expect( b2.context ).toBe( obj );
            expect( b2.getListener() ).toBe( l1 );

            s.remove(l1, obj);

            expect( b2.context ).toBeUndefined();
            expect( b2.getListener() ).toBeUndefined();

            expect( b1.context ).toBeUndefined();
            expect( b1.getListener() ).toBe( l1 );

            expect( s.getNumListeners() ).toBe( 1 );
            s.remove(l1);
            expect( s.getNumListeners() ).toBe( 0 );
            s.dispatch();
        });

    });

});
