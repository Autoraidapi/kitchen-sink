function View() {
	
	/* first */
	this.initialize.apply(this, arguments);

	/* Constructors */
	this.fragment = new DocumentFragment();
	this.request = new XMLHttpRequest();

	/* cache all dom nodes for the app in here */
	this.category = document.querySelector("#category");
	this.searchTerm = document.querySelector("#searchTerm");
	this.searchBtn = document.querySelector("button");
	this.article = document.querySelector("article");

}

View.prototype = {

	/* additional options and varibales to apply to the `View` object at runtime */
	initialize: function (options) {
		options = options || {};
	},

	/* uses XMLHttpRequest constructor */
	firstRequest: function () {},
	fetchBlob: function () {},

	/* uses  DocumentFragment constructor */
	updateDisplay: function () {},
	selectProduct: function () {},
	showProduct: function () {}
	
};

// new View();

/* OLD */
var products, icons;

var request;

function firstRequest() {
	request = new XMLHttpRequest();
	request.open("GET", "../json/catalog.json", true);
	request.responseType = "text";
	request.onload = function () {
		if (request.status === 200) {
			icons = JSON.parse(request.response);
			initialize();
		} else {
			console.log(
				"Network request for products.json failed with response " +
					request.status +
					": " +
					request.statusText
			);
		}
	};
	request.send(null);
}

var request = new XMLHttpRequest();
request.open("GET", "../json/catalog.json");
request.responseType = "text";

request.onload = function () {
	if (request.status === 200) {
		products = JSON.parse(request.response);
		initialize();
	} else {
		console.log(
			"Network request for products.json failed with response " +
				request.status +
				": " +
				request.statusText
		);
	}
};

request.send();

function initialize() {
	var category = document.querySelector("#category");
	var searchTerm = document.querySelector("#searchTerm");
	var searchBtn = document.querySelector("button");
	var article = document.querySelector("article");
	var lastCategory = category.value;
	var lastSearch = "";
	var categoryGroup;
	var finalGroup;
	finalGroup = products;
	updateDisplay();
	categoryGroup = [];
	finalGroup = [];
	searchBtn.onclick = selectCategory;
	function selectCategory(e) {
		e.preventDefault();
		categoryGroup = [];
		finalGroup = [];
		if (
			category.value === lastCategory &&
			searchTerm.value.trim() === lastSearch
		) {
			return;
		} else {
			lastCategory = category.value;
			lastSearch = searchTerm.value.trim();
			if (category.value === "All") {
				categoryGroup = products;
				selectProducts();
			} else {
				var lowerCaseType = category.value.toLowerCase();
				for (var i = 0; i < products.length; i++) {
					if (products[i].type === lowerCaseType) {
						categoryGroup.push(products[i]);
					}
				}
				selectProducts();
			}
		}
	}

	function selectProducts() {
		if (searchTerm.value.trim() === "") {
			finalGroup = categoryGroup;
			updateDisplay();
		} else {
			var lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
			for (var i = 0; i < categoryGroup.length; i++) {
				if (categoryGroup[i].name.indexOf(lowerCaseSearchTerm) !== -1) {
					finalGroup.push(categoryGroup[i]);
				}
			}
			updateDisplay();
		}
	}

	function updateDisplay() {
		while (article.firstChild) {
			article.removeChild(article.firstChild);
		}
		if (finalGroup.length === 0) {
			var para = document.createElement("p");
			para.textContent = "No results to display!";
			article.appendChild(para);
		} else {
			for (var i = 0; i < finalGroup.length; i++) {
				fetchBlob(finalGroup[i]);
			}
		}
	}

	function fetchBlob(product) {
		var url = "../img/catalog/" + product.image;
		var request = new XMLHttpRequest();
		request.open("GET", url);
		request.responseType = "blob";
		request.onload = function () {
			if (request.status === 200) {
				var blob = request.response;
				var objectURL = URL.createObjectURL(blob);
				showProduct(objectURL, product);
			} else {
				console.log(
					'Network request for "' +
						product.name +
						'" image failed with response ' +
						request.status +
						": " +
						request.statusText
				);
			}
		};

		request.send();
	}

	function showProduct(objectURL, product) {
		var fragment = document.createDocumentFragment();
		var section = document.createElement("section");
		var heading = document.createElement("h3");
		var para = document.createElement("p");
		var image = document.createElement("img");

		section.setAttribute("class", product.type);

		heading.textContent = product.name.replace(
			product.name.charAt(0),
			product.name.charAt(0).toUpperCase()
		);

		image.src = objectURL;
		image.alt = product.name;
		section.appendChild(heading);
		section.appendChild(para);
		section.appendChild(image);

		fragment.appendChild(section);
		article.appendChild(fragment);
	}
}
