function Node(value) {
    this.value = value;
}

function QueueNode(value) {
    Node.call(this, value);
    this.next = null;
};

QueueNode.prototype = Object.create(Node.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: QueueNode,
        writable: true
    }
});

function Queue() {
    this.first = null;
    this.last = null;
    this.size = 0;
};

Queue.prototype.enqueue = function (val) {
    var newNode = new QueueNode(val);
    if (!this.first) {
        this.first = newNode;
        this.last = newNode;
    } else {
        this.last.next = newNode;
        this.last = newNode;
    }
    return ++this.size;
};

Queue.prototype.dequeue = function () {
    if (!this.first) return null;
    var temp = this.first;
    if (this.first === this.last) {
        this.last = null;
    }
    this.first = this.first.next;
    this.size--;
    return temp.value;
};