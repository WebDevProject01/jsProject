//Variables

let wines;
let HTTPMethod;
let sortName;
let lastAction;
let userLikes=[];
let availableTags = [];

let info;
let pictureSelect;
let picturesList;

const userId= 1;
const user = "myriam";
const pass = "epfc";
const apiUrl = "http://cruth.phpnet.org/epfc/caviste/public/index.php/api";
const pics = "http://cruth.phpnet.org/epfc/caviste/public/pics/";
const uploads = "http://cruth.phpnet.org/epfc/caviste/public/uploads/";

//Functions
function filter(){
	//Define last action
	lastAction='filter';
	//remove search input
	document.getElementById('inputSearch').value="";
	//filter by country
	const selectCountry = document.getElementById("selectCountry");
	const selectedCountry=selectCountry.options[selectCountry.selectedIndex].value;
	const selectYear = document.getElementById("selectYear");
	const selectedYear=selectYear.options[selectYear.selectedIndex].value;


	//case when the user want to filter by country and year
	if(selectedCountry!='Country'&&selectedYear!='Year'){
		selected = showWines(wines.filter(element => element.country == selectedCountry && element.year == selectedYear));
	}
	//case when the user want to filter only by year
	else if(selectedCountry=='Country'&&selectedYear!='Year'){
		selected = showWines(wines.filter(element => element.year == selectedYear));
	}
	//case when the user want to filter only by country
	else if(selectedCountry!='Country'&&selectedYear=='Year'){
		selected = showWines(wines.filter(element => element.country == selectedCountry));
	}
	else{
		showWines(wines);
	}

}

function sortBy(){
	const selectSort = document.getElementById('selectSort');
	const selectedSort=selectSort.options[selectSort.selectedIndex].value;
	sortName=selectedSort;
	wines = sort(wines);
	//allows the sort even when the wines are filtered or searched
	if(lastAction=='filter'){
		filter();
	}else if(lastAction=='search'){
		search();
	}
}

function sort(wines){
	//sort by year
	if(sortName=='Year'){
		return wines.sort((a, b) => a.year !== b.year ? a.year < b.year ? -1 : 1 : 0);
	}
	//sort by grapes
	else if(sortName=='Grapes'){
		return wines.sort((a, b) => a.grapes !== b.grapes ? a.grapes < b.grapes ? -1 : 1 : 0);
	}
	//sort by name
	else{
		return wines.sort((a, b) => a.name !== b.name ? a.name < b.name ? -1 : 1 : 0);
	}
}

function getAllYears(){
	const allYears = document.getElementById('selectYear');
	let setYear=new Set();
	let arrayYears;

	//creation of a set to remove duplicates
	for(let i=0;i<wines.length;i++){
		setYear.add(wines[i]['year']);
	}
	//transforming the set into an array to use the sort() function
	arrayYears = Array.from(setYear);
	arrayYears.sort();

	//browse the list to add appropriate option values
	for (let item of arrayYears){
		allYears.options[allYears.options.length] = new Option(item, item);
	}


}

function getAllCountries(){
	const allCountries = document.getElementById('selectCountry');
	let setCountry=new Set();
	let arrayCountries;

	//creation of a set to remove duplicates
	for(let i=0;i<wines.length;i++){
		setCountry.add(wines[i]['country']);
	}
	//transforming the set into an array to use the sort() function
	arrayCountries = Array.from(setCountry);
	arrayCountries.sort();

	//browse the list to add appropriate option values
	for (let item of arrayCountries){
		allCountries.options[allCountries.options.length] = new Option(item, item);
	}

}

function search(){
	//define last action
	lastAction='search';
	//Create searchResult array
	const inputSearch = document.getElementById("inputSearch").value;
	searchResult=[];
	wines.forEach(function(wine){
		if(wine.name.includes(inputSearch.toUpperCase())){
			searchResult.push(wine);
		}
	});
	//display array
	showWines(searchResult);
	//Removes filter values
	document.getElementById("selectYear").value="Year";
	document.getElementById("selectCountry").value="Country";
}

function addPictures(){
	document.getElementById("uploadHide").style.display = "block";
}

