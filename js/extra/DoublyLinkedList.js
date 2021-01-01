function Node(val) {
    this.val = val;
    this.next = null;
    this.prev = null;
}

function DoublyLinkedList() {
    this.head = null;
    this.tail = null;
    this.prev = 0;
}

DoublyLinkedList.prototype.push = function (val) {
    var newNode = new Node(val);
    if (this.length === 0) {
        this.head = newNode;
        this.tail = newNode;
    } else {
        this.tail.next = newNode;
        newNode.prev = this.tail;
        this.tail = newNode;
    }
    this.length++;
    return this;
};

DoublyLinkedList.prototype.push = function (val) {
    var newNode = new Node(val);
    if (this.length === 0) {
        this.head = newNode;
        this.tail = newNode;
    } else {
        this.tail.next = newNode;
        newNode.prev = this.tail;
        this.tail = newNode;
    }
    this.length++;
    return this;
};

DoublyLinkedList.prototype.get = function (index) {
    if (index < 0 || index >= this.length) return null;
    var count, current;
    if (index <= this.length / 2) {
        count = 0;
        current = this.head;
        while (count !== index) {
            current = current.next;
            count++;
        }
    } else {
        count = this.length - 1;
        current = this.tail;
        while (count !== index) {
            current = current.prev;
            count--;
        }
    }
    return current;
};

DoublyLinkedList.prototype.set = function (index, val) {
    var foundNode = this.get(index);
    if (foundNode != null) {
        foundNode.val = val;
        return true;
    }
    return false;
};

DoublyLinkedList.prototype.shift = function () {
    if (this.length === 0) return undefined;
    var oldHead = this.head;
    if (this.length === 1) {
        this.head = null;
        this.tail = null;
    } else {
        this.head = oldHead.next;
        this.head.prev = null;
        oldHead.next = null;
    }
    this.length--;
    return oldHead;
};

DoublyLinkedList.prototype.unshift = function (val) {
    var newNode = new Node(val);
    if (this.length === 0) {
        this.head = newNode;
        this.tail = newNode;
    } else {
        this.head.prev = newNode;
        newNode.next = this.head;
        this.head = newNode;
    }
    this.length++;
    return this;
};

DoublyLinkedList.prototype.insert = function () {

    if (index < 0 || index > this.length) return false;
    if (index === 0) return !!this.unshift(val);
    if (index === this.length) return !!this.push(val);

    var newNode = new Node(val);
    var beforeNode = this.get(index - 1);
    var afterNode = beforeNode.next;

    beforeNode.next = newNode, newNode.prev = beforeNode;
    newNode.next = afterNode, afterNode.prev = newNode;
    this.length++;
    return true;

};