import { interpret } from "xstate";
import { inspect } from "@xstate/inspect";
import { watchMachine } from "./watchMachine";


inspect({
  iframe: () => document.querySelector('iframe[data-xstate]')
});


// Les boutons qui envoient des événements à la machine
const ESC = document.getElementById("ESC");
const SET = document.getElementById("SET");
const UP = document.getElementById("UP");
// L'affichage de l'heure / alarme / timer
const time = document.getElementById("time");
const date = document.getElementById("date");
const alarm = document.getElementById("alarm");
const timer = document.getElementById("timer");

const lightService = interpret(watchMachine, { devTools: true })
  .onTransition((state) => {
    // console.log("Current state:", state.value);
    time.style.display = ["NormalMode.Display.Time", "NormalMode.ChangeTime"].some(state.matches) ? "block" : "none";
    date.style.display = ["NormalMode.Display.Date", "NormalMode.ChangeDate"].some(state.matches) ? "block" : "none";
    alarm.style.display = ["NormalMode.Display.Alarm", "NormalMode.ChangeAlarm", "Alarm"].some(state.matches) ? "block" : "none";
    timer.style.display = ["NormalMode.Timer"].some(state.matches) ? "block" : "none";
  })
  .onChange((context) => {
    // console.log("Context:", context);
    time.textContent = context.currentTime.toFormat("hh:mm:ss");
    date.textContent = context.currentTime.toFormat("dd/MM/yyyy");
    alarm.textContent = context.alarmTime.toFormat("hh:mm:ss");
    timer.textContent = context.timer.toFormat("hh:mm:ss");
  })
  .start();

ESC.addEventListener("click", () => {
  lightService.send("ESC");
});
SET.addEventListener("click", () => {
  lightService.send("SET");
});
UP.addEventListener("click", () => {
  lightService.send("UP");
});


// On envoie le signal d'horloge à la machine toutes les secondes
setInterval(() => lightService.send("CLOCKTICK") , 1000);