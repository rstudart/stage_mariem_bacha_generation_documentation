import React from "react";
import { DefaultButton } from "office-ui-fabric-react";
import { Col } from "../../../Common.Components/src/Index";
import { IAction } from "../models/IAction";
import { WorkflowServices } from "../services/WorkflowServices";

export interface IActionState {
    disabled: boolean;
}
export interface IActionProps extends IAction {
    Update: (nextState: string) => Promise<void>;
    TaskUrl: string;
}

export class Action extends React.Component<IActionProps, IActionState> {

    /**
     *
     */
    constructor(props: IActionProps) {
        super(props);
        this.state = { disabled: false };
    }

    public render(): JSX.Element {
        return (
            <Col Size={2}>
                <DefaultButton text={this.props.DispalyText}
                    onClick={this.onClick} />
            </Col>
        );
    }

    private onClick = (): void => {
        this.setState({ disabled: true });
        let url: string = (this.props.TaskUrl.startsWith("/")) ? this.props.TaskUrl : "/" + this.props.TaskUrl;
        this.props
            .Update(this.props.NextStatus)
            .then(async () => {
                this.setState({ disabled: false });
                WorkflowServices.GetWebUrl().then(r => window.location.replace(r + url));
            })
            .catch(() => this.setState({ disabled: false }));
    }


}