function uploadPictures(){

	let idWine = document.getElementById('idWine').value;
	const frmUpload = document.forms["frmUpload"];
	const dataUpload = new FormData(frmUpload);

	//Pour uploader une photo:
	let pictureSelect = document.getElementById('upload');

	let picturesList = pictureSelect.files[0];
	alert(picturesList.name);
	dataUpload.getAll(picturesList);

	const xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if (this.status === 200) {

			alert("Upload réussi !");
		}
	}

	xhr.onerror = function () {
		if (this.status === 404) {

			alert("Une erreur est survenue, la photo n'a pu être uploader");
		}
	};

	xhr.open("POST", apiUrl +'/wines/' + idWine + '/'+ 'pictures', true);
	xhr.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pass));
	xhr.send(dataUpload);

}

function deleteWine() {
	if (confirm("Voulez-vous vraiment supprimer ce vin ?")) {
		let info;
		const idWine = document.getElementById('idWine').value;
		const xhr = new XMLHttpRequest();
		xhr.onload = function () {
			if (this.status === 200) {
				let id = document.getElementById("idWine").value;
				let wine = wines.find((element) => element.id == id);
				wines.splice(wines.indexOf(wine), 1);
				info = "Le vin a bien été supprimé";
				showWines(wines);
			}
		};

		xhr.onerror = function () {
			if (this.status === 404) {
				//console.log('error');
				info = "Une erreur est survenue, le vin n'a pas pu être supprimé";
			}
		};
		xhr.open("DELETE", apiUrl +'/wines/' + idWine, true);
		xhr.setRequestHeader("My-Authorization", "Basic " + btoa(user + ":" + pass));
		xhr.send();
	}
}

//Delete picture
function deletePicture(){
	//This is the picture id of the image selected via the carousel
	pictureId=$('#carousel li.active').attr("data-id");
}

function autocomplete() {
	$( "#inputSearch" ).autocomplete({
		source: availableTags
	});
}

/**
* Fonction permettant de créer et modifier un vin
* @author Simon
* @author Rachida
*/
function saveWine() {

	const data = new FormData(); //Récupération des données du formulaire

	//Ajout des données du vin
	const idWine = document.getElementById("idWine").value;
	data.append("idWine", idWine);
	const name = document.getElementById("name").value;
	data.append("name", name);
	const grapes = document.getElementById("grapes").value;
	data.append("grapes", grapes);
	const country = document.getElementById("country").value;
	data.append("country", country);
	const region = document.getElementById("region").value;
	data.append("region", region);
	const year = document.getElementById("year").value;
	data.append("year", year);
	const price = document.getElementById("price").value;
	data.append("price", price);
	const capacity = document.getElementById("capacity").value;
	data.append("capacity", capacity);
	const color = document.getElementById("color").value;
	data.append("color", color);

	//Ajout des données extra si existantes
	let extra;
	const promo = document.getElementById("promo").value;
	const bio = document.getElementById("bio").checked;
	if (bio || promo != "") {
		if (bio && promo != "") {
			extra = { bio: true, promo: promo/100 };
		} else if (bio && promo == "") {
			extra = { bio: true };
		} else {
			extra = { promo: true };
		}
	}
	data.append("extra", extra);
	console.log(data);

	/** Ouverture et envois de la requète */
	const xhr = new XMLHttpRequest();
	//Fonction de rappel
	xhr.onload = function(){
		if (this.readyState === 4 && this.status === 200) {
			//Requête terminée et prête
			//Affichage selon les méthodes
			if (HTTPMethod == "POST") {
				alert("Le vin a bien été créé.");
			} else {
				alert("Le vin a bien été modifié.");
			}
		} else {
			//gestion des erreurs selon la méthode
			if (HTTPMethod == "POST") {
				alert("une erreur est survenue, le vin na pas été créé.");
			} else {
				alert("une erreur est survenue, le vin na pas été modifié.");
			}
		}
	};
	let requestUrl;
	if (HTTPMethod == "POST") {
		requestUrl=apiUrl+'/wines';
	} else if(HTTPMethod =='PUT'){
		id = document.getElementById("idWine").value;
		requestUrl =apiUrl + '/wines/' + id;
	}
	//Envoie de la requete au serveur
	xhr.open(HTTPMethod, requestUrl, true);
	xhr.setRequestHeader("My-Authorization", "Basic " + btoa(user + ":" + pass));
	xhr.send(data);
}

