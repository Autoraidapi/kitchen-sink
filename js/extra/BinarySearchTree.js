function Node(value){
    this.value = value;
}

function BinarySearchNode(value){
    Node.call(this, value);
    this.left = null;
	this.right = null;
};

BinarySearchNode.prototype = Object.create(Node.prototype, {
    constructor: {
    	configurable : true,
    	enumerable: true,
    	value : BinarySearchNode,
    	writable:true
    }
});

function BinarySearchTree() {
	this.root = null;
};

BinarySearchTree.prototype.insert = function (value) {
	var newNode = new BinarySearchNode(value);
	if (this.root === null) {
		this.root = newNode;
		return this;
	}
	var current = this.root;
	while (true) {
		if (value === current.value) return undefined;
		if (value < current.value) {
			if (current.left === null) {
				current.left = newNode;
				return this;
			}
			current = current.left;
		} else {
			if (current.right === null) {
				current.right = newNode;
				return this;
			}
			current = current.right;
		}
	}
}

BinarySearchTree.prototype.find = function (value) {
	if (this.root === null) return false;
	var current = this.root,
		found = false;
	while (current && !found) {
		if (value < current.value) {
			current = current.left;
		} else if (value > current.value) {
			current = current.right;
		} else {
			found = true;
		}
	}
	if (!found) return undefined;
	return current;
}

BinarySearchTree.prototype.contains = function (value) {
	if (this.root === null) return false;
	var current = this.root,
		found = false;
	while (current && !found) {
		if (value < current.value) {
			current = current.left;
		} else if (value > current.value) {
			current = current.right;
		} else {
			return true;
		}
	}
	return false;
}