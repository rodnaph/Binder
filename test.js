
var assert = require( 'assert' ),
    binder = require( './index' );

function runTest( name, func ) {
    console.log( '*', name );
    func();
}

function Engine() {}

function Car() {}

Engine.prototype = {
    can: [ 'goForwards', 'goBackwards' ],
    goForwards: function() {},
    goBackwards: function() {}
};

Car.prototype = {
    can: [ 'driveToWork' ],
    needs: [ 'goForwards', 'goBackwards' ],
    driveToWork: function() {
        this.goForwards();
        this.goBackwards();
    }
};

runTest( 'Binder exposes its own abilities', function() {
    var b = binder.create();
    assert.ok( b.binderMake, 'Binder did not advertise own abilities' );
});

runTest( 'Binder exposes abilities of created objects', function() {
    var b = binder.create();
    b.make( Engine );
    var car = b.make( Car );
    assert.ok( car.goForwards, 'goForwards should have been bound from Engine' );
    assert.ok( car.goBackwards, 'goBackwards should have been bound from Engine' );
});

