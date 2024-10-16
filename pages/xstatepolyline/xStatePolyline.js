import Konva from "konva";
import { createMachine, interpret } from "xstate";


const stage = new Konva.Stage({
    container: "container",
    width: 400,
    height: 400,
});

const layer = new Konva.Layer();
stage.add(layer);

const MAX_POINTS = 10;
let polyline // La polyline en cours de construction;

const polylineMachine = createMachine(
    {
        /** @xstate-layout N4IgpgJg5mDOIC5QAcD2AbAngGQJYDswA6XCdMAYgFkB5AVQGUBRAYWwEkWBpAbQAYAuohSpYuAC65U+YSAAeiAMx8ALEQCMq9QDYAnHwAc+7QCYDAVgA0ITInW7FRbQHYT+gypWHtFxQF8-azQsPEISMkomWABjAENkMH4hJBA0MUlpWQUEdWdtIhVnXR11FXNdbR9FE2tbHL5nIgNtZR0VEw7qsoCgjBwCYmkwAAVUAnFqemY2Tl5BWTSJKRkU7OU1TRUdd2MzKxtEdr4nPRNzAyKzRSKe1L7QwcJR8cnGJloANSYkhdElzNWh1MRBM2i0Oz4pgstTsJnUIIqihUumc5jR2nMN0CdxCAyIQ2e+AmUTiCR+KUWGRWoDWinyfE26lK5UqBkUMIQKKIznsRU0zj4oOU2luwX6YQAtrF8JhCeJYK9phxuOSROllllEABaRQXIiGRSGixeQ25DmGkxNXQmAUMhrmRTmEyi+54qUyuUK2hvGYq9TJNX-anybUVK3nXXmE2KHQGDnnJqGi3OOnWlHO7Fih5Ed2ysZEr1Td40L6qu7qgE07WGtS6COR6Nmg4IEx0ogOOsGG2ptzOFQu3GS6V58YKgBCsWiAGtYMhJ4l5hS-lTNQgdXWiEmjVG+KbnBzSsddM0VBi6S0TO1+5nXUOPfn5RQSfEFwHy0HV1qw0YI8bdzGfAPAx4VbOtUX5B0nQHcViFzT0nyJMAACcy0pDVATXb9Owbf9Yw5G1GnsUFrUKYCvEqAJsXwVAIDgX5BzAX4K2DbItU8RwtxwvcOS1MwTkqFwhQaQUDGg7NSHIJiPww9QDGORltGZCoqhqZsTEMJoSkNS42UuMS8QJB8pJXDCVGApwtAxG0VDpcxtHwjoQWRU8eVBXJ1DOfS7xHAtjPQqs12qcwTlKFxHXMES6w5GzHA8c5clIw8MUovwgA */
        id: "polyLine",
        initial: "idle",
        states: {
            idle: {
                on: {
                    MOUSECLICK: {
                        actions: "createLine",
                        target: "onePoint",
                    },
                    Escape: { actions: "abandon" }, // Pour quitter à tout moment
                },
            },
            onePoint: {
                on: {
                    MOUSECLICK: {
                        actions: "addPoint",
                        target: "manyPoints",
                    },
                    MOUSEMOVE: {
                        actions: "setLastPoint",
                    },
                    Escape: { actions: "abandon", target: "idle" },
                },
            },
            manyPoints: {
                on: {
                    MOUSECLICK: [
                        {
                            cond: "pasPlein",
                            actions: "addPoint",
                            target: "manyPoints",
                        },
                        {
                            actions: ["saveLine", "addPoint"],
                            target: "idle",
                        },
                    ],
                    MOUSEMOVE: {
                        actions: "setLastPoint",
                    },
                    Backspace: {
                        actions: "removeLastPoint",
                        cond: "plusDeDeuxPoints",
                        internal: true,
                    },
                    Escape: { actions: "abandon", target: "idle" },
                    Enter: {
                        cond: "plusDeDeuxPoints",
                        actions: "saveLine",
                        target: "idle",
                    },
                },
            },
        },
    },
    {
        actions: {
            createLine: (context, event) => {
                const pos = stage.getPointerPosition();
                polyline = new Konva.Line({
                    points: [pos.x, pos.y, pos.x, pos.y],
                    stroke: "red",
                    strokeWidth: 2,
                });
                layer.add(polyline);
            },
            setLastPoint: (context, event) => {
                const pos = stage.getPointerPosition();
                const currentPoints = polyline.points();
                const size = currentPoints.length;
                const newPoints = currentPoints.slice(0, size - 2);
                polyline.points(newPoints.concat([pos.x, pos.y]));
                layer.batchDraw();
            },
            saveLine: (context, event) => {
                const currentPoints = polyline.points();
                const size = currentPoints.length;
                const newPoints = currentPoints.slice(0, size - 2);
                polyline.points(newPoints);
                layer.batchDraw();
            },
            addPoint: (context, event) => {
                const pos = stage.getPointerPosition();
                const currentPoints = polyline.points();
                const newPoints = [...currentPoints, pos.x, pos.y];
                polyline.points(newPoints);
                layer.batchDraw();
            },
            abandon: (context, event) => {
                polyline.remove();
                layer.batchDraw();
            },
            removeLastPoint: (context, event) => {
                const currentPoints = polyline.points();
                const size = currentPoints.length;
                const provisoire = currentPoints.slice(size - 2, size);
                const oldPoints = currentPoints.slice(0, size - 4);
                polyline.points(oldPoints.concat(provisoire));
                layer.batchDraw();
            },
        },
        guards: {
            pasPlein: (context, event) => {
                return polyline.points().length < MAX_POINTS * 2;
            },
            plusDeDeuxPoints: (context, event) => {
                return polyline.points().length > 4;
            },
        },
    }
);

// On démarre la machine
const polylineService = interpret(polylineMachine)
    .onTransition((state) => {
        console.log("Current state:", state.value);
    })
    .start();
// On envoie les événements à la machine
stage.on("click", () => {
    polylineService.send("MOUSECLICK");
});

stage.on("mousemove", () => {
    polylineService.send("MOUSEMOVE");
});

// Envoi des touches clavier à la machine
window.addEventListener("keydown", (event) => {
    console.log("Key pressed:", event.key);
    // Enverra "a", "b", "c", "Escape", "Backspace", "Enter"... à la machine
    polylineService.send(event.key);
});