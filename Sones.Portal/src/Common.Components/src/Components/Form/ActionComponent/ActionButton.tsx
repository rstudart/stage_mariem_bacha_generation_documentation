import React from "react";
import { PrimaryButton } from "office-ui-fabric-react";
import { Permission, IFormAction, IGroupPermissions, IPermissionByState } from "../IFieldConfiguration";

export interface IActionButtonProps {
    Config: IFormAction;
    UserGroups: Array<string>;
    State: string;
}
export interface IActionButtonState {
    Disabled: boolean;
}
export class ActionButton extends React.Component<IActionButtonProps, IActionButtonState> {

    public render(): JSX.Element {
        switch (this.GetPermission()) {
            case Permission.None:
                return <div>    </div>;
            default:
                return <div>
                    <PrimaryButton text={this.props.Config.Label}
                        disabled={this.state.Disabled}
                        onClick={this.click} />
                </div>;
        }
    }

    constructor(props: IActionButtonProps) {
        super(props);
        this.state = { Disabled: false };
    }
    private click = (): void => {
        this.setState({ Disabled: true });
        this.props.Config.Action()
            .then(() => this.setState({ Disabled: false }));
    }

    private GetPermission = (): Permission => {
        if (this.props.Config.Permissions === undefined) {
            return Permission.ReadAndWrite;
        } else {
            let commonGroups: Array<IGroupPermissions> = this.props.Config.Permissions
                .filter(perm => this.props.UserGroups.indexOf(perm.GroupName) !== -1);
            let val: Permission = Permission.None;

            for (let element of commonGroups) {
                if (val === Permission.ReadAndWrite) {
                    break;
                }
                if (element.GroupPermission as Permission) {
                    if (val < (element.GroupPermission as Permission)) {
                        val = element.GroupPermission as Permission;
                    }
                } else {
                    let permission: IPermissionByState | undefined =
                        (element.GroupPermission as Array<IPermissionByState>)
                            .find(element => element.State === this.props.State);
                    if (permission !== undefined) {
                        let per: Permission = permission.Permission;
                        if (val < (per)) {
                            val = per;
                        }
                    }
                }
            }
            return val;
        }
    }
}