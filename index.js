
function BindDefinition( definition ) {

    this.name = definition;
    this.method = definition;

    this.init( definition );

}
    
BindDefinition.prototype = {

    /**
     * Initialise name/method for bind definition
     *
     * @param String definition
     */
    init: function( definition ) {

        if ( definition && definition.indexOf(':') != -1 ) {
            var parts = definition.split( ':' );
            this.name = parts[ 0 ];
            this.method = parts[ 1 ];
        }

    }

};

function BoundAbility( object, def ) {

    this.object = object;
    this.def = def;

}

function Binder() {

    this.abilities = [];

}

Binder.prototype = {

    /**
     * @var Array Abilities
     */
    can: [
        'binderMake:make'
    ],

    /**
     * Stores an ability that an object has.  If another object has
     * already defined this ability an error is thrown.
     *
     * @param Object object
     * @param BindDefinition def
     */
    storeAbility: function( object, def ) {

        if ( this.abilities[def.name] ) {
            throw 'Ability "' +def.name+ '" already provided';
        }

        if ( !object[def.method] ) {
            throw 'Object claims to have ability "' +def.name+ '", but it does not';
        }

        this.abilities[ def.name ] = new BoundAbility( object, def );

    },

    /**
     * Tries to give the object the ability it needs.  If the ability
     * has not been provided yet then an error is thrown.
     *
     * @param Object object
     * @param BindDefinition def
     */
    giveAbility: function( object, def ) {

        if ( !this.abilities[def.name] ) {
            throw 'Ability "' +def.name+ '" has not been defined';
        }

        var boundAbility = this.abilities[ def.name ];

        object[ def.method ] = function() {
            boundAbility.object.abilitySource = object;
            return boundAbility.object[ boundAbility.def.method ]
                .apply( boundAbility.object, arguments );
        };

    },

    /**
     * Given a function for creating an object, create it and
     * give it all the verbs it needs to work.
     *
     * @param Function construct
     *
     * @return Array
     */
    make: function( construct ) {

        var object = new construct();

        this.bind( object );

        return object;

    },

    /**
     * Clear a bound ability (does not affect any objects currently bound, will
     * only affects newly bound objects)
     *
     * @param String name
     */
    clear: function( name ) {

        delete this.abilities[ name ];

    },

    /**
     * Extract/bind abilities for object
     *
     * @param Object object
     */
    bind: function( object ) {

        var needs = object.needs || [];
        var cans = object.can || [];

        cans.map(function( can ) {
            this.storeAbility( object, new BindDefinition(can) );
        }, this );

        needs.map(function( need ) {
            this.giveAbility( object, new BindDefinition(need) );
        }, this );

    }

};

function TestBinder() {

    this.abilities = [];

}

TestBinder.prototype = new Binder();

/**
 * Mock an ability to a specified function
 *
 * @param String ability
 * @param Function method
 */
TestBinder.prototype.mock = function( ability, method ) {

    var object = {
        can: [ ability ]
    };

    object[ ability ] = method || function() {};

    this.clear( ability );
    this.bind( object );

};

/**
 * Make a binder object
 *
 * @param Function construct
 *
 * @return Binder
 */
function makeBinder( construct ) {

    var binder = new construct();

    binder.bind( binder );

    return binder;

}

exports.create = function() {
    return makeBinder( Binder );
};

exports.createTest = function() {
    return makeBinder( TestBinder );
};

