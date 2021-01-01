function Graph() {
	this.adjacencyList = {};
}

Graph.prototype.addVertex = function (vertex) {
	if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
}

Graph.prototype.addEdge = function (v1, v2) {
	this.adjacencyList[v1].push(v2);
	this.adjacencyList[v2].push(v1);
}

Graph.prototype.removeEdge = function (vertex1, vertex2) {
	this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(function (v) {
		return v !== vertex2;
	});
	this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(function (v) {
		return v !== vertex1;
	});
}

Graph.prototype.removeVertex = function (vertex) {
	while (this.adjacencyList[vertex].length) {
		var adjacentVertex = this.adjacencyList[vertex].pop();
		this.removeEdge(vertex, adjacentVertex);
	}
	delete this.adjacencyList[vertex];
}