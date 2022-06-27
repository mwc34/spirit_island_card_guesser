function autocomplete(inp, arr) {
	/*the autocomplete function takes two arguments,
	the text field element and an array of possible autocompleted values:*/
	var currentFocus;
	/*execute a function when someone writes in the text field:*/
	inp.addEventListener("input", function(e) {
		var a, b, i, val = this.value;
		/*close any already open lists of autocompleted values*/
		closeAllLists();
		if (!val) { return false;}
		currentFocus = -1;
		/*create a DIV element that will contain the items (values):*/
		a = document.createElement("DIV");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");
		/*append the DIV element as a child of the autocomplete container:*/
		this.parentNode.appendChild(a);
		/*for each item in the array...*/
		for (i = 0; i < arr.length; i++) {
			/*check if the item starts with the same letters as the text field value:*/
			if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				/*create a DIV element for each matching element:*/
				b = document.createElement("DIV");
				/*make the matching letters bold:*/
				b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
				b.innerHTML += arr[i].substr(val.length);
				/*insert a input field that will hold the current array item's value:*/
				b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
				/*execute a function when someone clicks on the item value (DIV element):*/
				b.addEventListener("click", function(e) {
					/*insert the value for the autocomplete text field:*/
					inp.value = this.getElementsByTagName("input")[0].value;
					/*close the list of autocompleted values,
					(or any other open lists of autocompleted values:*/
					closeAllLists();
				});
				a.appendChild(b);
			}
		}
	});
	/*execute a function presses a key on the keyboard:*/
	inp.addEventListener("keydown", function(e) {
		var x = document.getElementById(this.id + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
			/*If the arrow DOWN key is pressed,
			increase the currentFocus variable:*/
			currentFocus++;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 38) { //up
			/*If the arrow UP key is pressed,
			decrease the currentFocus variable:*/
			currentFocus--;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 13) {
			if (currentFocus > -1) {
				/*and simulate a click on the "active" item:*/
				if (x) x[currentFocus].click();
			}
		}
	});
	function addActive(x) {
		/*a function to classify an item as "active":*/
		if (!x) return false;
		/*start by removing the "active" class on all items:*/
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = (x.length - 1);
		/*add class "autocomplete-active":*/
		x[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(x) {
		/*a function to remove the "active" class from all autocomplete items:*/
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}
	function closeAllLists(elmnt) {
		/*close all autocomplete lists in the document,
		except the one passed as an argument:*/
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	/*execute a function when someone clicks in the document:*/
	document.addEventListener("click", function (e) {
		closeAllLists(e.target);
	});
}

function startSet() {
	let sample_count = 5;
	let population = completeCards;
	cardsToGuess = [];
	for (let idx of getSubset(population.length, sample_count)) {
		cardsToGuess.push(population[idx]);
	}
	resetScore();
	setCardsLeft(sample_count);
}

function getSubset(population_count, sample_count) {
	let population = [...Array(population_count).keys()];
	let samples = [];
	for (let i=0; i<sample_count; i++) {
		let idx = Math.floor(Math.random()*population.length);
		samples.push(population[idx]);
		population.splice(idx, 1);
	}
	return samples;
}

function newCard() {
	if (!cardsToGuess.length) {
		currentCard = null;
		cardImage.src = "";
		return;
	}
	currentCard = cardsToGuess.splice(0, 1)[0];
	cardImage.src = currentCard.art.url;
}

function makeGuess() {
	let guess = cardInput.value;
	if (!guess.length) return
	
	cardInput.value = "";
	if (currentCard) {
		if (currentCard.title == guess) {
			incrementScore(true);
		}
		else {
			incrementScore(false);
		}
		decrementCardsLeft();
		if (getCardsLeft())
			newCard();
	}
}

function setCardsLeft(v) {
	cardsLeft.innerHTML = `Cards Left: ${v}`;
}

function decrementCardsLeft() {
	setCardsLeft(getCardsLeft() - 1);
}

function getCardsLeft() {
	return parseInt(cardsLeft.innerHTML.slice(12));
}

function resetScore() {
	score.innerHTML = "Score: 0/0";
}

function incrementScore(correct) {
	currentCorrect = parseInt(score.innerHTML.slice(7));
	currentTotal = parseInt(score.innerHTML.slice(9));
	score.innerHTML = `Score: ${currentCorrect + correct}/${currentTotal + 1}`
}

const cardInput = document.getElementById("cardInput");
const cardImage = document.getElementById("cardImage");
const cardsLeft = document.getElementById("cardsLeft");
const score = document.getElementById("score");
const completeCards = [];
const cardTitles = [];
window.fetch('/card-guesser/complete_cards.json').then(x => x.json()).then(x => {for (let card of x) {completeCards.push(card);cardNames.push(card.title)}});
autocomplete(cardInput, cardTitles);
var currentCard = null;
var cardsToGuess = [];
