
var abilities = {};

/**
 * Stores an ability that an object has.  If another object has
 * already defined this ability an error is thrown.
 *
 * @param Object object
 * @param String can
 */
function storeAbility( object, can ) {

    if ( abilities[can] ) {
        throw 'Ability "' +can+ '" already provided';
    }

    abilities[ can ] = object;

}

/**
 * Tries to give the object the ability it needs.  If the ability
 * has not been provided yet then an error is thrown.
 *
 * @param Object object
 * @param String need
 */
function giveAbility( object, need ) {

    if ( !abilities[need] ) {
        throw 'Ability "' +need+ '" has not been defined';
    }

    var ability = abilities[ need ];

    object[ need ] = function() {
        return ability[ need ].apply( ability, arguments );
    };

}

/**
 * Given a function for creating an object, create it and
 * give it all the verbs it needs to work.
 *
 * @param Function construct
 *
 * @return Array
 */
exports.make = function( construct ) {

    var object = new construct();
    var needs = object.needs || [];
    var cans = object.can || [];

    for ( var i=0; i<cans.length; i++ ) {
        storeAbility( object, cans[i] );
    }

    for ( var i=0; i<needs.length; i++ ) {
        giveAbility( object, needs[i] );
    }

    return object;

};

