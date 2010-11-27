
# JS-Signals #

Custom event/messaging system for JavaScript inspired by [AS3-Signals](https://github.com/robertpenner/as3-signals).


## Introduction ##

A Signal is similar to a EventTarget/EventDispatcher or a pub/sub system, the main difference is that each event kind has it's own controller and doesn't rely on strings to call proper callbacks. To know more about differences check the [Wiki page](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations).

This implementation is heavily inspired by [Robert Penner's AS3-Signals](https://github.com/robertpenner/as3-signals) but it has a different set of features (some extra features and some missing), some methods also were renamed, the main focus is *custom events* and not replacing *native DOM events*.


## Advantages ##

 - Doesn't rely on strings for subscribing/publishing to event types, reducing chances of error.
 - Arbitrary number of parameters to event handlers; 
 - Convenience methods that usually aren't present on other implementations of the *observer pattern* like:
   - disable/enable event dispatching per event type. 
   - remove all event listeners attached to specific event type.
   - option to automatically remove listener after first execution.
   - **option to bind an execution context** to the event handler, **avoiding scope issues** that are really common in JavaScript.
 - Favor composition over inheritance.
 - Easy do identify which *event types* the object dispatch.


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


## Repository ##

### Folder Structure ###

    .\dev       ->  development files
    ...\build       ->  files used on the build process
    ...\src         ->  source files
    ...\tests       ->  unit tests
    .\dist      ->  distribution files
    ...\docs        ->  documentation

### Branches ###

    master      ->  always contain code from the latest stable version
    release-**  ->  code canditate for the next stable version (alpha/beta)
    develop     ->  main development branch
    **other**   ->  features/hotfixes/experimental, probably non-stable code


## Learn More ##

 * [JS-Signals Wiki](http://github.com/millermedeiros/js-signals/wiki/)
 * [JS-Signals Documentation](http://millermedeiros.github.com/js-signals/docs/)
