
# JS-Signals #

Custom event/messaging system for JavaScript inspired by [AS3-Signals](https://github.com/robertpenner/as3-signals).


## Introduction ##

A Signal is similar to an *Event Emitter/Dispatcher* or a *Pub/Sub* system, the main difference is that each event type has it's own controller and doesn't rely on strings to broadcast/subscribe to events. To know more about the differences [check the Wiki page](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations).

This implementation is **heavily inspired** by [Robert Penner's AS3-Signals](https://github.com/robertpenner/as3-signals) but **it is not a direct port**, it has a different set of features (some extras and some missing) and some methods were renamed to avoid confusions and/or for brevity.

The main focus for now is custom events, there are no plans to add *native DOM events* support yet (AS3-signals has a NativeSignal class that emulates native flash events) specially since most of the JavaScript frameworks already have some kind of facade on top of the native events.


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

    var Signal = signals.Signal; //store local reference for brevity
    
    //custom object that dispatch signals
    var myObject = {
      started : new Signal(),
      stopped : new Signal()
    };
    
    function onStarted(param1, param2){
      alert(param1 + param2);
    }
    
    myObject.started.add(onStarted); //add listener
    myObject.started.dispatch('foo', 'bar'); //dispatch signal passing custom parameters
    myObject.started.remove(onStarted); //remove a single listener


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
 * [JS-Signals Page](http://millermedeiros.github.com/js-signals/)
