var signals = signals || require('../../dist/signals');

// ---

describe('Misc', function () {

    it('issue #44: should add a circular reference for backwards compatibility and convenience on AMD/node', function () {
        expect( signals.Signal ).toEqual( signals );
    });

});