function newWine() {
	$(".error").slideUp();

	HTTPMethod = "POST";

	document.getElementById("promoHide").style.display = "block";
	document.getElementById("bioHide").style.display = "block";

	document.getElementById("name").value = "";
	document.getElementById("grapes").value = "";
	document.getElementById("country").value = "";
	document.getElementById("region").value = "";
	document.getElementById("year").value = "";
	document.getElementById("price").value = "";
	document.getElementById("color").value = "";
	document.getElementById("capacity").value = "";
	document.getElementById("bio").type = "checkbox";
	document.getElementById("promo").value = "";
}

function validateForm() {
	let msg = "";
	//Name
	if (document.getElementById("name").value == "") {
		msg = "Please enter a wine name";
		document.getElementById("nameError").innerHTML = msg;
	} else {
		document.getElementById("nameError").innerHTML = "";
	}

	//Grapes
	if (document.getElementById("grapes").value == "") {
		msg = "Please enter grapes type";
		document.getElementById("grapesError").innerHTML = msg;
	} else {
		document.getElementById("grapesError").innerHTML = "";
	}

	//Region
	if (document.getElementById("region").value == "") {
		msg = "Please enter a region";
		document.getElementById("regionError").innerHTML = msg;
	} else {
		document.getElementById("regionError").innerHTML = "";
	}

	//Country
	if (document.getElementById("country").value == "") {
		msg = "Please enter a country";
		document.getElementById("countryError").innerHTML = msg;
	} else {
		document.getElementById("countryError").innerHTML = "";
	}

	//Year
	const year = document.getElementById("year").value;
	let currentYear = new Date().getFullYear();
	if (isNaN(parseFloat(year)) ||
	year.value == "" ||
	parseFloat(year) < 1500 ||
	parseFloat(year) > currentYear){
		msg = "Please enter a valid year";
		document.getElementById("yearError").innerHTML = msg;
	} else {
		msg="";

	}

	//Capacity
	const capacity = document.getElementById("capacity").value;
	if (isNaN(parseFloat(capacity)) || capacity.value == "") {
		msg = "Please enter a capacity in litter";
		document.getElementById("capacityError").innerHTML = msg;
	} else {
		document.getElementById("capacityError").innerHTML = "";
	}

	//Price
	const price = document.getElementById("price").value;
	if (isNaN(parseFloat(price)) || price.value == "") {
		msg = "Please enter a valid price";
		document.getElementById("priceError").innerHTML = msg;
	} else{
		document.getElementById("priceError").innerHTML = "";
	}

	//Color
	const color = document.getElementById("color").value.toLowerCase();
	const existingWineColors = ['gray','orange','red','white','rosé','tawny','yellow','burgundy','sangria','ox blood'];
	if(!existingWineColors.includes(color)){
		msg = "Please enter a valid color. Here is a list:";
		existingWineColors.forEach(function(wineColor){
			msg+= " '"+wineColor+"' - ";
		});
		document.getElementById("colorError").innerHTML = msg;
	} else {
		document.getElementById("colorError").innerHTML = "";
	}

	//Promo
	const promo = document.getElementById("promo").value;
	if (promo != "") {
		if (isNaN(parseFloat(promo))) {
			msg = "Please enter a valid promotion";
			document.getElementById("promoError").innerHTML = msg;
		} else {
			document.getElementById("promoError").innerHTML = "";
		}
	}
	$(".error").slideDown();
	if (msg === "") {
		saveWine();
	}
}



function validateAddPictures(){
	let msgError = "";
	let pictures = document.getElementById("upload");


	if(pictures.files.length == ""){
	  msgError = "Please upload a max 200 000 size .jpg or .jpeg file";
	  document.getElementById("uploadError").innerHTML = msgError;

	} else if(pictures.files.length != ""){

	  if(pictures.size > frmUpload.MAX_FILE_SIZE.value){
		msgError = "Please upload a max 200 000 size file";
		document.getElementById("uploadError").innerHTML = msgError;

	} else if(pictures.accept != ".jpeg, .jpg"){      //condition n'est peut-être pas nécessaire car avec la précision dans le formulaire, cela nous limite à la selection des fichiers jpj uniquement.
	  msgError = "Please upload at least one .jpeg file";
	  document.getElementById("uploadError").innerHTML = msgError;

	} else {
		document.getElementById("uploadError").innerHTML = "";

		uploadPictures();
	 }

	}
}

