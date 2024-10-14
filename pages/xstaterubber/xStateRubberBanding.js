import Konva from "konva";
import { createMachine, interpret } from "xstate";
import { inspect } from "@xstate/inspect";
inspect({
  iframe: () => document.querySelector('iframe[data-xstate]')
});

// L'endroit où on va dessiner
const stage = new Konva.Stage({
  container: "container",
  width: '400',
  height: 400,
});

// Une couche pour la ligne en cours de dessin (il peut y en avoir plusieurs)
const temporaire = new Konva.Layer();
// Une couche pour les lignes déjà dessinées
const dessin = new Konva.Layer();
stage.add(dessin);
stage.add(temporaire);


// La ligne en cours de dessin
let rubber;

const rubberBandingMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QCcCuAjdZkCECGAdhAJYFQB0xEANmAMQCyA8gKoDKAogMIAyAklwDSAbQAMAXUSgADgHtYxAC7FZBKSAAeiAIwBmUeQBsAFgCsADgBMow9oDshu6bvmANCACeOu3fKnj2oamlo4AnMbGurqGAL4x7miY2PhEpBQQyHgA7mmMrJzMAGocYpJIIHIKyqrqWgjGoqbk4aF6xlaGnaKB7l4I5rrNrbqWraG62trBunEJGFi4hCRk5BnZuczs3PxCpeqVSipq5XXaoeSBxnbWdqGGuhGtvYgDQ3qjZxNTlqZx8SAEWQQODqRILFLLKD7eSHGonRAAWkmhnIlj0oUsEVEtwsoTcnkRg1MonMnVCLkMNgmolCsxAYOSSzSlBoYGhVSOtURhnMqPRmIaOPMeOeCGsvLuXTsAXsokxsX+DMWqRWaxyZHZsOOoDqXwulL0UVs5kuousgxGJuR7VMplCzj+MSAA */
    id: "rubberBanding",
    initial: "idle",
    states: {
      idle: {
        on: {
          MOUSECLICK: {
            target: "drawing",
            actions: ["createLine"],
          },
        },
      },
      drawing: {
        on: {
          MOUSEMOVE: {
            actions: ["setLastPoint"],
          },
          MOUSECLICK: {
            target: "idle",
            actions: ["saveLine"],
          },
        },
      },
    },
  },
  {
    actions: {
        // Crée une ligne à la position du clic, les deux points sont confondus
      createLine: (context, event) => {
        const pos = stage.getPointerPosition();
        rubber = new Konva.Line({
          // Les points de la ligne sont stockés comme un tableau de coordonnées x,y
          points: [pos.x, pos.y, pos.x, pos.y],
          stroke: "red",
          strokeWidth: 2,
        });
        temporaire.add(rubber);
      },
      // Modifie le dernier point de la ligne en cours de dessin
      setLastPoint: (context, event) => {
        const pos = stage.getPointerPosition();
        rubber.points([rubber.points()[0], rubber.points()[1], pos.x, pos.y]);
        temporaire.batchDraw();
      },
      // Sauvegarde la ligne
      saveLine: (context, event) => {
        rubber.remove(); // On l'enlève de la couche temporaire
        rubber.stroke("black"); // On change la couleur
        dessin.add(rubber); // On l'ajoute à la couche de dessin
      }
    },
  }
);

// On démarre la machine
const rubberBandingService = 
interpret(rubberBandingMachine, { devTools: true })
  .onTransition((state) => {
    console.log("Current state:", state.value);
  })
  .start();

// On transmet les événements souris à la machine
stage.on("click", () => {
  rubberBandingService.send("MOUSECLICK");
});

stage.on("mousemove", () => {
  rubberBandingService.send("MOUSEMOVE");
});