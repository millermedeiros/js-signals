/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */
/*global define:false, require:false, exports:false, module:false*/

//::LICENSE:://
(function(def){
def(function(){

//::SIGNALS_JS:://

//::SIGNAL_BINDING_JS:://

//::SIGNAL_JS:://

    return signals;
});
}(
    // wrapper to run code everywhere
    // based on http://bit.ly/c7U4h5
    typeof require === 'undefined'?
        //Browser (regular script tag)
        function(factory){
            this.signals = factory();
        } :
        ((typeof exports === 'undefined')?
            //AMD
            function(factory){
                define('signals', [], factory);
            } :
            //CommonJS
            function(factory){
                module.exports = factory();
            }
        )
));
