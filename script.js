import commands from "./commands.js";

const commandArea = document.querySelector('#commandarea');

let suggestionSelected = 0;


window.addEventListener("keypress", e => {
    console.log(e.key)
    commandArea.innerHTML += e.key;
    parse();
})
window.addEventListener("keydown", e => {
    switch (e.key) {
        case "Backspace":
            commandArea.innerHTML = commandArea.innerHTML.slice(0, -1);
            break;
        
        case "ArrowUp":
            suggestionSelected--;
            break;
        
        case "ArrowDown":
            suggestionSelected++;
            break;

        case "Tab":
            const suggestion = document.querySelector(`#suggestions:nth-child(${suggestionSelected})`).innerText;
            commandArea.innerHTML = suggestion;
        
        default:
            console.log(e.key)
            break;
    }
    parse();
})


parse()

function parse() {
    const tokens = commandArea.innerHTML.split(' ');

    let possible = new Set();

    const curToken = tokens[tokens.length - 1];
    for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        if (command?.[tokens.length - 1]?.startsWith(curToken)) {
            possible.add(command[tokens.length - 1]);
        }
    }

    if(suggestionSelected < 0) {
        suggestionSelected = possible.size - 1;
    } else if(suggestionSelected >= possible.size) {
        suggestionSelected = 0;
    }

    let suggestions = document.querySelector("#suggestions");
    suggestions.innerHTML = "";

    let i = 0;
    possible.forEach((suggestion) => {
        suggestions.innerHTML += `<li class="${i == suggestionSelected ? "selected" : ""}">${suggestion}</li>`
        i++;
    });
    console.log(possible)
}