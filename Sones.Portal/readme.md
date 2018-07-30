# Prise en main du projet

## Prérequis

* Installation de  [Node JS](https://nodejs.org/en/).

* Installation de TypeScript " npm install typescript@2.7.2 -g "

* Installation de webpack " npm install webpack@3.11.0 -g "

* Installation de gulp " npm install gulp@3.9.1 -g "

* Installation des dépendances du projet "  npm install " au niveau du dossier root (même dossier que le fichier package.json )

## Publication du code en mode dev

Pour publier le code sur la liste SharePoint Code ( du site config ), il faut lancer la commande " gulp publish --solution {nom de la solution}  "

## Création de pages

Pour créer une page référençant les fichiers JavaScript générés, il faut lancer la commande " gulp createPage --solution {nom de la solution} --prod ". Une page ASPX sera créée dans le dossier Upload / Pages  dans le dossier du feature correspondant.

Les fichiers référencés dans cette page sont :

1 - app-entry
2 - node_modules-bundle
3 - Common.Components
4 - Common.Services
5 - main

## Publication du code en mode production

Pour publier le code dans la solution en mode production, il faut lancer la commande " gulp build --solution {nom de la solution} --prod "

Cette commande copiera le résultat du build dans le dossier code du feature correspondant ( à l'aide du fichier feature.js )
