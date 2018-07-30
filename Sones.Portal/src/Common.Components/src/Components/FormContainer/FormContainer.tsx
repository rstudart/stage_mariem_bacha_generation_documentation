import React from "react";
import { Container } from "../Layout/Container";
import { BlockUI } from "../BlockUI/BlockUI";
import { BaseComponent, IBaseProps, Label } from "office-ui-fabric-react";
import { SharePointServices } from "../../../../Common.Services/src/Index";

export interface IFormContainerProps extends IBaseProps {
    isSaving: boolean;
    isLoading: boolean;
    title: string;
    allowedGroups?: Array<string>;
    onUserGroupsChange?: (userGroups: Array<string>) => void;
}

export interface IFormStateProps {
    userGroups: Array<string>;
    userGroupsInitialized: boolean;
    isAllowed?: boolean;
}

export class FormContainer extends BaseComponent<IFormContainerProps, IFormStateProps> {

    constructor(prop: IFormContainerProps) {
        super(prop);
        this.state = {
            userGroups: new Array<string>(),
            isAllowed: (this.props.allowedGroups === undefined) ? true : undefined,
            userGroupsInitialized: false
        };
        this.initializeGroups();
        this.componentWillReceiveProps = this.setTitle;
    }

    public render(): JSX.Element {
        return (
            <Container>
                <BlockUI Block={this.props.isSaving} Text="Sauvegarde en cours..." />
                <BlockUI Block={this.isLoading()} Text="Chargement..." />
                {this.state.isAllowed === false && this.state.userGroupsInitialized &&
                    <Label className="ms-fontSize-xxl"> Désolé.. cette page n'est pas partagée avec vous.</Label>
                }
                {this.state.isAllowed && this.state.userGroupsInitialized &&
                    this.props.children
                }
            </Container>
        );
    }
    private setTitle = (newProps: Readonly<IFormContainerProps>): void => {
        let title: HTMLElement = document.getElementById("DeltaPlaceHolderPageTitleInTitleArea") as HTMLElement;
        title.innerHTML = newProps.title;
        document.title = newProps.title;
    }
    private isLoading = (): boolean => {
        return this.props.isLoading || !this.state.userGroupsInitialized;
    }

    private initializeGroups = (): void => {
        SharePointServices.GetCurrentUserGroups()
            .then(grps => {
                let userGroups: Array<string> = grps.get_data().map(grp => grp.get_title());
                if (this.props.allowedGroups !== undefined) {
                    let groupsInterSection: Array<string> = this.props.allowedGroups.filter(gp => userGroups.indexOf(gp) !== -1);
                    this.setState({
                        userGroups: userGroups,
                        userGroupsInitialized: true,
                        isAllowed: (groupsInterSection.length > 0)
                    });
                    if (this.props.onUserGroupsChange !== undefined) {
                        this.props.onUserGroupsChange(groupsInterSection);
                    }
                } else {
                    this.setState({
                        userGroups: userGroups,
                        userGroupsInitialized: true
                    });
                    if (this.props.onUserGroupsChange !== undefined) {
                        this.props.onUserGroupsChange(userGroups);
                    }
                }
            });
    }
}