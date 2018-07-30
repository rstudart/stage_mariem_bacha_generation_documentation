import { BaseComponent, TextField, Label, PrimaryButton, memoize } from "office-ui-fabric-react";
import { Articles } from "./Articles";
import { Article } from "../models/Article";
import { IBaseProps } from "@uifabric/utilities";
import React from "react";
import { DateCommandePicker } from "./DateCommandePicker";
import { required, isNumber, Row, Col, PrintHandler, FormContainer } from "../../../Common.Components/src/Index";
import { FournisseurPicker } from "./FournisseurPicker";
import { ICommande, Commande } from "../models/ICommande";
import { BonDeCommandeService } from "../Services/BonDeCommandeService";
import "./Styles/Articles.css";
import writtenNumber from "written-number";
import { frenchLangNumber } from "../Consts/FrenchNumberInLetters";
import { FilePicker } from "./FilePicker";
import { StateManagement, IStateConfig, AllowedGroups } from "../Consts/ConfigState";
export interface IFormulaireState extends ICommande {
    IsSaving: boolean;
    IsLoading: boolean;
    UserGroups: Array<string>;
    Title: string;
}

export class Formulaire extends BaseComponent<IBaseProps, IFormulaireState> {

    constructor(props: IBaseProps) {
        super(props);
        this.state = {
            ...new Commande(),
            IsLoading: true,
            IsSaving: false,
            UserGroups: [],
            Title: ""
        };

        this.componentDidMount = this.Intialize;
    }
    public render(): JSX.Element {
        return (
            <FormContainer
                isLoading={this.state.IsLoading}
                isSaving={this.state.IsSaving}
                onUserGroupsChange={this.OnUserGroupsChange}
                title={this.state.Title}
                allowedGroups={AllowedGroups}>
                <Row>
                    <Col Size={6}>
                        <TextField label="Demande d’approvisionnement"
                            required={true}
                            value={this.state.DA}
                            disabled={!this.EditEnabled()}
                            validateOnFocusOut={true}
                            validateOnLoad={false}
                            onChanged={(val: string) => { this.setState({ DA: val }); }}
                            onGetErrorMessage={(val: string) => { return required()(val); }}
                        />
                    </Col>
                    <Col Size={6}>
                        <DateCommandePicker
                            Date={this.state.DateBonDeCommande}
                            Disabled={this.state.StatutBonDeCommande !== ""}
                            onChanged={this.OnDateChange} />
                    </Col>
                </Row>
                <Row>
                    <Col Size={6}>
                        <FournisseurPicker
                            Disabled={!this.EditEnabled()}
                            FournisseurID={this.state.FournisseurID}
                            FournisseurName={this.state.Fournisseur}
                            onChange={this.OnFournisseurChange} />
                    </Col>
                    <Col Size={6}>
                        <TextField label="TVA"
                            disabled={!this.EditEnabled()}
                            required={true}
                            value={this.state.TVA === undefined ? "" : this.state.TVA + ""}
                            onChanged={this.OnTVAChange}
                            validateOnFocusOut={true}
                            validateOnLoad={false}
                            onGetErrorMessage={this.TVAOnGetErrorMessage}
                        />
                    </Col>
                </Row>
                <Row>
                    <FilePicker
                        Disabled={!this.UploadEnabled()}
                        file={this.state.File}
                        OnChanged={(file) => this.setState({ File: file })}
                        Files={this.state.ScannedAttachements}
                    />
                </Row>
                <Row>
                    <Col Size={12}>
                        <TextField label="Remarque"
                            disabled={!this.EditEnabled()}
                            multiline
                            rows={4}
                            value={this.state.Remarque}
                            onChanged={(val: string) => { this.setState({ Remarque: val }); }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col Size={2}>
                        <Label> Montant TTC en lettres</Label>
                    </Col>
                    <Col Size={10}>
                        <Label>      {this.state.MontantEnLettres}</Label>
                    </Col>
                </Row>
                <Row>
                    <Col Size={2}>
                        <Label> Total H. TVA </Label>
                    </Col>
                    <Col Size={2}>
                        <Label>    {this.state.MontantHTVA.toLocaleString()} </Label>
                    </Col>
                    <Col Size={2}>
                        <Label> Total TVA </Label>
                    </Col>
                    <Col Size={2}>
                        <Label>    {this.state.TotalTVA.toLocaleString()} </Label>
                    </Col>
                    <Col Size={2}>
                        <Label> Total TTC </Label>
                    </Col>
                    <Col Size={2}>
                        <Label>    {this.state.MontantTTC.toLocaleString()} </Label>
                    </Col>
                </Row>
                <Row>
                    <Col Size={12}>
                        <Articles
                            Disabled={!this.EditEnabled()}
                            Articles={this.state.Articles}
                            OnChanged={this.OnArticlesChange} />
                    </Col>
                </Row>
                <Row>
                    <div className="button-bar">

                        {this.CanPrint() &&
                            <PrimaryButton
                                text="Imprimer"
                                disabled={!this.ButtonEnabled()}
                                onClick={this.Print}
                            />
                        }

                        {this.GetState() !== undefined &&
                            < PrimaryButton
                                text={this.GetBtnText()}
                                disabled={!this.ButtonEnabled()}
                                onClick={this.Save}
                            />
                        }
                    </div>
                </Row>
            </FormContainer>
        );
    }

    private CanPrint = (): boolean => {
        let state: IStateConfig | undefined = this.GetState();
        if (state !== undefined) {
            return state.CanPrint;
        }
        return false;
    }

    private EditEnabled = (): boolean => {
        let state: IStateConfig | undefined = this.GetState();
        if (state !== undefined) {
            return state.CanEdit;
        }
        return false;
    }

    private UploadEnabled = (): boolean => {
        let state: IStateConfig | undefined = this.GetState();
        if (state !== undefined) {
            return state.CanUploadFile;
        }
        return false;
    }
    private Print = async (): Promise<void> => {
        let objectData: any = {
            ...this.state,
            DateBonDeCommandeFormatted: (this.state.DateBonDeCommande as Date).toLocaleDateString(),
            ... await BonDeCommandeService.GetFournisseurByID(parseInt(this.state.FournisseurID as string, 10))
        };
        PrintHandler.Print(await BonDeCommandeService.GetPrintTemplate(), objectData);
    }
    private GetState = (): IStateConfig | undefined => {
        return StateManagement.StateConfig.find(val => this.state.StatutBonDeCommande === val.State
            && this.state.UserGroups.indexOf(val.Group) !== -1);
    }

    private OnUserGroupsChange = (grps: Array<string>): void => {
        this.setState({ UserGroups: grps });
    }

    private Intialize(): void {
        var urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        let Id: string = urlParams.has("ID") ?
            urlParams.get("ID") as string : "";

            if (Id !== "") {
            BonDeCommandeService.GetCommande(parseInt(Id, 10)).then(
                result => {
                    this.setState({ ...result, IsLoading: false ,Title:"Bon de commande N° " + result.NumeroBonDeCommande});
                }
            );
        } else {
            this.setState({ IsLoading: false ,Title:"Nouveau bon de commande"});
        }
    }

    private TVAOnGetErrorMessage = (val: string): string => {
        let message: string = required()(val);
        if (message === "") {
            message = isNumber()(val);
            if (message === "") {
                if (parseFloat(val) <= 0) {
                    message = "La valeur doit être strictement positive";
                }
            }
        }
        return message;
    }

    private ButtonEnabled = (): boolean => {
        return this.FormulaireIsValid() && !this.state.IsSaving;
    }
    private FormulaireIsValid = (): boolean => {
        return this.state.DA !== "" &&
            this.state.Articles.length > 0 &&
            this.state.DateBonDeCommande !== undefined &&
            this.state.FournisseurID !== undefined &&
            this.state.TVA > 0;
    }

    private GetBtnText = (): string => {
        let state: IStateConfig | undefined = this.GetState();
        if (state !== undefined) {
            return state.ButtonText;
        }
        return "";
    }

    private Save = (): void => {
        this.setState({ IsSaving: true });
        BonDeCommandeService.AddOrUpdate(this.state
            , (this.GetState() as IStateConfig).StateTo).then(() => {
                this.setState({ IsSaving: false });
                window.location.replace("/Lists/BonDeCommande");
            }).catch(e => {
                this.setState({ IsSaving: false });
                alert("Erreur lors du sauvgarde" + (e as SP.ClientRequestFailedEventArgs).get_message());
                console.log(e);
            });
    }

    private OnFournisseurChange = (id?: string, name?: string): void => {
        this.setState({
            FournisseurID: id,
            Fournisseur: name
        });
    }

    private OnTVAChange = (val: number): void => {
        let totalTVA: number = (this.state.MontantHTVA * val) / 100;
        let montantTTC: number = totalTVA + this.state.MontantHTVA;
        this.setState({
            TVA: val,
            MontantTTC: montantTTC,
            TotalTVA: totalTVA,
            MontantEnLettres: this.NumberToLetters(montantTTC)
        });

    }

    @memoize
    private NumberToLetters(val: number): string {
        return (writtenNumber(val, { lang: frenchLangNumber }) as string).toLocaleUpperCase();
    }


    private OnDateChange = (date?: Date): void => {
        this.setState({
            DateBonDeCommande: date
        });
    }
    private OnArticlesChange = (articles: Array<Article>): void => {
        let montantHTVA: number = 0;
        for (let article of articles) {
            montantHTVA += article.MontantFCFA;
        }

        let totalTVA: number = (montantHTVA * this.state.TVA) / 100;
        let montantTTC: number = totalTVA + montantHTVA;
        this.setState({
            Articles: articles,
            MontantHTVA: montantHTVA,
            TotalTVA: totalTVA,
            MontantTTC: montantTTC,
            MontantEnLettres: this.NumberToLetters(montantTTC)
        });
    }
}