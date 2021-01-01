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

function StackNode(){

};

function QueueNode(){

};


function Doctor(name){
    this.preinitialize.apply(this, arguments);
    this.name = name;
    this.initialize.apply(this, arguments);
};

Doctor.prototype.preinitialize = function(){};

Doctor.prototype.initialize = function(){};

Doctor.prototype.treat = function(){
	return "treated";
};

Doctor.prototype.toString = function(){
	return "[Doctor "+this.name +"]";
};

function Surgeon(name,type){
    Doctor.call(this,name);
    this.preinitialize.apply(this, arguments);
	this.name = name;
    this.type = type;
    this.initialize.apply(this, arguments);
}

Surgeon.prototype = Object.create(Doctor.prototype,{
    constructor: {
    	configurable : true,
    	enumerable: true,
    	value:Surgeon,
    	writable:true
    }
});

Surgeon.prototype.preinitialize = function(){};

Surgeon.prototype.initialize = function(){};

Surgeon.prototype.treat = function(){
	return Doctor.prototype.treat.call(this)+ " operated";
};

Surgeon.prototype.toString = function(){
	return "[Surgeon "+this.name +" type "+this.type +"]";
};

