
export const StateManagement: IConfig = {
    StateConfig: [
        {
            State: "",
            Group: "Bons de commandes - Secrétaires",
            StateTo: "Soumis",
            CanUploadFile: false,
            CanEdit: true,
            CanPrint: false,
            ButtonText: "Soumettre"
        },
        {
            State: "Soumis",
            Group: "Bons de commandes - Chefs du service des moyens généraux",
            StateTo: "Validé",
            CanUploadFile: false,
            CanPrint: false,
            CanEdit: true,
            ButtonText: "Valider"
        },
        {
            State: "Validé",
            Group: "Bons de commandes - Chefs du service des moyens généraux",
            StateTo: "Validé",
            CanEdit: false,
            CanPrint: true,
            CanUploadFile: true,
            ButtonText: "Enregistrer"
        }
    ]
};

export const AllowedGroups: Array<string> = [
    "Bons de commandes - Secrétaires",
    "Bons de commandes - Gestionnaires",
    "Bons de commandes - Chefs du service des moyens généraux",
    "Bons de commandes - Lecteurs"];

export interface IConfig {
    StateConfig: Array<IStateConfig>;
}

export interface IStateConfig {
    State: string;
    Group: string;
    StateTo: string;
    CanUploadFile: boolean;
    CanEdit: boolean;
    CanPrint: boolean;
    ButtonText: string;
}