//Request and show likes()
function getLikes(id){
	//Show user blue liked button if already liked
	const likeButton=document.getElementById('btnLike');
	if(userLikes.includes(id)){
		likeButton.className = 'likeButtonLiked';
	}else{
		likeButton.className = 'likeButton';
	}
	//Request and show wines like
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			let data = xhttp.responseText;
			let likes = JSON.parse(data);
			document.getElementById("wineLikesCount").innerHTML=likes.total +" user(s) like this wine.";
		}
	};
	xhttp.open("GET",apiUrl+'/wines/'+id+'/likes-count',true);
	xhttp.send();
}

function showWines(wines) {
	//Add Wines to List
	const emptyList = document.getElementById('winesList');
	let listContent = '';
	Object.keys(wines).forEach(function(key) {
		listContent += '<li data-id="'+wines[key].id+'" class="list-group-item list-group-item-action">'+wines[key].name+'</li>';
	});
	emptyList.innerHTML = listContent;

	//Add Event Listenners to each wine
	const liList = emptyList.querySelectorAll('li');
	for(li of liList){
		li.addEventListener('click',function() {
			showWine(this.dataset.id, wines);
		});
	}
	if(wines.length>0){
		$('#addUpdateWine').slideDown();
		showWine(wines[0].id);
	}else{
		$('#addUpdateWine').slideUp();
	}
}

function showWine(id) {
	//clear error messages
	$(".error").slideUp('slow');

	//define HTTPMethod for wine update as PUT
	HTTPMethod = "PUT";

	const wine = wines.find((element) => element.id == id);

	//Show common wine properties
	document.getElementById("idWine").value = wine.id;;
	document.getElementById("name").value = wine.name;
	document.getElementById("grapes").value = wine.grapes;
	document.getElementById("country").value = wine.country;
	document.getElementById("region").value = wine.region;
	document.getElementById("year").value = wine.year;
	document.getElementById("notes").value = wine.description;
	document.getElementById("price").value = wine.price;

	//Show capacity IF given
	if (wine.capicity === "0") {
		document.getElementById("capacity").value = "Not given";
	} else {
		document.getElementById("capacity").value = wine.capacity / 100 + "L";
	}
	//Show color IF given
	if (wine.color == "") {
		document.getElementById("color").value = "Not given";
	} else {
		document.getElementById("color").value = wine.color;
	}

	//Show extra properties of the wine
	if (wine.extra) {
		let extra = JSON.parse(wine.extra);
		if (extra.bio) {
			document.getElementById("bioHide").style.display = "block";
			document.getElementById("bio").value = "Oui";
		}
		if (extra.promo) {
			document.getElementById("promoHide").style.display = "block";
			document.getElementById("promo").value = extra.promo * 100 + "%";
		}
	} else if (wine.extra === null) {
		document.getElementById("bioHide").style.display = "none";
		document.getElementById("promoHide").style.display = "none";
	}
  
	//Get and show wine Likes
	getLikes(id);

	//Get and show pictures
	getPictures(wine);

}

//Like or dislike a wine
function like(){
	//prevents page from reloading
	event.preventDefault();

	const xhr = new XMLHttpRequest();
	const id=document.getElementById('idWine').value;

	//Choose if like or unlike wine
	let like=false;
	if(!userLikes.includes(id)){
		like=true;
	}
	let toSend={like:like};
	toSend = JSON.stringify(toSend);

	//Request handler
	xhr.onload = function () {
		//Success : Add wine to likedWines and show wine.
		if (this.status === 200) {
			if(like){
				userLikes.push(id);
			}else{
				let index = userLikes.indexOf(id);
				userLikes.splice(index, 1);
			}
			getLikes(id);
		} else{
			alert(xhr.responseText);
		}
	};
	xhr.open("PUT",apiUrl+'/wines/'+id+'/like',true);
	xhr.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pass));
	xhr.send(toSend);
}

