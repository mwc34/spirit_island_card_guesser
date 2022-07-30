const cardSelection = document.getElementById("cardSelection");
const cardBoard = document.getElementById("cardBoard");
const mainWrapper = document.getElementById("mainWrapper");
const fearPoolSlider = document.getElementById("fearPoolSlider");
const earnedFear = document.getElementsByClassName("fearCounter")[0];
const fearPool = document.getElementsByClassName("fearCounter")[1];
var cardFocus = null;

function generateCardSelection() {
	let terrains = ["mountain", "jungle", "sand", "wetland"];
	let emptyCard = () => {
		let div = document.createElement("div");
		div.classList.add("card");
		div.onclick = () => {
			mainWrapper.style.opacity = "";
			cardFocus.innerHTML = div.innerHTML;
			cardSelection.style.visibility = "";
		}
		return div;
	};
	
	// Empty Slot
	let c = emptyCard();
	c.style.backgroundColor = "white";
	c.onclick = () => {
		mainWrapper.style.opacity = "";
		if (cardFocus.parentElement.childElementCount > 1)
			cardFocus.parentElement.removeChild(cardFocus);
		else
			cardFocus.innerHTML = c.innerHTML;
		cardSelection.style.visibility = "";
	}
	cardSelection.children[0].appendChild(c);
	
	// Stage 1
	for (let t of terrains) {
		let c = emptyCard();
		let d = document.createElement("div");
		d.classList.add(t);
		let s = document.createElement("span");
		s.innerHTML = t[0].toUpperCase();
		d.appendChild(s);
		c.appendChild(d);
		cardSelection.children[0].appendChild(c);
	}
	
	// New Card
	let addCard = emptyCard();
	addCard.style.backgroundColor = "white";
	let d = document.createElement("div");
	d.innerHTML = "+";
	addCard.appendChild(d);
	addCard.onclick = () => {
		mainWrapper.style.opacity = "";
		let newCard = getEmptyBoardCard();
		cardFocus.parentElement.appendChild(newCard);
		cardSelection.style.visibility = "";
	}
	cardSelection.children[0].appendChild(addCard);
	
	// Stage 2
	for (let t of terrains.concat(["coastal"])) {
		let c = emptyCard();
		let d = document.createElement("div");
		d.classList.add(t);
		let s = document.createElement("span");
		s.innerHTML = t[0].toUpperCase();
		d.appendChild(s);
		if (t != "coastal") {
			let e = document.createElement("div");
			e.innerHTML = "E";
			e.classList.add("escalation");
			d.appendChild(e);
		}
		c.appendChild(d);
		cardSelection.children[1].appendChild(c);
	}
	
	// Stage 3
	for (let i=0; i<terrains.length; i++) {
		for (let j=i+1; j<terrains.length; j++) {
			let c = emptyCard();
			for (let k of [i, j]) {
				let d = document.createElement("div");
				d.classList.add(terrains[k]);
				let s = document.createElement("span");
				s.innerHTML = terrains[k][0].toUpperCase();
				d.appendChild(s);
				c.appendChild(d);
			}
			cardSelection.children[2].appendChild(c);
		}
	}
}

function getEmptyBoardCard() {
	let div = document.createElement("div");
	div.classList.add("card");
	div.onclick = () => {
		mainWrapper.style.opacity = "50%";
		cardFocus = div;
		cardSelection.style.visibility = "visible";
	}
	return div;
}

function generateCardBoard() {
	for (let c of cardBoard.children) {
		c.children[0].appendChild(getEmptyBoardCard());
	}
}

function advanceCards() {
	for (let i=0; i<3; i++) {
		let wrapper = cardBoard.children[i].children[0];
		wrapper.innerHTML = "";
		if (i < 2) {
			let tmp = [];
			for (let c of cardBoard.children[i+1].children[0].children) {
				tmp.push(c);
			}
			for (let c of tmp) {
				wrapper.appendChild(c);
			}
		}
		else {
			wrapper.appendChild(getEmptyBoardCard());
		}
	}
}

function changeFear(x) {
	let totalFear = parseInt(earnedFear.innerHTML) + parseInt(fearPool.innerHTML);
	let v = (parseInt(earnedFear.innerHTML) + x + totalFear) % totalFear;
	earnedFear.innerHTML = v;
	fearPool.innerHTML = totalFear - v;
}

generateCardBoard();
generateCardSelection();

fearPoolSlider.oninput = () => {
	fearPool.innerHTML = fearPoolSlider.value - parseInt(earnedFear.innerHTML);
}
fearPoolSlider.value = 4;
fearPoolSlider.oninput();