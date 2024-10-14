import { createMachine } from "xstate";

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGUCeA7ALgQwB5gDoBRHTARgGIIwBjAGzHRoAswBXAJwG0AGAXUSgADgHtYAS0ziR6QSFyIyAZjIEAnAHYlapTwCsOpQA4ATEoA0IVIiOqALBrVkAbM+V2TPHnaUBfX5ZoWHiEJNjkVLQMTKycXGQCSCCiElIycgoIyqqa2roGSsZmltYIJmR66komJk7unt5+-pboItTwSUE4+HIpktKySZkAtD4E+nbORhp6JYjDzuOeRoVGznqOaht2zSBdIcSkZL1i-elDiHbqdnoqJrNWit4Eph5kRkZ6bmpqu-v4h3CJhOqQGGUuZB44yUzm0Rh4zhqsOccyyz1e5Q+XzIPz+GG6oVIShBZ0GoEySkmBE8amcPDMegMGx4FkeZQ0OTsdi89K5ZG5zn8-iAA */
    id: "Syntaxe",
    initial: "Etat1",
    states: {
      Etat1: {
        on: {
          declencheur: [{
            target: "Etat2",
            cond: "garde",
            actions: ["action"],
          }, "Etat3"],
        },
      },

      Etat2: {},
      Etat3: {}
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: { action: (context, event) => {} },
    services: {},
    guards: { garde: (context, event) => false },
    delays: {},
  },
);