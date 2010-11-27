
# JS-Signals #

Custom event/messaging system for JavaScript inspired by [AS3-Signals](https://github.com/robertpenner/as3-signals).


## Introduction ##

A Signal is similar to a EventTarget/EventDispatcher or a pub/sub system, the main difference is that each event kind has it's own controller and doesn't rely on strings to call proper callbacks.

Another advantage is that you can pass arbitrary parameters to callbacks and it also have some convenience methods that aren't present on other implementations of the *observer pattern*.

This implementation is heavily inspired by *Robert Penner's AS3-Signals* but it has a different set of features, the main focus is on *custom events* and not replacing *native DOM events*.


## Basic Example ##

```javascript
  //store local reference for brevity
  var Signal = signals.Signal;
  
  //custom object that dispatch signals
  var myObject = {
    started : new Signal(),
    stopped : new Signal()
  };
  
  function onStarted(param1, param2){
    alert(param1 + param2);
  }
  
  //add listener
  myObject.started.add(onStarted);
  
  //dispatch signal passing custom parameters
  myObject.started.dispatch('foo', 'bar');
  
  //remove a single listener
  myObject.started.remove(onStarted);
```

## Learn More ##

 * [JS-Signals Wiki](http://github.com/millermedeiros/js-signals/wiki/)
 * [JS-Signals Documentation](http://millermedeiros.github.com/js-signals/docs/)
