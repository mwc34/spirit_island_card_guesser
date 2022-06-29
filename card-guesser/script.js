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
		// Scroll to show input box
		bodyWrapper.scrollTop = bodyWrapper.scrollHeight;
	});
	/*execute a function presses a key on the keyboard:*/
	inp.addEventListener("keydown", function(e) {
		var x = document.getElementById(this.id + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
			/*If the arrow DOWN key is pressed,
			increase the currentFocus variable:*/
			if (currentFocus < x.length-1)
				currentFocus++;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 38) { //up
			/*If the arrow UP key is pressed,
			decrease the currentFocus variable:*/
			if (currentFocus != 0)
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
		x[currentFocus].scrollIntoView({block: "nearest"});
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

function hideKeyboard(e) {
	e.setAttribute('readonly', '');
	e.setAttribute('disabled', '');
    setTimeout(function() {
        e.blur();  //actually close the keyboard
        // Remove readonly attribute after keyboard is hidden.
        e.removeAttribute('readonly');
        e.removeAttribute('disabled');
    }, 100);
}

window.mobileAndTabletCheck = function() {
	let check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

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
	else if (guessTypeOptions.children[1].classList.contains("activeOption")) {
		cardGuessURI = (x) => `/card-guesser/no_picture_cards_img/${x}.png`;
	}
	// Picture Only
	else if (guessTypeOptions.children[2].classList.contains("activeOption")) {
		cardGuessURI = (x) => `/card-guesser/picture_only_cards_img/${x}.png`;
	}
	// Minimal
	else if (guessTypeOptions.children[3].classList.contains("activeOption")) {
		cardGuessURI = (x) => `/card-guesser/minimal_cards_img/${x}.png`;
	}
	// Nothing selected
	else {
		return
	}
	
	
	let population = [...completeCards];
	
	// Remove unwanted sections
	let sections = [];
	// Minor
	if (!cardTypeOptions.children[0].classList.contains("activeOption")) {
		for (let i=population.length-1; i>=0; i--) {
			if (population[i].type == 'minor')
				population.splice(i, 1);
		}
	}
	else
		sections.push('minor');
	// Major
	if (!cardTypeOptions.children[1].classList.contains("activeOption")) {
		for (let i=population.length-1; i>=0; i--) {
			if (population[i].type == 'major')
				population.splice(i, 1);
		}
	}
	else
		sections.push('major');
	// Unique
	if (!cardTypeOptions.children[2].classList.contains("activeOption")) {
		for (let i=population.length-1; i>=0; i--) {
			if (population[i].type == 'unique')
				population.splice(i, 1);
		}
	}
	else
		sections.push('unique');
	
	
	
	let sample_count = null;
	let random_seed = null;
	
	// Check if Daily or not
	if (dailyAllOptions.children[0].classList.contains("activeOption")) {
		// Generate seed from date
		let d = new Date();
		let hashString = d.getUTCDate().toString() + (d.getUTCMonth()+1) + d.getUTCFullYear();
		hashString += sections.reduce((x,y)=>x+y);
		if (differentDaily) {
			hashString += cardGuessURI('hash');
		}
		random_seed = cyrb128(hashString).reduce((x,y)=>x+y);
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
	guessHistory.splice(0, guessHistory.length);
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

function newCard(timeout=10) {
	if (!cardsToGuess.length) {
		currentCard = null;
		setTimeout(() => {
			shareButton.style.display = '';
			cardInputWrapper.style.display = 'none';
			submitInput.style.display = 'none';
			score.style.backgroundColor = '';
			cardsLeft.style.backgroundColor = '';
		}, timeout);
		return;
	}
	currentCard = cardsToGuess.splice(0, 1)[0];
	
	preImg.href = cardGuessURI(currentCard.id);
	setTimeout(() => {
		score.style.backgroundColor = '';
		cardsLeft.style.backgroundColor = '';
		cardImage.src = cardGuessURI(currentCard.id);
		preImg.href = `/card-guesser/complete_cards_img/${currentCard.id}.png`;
		if (!mobileAndTabletCheck())
			cardInput.focus();
	}, timeout);
}

function makeGuess() {
	let guess = cardInput.value;
	
	if (!guess.length) return
	
	cardInput.value = "";
	hideKeyboard(cardInput);
	if (currentCard) {
		cardImage.src = `/card-guesser/complete_cards_img/${currentCard.id}.png`;
		
		cardImage.onload = () => {
			cardImage.onload = undefined;
			
			timeout = 1000;
			if (currentCard.title == guess) {
				incrementScore(true);
				score.style.backgroundColor = '#0fd920';
				cardsLeft.style.backgroundColor = '#0fd920';
				guessHistory.push(true);
			}
			else {
				timeout += 1000;
				incrementScore(false);
				score.style.backgroundColor = '#db0f0f';
				cardsLeft.style.backgroundColor = '#db0f0f';
				guessHistory.push(false);
			}
			decrementCardsLeft();
			
			newCard(timeout);
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
	// Already shared
	if (cardImage.src.includes("/card-guesser/finish_card.png"))
		return
	
	let current = getScore();
	let d = new Date();
	let date = `${d.getUTCDate()}/${d.getUTCMonth()+1}/${d.getUTCFullYear()}`;
	let daily = current.total == dailyCount;
	let copyText = `#SI Card Guesser ${daily ? date : 'Complete Set'}\n`;
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
	if (daily) {
		copyText += guessHistory.map((x) => x ? '\ud83d\udfe9' : '\ud83d\udfe5').reduce((x,y)=>x+' '+y) + '\n';
	}
	copyText += 'https://spirit-island.vercel.app/card-guesser/';
	
	navigator.clipboard.writeText(copyText);

	cardImage.src = "/card-guesser/finish_card.png";
	for (let c of guessTypeOptions.children) {
		c.classList.remove("activeOption");
	}
}

const bodyWrapper = document.getElementById("bodyWrapper");
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
const guessHistory = [];
const differentDaily = false; // For the guess type modes
const completeCards = [];
const cardTitles = [];
const preImg = document.createElement('link');
preImg.href = '';
preImg.rel = 'preload';
preImg.as = 'image';
document.head.appendChild(preImg);
const local = false;
if (!local) {
	window.fetch('/card-guesser/complete_cards.json').then(x => x.json()).then(x => {
		for (let card of x) {
			completeCards.push(card);
			cardTitles.push(card.title);
		}
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



var currentWidth = 0;
var currentHeight = 0;

function setSize() {
	mainWrapper.style.width = window.innerWidth + 'px';
	mainWrapper.style.height = window.innerHeight + 'px';
}

function saveSize() {
	currentWidth = window.innerWidth;
	currentHeight = window.innerHeight;
}

// Set the global orientation variable as soon as the page loads
addEventListener("load", () => {
	setSize();
	saveSize()
})

// Adjust viewport values only if width change or increase height (avoids keyboard shrinking)
window.addEventListener("resize", () => {
	if (window.innerWidth != currentWidth || window.innerHeight > currentHeight) {
		setSize();
		
	}
	else {
		bodyWrapper.scrollTop = bodyWrapper.scrollHeight;
	}
	saveSize();
});
