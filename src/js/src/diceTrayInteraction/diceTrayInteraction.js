import DiceParser from '@3d-dice/dice-parser-interface'

class DiceTrayInteraction {
  constructor(options) {
    this.target = options.target ? document.querySelector(options.target) : document.body
    this.form = document.querySelector('.adv-roller--form')
    this.diceInput = document.querySelector('#dice-input')
    this.diceSelectors = document.querySelectorAll(".dice-selector .die");

    // create Notation Parser - pass on options
    this.DRP = new DiceParser({
      targetRollsCritSuccess: options?.targetRollsCritSuccess || options?.targetRollsCritSuccess || false,
      targetRollsCritFailure: options?.targetRollsCritFailure || options?.targetRollsCrit || false,
      targetRollsCrit: options?.targetRollsCrit || false,
    })

    // callback events
    this.onSubmit = options?.onSubmit || noop
    this.onClear = options?.onClear || noop
    this.onReroll = options?.onReroll || noop
    this.onResults = options?.onResults || noop

    // Global vars
    this.diceSelectedOrder = []
    this.diceSelected = []

    this.init()
  }

  init() {
    this.form.addEventListener('submit', this.submitForm.bind(this))
    this.form.addEventListener('reset', this.clear.bind(this))

    this.diceInput.value = '2d20'

    let self = this;

    // Add trigger for every dice selector
    for (var i = 0; i < this.diceSelectors.length; i++) {
      this.diceSelectors[i].addEventListener("click", function(event) {
        event.preventDefault();
        let dieSelect = this.getAttribute('data-selector-value');
        self.addDiceSelector(dieSelect);
      });
    }
  }

  submitForm(e) {
    e.preventDefault()
    this.clear()
    this.onSubmit(this.getNotation())
  }

  getNotation() {
    return this.DRP.parseNotation(this.diceInput.value);
  }

  getRawNotation() {
    // TODO: find way to get correct notation by parser?
    // return this.DRP.initParser;
    return this.diceInput.value;
  }

  clear() {
    this.DRP.clear()
    if (this.onClear) {
      this.onClear()
    }

    // Reset global values
    this.diceSelected = [];
    this.diceSelectedOrder = [];
  }

  handleResults(results) {
    const rerolls = this.DRP.handleRerolls(results);
    if (rerolls.length) {
      this.onReroll(rerolls)
      return rerolls
    }

    const finalResults = this.DRP.parsedNotation ? this.DRP.parseFinalResults(results) : results

    // dispatch an event with the results object for other UI elements to listen for
    const event = new CustomEvent('resultsAvailable', {detail: finalResults})
    document.dispatchEvent(event)

    this.onResults(finalResults)

    return finalResults
  }

  addDiceSelector(dieValue) {
    if (this.diceSelectedOrder[dieValue] === undefined) {
      this.diceSelectedOrder[dieValue] = this.diceSelected.length;
      this.diceSelected[this.diceSelected.length] = {
        amount: 1,
        value: parseInt(dieValue),
        modifier: 0,
      }
    } else {
      var position = this.diceSelectedOrder[dieValue];
      this.diceSelected[position].amount += 1;
    }

    this.recreateInputValue();
  }


  recreateInputValue() {
    let inputContent = '';
    let addcontent = '';
    let modifier = '';

    this.diceSelected.forEach((die, key) => {
      // See what we need to add, a modifier or a die
      if (die.modifier !== 0) {
        modifier = die.modifier
        if (modifier < 0) {
          modifier = '(' + modifier + ')';
        }
        addcontent = modifier;

      } else {
        addcontent = die.amount + 'd' + die.value;
      }

      // Add the part to the rest of the content
      if (inputContent !== '') {
        inputContent += ' + ';
      }

      inputContent = inputContent + addcontent;
    });

    this.diceInput.value = inputContent;
  }
}

export default DiceTrayInteraction