# stateChartsJS

stateChartsJS est un projet qui démontre l'utilisation des statecharts en JavaScript.

## Installation

Suivez ces étapes pour configurer le projet :

1. Utilisez le dépôt en tant que template

2. Naviguez vers le répertoire du projet : `cd stateChartsJS`

3. Installez les dépendances : `npm install`

## Exécution du Projet

Après avoir installé les dépendances, vous pouvez démarrer le projet en exécutant : `npm run dev`

## Exercice
Implémenter avec la bibliothèque xState un statechart qui trace une "polyline" (suite de points interconnectés) [Voir un exemple en ligne.](https://statecharts-js.vercel.app/pages/xstatepolyline/index.html "Exemple du comportement attendu")


Les événement à traiter dans le statechart sont les suivants :
* `MOUSECLICK` ajoute un point (jusqu'au maximum MAX fixé)
* `MOUSEMOVE` déplace le point provisoire
* `Backspace` efface le dernier point ajouté (sauf le premier)
* `Enter` enregistre la polyline (2 ≤ nombre de points ≤ MAX)
* `Escape` abandonne le tracé de la polyline

## Eléments de solution
Le code à développer se trouve dans le répertoire `pages/xstatepolyline` (javascript + html). Le code javascript contient les actions et les préconditions (guards) dont vous avez besoin dans le statechart.

Vous pouvez vous inspirer du code dans le répertoire `pages/xstaterubber` pour un exemple.

Le code utilise la bibliothèque [Konva](https://konvajs.org/docs/index.html) pour le dessin des points et des lignes.




