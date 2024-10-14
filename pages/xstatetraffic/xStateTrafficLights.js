import { createMachine, interpret } from "xstate";
import { inspect } from "@xstate/inspect";
inspect({
  iframe: () => document.querySelector('iframe[data-xstate]')
});
// Les sous-états du mode normal
const normalSubstates = {
  initial: "orange",
  states: {
    orange: {
      after: {
        3000: { target: "red" },
      },
    },
    red: {
      after: {
        3000: { target: "green" },
      },
    },
    green: {
      after: {
        3000: { target: "orange" },
      },
    },
  },
};
// Les sous-états du mode maintenance
const maintenanceSubstates = {
  initial: "orange",
  states: {
    orange: {
      after: {
        1000: { target: "off" },
      },
    },
    off: {
      after: {
        1000: { target: "orange" },
      },
    },
  },
};

const lightMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDMBOYB2BjAFgfQBdUBDZZASyzwBtyocDYA6AezIGIAVAVQCUA5APL8A2gAYAuolAAHFrHIFyLDNJAAPRAFoAzAFY9TAOwA2ABwmALGJM6AjAE47Ys5YA0IAJ6IATHbtMZnq2djouJg6WkWYAvjEeaJi4hCRklDR0DMwAtsTkGASYxNhg7ADiguJSSCByCkoqapoIoQFGRj6Wlj5WZj6dOkYe3i0+ZkzWYj4ODp3O7bHxIInY+ESkFFS09IxMufmFGMVYpTwCggBiF1VqdYrKqjXNunrjM3bTdnoOpmZmQ15EB8jIE7CYxDMTHYjJYdA4THo4gl0KsUht0tssns8gUiiVWCQMDB2OpYARiIUmKRCqgABTOMRiACU7BWyXWaS2mV2+1xR3xLEJMBuNTuDUeoGeUSYJhhXTEgz0jhsAJGPR8TCm-1cjJsZh0liRyxR7NSmwyOxyOMOxzArA4pPJlOpYDpDOZrJNazNGO5VoOeJO9uQItk8nujSe2jBOgmUJ8SssRjMoT0SeGvksAS+lgsXzEoVcPiNbO96K5lqYGEFuWoghkropD3YvAAogBlVucUO1cPippAuGa8zmew6HQRIwOHQZhDTEH6LP-Gb-MKGpaltGci1Y6uoWv1xvirh8IRXHtih4DhBaHymTV3iEdHp6Rmq7RZibjywmBNmGywvoJZelu5qYrse4Hg2JDigSxTEo6FJ2i6dJhIyLKbhyYF+lWNbEHW0FNiocFEmAF59leUYIPYliakYr4OH8YymGI74tP8EwKpYBgQlm45gsBSRltu4HMJB+GHjBDxMOgEAkmSSFUsgNK0mhHqYT6Fa7nhBFHtJsnkfUlGSogWYOIEyazDoPhhEqegGrOf5MDZWY2f4sz9IJqJYb6lbibpUnEVA6CYPJTrIcprqqbqGEgT5WkQTpklERgTDBWAmCGRGEoaIgNF0a+Fgvq+djcbOYTmRCehTuOUzTgYOhxEs1YQHAagaeWO6MLcFGRiZN5RAEdkRIxjjgmms5aB8bwfFCswIs4zgOF5pqdaJwY9UZfW5QNsJMMNK5jWIE2AnO-iBLCYy2Nq9F-CtwnYZWvI2iUm3Zdet7nT+HyJsmqbpqdDKBK8fyMv+aZZuuyJCaBvlYs9gZ2oK8FgG9-ZUVN1XGD9rw-uCNk6GYs52H8TDjv+v5QmYDgGDZ92wwl-p8raG2ir1OXPF8IJGDjrgmPj5Plf0gR3lYP7-s+izQ95mldWJSWEejYZbRzvj8wV4TFQWZWnYMTD+Aanz9K0tiIhucWy+t-nJbByOkWjxk7dZYhMNORiscEBYwgWJiOa+ZOdAqMJwqVRj0-Fcu4fuEmK-pkAO9tzT8ft9EQuY3QGs4ejE50+3zf4-PHd0HTh5bOHW7HQUhTll6J3lCYTA1HytBDRO6xYKcVcEIeLk1MRAA */
  id: "french_traffic_lights",
  initial: "off",
  states: {
    off: {
      on: {
        TURNON: "maintenance",
      },
    },
    maintenance: {
      on: {
        GO: "normalOperation",
        TURNOFF: "off",
      },
      ...maintenanceSubstates,
    },
    normalOperation: {
      on: {
        RESET: "maintenance",
        TURNOFF: "off",
      },
      ...normalSubstates,
    },
  },
});


const turnOnButton = document.getElementById("turnOn");
const turnOffButton = document.getElementById("turnOff");
const resetButton = document.getElementById("reset");
const goButton = document.getElementById("go");
const lightsImage = document.getElementById("lights");

const lightService = interpret(lightMachine, { devTools: true })
  .onTransition((state) => {
    console.log("Current state:", state.value);
    // On change l'image en fonction de l'état
    let image = "/traffic-off.png";
    if (["maintenance.orange", "normalOperation.orange"].some(state.matches))
      image = "/traffic-orange.png";
    if (state.matches("normalOperation.green")) image = "/traffic-green.png";
    if (state.matches("normalOperation.red"))   image = "/traffic-red.png";
    lightsImage.src = image;
    // On active ou désactive les boutons en fonction de l'état
    turnOnButton.disabled = !state.can("TURNON");
    turnOffButton.disabled = !state.can("TURNOFF");
    resetButton.disabled = !state.can("RESET");
    goButton.disabled = !state.can("GO");
  })
  .start();

turnOnButton.addEventListener("click", () => {
  lightService.send("TURNON");
});
turnOffButton.addEventListener("click", () => {
  lightService.send("TURNOFF");
});
resetButton.addEventListener("click", () => {
  lightService.send("RESET");
});
goButton.addEventListener("click", () => {
  lightService.send("GO");
});
