import moment from "moment/moment";
import LocalStorageManager from "../localStorageManager";

class DiceHistory {
  constructor(options) {
    this.target = options.target ? document.querySelector(options.target) : document.body
    this.storage = new LocalStorageManager('3ddice_');

    this.init()
  }

  init() {
    // If we have history stored, recreate it
    const savedHistory = this.storage.get('history');

    if (savedHistory !== null) {
      this.recreateHistory(savedHistory);
    }
  }

  generateDieIcon(dieType, dieValue) {

    const possibleDice = ["d20", "d12", "d10", "d8", "d6", "d4"];
    let dieIcon = "fa-dice";
    let icon = '';

    if (possibleDice.includes(dieType)) {
      dieIcon += "-" + dieType;
    }

    if (dieType === "d100") {

      const iconPart1 = document.createElement("i");
      iconPart1.classList.add('fas', 'fa-dice-d10', 'fa-stack-2x');
      const iconPart2 = document.createElement("i");
      iconPart2.classList.add('fas', 'fa-percent', 'fa-stack-1x', 'fa-inverse');

      icon = document.createElement("div");
      icon.classList.add('fa-stack', 'fa-stack', 'fa-lg');
      icon.appendChild(iconPart1);
      icon.appendChild(iconPart2);

    } else {
      // Set icon element
      icon = document.createElement("i");
      icon.classList.add('fas', dieIcon, 'fa-lg');
    }

    // Set span value of the die
    const span =  document.createElement("span");
    span.textContent = dieValue;

    // Create wrapper
    const divWrapper = document.createElement("div");
    divWrapper.classList.add('col-1', 'die', dieType);

    // Combine all elements
    // if (dieType === "d100"){
    //   divWrapper.appendChild(icon.cloneNode());
    // }

    divWrapper.appendChild(icon);
    divWrapper.appendChild(span);

    return divWrapper;
  }

  generateTrowHistory(results, totalResult, notation, date) {
    // ==== CARD HEADER - Create the history card header ====
    // Set span
    const spanHeader =  document.createElement("span");
    spanHeader.classList.add('dice-notation');
    spanHeader.textContent = notation;

    // set div
    const cardHeader = document.createElement("div");
    cardHeader.classList.add('card-header');
    cardHeader.appendChild(spanHeader);

    // ==== CARD FOOTER - Create the history card footer ====
    // Set small date
    const smallFooter =  document.createElement("small");
    smallFooter.textContent = date;

    // set div
    const cardFooter = document.createElement("div");
    cardFooter.classList.add('card-footer', 'text-body-secondary');
    cardFooter.appendChild(smallFooter);

    // ==== CARD BODY - Create the history card body ====

    // == Dice total wrapper ==
    // Span for dice total
    const spanTotal = document.createElement("span");
    spanTotal.textContent = totalResult;

    const divTotal = document.createElement("div");
    divTotal.classList.add('total-result', 'text-center');
    divTotal.appendChild(spanTotal);

    // == Dice summery wrapper ==
    // Dice summery row
    const divDiceRows = document.createElement("div");
    divDiceRows.classList.add('row', 'gx-1');

    // Create all the dice icons and add to row
    results.forEach((dieTypeResult) => {
      dieTypeResult.rolls.forEach((dieValue) => {
        divDiceRows.appendChild(this.generateDieIcon(dieValue.dieType, dieValue.value));
      });
    });

    // Div dice summery
    const divDiceSummery = document.createElement("div");
    divDiceSummery.classList.add('dice-summery');
    divDiceSummery.appendChild(divDiceRows);

    // set card body div
    const cardBody = document.createElement("div");
    cardBody.classList.add('card-body');
    cardBody.appendChild(divTotal);
    cardBody.appendChild(divDiceSummery);

    // ==== Set card body div ====
    const cardHistory = document.createElement("div");
    cardHistory.classList.add('card', 'history-card', 'mt-2');
    cardHistory.appendChild(cardHeader);
    cardHistory.appendChild(cardBody);
    cardHistory.appendChild(cardFooter);

    return cardHistory;
  }

