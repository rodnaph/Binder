
/**
 * The binder creates objects, taking abilities they can() do, and
 * giving them abilities they needs()
 *
 */
exports = {

    /**
     * @var Object Store for ability/object map
     */
    abilities: {},

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
        var needs = object.needs || [];
        var cans = object.can || [];

        for ( var i=0; i<cans.length; i++ ) {
            this.storeAbility( object, cans[i] );
        }

        for ( var i=0; i<needs.length; i++ ) {
            this.giveAbility( object, needs[i] );
        }

        return object;

    },

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
            return ability[ need ].apply( ability, arguments );
        };

    }

};

