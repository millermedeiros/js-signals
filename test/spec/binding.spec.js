var signals = signals || require('../../dist/signals');

// --

describe('SignalBinding', function () {

    beforeEach(function(){
        this.signal = new signals.Signal();
    });



    describe('add/addOnce', function () {

        describe('addOnce', function () {

            it('should return a binding and isOnce() should be true', function () {
                var s = this.signal;
                var b1 = s.addOnce(function(){});
                var b2 = s.addOnce(function(){});
                expect( s.getNumListeners() ).toBe( 2 );
                expect( b1.isOnce() ).toBe( true );
                expect( b2.isOnce() ).toBe( true );
                expect( b1 ).not.toBe( b2 );
            });


            it('should return same binding if trying to add same listener twice', function () {
                var s = this.signal;
                var l = function(){};
                var b1 = s.addOnce(l);
                var b2 = s.addOnce(l);
                expect( s.getNumListeners() ).toBe( 1 );
                expect( b1.isOnce() ).toBe( true );
                expect( b2.isOnce() ).toBe( true );
                expect( b2 ).toBe( b1 );
            });
        });


        describe('add', function () {

            it('should return binding and isOnce() should be false', function () {
                var s = this.signal;
                var b1 = s.add(function(){});
                var b2 = s.add(function(){});
                expect( s.getNumListeners() ).toBe( 2 );
                expect( b1.isOnce() ).toBe( false );
                expect( b2.isOnce() ).toBe( false );
                expect( b1 ).not.toBe( b2 );
            });

            it('should return same binding if adding same listener twice', function () {
                var s = this.signal;
                var l = function(){};
                var b1 = s.add(l);
                var b2 = s.add(l);
                expect( s.getNumListeners() ).toBe( 1 );
                expect( b1.isOnce() ).toBe( false );
                expect( b2.isOnce() ).toBe( false );
                expect( b2 ).toBe( b1 );
            });

        });

    });



    describe('detach()', function () {

        it('should remove listener', function () {
            var s = this.signal;
            var b1 = s.add(function(){
                expect(null).toEqual('fail: ');
            });
            expect( s.getNumListeners() ).toBe( 1 );
            b1.detach();
            expect( s.getNumListeners() ).toBe( 0 );
            s.dispatch();
        });


        it('should not throw error if called multiple times', function () {
            var s = this.signal;
            var b1 = s.add(function(){
                expect(null).toEqual('fail: ');
            });
            expect( s.getNumListeners() ).toBe( 1 );
            b1.detach();
            expect( s.getNumListeners() ).toBe( 0 );
            s.dispatch();
            b1.detach();
            b1.detach();
            b1.detach();
            s.dispatch();
            expect( s.getNumListeners() ).toBe( 0 );
        });


        it('should update isBound()', function () {
            var s = this.signal;
            var b1 = s.add(function(){});
            expect( s.getNumListeners() ).toBe( 1 );
            expect( b1.isBound() ).toBe( true );
            b1.detach();
            expect( b1.isBound() ).toBe( false );
        });

    });


    describe('getListener()', function () {
        it('should retrieve reference to handler', function () {
            var s = this.signal;
            var l1 = function(){};
            var b1 = s.add(l1);
            expect( b1.listener ).toBeUndefined(); //make sure it's private
            expect( s.getNumListeners() ).toBe( 1 );
            expect( b1.getListener() ).toBe( l1 );
        });
    });


    describe('context', function () {
        it('should allow setting the context dynamically', function () {
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

            expect( scope1.n ).toBe( 1 );
            expect( scope2.n ).toBe( 1 );

            b1.context = scope2;
            s.dispatch();

            expect( scope1.n ).toBe( 1 );
            expect( scope2.n ).toBe( 3 );
        });
    });



    describe('params / arguments', function () {
        it('should curry arguments', function () {
            var s = this.signal;
            var _a, _b, _c;
            var b1 = s.add(function(a, b, c){
                _a = a;
                _b = b;
                _c = c;
            });
            b1.params = ['foo', 'bar'];
            s.dispatch(123);
            expect( _a ).toBe( 'foo' );
            expect( _b ).toBe( 'bar' );
            expect( _c ).toBe( 123 );
        });
    });


    describe('getSignal()', function () {
        it('should return reference to Signal', function () {
            var s = this.signal;
            var _a;
            var b1 = s.add(function(a){
                _a = a;
            });
            expect( b1.getSignal() ).toBe( s );
        });
    });


});
