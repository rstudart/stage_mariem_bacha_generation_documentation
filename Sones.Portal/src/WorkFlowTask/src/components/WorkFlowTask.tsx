import { BaseComponent, IBaseProps, TextField, Label } from "office-ui-fabric-react";
import React from "react";
import { ITask } from "../models/ITask";
import { Field } from "./Field";
import { Container, Row, BlockUI, Col } from "../../../Common.Components/src/Index";
import { Action } from "./Action";
import { WorkflowServices } from "../services/WorkflowServices";
import { Context } from "../store/Context";
import { Task } from "../models/Task";
import "./style.css";
export interface IWorkFlowTaskState extends ITask {
    Item: any;
    IsSaving: boolean;
    Note: string;
    ListItemFields: Array<SP.Field>;
    IsAllowed: boolean;
    IsLoading: boolean;
}

export class WorkFlowTask extends BaseComponent<IBaseProps, IWorkFlowTaskState> {


    constructor(props: IBaseProps) {

        super(props);
        this.state = Object.assign(new Task(), {
            IsSaving: false,
            IsLoading: true,
            Item: undefined,
            Note: "",
            IsAllowed: false,
            ListItemFields: []

        });
        this.Init();
    }

    public render(): JSX.Element {
        return <Container>
            {this.state.Item !== undefined && !this.state.IsAllowed &&
                <Label className="ms-fontSize-xxl">  Désolé.. cette tâche ne vous est pas assignée. </Label>
            }
            {this.state.Item !== undefined && this.state.IsAllowed &&
                <div>
                    {this.state.TaskInfo.Fields.map((field, index) => {
                        return <Field
                            key={index}
                            Field={this.GetField(field.InternalName)}
                            Label={field.Label}
                            Item={this.state.Item}
                            InternalName={field.InternalName} />;
                    })}
                    {this.state.Status !== "Terminé" && this.state.Status !== "Attente de quelqu'un d'autre" &&
                        <div>
                            <Row>
                                <Col Size={10}>
                                    <TextField
                                        multiline
                                        label="Remarques :"
                                        value={this.state.Note}
                                        onChanged={this.SetNote}
                                    />
                                </Col>

                            </Row>
                            <Row>
                                <Col Size={10} className="WF-Buttons">


                                    {this.state.TaskInfo.Actions.map((action, index) => {
                                        return <Action
                                            key={index}
                                            TaskUrl={Context.TaskListUrl as string}
                                            NextStatus={action.NextStatus}
                                            DispalyText={action.DispalyText}
                                            Update={this.UpdateState}
                                        />;
                                    })}

                                </Col>
                                <Col Size={2}></Col>
                            </Row>
                        </div>
                    }
                </div>
            }

            <BlockUI Block={this.state.IsSaving} Text="Sauvegarde en cours..." />
            <BlockUI Block={this.state.IsLoading} Text="Chargement..." />
        </Container>;
    }
    private GetField = (fieldInternalName: string): SP.Field => {
        return this.state.ListItemFields.find(fld => fld.get_internalName() === fieldInternalName) as SP.Field;
    }
    private SetNote = (newValue: string): void => {
        this.setState({ Note: newValue });
    }

    private Init = async (): Promise<void> => {
        let taskConfig: ITask = await WorkflowServices.GetTaskConfiguration();
        let state: IWorkFlowTaskState = this.state;
        let newState: IWorkFlowTaskState = Object.assign(state,
            {
                ...taskConfig,
                IsLoading: false
            });
        newState.ItemInfo = JSON.parse(newState.SerializedItemInfo);
        newState.TaskInfo = JSON.parse(newState.SerializedTaskInfo);
        let title: HTMLElement = document.getElementById("DeltaPlaceHolderPageTitleInTitleArea") as HTMLElement;
        title.innerHTML = newState.TaskInfo.Title;
        if (newState.AssignedTo !== undefined) {
            newState.IsAllowed = await WorkflowServices.IsAllowed(newState.AssignedTo);
        }
        newState.Item = await WorkflowServices.GetItem(newState.ItemInfo.ListUrl, newState.ItemInfo.ItemID);
        newState.ListItemFields = await WorkflowServices.GetFields(newState.ItemInfo.ListUrl);
        this.setState(newState);


    }

    private UpdateState = (state: string): Promise<void> => {
        this.setState({ IsSaving: true });
        // let item: any = this.state.Item;
        let item: any = { ID: this.state.Item.ID };
        item[this.state.ItemInfo.StatusColumn] = state;
        item.WFInstanceID = this.state.WFInstanceID;
        return WorkflowServices.UpdateItem(this.state.ItemInfo.ListUrl, item, this.state.Note, state)
            .then(() => this.setState({ IsSaving: false }))
            .catch(e => {
                this.setState({ IsSaving: false });
                throw e;
            });

    }


}