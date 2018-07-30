import React from "react";
import {
    IFieldSettings,
    IGroupPermissions,
    Permission,
    IPermissionByState
} from "../IFieldConfiguration";
import { BaseComponent, IBaseProps } from "office-ui-fabric-react";


export interface IFieldProps extends IBaseProps {
    Config: IFieldSettings;
    UserGroups: Array<string>;
    State: string;
    DefaultValue: any;
    OnChanged: (value: any) => void;
}

export class Field extends BaseComponent<IFieldProps, {}> {
    public render(): JSX.Element {

        let permission: Permission = this.GetPermission();
        switch (permission) {
            case Permission.None:
                return <div></div>;
            case Permission.Read:
                return this.RenderField(true);
            case Permission.ReadAndWrite:
                return this.RenderField();
            default:
                return <div></div>;
        }
    }

    private RenderField = (disabled?: boolean): JSX.Element => {
        return this.props.Config.FieldConfiguration.Render(this.props.DefaultValue, this.props.OnChanged, disabled);
    }
    private GetPermission = (): Permission => {

        if (this.props.Config.FieldConfiguration.Permissions === undefined) {
            return Permission.ReadAndWrite;
        } else {
            let commonGroups: Array<IGroupPermissions> = this.props.Config.FieldConfiguration.Permissions
                .filter(perm => this.props.UserGroups.indexOf(perm.GroupName) !== -1);
            let val: Permission = Permission.None;
            for (let element of commonGroups) {
                if (val === Permission.ReadAndWrite) {
                    break;
                }
                if ([0, 1, 2].indexOf(element.GroupPermission as number) !== -1) {
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