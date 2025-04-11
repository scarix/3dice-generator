# ✅ 1. Create a Vite Project

Run the following commands in your terminal:

````
npm create vite@latest my-dice-app --template vanilla
cd my-dice-app
npm install
````

This will create a Vite project using the Vanilla JavaScript template.
# ✅ 2. Install @3d-dice/dice-box

Inside your project folder, install the dice roller library:

````
npm install @3d-dice/dice-box
````

# ✅ 3. Project Structure

Your project should now look like this:
````
my-dice-app/<br>
│── node_modules/<br>
│── public/<br>
│   │── index.html<br>
│── src/<br>
│   │── main.js<br>
│   │── style.css<br>
│── vite.config.js<br>
│── package.json<br>
│── index.html<br>
````

# ✅ 4. Configure index.html

Modify the index.html inside the root folder:

````
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Dice Roller</title>
    <link rel="stylesheet" href="./src/style.css">
</head>
<body>
    <div id="dice-box"></div>
    <button id="roll-button">Roll Dice</button>

    <script type="module" src="/src/main.js"></script>
</body>
</html>
````

# ✅ 5. Add Dice Roller Logic (main.js)

Edit src/main.js to include the dice roller functionality:
````
import "./style.css";
import DiceBox from "@3d-dice/dice-box";

async function setupDiceBox() {
const diceBox = new DiceBox("#dice-box", {
assetPath: "https://cdn.jsdelivr.net/npm/@3d-dice/dice-box@1.1.4/dist/assets/",
theme: "default",
scale: 6,
});

    await diceBox.init();

    document.getElementById("roll-button").addEventListener("click", () => {
        diceBox.roll("2d20");
    });
}

setupDiceBox();
````

# ✅ 6. Add Styles (style.css)

Edit src/style.css to style the dice roller:

````
body {
margin: 0;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 100vh;
background: #222;
color: white;
}

#dice-box {
width: 80vw;
height: 80vh;
border: 2px solid white;
}

#roll-button {
margin-top: 10px;
padding: 10px 20px;
font-size: 18px;
cursor: pointer;
}
````

# ✅ 7. Start the Vite Development Server

Run:

````
npm run dev
````

This will:

- Start a Vite development server at http://localhost:5173
- Automatically reload when you make changes
- Use ES modules for fast development

# ✅ 8. Build for Production

To generate optimized files for production, run:
````
npm run build
````

This will create a dist/ folder with your bundled app.
🎯 That's It!

You now have a fully working Vite setup with @3d-dice/dice-box. 🎲🔥