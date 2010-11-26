
# JS-Signals #

Custom event/messaging system for JavaScript inspired by [AS3-Signals](https://github.com/robertpenner/as3-signals).


## Introduction ##

A Signal is similar to a EventTarget/EventDispatcher or a pub/sub system, the main difference is that each event kind has it's own controller and doesn't rely on strings to call proper callbacks.

Another advantage is that you can pass arbitrary parameters to callbacks and it also have some convenience methods that aren't present on other *observer pattern* implementations.

This implementation is heavily inspired by Robert Penner's AS3-Signals but it has a different set of features/classes, the main target of this implementation is *custom events* and not replacing *native DOM events*.


## Comparisson between *observers* ##

The comparisson below is just about the basic features of subscribing to an event type, dispatching and removing an event listener. It isn't based on available features but on differences between each concept and pros and cons of using each one. 

### Event Target / Event Dispatcher ###

 - Each Object that dispatches custom events needs to inherit from an EventTarget/EventDispatcher object or implement the proper interface.
 - Use strings to identify the event type.
 - DOM2/DOM3 Events are based on this principle.

#### Code sample ####

    myObject.addEventListener('myCustomEventTypeString', handler);
    myObject.dispatch(new Event('myCustomEventTypeString'));
    myObject.removeEventListener('myCustomEventTypeString', handler);
 
#### Pros ####

 - You have total control of the *target object* and make sure you are listening only to the events dispatched by the specific target.
 - Can dispatch arbitrary event types without modifying the target object.

#### Cons ####
   
 - Favors inheritance over composition.
 - Uses strings to identify event types, prone to typo errors and autocomplete doens't work properly.


### Publish / Subscribe ###

 - Uses a single object to *broadcast messages* to multiple *subscribers*.
 - Use strings to identify the event type.

#### Code sample ####

    globalBroadcaster.subscribe('myCustomEventTypeString', handler);
    globalBroadcaster.publish('myCustomEventTypeString', paramsArray);
    globalBroadcaster.unsubscribe('myCustomEventTypeString', handler);

#### Pros ####

 - Any object can publish/subscribe to any event type.
 - Light-weigth.
 - Easy to use.
 
#### Cons ####

 - Any object can publish/subscribe to any event type. *(yeap, it's pro and con at the same time)*
 - Uses strings to identify event types (error prone and no auto-complete).


### Signals ###

 - Each event type has it's own controller.
 - Doesn't rely on strings for event types.

#### Code sample ####

    myObject.myCustomEventType.add(handler);
    myObject.myCustomEventType.dispatch(param1, param2, ...);
    myObject.myCustomEventType.remove(handler);

#### Pros ####

 - Doesn't rely on strings.
   - auto-complete works properly.
   - easy do identify wich *signals* the object dispatch.
   - less error prone.
 - Granular control over each listener and event type (easily).
 
#### Cons ####

 - Can't dispatch arbitrary events. *(which is also a pro in most cases)*
 - Each event-type is an object member. *(which is also a pro in most cases)*


## Examples ##

### Setup code (required for all examples) ###

    //store local reference for brevity
    var Signal = signals.Signal;
  
    //custom object that dispatch signals
    var myObject = {
      started : new Signal(),
      stopped : new Signal()
    };


### Single Listener ###

    function onStarted(param1, param2){
      alert(param1 + param2);
    }
    
    //add listener
    myObject.started.add(onStarted);
    
    //dispatch signal passing custom parameters
    myObject.started.dispatch('foo', 'bar');
    
    //remove a single listener
    myObject.started.remove(onStarted);


### Multiple Listeners ###

    function onStopped(){
      alert('stopped');
    }
    
    function onStopped2(){
      alert('stopped listener 2');
    }
    
    //add listeners
    myObject.stopped.add(onStopped);
    myObject.stopped.add(onStopped2);
    
    //dispatch signal
    myObject.stopped.dispatch();
    
    //remove all listeners of the `stopped` signal
    myObject.stopped.removeAll();


### Stop Propagation (method 1) ###
    
    myObject.started.add(function(){
    	myObject.started.stopPropagation();
    });
    myObject.started.add(function(){
    	//won't be called since first listener stops propagation
    	alert('second listener');
    });
    myObject.started.dispatch();
    

### Stop Propagation (method 2) ###
    
    myObject.started.add(function(){
    	return false; //stop propagation
    });
    myObject.started.add(function(){
    	//won't be called since first listener stops propagation
    	alert('second listener');
    });
    myObject.started.dispatch();
    
