
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
var binder = require( 'binder' );
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

Credits
-------

Inspired by ideas from: http://thorstenlorenz.wordpress.com/2011/07/23/dependency-injection-is-dead-long-live-verbs/

