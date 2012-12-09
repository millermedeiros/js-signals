var signals = signals || require('../../dist/signals');

// ---

describe('Dispose', function () {

    beforeEach(function(){
        this.signal = new signals.Signal();
    });

    it('clear internal refences and "destroy" Signal', function () {
        var s = this.signal;
        s.memorize = true;
        s.add(function(){});
        s.dispatch('foo', 123);
        expect( s._prevParams ).toEqual( ['foo', 123] );
        expect( s._bindings.length ).toBe( 1 );
        s.dispose();
        expect( s._prevParams ).toBe( undefined );
        expect( s._bindings ).toBe( undefined );
        expect( function(){ s.getNumListeners(); }).toThrow();
        expect( function(){ s.add(function(){}); }).toThrow();
        expect( function(){ s.addOnce(function(){}); }).toThrow();
        expect( function(){ s.remove(function(){}); }).toThrow();
    });

});

