
function Binder() {

    this.abilities = [];

}

Binder.prototype = {

    /**
     * @var Array Abilities
     */
    can: [
        'binderMake'
    ],

    /**
     * Stores an ability that an object has.  If another object has
     * already defined this ability an error is thrown.
     *
     * @param Object object
     * @param String can
     */
    storeAbility: function( object, can ) {

        if ( this.abilities[can] ) {
            throw 'Ability "' +can+ '" already provided';
        }

        if ( !object[can] ) {
            throw 'Object claims to have ability "' +can+ '", but it does not';
        }

        this.abilities[ can ] = object;

    },

    /**
     * Tries to give the object the ability it needs.  If the ability
     * has not been provided yet then an error is thrown.
     *
     * @param Object object
     * @param String need
     */
    giveAbility: function( object, need ) {

        if ( !this.abilities[need] ) {
            throw 'Ability "' +need+ '" has not been defined';
        }

        var ability = this.abilities[ need ];

        object[ need ] = function() {
            return ability[ need ]
                .apply( ability, arguments );
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
     * Extract/bind abilities for object
     *
     * @param Object object
     */
    bind: function( object ) {

        var needs = object.needs || [];
        var cans = object.can || [];

        cans.map(function( can ) {
            this.storeAbility( object, can );
        }, this );

        needs.map(function( need ) {
            this.giveAbility( object, need );
        }, this );

    },

    /**
     * Ability proxy to make()
     *
     */
    binderMake: function() {

        return this.make.apply( this, arguments );

    } 

};

exports.create = function() {

    var binder = new Binder();

    binder.bind( binder );

    return binder;

};

