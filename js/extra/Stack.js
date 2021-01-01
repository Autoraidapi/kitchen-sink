function Node(value){
    this.value = value;
}

function StackNode(value){
    Node.call(this, value);
    this.next = null;
};

StackNode.prototype = Object.create(Node.prototype, {
    constructor: {
    	configurable : true,
    	enumerable: true,
    	value : StackNode,
    	writable:true
    }
});

function Stack() {
    this.first = null;
    this.last = null;
    this.size = 0;
};

Stack.prototype.push = function (val) {
    var newNode = new StackNode(val);
    if (!this.first) {
        this.first = newNode;
        this.last = newNode;
    } else {
        var temp = this.first;
        this.first = newNode;
        this.first.next = temp;
    }
    return ++this.size;
};

Stack.prototype.pop = function () {
    if (!this.first) return null;
    var temp = this.first;
    if (this.first === this.last) {
        this.last = null;
    }
    this.first = this.first.next;
    this.size--;
    return temp.value;
};
