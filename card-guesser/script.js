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
			let start_idx = arr[i].toUpperCase().indexOf(val.toUpperCase())
			if (start_idx >= 0) {
				/*create a DIV element for each matching element:*/
				b = document.createElement("DIV");
				/*make the matching letters bold:*/
				b.innerHTML = arr[i].substr(0, start_idx);
				b.innerHTML += "<strong>" + arr[i].substr(start_idx, val.length) + "</strong>";
				b.innerHTML += arr[i].substr(val.length + start_idx);
				/*insert a input field that will hold the current array item's value:*/
				b.innerHTML += `<input type="hidden" value="${arr[i]}">`;
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
			/*If the ENTER key is pressed, prevent the form from being submitted,*/
			if (currentFocus > -1) {
				/*and simulate a click on the "active" item:*/
				if (x) x[currentFocus].click();
			}
			else if (x && x.length == 1) {
				x[0].click();
			}
			else {
				e.preventDefault();
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

function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

function startSet() {
	// Set function to find set urls
	// Maximal
	if (guessTypeOptions.children[0].classList.contains("activeOption")) {
		cardGuessURI = (x) => `/card-guesser/maximal_cards_img/${x}.png`;
	}
	// No Picture
	if (guessTypeOptions.children[1].classList.contains("activeOption")) {
		cardGuessURI = (x) => `/card-guesser/no_picture_cards_img/${x}.png`;
	}
	// Picture Only
	if (guessTypeOptions.children[2].classList.contains("activeOption")) {
		cardGuessURI = (x) => `/card-guesser/picture_only_cards_img/${x}.png`;
	}
	// Minimal
	if (guessTypeOptions.children[3].classList.contains("activeOption")) {
		cardGuessURI = (x) => `/card-guesser/minimal_cards_img/${x}.png`;
	}
	
	
	let population = [...completeCards];
	
	// Remove unwanted sections
	// Minor
	if (!cardTypeOptions.children[0].classList.contains("activeOption")) {
		for (let i=population.length-1; i>=0; i--) {
			if (population[i].type == 'minor')
				population.splice(i, 1);
		}
	}
	// Major
	if (!cardTypeOptions.children[1].classList.contains("activeOption")) {
		for (let i=population.length-1; i>=0; i--) {
			if (population[i].type == 'major')
				population.splice(i, 1);
		}
	}
	// Unique
	if (!cardTypeOptions.children[2].classList.contains("activeOption")) {
		for (let i=population.length-1; i>=0; i--) {
			if (population[i].type == 'unique')
				population.splice(i, 1);
		}
	}
	
	let sample_count = null;
	let random_seed = null;
	
	// Check if Daily or not
	if (dailyAllOptions.children[0].classList.contains("activeOption")) {
		// Generate seed from date
		let d = new Date();
		random_seed = cyrb128(d.getUTCDate().toString() + d.getUTCMonth() + d.getUTCFullYear()).reduce((x,y)=>x+y)
		sample_count = dailyCount;
	}
	else {
		sample_count = population.length;
	}
	
	if (population.length < sample_count)
		return
	
	shareButton.style.display = 'none';
	cardInputWrapper.style.display = '';
	submitInput.style.display = '';
	
	
	cardsToGuess = [];
	for (let idx of getSubset(population.length, sample_count, random_seed)) {
		cardsToGuess.push(population[idx]);
	}
	resetScore();
	setCardsLeft(sample_count);
	newCard();
}

function getSubset(population_count, sample_count, random_seed=null) {
	let population = [...Array(population_count).keys()];
	let samples = [];
	for (let i=0; i<sample_count; i++) {
		let idx = null;
		if (random_seed) {
			idx = random_seed % population.length;
			random_seed += idx;
		} 
		else {
			idx = Math.floor(Math.random()*population.length);
		}
		samples.push(population[idx]);
		population.splice(idx, 1);
	}
	return samples;
}

function newCard() {
	score.style.backgroundColor = '';
	cardsLeft.style.backgroundColor = '';
	if (!cardsToGuess.length) {
		currentCard = null;
		shareButton.style.display = '';
		cardInputWrapper.style.display = 'none';
		submitInput.style.display = 'none';
		return;
	}
	currentCard = cardsToGuess.splice(0, 1)[0];
	cardImage.src = cardGuessURI(currentCard.id);
	cardInput.focus();
}

function makeGuess() {
	let guess = cardInput.value;
	if (!guess.length) return
	
	cardInput.value = "";
	if (currentCard) {
		cardImage.src = `/card-guesser/complete_cards_img/${currentCard.id}.png`;
		
		cardImage.onload = () => {
			cardImage.onload = undefined;
			
			timeout = 1000;
			if (currentCard.title == guess) {
				incrementScore(true);
				score.style.backgroundColor = '#0fd920';
				cardsLeft.style.backgroundColor = '#0fd920';
			}
			else {
				timeout += 1000;
				incrementScore(false);
				score.style.backgroundColor = '#db0f0f';
				cardsLeft.style.backgroundColor = '#db0f0f';
			}
			decrementCardsLeft();
			
			setTimeout(newCard, timeout);
		}
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
	current = getScore();
	score.innerHTML = `Score: ${current.correct + correct}/${current.total + 1}`
}

function getScore() {
	let idx = score.innerHTML.indexOf('/');
	
	return {
		'correct' : parseInt(score.innerHTML.slice(7, idx)),
		'total' : parseInt(score.innerHTML.slice(idx+1, score.innerHTML.length))
	}
}

function toggleGuessType(idx) {
	for (let i=0; i<guessTypeOptions.childElementCount; i++) {
		if (i == idx) {
			guessTypeOptions.children[i].classList.add("activeOption");
		}
		else {
			guessTypeOptions.children[i].classList.remove("activeOption");
		}
	}
	startSet();
}

function toggleCardType(idx) {
	let e = cardTypeOptions.children[idx];
	if (e.classList.contains("activeOption")) {
		e.classList.remove("activeOption");
	}
	else {
		e.classList.add("activeOption");
	}
	startSet();
}

function toggleDaily(idx) {
	for (let i=0; i<dailyAllOptions.childElementCount; i++) {
		if (i == idx) {
			dailyAllOptions.children[i].classList.add("activeOption");
		}
		else {
			dailyAllOptions.children[i].classList.remove("activeOption");
		}
	}
	startSet();
}

function shareSet() {
	let current = getScore();
	let d = new Date();
	let date = `${d.getUTCDate()}/${d.getUTCMonth()+1}/${d.getUTCFullYear()}`;
	let copyText = `#SI Card Guesser ${current.total == dailyCount ? date : 'Complete Set'}\n`;
	for (let c of guessTypeOptions.children) {
		if (c.classList.contains("activeOption")) {
			copyText += c.innerHTML + '\n';
			break;
		}
	}
	for (let c of cardTypeOptions.children) {
		if (c.classList.contains("activeOption")) {
			copyText += c.innerHTML + ' ';
		}
	}
	copyText = copyText.slice(0, copyText.length-1) + '\n';
	copyText += `${current.correct}/${current.total} (${Math.floor(current.correct*100/current.total)}%)\n`;
	copyText += 'https://spirit-island.vercel.app/card-guesser/';
	
	navigator.clipboard.writeText(copyText);

	/* Alert the copied text */
	alert("Copied the text:\n" + copyText);
}

const mainWrapper = document.getElementById("mainWrapper");
const guessTypeOptions = document.getElementById("guessTypeOptions");
const cardTypeOptions = document.getElementById("cardTypeOptions");
const dailyAllOptions = document.getElementById("dailyAllOptions");
const cardInput = document.getElementById("cardInput");
const cardInputWrapper = document.getElementById("cardInputWrapper");
const submitInput = document.getElementById("submitInput");
const shareButton = document.getElementById("shareButton");
const cardImage = document.getElementById("cardImage");
const cardsLeft = document.getElementById("cardsLeft");
const score = document.getElementById("score");
const dailyCount = 10;
const completeCards = [];
const cardTitles = [];
const local = false;
if (!local) {
	window.fetch('/card-guesser/complete_cards.json').then(x => x.json()).then(x => {
		for (let card of x) {
			completeCards.push(card);
			cardTitles.push(card.title);
		}
		startSet();
		mainWrapper.style.height = window.innerHeight;
	});
	autocomplete(cardInput, cardTitles);
}
else {
	autocomplete(cardInput, ['a', 'aa', 'aaa', 'aaaa']);
	cardImage.src = 'complete_cards_img/a_circuitous_and_wending_journey.png'
}
var currentCard = null;
var cardsToGuess = [];
var cardGuessURI = null;
