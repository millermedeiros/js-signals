var signals = signals || require('../../dist/signals');

// ---


describe('Memorize', function () {

    beforeEach(function(){
        this.signal = new signals.Signal();
    });

    // ---


    it('should memorize previously dispatched value and automatically execute handler on add/addOnce', function () {
       var s = this.signal;
       s.memorize = true;
       var count = 0;

       var ts1 = +(new Date());

       s.addOnce(function(a, b){
           count++;
           expect( a ).toBe( 'foo' );
           expect( b ).toBe( ts1 );
       });

       s.dispatch('foo', ts1);

       s.addOnce(function(a, b){
           count++;
           expect( a ).toBe( 'foo' );
           expect( b ).toBe( ts1 );
       });

       var ts2 = +(new Date());

       s.dispatch('bar', ts2);

       s.addOnce(function(a, b){
           count++;
           expect( a ).toBe( 'bar' );
           expect( b ).toBe( ts2 );
       });

       expect( count ).toBe( 3 );
    });


    it('should forget values after calling signal.forget()', function () {
       var s = this.signal;
       s.memorize = true;
       var count = 0;

       var ts1 = +(new Date());

       s.addOnce(function(a, b){
           count++;
           expect( a ).toBe( 'foo' );
           expect( b ).toBe( ts1 );
       });

       s.dispatch('foo', ts1);

       s.addOnce(function(a, b){
           count++;
           expect( a ).toBe( 'foo' );
           expect( b ).toBe( ts1 );
       });

       var ts2 = +(new Date());

       s.dispatch('bar', ts2);
       s.forget();

       s.addOnce(function(a, b){
           count++;
           expect(null).toEqual('fail: ');
       });

       expect( count ).toBe( 2 );
    });

});

