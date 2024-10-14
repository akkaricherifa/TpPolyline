import { createMachine, interpret } from "xstate";
import { inspect } from "@xstate/inspect";
inspect({
  iframe: () => document.querySelector('iframe[data-xstate]')
});

let count = 0;
const lampMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBsCGBbADgOjVg8gGaEDEAygOoCSAKgMIASA2gAwC6iomA9rAJYAXPtwB2nEAA9EAJmkB2bAE4AjC2kAWFirksAbHLkAaEAE9EygKwAOJQGZdt63IvLd6zboC+n43hx-8EXJqemZ2cR5+IVFxKQRZBRU1C1sDKwtdCzlbYzMEAFpFbHVpBytpKzlVPRVlbx8QEW4IOHE-CN5BYTEkSUR83Vz+xV0lFgsLdXTbVVTlOW9fDH9lokIOqO7YxBKhhEV1bAd1FItZdI1pOoa-XFWerk7oh76ETQtsDN1ZaWsWVRcewOR1sJ0c5zOJWu3iAA */
    id: "lamp",
    initial: "lampOff",
    states: {
      lampOff: {
        on: { 
          SWITCH: {
            target: "lampOn",
            actions: ["turnOn"],
          }
        },
      },
      lampOn: {
        on: { 
          SWITCH: {
            target: "lampOff",
            actions: ["turnOff"],
          }
        },
      }
    },
  },
  {
    actions: {
        turnOn: (context, event) => {
          console.log("Turning on!");
          count++;
        },
        turnOff: (context, event) => {
          console.log("Turning off!");
        }
      }
  }
);

const lamp = document.getElementById("lamp");
const switchButton = document.getElementById("switch");
const counterText = document.getElementById("counter");

switchButton.addEventListener("click", () => {
  lampService.send("SWITCH");
});

const lampService = interpret(lampMachine, { devTools: true })
  .onTransition((state) => {
    console.log("Current state:", state.value);
    switch (state.value) {
      case "lampOff":
        lamp.src = "/light_off.gif";
        break;
      case "lampOn":
        lamp.src = "/light_on.gif";
        break;
    }
    counterText.innerHTML = count;
  })
  .start();