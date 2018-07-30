import { BaseComponent, IBaseProps, Dialog, DialogType, Spinner, SpinnerSize } from "office-ui-fabric-react";
import React from "react";

export interface IBlockUIProps extends IBaseProps {
    Block: boolean;
    Text:string;
}

export class BlockUI extends BaseComponent<IBlockUIProps, {}> {
    render(): JSX.Element {
        return (
            <Dialog
                hidden={!this.props.Block}
                dialogContentProps={{
                    type: DialogType.normal,
                }}
                modalProps={{
                    isBlocking: true,
                    containerClassName: "ms-dialogMainOverride"
                }}
            >
                <Spinner size={SpinnerSize.large} label={this.props.Text}/>
            </Dialog>
        );
    }
}
