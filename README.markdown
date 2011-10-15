
Binder
====

Binder is a simple module for binding abilities together between Javascript objects.  It takes the nouns out of dependency injection and ties functions together between objects in a lightweight, decoupled manner.

Contrived Example
----------------

Objects specify their abilities using the _can_ property array, and they specify abilities they require using the _needs_ property array.

<pre>
Car.prototype = {
  can: [ 'driveToWork' ],
  needs: [ 'goForwards', 'turnLeft', 'turnRight' ],
  // ...
};
</pre>

Here, the car advertises it has the ability to drive you to work, but that it needs to collaborate with objects that can help it go forwards, turn left, and turn right.  This kind of object would then want to collaborate with something like an engine...

<pre>
Engine.prototype = {
  can: [ 'goForwards', 'goBackwards' ],
  // ...
};
</pre>

Usage Example
-------------

To use Binder you can install it through _npm_.

<pre>
var binder = require( 'binder' ).create();
</pre>

It then takes functions to construct objects as the single argument to its _make_ method.

<pre>
binder.make( Engine );
binder.make( SteeringWheel );
var car = binder.make( Car );
</pre>

The car will then be able to use the abilities that were provided by the engine and the steering wheel.

<pre>
Car.prototype = {
  // ...
  driveToWork: function() {
    this.goForwards();
    this.turnLeft();
    // etc...
  }
};
</pre>

The car is then communicating with its collaborators without being dependent on _who_ they are, the only coupling is by the specific abilities that it requires.

Binder Abilities
----------------

The binder object provides the ability *binderMake* which can make other objects that possess/require abilities.

Ability Namespace
-----------------

The astute reader *chortle* will notice that ability names form a single namespace.  Abilities provided and consumed by objects share a single space within a Binder object.  So how do you handle collisions?  Well you can provide mapping each side to map abilities to/from instance methods of your choosing.  So to provide an ability implemented by a named method do:

<pre>
Car.prototype = {
  can: [
    'driveToWork:makeTheCarDriveToWork'
  ],
  makeTheCarDriveToWork: function() {
    // ability impl
  }
};
</pre>

And to add an ability to your object use the same syntax:

<pre>
Van.prototype = {
  needs: [
    'goFowards:makeTheCarGoForwards'
  ],
  driveToWork: function() 
    this.makeTheCarGoForwards();
  }
};
</pre>

So the ability name namespace, no longer bound to method names, can be application defined.  (eg. 'com.mysite.somePackage.abilityName')

Unit Testing Abilities
----------------------

There's also a *BinderTest* object available via the _createTest()_ method, that can be used in unit testing.  The main method it provides in addition to the normal binder methods is *mock*.  This allows you to mock an ability for use in unit testing.

<pre>
binderTest = require( 'binder' ).createTest();
binderTest.mock( 'someAbility', function() { ... } );
var obj = binderTest.make( MyClass );
</pre>

Credits
-------

This is just a toy concept at the moment, and was inspired by ideas from: http://thorstenlorenz.wordpress.com/2011/07/23/dependency-injection-is-dead-long-live-verbs/

