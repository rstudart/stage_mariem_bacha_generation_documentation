import { IDemande, Demande } from "../models/IDemande";
import { BaseComponent, IBaseProps, PrimaryButton, Label } from "office-ui-fabric-react";
import React from "react";
import "./Styles/style.css";
import { DateCommandePicker } from "./DateCommandePicker";
import { Row, Col, FormContainer } from "../../../Common.Components/src/Index";
import { Articles } from "./Articles";
import { ArticleDemande } from "../models/ArticleDemande";
import { FournitureBureauServices } from "../Services/FournitureBureauServices";
import { IStateConfig, StateManagement, AllowedGroups } from "../Consts/ConfigState";

export interface IFormulaireState extends IDemande {
    IsSaving: boolean;
    IsLoading: boolean;
    UserGroups: Array<string>;
    Title: string;
}

export class Formulaire extends BaseComponent<IBaseProps, IFormulaireState> {

    constructor(props: IBaseProps) {
        super(props);
        this.state = {
            ...new Demande(),
            IsSaving: false,
            IsLoading: true,
            UserGroups: [],
            Title: "Page"
        };
        this.Intialize();

    }


    private Intialize(): void {

        FournitureBureauServices.GetUserGroups().then(result => {
            this.setState({ UserGroups: result });
        });
        var urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        let Id: string = urlParams.has("ID") ?
            urlParams.get("ID") as string : "";
        if (Id !== "") {
            FournitureBureauServices.GetDemande(parseInt(Id, 10)).then(
                result => {
                    this.setState({ ...result, IsLoading: false, Title: "Modifier la demande" });
                }
            ).catch(e => alert((e as SP.ClientRequestFailedEventArgs).get_message()));
        } else {
            FournitureBureauServices.GetUserDirection().then(val => {
                if (this.state.Direction === "") {
                    this.setState({
                        IsLoading: false,
                        Direction: val.NameDirection,
                        CodeDirection: val.CodeDirection,
                        Title: "Nouvelle demande"
                    });
                }
            }).catch(e => alert(e));
        }
    }
    public render(): JSX.Element {
        return (
            <FormContainer
                isSaving={this.state.IsSaving}
                isLoading={this.state.IsLoading}
                allowedGroups={AllowedGroups}
                title={this.state.Title}
                onUserGroupsChange={this.OnUserGroupsChange}>
                <Row>
                    <Col Size={6}>
                        <DateCommandePicker onChanged={this.onDateChange}
                            Date={this.state.DateDemandeFournitureBureau}
                            Disabled={!this.CanEditDate()} />
                    </Col>
                    <Col Size={3} />
                    <Col Size={3}>
                        <Label> <strong> Direction :</strong> {this.state.Direction} </Label>
                    </Col>
                </Row>
                <Row>
                    <Col Size={12}>
                        <Articles Articles={this.state.Articles}
                            OnChanged={this.onArticlesChange}
                            ShowEdit={this.showEdit()}
                            Disabled={!this.CanEdit()} />
                    </Col>
                </Row>
                <Row>
                    <Col Size={12}>
                        <div className="button-bar">
                            {this.CanApprove() &&
                                <PrimaryButton
                                    text={(this.GetConfig() as IStateConfig).ButtonText}
                                    disabled={!this.buttonEnabled()}
                                    onClick={this.approve}
                                />
                            }
                            {this.CanSave() &&
                                <PrimaryButton
                                    text="Enregistrer"
                                    disabled={!this.buttonEnabled()}
                                    onClick={this.save}
                                />
                            }

                            {this.CanReject() &&
                                < PrimaryButton
                                    text="Reject"
                                    disabled={!this.buttonEnabled()}
                                    onClick={this.Reject}
                                />
                            }
                        </div>
                    </Col>
                </Row>
            </FormContainer>
        );
    }
    private showEdit = (): boolean => {
        return this.state.StatutDemandeFournitureBureau === "Validée Moyens Généraux" ||
            this.state.StatutDemandeFournitureBureau === "Livrée";
    }

    private save = (): void => {
        this.setState({ IsSaving: true });
        FournitureBureauServices.Save(this.state)
            .then(() => {
                this.setState({ IsSaving: false });
                window.location.replace("/Lists/DemandeFourniture");
            }).catch(e => {
                this.setState({ IsSaving: false });
                console.log(e);
            });
    }

    private OnUserGroupsChange = (grps: Array<string>): void => {
        this.setState({ UserGroups: grps });
    }
    private CanEditDate = (): boolean => {
        return this.state.StatutDemandeFournitureBureau === "";
    }

    private approve = (): void => {
        let conf: IStateConfig = this.GetConfig() as IStateConfig;
        this.setState({ IsSaving: true });
        FournitureBureauServices.Save(this.state, conf.StateTo)
            .then(() => {
                this.setState({ IsSaving: false });
                window.location.replace("/Lists/DemandeFourniture");
            }).catch(e => {
                this.setState({ IsSaving: false });
                alert("Erreur lors du sauvgarde" + (e as SP.ClientRequestFailedEventArgs).get_message());
                console.log(e);
            });
    }
    private CanApprove = (): boolean => {
        let conf: IStateConfig | undefined = this.GetConfig();
        return conf !== undefined && conf.StateTo !== "";
    }
    private CanSave = (): boolean => {
        let conf: IStateConfig | undefined = this.GetConfig();
        return conf !== undefined && conf.CanSave;
    }
    private CanEdit = (): boolean => {
        let conf: IStateConfig | undefined = this.GetConfig();
        return conf !== undefined && conf.CanEdit;
    }
    private CanReject = (): boolean => {
        let conf: IStateConfig | undefined = this.GetConfig();
        return conf !== undefined && conf.CanReject;
    }

    private GetConfig = (): IStateConfig | undefined => {
        return StateManagement.StateConfig.find(val => val.State === this.state.StatutDemandeFournitureBureau
            && this.state.UserGroups.indexOf(val.Group) !== -1);
    }

    private Reject = (): void => {
        this.setState({ IsSaving: true });
        FournitureBureauServices.Save(this.state, StateManagement.RejectionState)
            .then(() => {
                this.setState({ IsSaving: false });
                window.history.go(-1);
            }).catch(e => {
                this.setState({ IsSaving: false });
                console.log(e);
            });
    }

    private onArticlesChange = (articles: Array<ArticleDemande>): void => {
        this.setState({
            Articles: articles
        });
    }

    private buttonEnabled = (): boolean => {
        return (this.state.DateDemandeFournitureBureau !== undefined &&
            this.state.Direction !== "" &&
            this.state.Articles.length > 0 &&
            !this.state.IsSaving);
    }

    private onDateChange = (date?: Date): void => {
        this.setState({
            DateDemandeFournitureBureau: date
        });
    }
}