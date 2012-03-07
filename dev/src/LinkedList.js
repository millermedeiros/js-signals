/**
 * Fast LinkedList implementation
 * @author Miller Medeiros
 * @version 0.1.1 (2012/03/07)
 */
signals.LinkedList = function(){
    this._head = null;
    this._tail = null;
    this._prev = null;
    this._length = 0;
};

signals.LinkedList.prototype = {

    hasNext : function(){
        return this._prev? !!this._prev.next : !!this._head;
    },

    // get next item of the list or head in case it's the first call
    next : function(){
        if (!this._prev) {
            this._prev = this._head;
        } else {
            this._prev = this._prev.next;
        }
        return this._prev? this._prev.data : null;
    },

    // reset iterator
    rewind : function(){
        this._prev = null;
    },

    append : function(data){
        var item = {data: data, next: null};

        if (!this._head) {
            this._head = this._tail = item;
        } else {
            this._tail.next = item;
            this._tail = item;
        }
        this._length++;
        return true;
    },

    prepend : function(data){
        this._head = {data: data, next: this._head};
        if (!this._tail) {
            this._tail = this._head;
        }
        this._length++;
        return true;
    },

    // compareFn used to check at which position the item should be added
    // it will be added just before item that returns `true` in the
    // compareFn check (useful for sorted inserts)
    insert : function(data, compareFn){
        var cur = this._head,
            prev = this._head,
            item;

        while (cur){
            if (compareFn(cur.data, data)) {
                item = {data: data, next: cur};
                if (cur !== prev) {
                    //safe-guard against cross-references
                    prev.next = item;
                } else {
                    this._head = item;
                }
                this._length++;
                return true;
            }
            prev = cur;
            cur = cur.next;
        }
        //if all checks returns `false` add it to the tail
        return this.append(data);
    },

    remove : function(data){
        if (!this._length) return false;
        var prev = this._head,
            cur = this._head;
        while (cur) {
            if (cur.data === data) {
                // no need to delete object properties since it won't have
                // any reference pointing to it it will be garbage collected
                prev.next = cur.next;
                this._length--;
                return true;
            }
            prev = cur;
            cur = cur.next;
        }
        return false;
    },

    removeAll : function(){
        //deleting head and tail is enough for the garbage collector to
        //kick in since it's the only reference to these objects
        this._head = this._tail = this._prev = null;
        this._length = 0;
    },

    size : function(){
        return this._length;
    }

};