//Request and show pictures
function getPictures(wine){
	document.getElementById("carousel-inner").innerHTML='';
	const xhttp = new XMLHttpRequest();

	//Add the image of the API
	let div = '<div class="carousel-item active"><img  src="' + pics + wine.picture + '" alt="' + wine.name + ' picture"></div>';
	document.getElementById("carousel-inner").innerHTML = div;

	xhttp.onload = function () {
		if(xhttp.status===200) {

			let data = xhttp.responseText;
			let JSONpictures = JSON.parse(data);

			//create list for carousel indicators
			const carouselIndicators = document.getElementById("carousel-indicators");
			let count=1;
			let li = '<li data-target="#carousel" data-slide-to="0" class="active"></li>';;
			for (let prop in JSONpictures) {
				li += '<li data-target="#carousel" data-id="'+JSONpictures[prop].id+'" data-slide-to="'+count+'"></li>';
				count++;;
			}
			carouselIndicators.innerHTML =li;

			//Add user images to carousel
			for (let prop in JSONpictures) {
				div +='<div class="carousel-item"><img  src="'+ uploads +JSONpictures[prop].url+'" alt"' +wine.name+ ' picture"></div>';
			}
			document.getElementById("carousel-inner").innerHTML = div;
			$('.carousel').carousel('pause');
		}
	};

	xhttp.open("GET",apiUrl+'/wines/'+wine.id+'/pictures',true);
	xhttp.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pass));
	xhttp.send();
}

//Get wines from the API and then display them
function getWines(){
	//Data gathering from the API
	const xhttp = new XMLHttpRequest();
	let	winesArray=[];
	xhttp.onreadystatechange = function() {
		if(xhttp.readyState==4 && xhttp.status==200) {
			let data = xhttp.responseText;
			wines = JSON.parse(data);
			for (let prop in wines) {
				//fill the array with our wines
				winesArray.push(wines[prop]);
				//Create tag for autocompletion on search
				availableTags.push(wines[prop].name.toLowerCase());
			}
			winesArray.sort((a, b) => a.name !== b.name ? a.name < b.name ? -1 : 1 : 0);
			wines = winesArray;
			showWines(wines);
			//call the functions allowing the filter/sort dynamically
			getAllYears();
			getAllCountries();

		}
	};
	xhttp.open('GET',apiUrl+'/wines',true);
	xhttp.send();
}

//Fill array with the likes of the user once
function getUserLikes(){
	//Data gathering from the API
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(xhttp.readyState==4 && xhttp.status==200) {
			let data = xhttp.responseText;
			let wines = JSON.parse(data);
			for (let prop in wines) {
				userLikes.push(wines[prop].id);
			}
		}
	};
	xhttp.open('GET',apiUrl+'/users/'+userId+'/likes/wines',true);
	xhttp.send();
}

//Main

window.onload = function() {

	getWines();
	getUserLikes();
	autocomplete();

	//Buttons and inputs
	let btnSearch = document.getElementById('btnSearch');
	let btnNew = document.getElementById('btnNew');
	let btnSave = document.getElementById('btnSave');
	let btnDelete = document.getElementById('btnDelete');
	let btnFilter = document.getElementById('btnFilter');
	let btnSortBy=document.getElementById('btnSortBy');
	let btnLike=document.getElementById('btnLike');
	let btnAddPictures = document.getElementById('btnAddPictures');
	let btnUpload = document.getElementById('btnUpload');
	let input = document.getElementById("inputSearch");

	//Events creation
	btnSearch.addEventListener('click', search);
	btnNew.addEventListener('click', newWine);
	btnSave.addEventListener('click',validateForm);
	btnDelete.addEventListener('click', deleteWine);
	btnFilter.addEventListener('click', filter);
	btnSortBy.addEventListener('click', sortBy);
	btnLike.addEventListener('click', like);
	btnAddPictures.addEventListener('click', addPictures);
	btnUpload.addEventListener('click', validateAddPictures);
	input.addEventListener("keydown", function(event) {
		// Number 13 is the "Enter" key on the keyboard
		if (event.keyCode === 13) {
			event.preventDefault();
			search();
		}
	});
};
