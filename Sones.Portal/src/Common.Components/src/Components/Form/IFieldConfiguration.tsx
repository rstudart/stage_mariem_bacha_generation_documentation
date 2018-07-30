import { IBaseProps } from "office-ui-fabric-react";
import { IValidator } from "./EditorComponent/DynamicFieldConfigurationFactroy";

export interface IFieldSettings<T=IField> {
    FieldName: string;
    FieldConfiguration: T;
}

export interface IGroupPermissions {
    GroupName: string;
    GroupPermission: Permission | Array<IPermissionByState>;
}

export interface IPermissionByState {
    State: string;
    Permission: Permission;
}

export enum Permission {
    Read = 1,
    ReadAndWrite = 2,
    None = 0
}

export interface IField {
    Permissions?: Array<IGroupPermissions>;
    Validators: Array<IValidator>;
    Render: (defaultValue: any, OnChanged: (value: any) => void, disabled?: boolean) => JSX.Element;
}

export interface IFormAction {
    Label: string;
    Action: () => Promise<any>;
    Permissions?: Array<IGroupPermissions>;
}

export interface IComponentProp<T> extends IBaseProps {
    prop: T;
    defaultValue: any;
    disabled?: boolean;
    OnChanged: (value: any) => void;
}
