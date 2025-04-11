import '../scss/styles.scss'
import DiceBox from "@3d-dice/dice-box";
import DisplayResults from "@3d-dice/dice-ui/src/displayResults";
// import AdvancedRoller from "@3d-dice/dice-ui/src/advancedRoller";
import BoxControls from "@3d-dice/dice-ui/src/boxControls";
import DiceParser from '@3d-dice/dice-parser-interface';
import DiceTrayInteraction from "./src/diceTrayInteraction";
import Swipe from "./src/swipe";

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

const diceBoxId = "#dice-box";
const diceBox = new DiceBox({
  container: diceBoxId,
  assetPath: "/assets/dice-box/",
  theme: "default",
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

  // create Roller Input
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

  // Define swipe action
  const Swiper = new Swipe({
    target: diceBoxId,
    onSwipe: () => {
      diceBox.clear();
      Display.clear();
      diceBox.roll(Roller.getNotation())
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
    console.log("Dice-color: " + newColor);
    diceBox.updateConfig({'themeColor': newColor});
  };

  diceBox.roll(["2d20"]);
});

