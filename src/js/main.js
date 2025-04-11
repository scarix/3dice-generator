import "../style.css";
import '../scss/styles.scss'
import DiceBox from "@3d-dice/dice-box";
import DisplayResults from "@3d-dice/dice-ui/src/displayResults";
// import AdvancedRoller from "@3d-dice/dice-ui/src/advancedRoller";
import BoxControls from "@3d-dice/dice-ui/src/boxControls";
import DiceParser from '@3d-dice/dice-parser-interface';
import DiceTrayInteraction from "./src/diceTrayInteraction";

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import {getElement} from "bootstrap/js/src/util/index.js";
const diceBoxId = "#dice-box";

const diceBox = new DiceBox({
  container: diceBoxId,
  assetPath: "/assets/dice-box/",
  theme: "rust",
  offscreen: true,
  scale: 6,
});

// LoadAudio
const audios = {};
audios['audio1'] = new Audio("/assets/sound/dice-1.mp3");
audios['audio2'] = new Audio("/assets/sound/dice-2.mp3");
audios['audio3'] = new Audio("/assets/sound/dice-3.mp3");
audios['audio4'] = new Audio("/assets/sound/dice-4.mp3");
audios['audio5'] = new Audio("/assets/sound/dice-5.mp3");

audios['audio1'].load();
audios['audio2'].load();
audios['audio3'].load();
audios['audio4'].load();
audios['audio5'].load();

diceBox.init().then(async (world) => {
  // console.log("Box is ready");

  let finalResults = '';
  let diceNotation = '';

  const DP = new DiceParser();

  const Controls = new BoxControls({
    themes: ["default", "diceOfRolling", "gemstone", "gemstoneMarble", "smooth", "rock", "rust", "wooden"],
    themeColor: world.config.themeColor,
    onUpdate: (updates) => {
      diceBox.updateConfig(updates);
    },
  });
  Controls.themeSelect.setValue(world.config.theme);

  diceBox.onThemeConfigLoaded = (themeData) => {
    if (themeData.themeColor) {
      Controls.themeColorPicker.setValue(themeData.themeColor);
    }
  };

  // create display overlay
  const Display = new DisplayResults(diceBoxId);

  // // create Roller Input
  const Roller = new DiceTrayInteraction({
    target: "#dice-interface",
    onSubmit: (notation) => diceBox.roll(notation),
    onClear: () => {
      diceBox.clear();
      Display.clear();
    },

    onReroll: (rolls) => {
      // loop through parsed roll notations and send them to the Box
      rolls.forEach((roll) => diceBox.add(roll, roll.groupId));
    },

    onResults: (results) => {
      Display.showResults(results);
    },
  });

  // pass dice rolls to Advanced Roller to handle
  diceBox.onRollComplete = (results) => {
    Roller.handleResults(results);
  };

  // add sound to roll
  diceBox.onBeforeRoll = (parsedNotation) => {
    // Play sound for each dice group
    setTimeout(function () {
      parsedNotation.forEach((element) => {
        const soundNr = Math.floor(Math.random() * 5 + 1);
        audios['audio' + soundNr].play();
      }, 400);
    });

    // Temp random color test
    let newColor = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    diceBox.updateConfig({'themeColor': newColor});
  };

  let element = document.querySelector(diceBoxId);
  element.addEventListener('swipe', (event) => {
    document.querySelector('.adv-roller--form').submit();
    console.log("SWIPE!")
  });

  // document.getElementById('btn-roll').addEventListener("click", (event) => {
  //   event.preventDefault();
  //
  //   diceNotation = document.getElementById('dice-input').value;
  //
  //   if (diceNotation != undefined && diceNotation != '') {
  //     diceBox.clear();
  //     Display.clear();
  //     diceBox.roll(DP.parseNotation(diceNotation));
  //   }
  // });

  diceBox.roll(["2d20"]);
});
