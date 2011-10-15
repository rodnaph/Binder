
var assert = require( 'assert' ),
    binder = require( './index' );

function runTest( name, func ) {
    console.log( '✔ ', name );
    func();
}

function Engine() {}
function Car() {}
function ClassicCar() {}
function Lorry() {}
function Minibus() {}
function Bike() {}
function MountainBike() {}
function SuperCar() {}

Engine.prototype = {
    can: [ 'goForwards', 'goBackwards' ],
    goForwards: function() {},
    goBackwards: function() {
        return this.abilitySource;
    }
};

Car.prototype = {
    can: [ 'driveToWork' ],
    needs: [ 'goForwards', 'goBackwards' ],
    driveToWork: function() {
        this.goForwards();
        return this.goBackwards();
    }
};

ClassicCar.prototype = {
    can: [ 'driveToWork' ]
};

Lorry.prototype = {
    needs: [ 'loadWithLego' ]
};

Minibus.prototype = {
    can: [ 'getPeople' ]
};

Bike.prototype = {
    can: [
        'doWheelie:bikeDoesWheelie'
    ],
    needs: [
        'goForwards:bikeGoForwards'
    ],
    bikeDoesWheelie: function() {
        return 'wheelie';
    }
};

MountainBike.prototype = {
    needs: [
        'doWheelie'
    ]
};

SuperCar.prototype = {
    can: [ 'driveToWork' ],
    driveToWork: function() {}
};

////////////////////////////////////////////////////////////////////

runTest( 'Binder exposes its own abilities', function() {
    function Foo() {}
    Foo.prototype = { needs: ['binderMake'] };
    var b = binder.create();
    assert.ok( b.make( Foo ).binderMake, 'Binder did not advertise own abilities' );
});

runTest( 'Binder exposes abilities of created objects', function() {
    var b = binder.create();
    b.make( Engine );
    var car = b.make( Car );
    assert.ok( car.goForwards, 'goForwards should have been bound from Engine' );
    assert.ok( car.goBackwards, 'goBackwards should have been bound from Engine' );
});

runTest( 'Exception thrown when ability not met', function() {
    var b = binder.create();
    assert.throws(function() {
        b.make( Lorry );
    });
});

runTest( 'Exception thrown when claimed ability does not exist', function() {
    var b = binder.create();
    assert.throws(function() {
        b.make( Minibus );
    });
});

runTest( 'Exception thrown when ability is redefined', function() {
    var b = binder.create();
    assert.throws(function() {
        b.make( Car );
        b.make( ClassicCar );
    });
});

runTest( 'Provider of ability is available to caller of ability', function() {
    var b = binder.create();
    var engine = b.make( Engine ); 
    var car = b.make( Car );
    assert.equal( car, car.driveToWork() );
});

runTest( 'Abilities can be bound to arbitrary methods', function() {
    var b = binder.create();
    b.make( Engine );
    var bike = b.make( Bike );
    assert.ok( bike.bikeGoForwards != null );
});

runTest( 'Abilities can be provided by arbitrary methods', function() {
    var b = binder.create();
    b.make( Engine );
    b.make( Bike );
    var mb = b.make( MountainBike );
    assert.equal( 'wheelie', mb.doWheelie() );
});

runTest( 'Abilities can be cleared to be rebound', function() {
    var b = binder.create();
    b.make( Engine );
    b.make( Car );
    b.clear( 'driveToWork' );
    b.make( SuperCar );
});

