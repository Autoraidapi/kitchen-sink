function Node(value) {
    this.value = value;
};

function PriorityNode(value, priority) {
    Node.call(this, value);
    this.priority = priority;
};

PriorityNode.prototype = Object.create(Node.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: PriorityNode,
        writable: true
    }
});

function PriorityQueue() {
    this.values = [];
}

PriorityQueue.prototype.enqueue = function (value, priority) {
    var newNode = new PriorityNode(value, priority);
    this.values.push(newNode);
    this.bubbleUp();
}

PriorityQueue.prototype.bubbleUp = function () {
    var idx = this.values.length - 1;
    var element = this.values[idx];
    while (idx > 0) {
        var parentIdx = Math.floor((idx - 1) / 2);
        var parent = this.values[parentIdx];
        if (element.priority >= parent.priority) break;
        this.values[parentIdx] = element;
        this.values[idx] = parent;
        idx = parentIdx;
    }
}

PriorityQueue.prototype.dequeue = function () {
    var min = this.values[0];
    var end = this.values.pop();
    if (this.values.length > 0) {
        this.values[0] = end;
        this.sinkDown();
    }
    return min;
}

PriorityQueue.prototype.sinkDown = function () {
    var idx = 0;
    var length = this.values.length;
    var element = this.values[0];
    while (true) {
        var leftChildIdx = 2 * idx + 1;
        var rightChildIdx = 2 * idx + 2;
        var leftChild, rightChild;
        var swap = null;

        if (leftChildIdx < length) {
            leftChild = this.values[leftChildIdx];
            if (leftChild.priority < element.priority) {
                swap = leftChildIdx;
            }
        }
        if (rightChildIdx < length) {
            rightChild = this.values[rightChildIdx];
            if (
                (swap === null && rightChild.priority < element.priority) ||
                (swap !== null && rightChild.priority < leftChild.priority)
            ) {
                swap = rightChildIdx;
            }
        }
        if (swap === null) break;
        this.values[idx] = this.values[swap];
        this.values[swap] = element;
        idx = swap;
    }
}