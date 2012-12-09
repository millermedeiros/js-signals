var signals = signals || require('../../dist/signals');

// ---

describe('Dispatch', function () {

    beforeEach(function(){
        this.signal = new signals.Signal();
    });


    describe('add', function () {

        it('should execute listeners (FIFO)', function () {
            var s = this.signal;

            var str = '';
            var l1 = function(){str += 'a'};
            var l2 = function(){str += 'b'};

            s.add(l1);
            s.add(l2);
            s.dispatch();
            expect( str ).toBe( 'ab' );
        });


        it('should follow priority', function () {
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
            expect( str ).toBe( 'bca' );
        });


        it('should respect default priority (0)', function () {
            var s = this.signal;
            var str = '';
            var l1 = function(){str += 'a'};
            var l2 = function(){str += 'b'};
            var l3 = function(){str += 'c'};

            s.add(l1);
            s.add(l2, null, 1);
            s.add(l3);
            s.dispatch();
            expect( str ).toBe( 'bac' );
        });


        it('should allow multiple dispatches', function () {
            var s = this.signal;
            var n = 0;
            var l1 = function(){n++};
            s.add(l1);

            s.dispatch();
            expect( n ).toBe( 1 );
            s.dispatch();
            expect( n ).toBe( 2 );
            s.dispatch();
            expect( n ).toBe( 3 );
        });


        it('should respect listener context', function () {
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

            expect( scope1.n ).toBe( 1 );
            expect( scope2.n ).toBe( 1 );

            s.dispatch();
            expect( scope1.n ).toBe( 2 );
            expect( scope2.n ).toBe( 2 );
        });

    });



    describe('addOnce', function () {

        it('should execute listener only once even if multiple dispatches', function () {
            var s = this.signal;
            var n = 0;
            var k = 0;
            var l1 = function(){n++};
            var l2 = function(){k++};

            s.addOnce(l1);
            s.addOnce(l2);
            s.dispatch();
            s.dispatch();

            expect( n ).toBe( 1 );
            expect( k ).toBe( 1 );
        });


        it('should call listener on given context', function () {
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
            expect( scope1.n ).toBe( 1 );
            expect( scope2.n ).toBe( 1 );

            s.dispatch();
            expect( scope1.n ).toBe( 1 );
            expect( scope2.n ).toBe( 1 );
        });


    });



    describe('quirks', function () {

        describe('issue #24: invalid listener', function () {
            it('should not trigger binding if it was removed', function () {
                var s = this.signal;

                var n = 0;
                var l2 = function(){n += 1}
                var l1 = function(){n += 1; s.remove(l2)}  //test for #24

                s.add(l1);
                s.add(l2);
                s.dispatch();

                expect( n ).toBe( 1 );
            });
        });

        describe('issue #47: invalid context', function () {
            it('should automatically bind Signal.dispatch context to avoid issues', function () {
                var s = this.signal;

                var n = 0;
                var args;
                var l1 = function(){n++; args = Array.prototype.slice.call(arguments);};

                s.add(l1);
                s.dispatch.call(null); // test #47

                expect( n ).toBe( 1 );
                expect( args ).toEqual( [] );

                s.dispatch.call(null, 4, 5);
                expect( n ).toBe( 2 );
                expect( args ).toEqual( [4, 5] );
            });
        });

    });



    //--------------------- Dispatch with arguments ----------------------//


    describe('arguments', function () {

        describe('add', function () {

            it('should propagate single argument', function () {
                var s = this.signal;
                var n = 0;
                var l1 = function(param){n += param};
                var l2 = function(param){n += param};
                s.add(l1);
                s.add(l2);
                s.dispatch(1);
                expect( n ).toBe( 2 );
            });

            it('should propagate [n] arguments', function () {
                var s = this.signal;
                var args;
                s.add(function(){
                    args = Array.prototype.slice.call(arguments);
                });
                s.dispatch(1,2,3,4,5);
                expect( args ).toEqual( [1,2,3,4,5] );
                s.dispatch(9,8);
                expect( args ).toEqual( [9,8] );
            });

        });


        describe('addOnce', function () {

            it('should propagate single argument', function () {
                var s = this.signal;
                var n = 0;
                var l1 = function(param){n += param};
                var l2 = function(param){n += param};
                s.addOnce(l1);
                s.addOnce(l2);
                s.dispatch(1);
                expect( n ).toBe( 2 );
                s.dispatch(20);
                expect( n ).toBe( 2 );
            });

            it('should propagate [n] arguments', function () {
                var s = this.signal;
                var args;
                s.addOnce(function(){
                    args = Array.prototype.slice.call(arguments);
                });
                s.dispatch(1,2,3,4,5);
                expect( args ).toEqual( [1,2,3,4,5] );
                s.dispatch(9,8);
                expect( args ).toEqual( [1,2,3,4,5] );
            });

        });

    });


    //-------------------- Stop Propagation -----------------------------//

    describe('stop propagation / halt', function () {

        it('should stop propagation if any listener returns false', function () {
            var s = this.signal;

            var n = 0;
            var l1 = function(){n++};
            var l2 = function(){return false};
            var l3 = function(){n++};

            s.add(l1);
            s.add(l2);
            s.add(l3);
            s.dispatch();

            expect( n ).toBe( 1 );
        });


        it('should stop propagation if any listener call Signal.halt()', function () {
            var s = this.signal;

            var n = 0;
            var l1 = function(){n++};
            var l2 = function(){s.halt()};
            var l3 = function(){n++};

            s.add(l1);
            s.add(l2);
            s.add(l3);
            s.dispatch();

            expect( n ).toBe( 1 );
        });


        it('should not stop propagation if halt() was called before the dispatch', function () {
            var s = this.signal;

            var n = 0;
            var l1 = function(){n++};
            var l2 = function(){n++};
            var l3 = function(){n++};

            s.add(l1);
            s.add(l2);
            s.add(l3);

            s.halt();
            s.dispatch();

            expect( n ).toBe( 3 );
        });


        it('should not stop propagation if halt() was called on a previous dispatch', function () {
            var s = this.signal;

            var n = 0;
            var l1 = function(){n++};
            var l2 = function(){n++; if (n < 3) { s.halt(); }};
            var l3 = function(){n++};

            s.add(l1);
            s.add(l2);
            s.add(l3);

            s.dispatch();
            expect( n ).toBe( 2 );

            s.dispatch();
            expect( n ).toBe( 5 );
        });

    });


    //--------------------------- Enable/Disable -------------------------------//

    describe('enable/disable', function () {


        it('should enable/disable signal dispatch', function () {
            var s = this.signal;

            var n = 0;
            var l1 = function(){n++};
            var l2 = function(){n++};
            var l3 = function(){n++};

            s.add(l1);
            s.add(l2);
            s.add(l3);

            expect( s.active ).toBe( true );
            s.dispatch();

            s.active = false;
            expect( s.active ).toBe( false );
            s.dispatch();

            s.active = true;
            expect( s.active ).toBe( true );
            s.dispatch();

            expect( n ).toBe( 6 );
        });


        it('should enable/disable SignalBinding', function () {
            var s = this.signal;

            var n = 0;
            var l1 = function(){n++};
            var l2 = function(){n++};
            var l3 = function(){n++};

            var b1 = s.add(l1);
            var b2 = s.add(l2);
            var b3 = s.add(l3);

            expect( s.active ).toBe( true );
            expect( b2.active ).toBe( true );
            s.dispatch();

            b2.active = false;
            expect( s.active ).toBe( true );
            expect( b2.active ).toBe( false );
            s.dispatch();

            b2.active = true;
            expect( s.active ).toBe( true );
            expect( b2.active ).toBe( true );
            s.dispatch();

            expect( n ).toBe( 8 );
        });

    });


});
