# JS-Signals Changelog #


## v0.2 (2010/11/26) ##

### API changes ###
 
 - Added:
   - `Signal.prototype.pause()`
   - `Signal.prototype.resume()`
   - `Signal.prototype.isPaused()`
   - `Signal.prototype.stopPropagation()`
 
### Fixes ###
 
 - `SignalBinding.prototype.isPaused()`

### Test Changes ###

 - Increased test coverage a lot. 
 - Tests added: 
   - pause/resume (for individual bindings and signal)
   - stopPropagation (using `return false` and `Signal.prototype.stopPropagation()`)
   - `SignalBindings.prototype.isOnce()`
   - if same listener added twice returns same binding

### Other ###

Small refactoring and code cleaning.


## v0.1 (2010/11/26) ##

 - initial release, support of basic features.