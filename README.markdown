
# JS-Signals #

Custom event/messaging system for JavaScript inspired by [AS3-Signals](https://github.com/robertpenner/as3-signals).

## Introduction ##

A Signal is similar to a EventTarget/EventDispatcher or a pub/sub system, the main difference is that each event kind has it's own controller and doesn't rely on strings to call proper callbacks.

Another advantage is that you can pass arbitrary parameters to callbacks and it also have some convenience methods that aren't present on other *observer pattern* implementations.


## Examples ##

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