  // Inspiration from @3d-dice/dice-ui/displayResults
  calculateTotalResult(finalResults) {
    let rolls
    if(finalResults.rolls && !Array.isArray(finalResults.rolls)){
      rolls = Object.values(finalResults.rolls).map(roll => roll)
    } else {
      // rolls = this.recursiveSearch(finalResults,'rolls').flat()
      rolls = Object.values(this.recursiveSearch(finalResults,'rolls')).map(group => {
        return Object.values(group)
      }).flat()
    }

    let total = 0
    if(finalResults.hasOwnProperty('value')) {
      total = finalResults.value
    } else {
      total = rolls.reduce((val,roll) => val + roll.value,0)
      let modifier = finalResults.reduce((val,roll) => val + roll.modifier,0)
      total += modifier
    }

    total = isNaN(total) ? '...' : total

    if(typeof total === 'string'){
      const counter = {}

      // count up values
      function logValue(value) {
        if(value && typeof value === 'string'){
          if(counter[value]){
            counter[value] = counter[value] + 1
          } else {
            counter[value] = 1
          }
        }
      }
      rolls.forEach(roll => {
        // if value is a string
        if(typeof roll.value === 'string'){
          logValue(roll.value)
        }

        // if value is an array, then loop and count
        if(Array.isArray(roll.value)){
          roll.value.forEach(val => {
            logValue(val)
          })
        }
      })

      // clear total
      total = ''

      // sort the keys by alpha
      const sortedCounter = Object.fromEntries(Object.entries(counter).sort())

      // build the result
      Object.entries(sortedCounter).forEach(([key,val],i) => {
        if(i!==0){
          total += ', '
        }
        total += key + ": " + val
      })
    }

    return total;
  }

  logHistory (results, finalResults, notation) {
    const now = moment();
    const formattedDate = now.format("D MMMM - HH:mm:ss");

    const totalResult = this.calculateTotalResult(finalResults);
    const historyCard = this.generateTrowHistory(results, totalResult, notation, formattedDate);

    // Save the history
    this.storeLogHistory(results, finalResults, notation, formattedDate);

    // Show history card
    this.target.append(historyCard);
    this.target.scrollTop = this.target.scrollHeight;
  }

  recreateHistory (storedHistory) {
    if (storedHistory !== null) {
      storedHistory.forEach((storedResult) => {
        const totalResult = this.calculateTotalResult(storedResult.finalResults);
        const historyCard = this.generateTrowHistory(storedResult.results, totalResult, storedResult.notation, storedResult.formattedDate);
        this.target.append(historyCard);
      })

      this.target.scrollTop = this.target.scrollHeight;
    }
  }

  storeLogHistory (results, finalResults, notation, formattedDate) {
    let savedHistory = this.storage.get('history');
    const storeResults = {
      "results": results,
      "finalResults": results,
      "notation": notation,
      "formattedDate": formattedDate,
    };

    if (savedHistory === null) {
      savedHistory = [storeResults];
    } else {
      savedHistory.push(storeResults);
    }

    // Max history length
    if (savedHistory.length > 25) {
      while (savedHistory.length > 25) {
        savedHistory.shift();
      }
    }

    this.storage.set('history', savedHistory);
  }

  // Inspiration from @3d-dice/dice-ui/displayResults
  recursiveSearch(obj, searchKey, results = [], callback) {
    const r = results;
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      // if(key === searchKey && typeof value !== 'object'){
      if(key === searchKey){
        r.push(value);
        if(callback && typeof callback === 'function') {
          callback(obj)
        }
      } else if(value && typeof value === 'object'){
        this.recursiveSearch(value, searchKey, r, callback);
      }
    });
    return r;
  }
}

export default DiceHistory