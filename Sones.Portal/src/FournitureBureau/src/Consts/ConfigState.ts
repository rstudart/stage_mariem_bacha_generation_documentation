
export const StateManagement: IConfig = {
    RejectionState: "Refusée",
    StateConfig: [
        {
            State: "",
            Group: "Demandes de fournitures de bureau - Secrétaires",
            StateTo: "Soumise",
            CanReject: false,
            CanSave: false,
            CanEdit: true,
            ButtonText: "Soumettre"
        },
        {
            State: "Soumise",
            Group: "Demandes de fournitures de bureau - Directeurs",
            StateTo: "Validée Direction",
            CanReject: true,
            CanEdit: false,
            CanSave: false,
            ButtonText: "Validation direction"
        },
        {
            State: "Validée Direction",
            Group: "Demandes de fournitures de bureau - Chefs de division achats",
            StateTo: "Validée Achat",
            CanReject: true,
            CanEdit: false,
            CanSave: false,
            ButtonText: "Validation Achat"
        },
        {
            State: "Validée Achat",
            Group: "Demandes de fournitures de bureau - Chefs des services généraux",
            StateTo: "Validée Moyens Généraux",
            CanReject: true,
            CanEdit: false,
            CanSave: false,
            ButtonText: "Validation Moyens Généraux"
        },
        {
            State: "Validée Moyens Généraux",
            Group: "Demandes de fournitures de bureau - Secrétaires",
            StateTo: "Livrée",
            CanReject: false,
            CanEdit: true,
            CanSave: true,
            ButtonText: "Valider la livraison"
        }
    ]
};
export const AllowedGroups :Array<string>= [
    "Demandes de fournitures de bureau - Secrétaires",
    "Demandes de fournitures de bureau - Directeurs",
    "Demandes de fournitures de bureau - Chefs de division achats",
    "Demandes de fournitures de bureau - Chefs des services généraux",
    "Demandes de fournitures de bureau - Gestionnaires"
];

export interface IConfig {
    RejectionState: string;
    StateConfig: Array<IStateConfig>;
}

export interface IStateConfig {
    State: string;
    Group: string;
    StateTo: string;
    CanReject: boolean;
    CanSave: boolean;
    CanEdit: boolean;
    ButtonText: string;
}