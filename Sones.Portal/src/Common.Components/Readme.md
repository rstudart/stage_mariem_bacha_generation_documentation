# Génerateur de formulaire

Le Génerateur de formulaire permet de genere un formulaire en utilisant des composant d'Office Fabric ui. Pour ajouter un formulaire au projet, il suffit d'ajouter une entrée à la liste des formulaires génerique et d'y définir un Json ayant la structure suivante:

| Propriété | Type de la valeur | Obligatoire | Role                             |
| --------- | :---------------: | :---------: | :------------------------------- |
| Title     | string            | oui         | Titre du formulaire              |
| Actions   | Array\<Action>    | oui         | Actions du formulaire  (buttons) |
| Fields    | Array\<Field>     | oui         | Champs du formulaire             |

**note :** Ce json sera recupéré en utilisant les parametres query au niveau du lien (Window Location search pattern ).

## Structure de Field

| Propriété          | Type de la valeur  | Obligatoire | Role                                                |
| ------------------ | :----------------: | :---------: | :-------------------------------------------------- |
| FieldName          | string             | oui         | Nom de la propriété de l'item (Objet de persitance) |
| FieldConfiguration | FieldConfiguration | oui         | Paramètres du champs                                |
| Type               | string             | oui         | Nom de l'implémentation à utiliser                  |

### Structure de base de FieldConfiguration

Toutes les implémentations de FieldConfiguration contiennent la configuration de base des composant (sauf les fonctions).
**Exemple :** Pour un text field vous pouvez utiliser toutes les propriétés de ITextFieldProps interface
[Voir Office Fabric UI](https://developer.microsoft.com/en-us/fabric#/components/textfield#Implementation "Composant TextField").
FieldConfiguration contient aussi :

| Propriété  | Type de la valeur       | Obligatoire | Role                   |
| ---------- | :---------------------: | :---------: | :--------------------- |
| Permission | Array\<GroupPermissions> | non         | Permission des Groupes |

### GroupPermissions

| Propriété       | Type de la valeur                        | Obligatoire | Role                 |
| --------------- | :--------------------------------------: | :---------: | :------------------- |
| GroupName       | string                                   | oui         | Le du groupe         |
| GroupPermission | Permission \| Array\<PermissionPerState> | oui         | Permission du groupe |

**notes :**

- Permission est un nombre (0 : none , 1 : Read , 2 : Read & write)
- PermissionPerState ( State : string , Permission : number )

### Implémentations de FieldConfiguration

#### TextFieldConfiguration

Aucune propriété supplémentaire.
**note :** TextField accepte les attributs Html5 des balises input et textarea (exemple type , rows ...).

#### ChoiceConfiguration

| Propriété                 | Type de la valeur | Obligatoire | Role                                                                |
| ------------------------- | :---------------: | :---------: | :------------------------------------------------------------------ |
| FieldDefinitionChoicesSrc | boolean           | oui         | si True les choix seront recupérés depuis la definition de la liste |
| ListUrl                   | string            | Non         | Url de la liste sharepoint                                          |
| Column                    | string            | Non         | nom de la column sharepoint                                         |

#### ItemPickerConfiguration

Cet editeur est destiné pour la selection d'un element d'une liste (lookUp)

| Propriété       | Type de la valeur | Obligatoire | Role                                   |
| --------------- | :---------------: | :---------: | :------------------------------------- |
| ListUrl         | string            | oui         | Url de la liste sharepoint             |
| DisplayedColumn | string            | oui         | nom de la column sharepoint à afficher |
