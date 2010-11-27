
/*
 * The contents of this file are subject to the Mozilla Public License
 * Version 1.1 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 * 
 * The Initial Developer of the Original Code is Steffen Siering. All Rights Reserved.
 */

(function() {

    /** @scope _global_ */
    /**
     * Abstract class for more specific DOM-Node classes.
     *
     * @class
     */
    function DomAbstract(){ return this; }

    this.DomAbstract = DomAbstract; // export DomAbstract

    DomAbstract.constructor = DomAbstract;
    /** @function */
    DomAbstract.prototype.__doGetElementsBy = function(){return []};
    DomAbstract.prototype.getElementsByTagName = function(){ return []; };
    DomAbstract.prototype.getElementById = function(){ return null; };
    DomAbstract.prototype.getAttribute = function(){ return ""};
    DomAbstract.prototype.setAttribute = function(){};
    DomAbstract.prototype.removeAttribute = function(){};
    DomAbstract.prototype.cloneNode = function(){};
    DomAbstract.prototype.uid = 1;
    DomAbstract.prototype.nodeValue = null;
    DomAbstract.prototype.firstChild = null;
    DomAbstract.prototype.nextSibling = null;
    DomAbstract.prototype.previousSibling = null;
    DomAbstract.prototype.style = "";

    DomAbstract.prototype.getInnerHTML = function(){};
    DomAbstract.prototype.setInnerHTML = function(val){};
    DomAbstract.prototype.getInnerText = function(){};
    DomAbstract.prototype.setInnerText = function(){};
    DomAbstract.prototype.getOuterHTML = function(){};
    DomAbstract.prototype.setOuterHTML = function(){};

    DomAbstract.prototype.__defineGetter__("innerText", function(){ return 
        this.getInnerText(); 
    });
    DomAbstract.prototype.__defineSetter__("innerText", function(x){ 
        this.setInnerText(x); 
    });
    DomAbstract.prototype.__defineGetter__("innerHTML", function(){ 
        return this.getInnerHTML(); 
    });
    DomAbstract.prototype.__defineSetter__("innerHTML", function(x){
        this.setInnerHTML(x); 
    });
    DomAbstract.prototype.__defineGetter__("outerHTML", function(){
        return this.getOuterHTML(); 
    });
    DomAbstract.prototype.__defineSetter__("outerHTML", function(x){
        this.setOuterHTML(x); 
    });

    /** @scope _global_ */
    /**
     * DOM Element Node.
     *
     * @class
     */
    function DomElement(parent, tag, attrs) {
        this.nodeType = 1;
        this.initialized = false;

        this.style = "";
        this.className = '';
        this.id = null;
        this.lang = null;

        var attrs = !attrs ? [] : $A(attrs).filter(function(x){
                    if(x.nodeName == "class") {
                        this.className = x.nodeValue; 
                        return false; 
                    }
                    if(x.nodeName == "id") {
                        this.id = x.nodeValue;
                        return false;
                    }
                    if(x.nodeName == "lang") {
                        this.lang = x.nodeValue;
                        return false; 
                    }
                    if(x.nodeName == "style") {
                        this.style = x.nodeValue;
                        return false;
                    }

                    return true;
                }, this);
        this.tagName = tag;
        this.attrs = attrs;
        this.parentNode = parent;
        this.childNodes = [];
        this.$family = true;
        this.nodeName = tag.toUpperCase();

        this.firstChild = null;
        this.lastChild = null;
        this.nextSibling = null;
        this.previousSibling = null;
        this.initialized = true;

        return this;
    }
    this.DomElement = DomElement; //export class DomElement

    DomElement.constructor = DomElement;

    DomElement.prototype = new DomAbstract();

    DomElement.prototype.cloneNode = function(recursive){
        var rec = arguments.length == 0 ? true : recursive;

        var ret = new DomElement(undefined, this.tagName, this.copyAttributes);
        ret.className = this.className ? this.className : "";
        ret.id = this.id ? this.id : null;
        ret.lang = this.lang ? this.lang : null;
        ret.style = this.style ? this.style : null;

        if(recursive){
            ret.childNodes = this.childNodes.map(function(child){
                                var c = child.cloneNode(recursive);
                                return c;
                           });
        }
        linkChildren(ret);
        return ret;
    };

    DomElement.prototype.copyAttributes = function(){
        this.attrs.map(function(attr){
                    return { nodeName: attr.nodeName, 
                             nodeValue: attr.nodeValue,
                             nodeType: attr.nodeType};
                });
    };

    DomElement.prototype.appendChild = function(newChild) {
        if(newChild.parentNode) newChild.parentNode.removeChild(newChild);
        this.childNodes.push(newChild);
        newChild.nextSibling = null;
        newChild.previousSibling = this.last;
        newChild.parentNode = this;
        this.lastChild = newChild;
    };

    DomElement.prototype.hasChildNodes = function() {
                       return this.childNodes.length > 0;
    };

    DomElement.prototype.insertBefore = function(newChild, child) {
        if(arguments.length === 1 || !child) this.appendChild(newChild);
        if(newChild.parentNode) newChild.parentNode.removeChild(newChild);

        newChild.parentNode = this;
        newChild.previousSibling = child.previousSibling;
        newChild.nextSibling = child;
        child.previousSibling = newChild;
        var i = this.childNodes.indexOf(child);
        this.childNodes.splice(i,0,newChild);
    };

    DomElement.prototype.removeChild = function(child) {
        if(!child || !child.parentNode || child.parentNode !== this)
            return undefined;

        this.childNodes.erase(child);
        if(child.previousSibling) {
            child.previousSibling.nextSibling = child.nextSibling;
        }

        if(child.nextSibling){
            child.nextSibling.previousSibling = child.previousSibling;
        }

        child.parentNode = null;
        child.previousSibling = child.nextSibling = null;
        return child;
    };

    DomElement.prototype.replaceChild = function(newChild, oldChild) {
        if(newChild.parentNode) newChild.parentNode.removeChild(newChild);
        newChild.parentNode = this;
        newChild.previousSibling = oldChild.previousSibling;
        newChild.previousSibling.nextSibling = newChild;
        newChild.nextSibling = oldChild.previousSibling;
        newChild.nextSibling.previousSibling = newChild;
        if(this.lastChild == oldChild) this.lastChild = newChild;

        var i = this.childNodes.indexOf(oldChild);
        this.childNodes.splice(i,1,newChild);
        return oldChild;
    };

    DomElement.prototype.__doGetElementsBy = function(selector, first) {
        var ret = [];

        this.childNodes.map(function(elem){
                    if(!elem.__doGetElementsBy) return [];
                    var children = elem.__doGetElementsBy(selector, first);
                    return selector(elem) ? 
                             [elem].concat(children) : 
                             children;
                }).each( function(elemSubs){
                    if(elemSubs && elemSubs.length>0)
                        ret = ret.concat(elemSubs.filter(function(x){return x}));
                });
        return (!ret || ret.length == 0) ? null : ret;
    };

    DomElement.prototype.getElementsByTagName = function(name) {
        return this.__doGetElementsBy(
                name === "*" ? function(x){ return x.nodeType == 1; } : 
                               function(x){ 
                                    return x.tagName == name; 
                               }, 
                false);
    };

    DomElement.prototype.getElementById = function(id) {
        var tmp = this.__doGetElementsBy(function(x){ return x.id == name; },
                                         false);
        return tmp && tmp.length > 0 ? tmp[0] : undefined;
    };

    DomElement.prototype.getElement = $defined(this['Element']) ? 
        Element.prototype.getElement :
        function(tag) {
            return this.getElements(tag)[0] || null;
        };

    DomElement.prototype.getElements = $defined(this['Element']) ?
        function() {
            var ret = Element.prototype.getElements.apply(this, arguments);
            return ret;
        } :
        function(tags) {
            tags = tags.split(',');
            var elements = null;
            tags.each(function(tag){
                tag = tag.trim().toLowerCase();
                var partial = this.getElementsByTagName(tag);
                elements = elements ? elements.concat(partial) : partial;
            }, this);
            return elements ? elements : [];
        };

    DomElement.prototype.getAttribute = function(name) {
        if(name === "id") return this.id;
        if(name === "lang") return this.lang;

        for(var i=0; i < this.attrs.length; i++){
            if(this.attrs[i].nodeName == name) {
                return this.attrs[i].nodeValue;
            }
        }
        return "";
    };

    DomElement.prototype.setAttribute = function(name, value){
        for(var i=0; i < this.attrs.length; i++){
            if(this.attrs[i].nodeName == name) {
                this.attrs[i].nodeValue = value;
            }
        }
    };

    DomElement.prototype.removeAttribute = function(name){
        for(var i=0; i < this.attrs.length; i++){
            if(this.attrs[i].nodeName == name) {
                this.attrs.splice(i,1);
                return;
            }
        }
    };

    DomElement.prototype.getProperty = $defined(this['Element']) ? 
        Element.prototype.getProperty : undefined,

    DomElement.prototype.setProperty = $defined(this['Element']) ? 
        Element.prototype.setProperty : undefined,

    DomElement.prototype.removeProperty = $defined(this['Element']) ? 
        Element.prototype.removeProperty : undefined,

    DomElement.prototype.getProperties = $defined(this['Element']) ? 
        Element.prototype.getProperties : undefined,

    DomElement.prototype.setProperties = $defined(this['Element']) ? 
        Element.prototype.setProperties : undefined,

    DomElement.prototype.removeProperties = $defined(this['Element']) ? 
        Element.prototype.removeProperties : undefined,

    DomElement.prototype.hasClass = $defined(this['Element']) ? 
        Element.prototype.hasClass :
        function(className) {
            return this.className.contains(className, ' ');
        }
    ;

    if ($defined(this['Element'])) {
        DomElement.prototype.get = $defined(this['Element']) ? 
                                    Element.prototype.get : 
                                    undefined;

        DomElement.prototype.set = $defined(this['Element']) ? 
                                    Element.prototype.set : 
                                    undefined;
    }

    DomElement.prototype.addClass = function(className) {
        if (!this.hasClass(className)) {
            this.className = (this.className + ' ' + className).clean();
        }
        return this;
    };

    DomElement.prototype.removeClass = function(className) {
        var regex = new RegExp('(^|\\s)' + className + '(?:\\s|$)');
        this.className = this.className.replace(regex, '$1');
        return this;
    };

    DomElement.prototype.toggleClass = function(className) {
        return this.hasClass(className) ? 
            this.removeClass(className) : 
                this.addClass(className);
    };



    DomElement.prototype.getInnerHTML = function(){
        if(!this.initialized) return "";
        var strs = "";

        if(this.childNodes && this.childNodes.length > 0)
            this.childNodes.forEach(function(x){ 
                    strs += x.getOuterHTML(); 
                });
        return strs;
    };

    DomElement.prototype.setInnerHTML = function(val){
        this.childNodes = parseDom(val);
        linkChildren(this);
    };

    DomElement.prototype.getOuterHTML = function(){
        if(!this.initialized) return;

        var self = this;
        var str = "<" + self.tagName;
        function addAttrib(name, value){
            if(value) str += ' ' + name + '="' + value + '"';
        }
        addAttrib('id', this.id);
        addAttrib('class', this.className);
        addAttrib('lang', this.lang);
        addAttrib('style', this.style);
        self.attrs.forEach( function(x){ 
            addAttrib(x.nodeName, x.nodeValue); 
        });
        str += ">";

        str += this.getInnerHTML();
        str += "</" + self.tagName + ">";
        return str;
    };

    DomElement.prototype.setOuterHTML = function(){
        throw 'property outerHTML is read only';
    };

    /**
     * DOM Text Node.
     *
     * @class
     */
    function DomText(text) {
        this.nodeType = 3;

        this.nodeValue = String(text);
        this.nodeName = "#text";

        return this;
    }

    this.DomText = DomText; //export class DomText

    DomText.constructor = DomText;
    DomText.prototype = new DomAbstract();

    DomText.prototype.cloneNode = function(){
        return new DomText(this.nodeValue.substr(0));
    };

    DomText.prototype.getOuterHTML = function(){
        return this.nodeValue;
    };

    DomText.prototype.setOuterHTML = function(val){
        var tmp = parseDom(val)[0];
       $extend( this, tmp );
       this.nodeType = tmp.nodeType;
       this.nodeName = tmp.nodeName;
    };

    DomText.prototype.getInnerHTML = function(){
        return this.nodeValue;
    };

    DomText.prototype.setInnerHTML = function(val){
        return this.nodeValue;
    };

    DomText.prototype.getInnerText = function(){
        return unescape(this.nodeValue);
    };

    DomText.prototype.setInnerText = function(val){
        this.nodeValue = escape(val);
    };

    function mkElem(parent, tag, attrs, unary) {
        attrs = attrs.map(function(x){
            return { nodeName: x.name, nodeValue: x.value, nodeType:2 };
        });
        return new DomElement(parent, tag, attrs);
    }

    function linkChildren(elem) {
        if(!elem.childNodes || elem.childNodes.length === 0 ) return;

        elem.firstChild = elem.childNodes[0];

        var last = null;
        elem.childNodes.forEach( function(child){
                child.parentNode = elem;
                if(last) {
                    last.nextSibling = child;
                    child.previousSibling = last;
                }
                last = child;
        });
        elem.lastChild = last;
        last.nextSibling = null;
    }

    /**
     * parses DOM structure from given text.
     *
     * @param {String} text HTML-String to parse
     *
     * @return DOM Tree Root Node, or if no specific root an Array of DOM Nodes.
     */
    function parseDom(text) {
        var stack = [];
        var elem = null;
        var roots = [];

        HTMLParser(text, {
            start: function( tag, attrs, unary ) {
                if(unary){
                    (elem ? elem.childNodes : roots).
                        push(mkElem(elem, tag, attrs));
                } else {
                    if(elem) {
                        stack.push(elem);
                    }
                    elem = mkElem(elem, tag, attrs, unary);
                }
            },

            end: function( tag ) {
                var old = stack.pop();
                ($defined(old) && old ? old.childNodes : roots).push(elem);
                linkChildren(elem);
                elem = old;
            },

            chars: function( text ) {
                if (!text || text.trim() == "") return;
                (elem ? elem.childNodes : roots).push(new DomText(text));
            }
        });

        return roots.length == 1 ? roots[0] : roots;
    }
    this.parseDom = parseDom;

})();

