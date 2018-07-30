import { BaseComponent, DefaultButton, IBaseProps, Link, Label } from "office-ui-fabric-react";
import React from "react";
import { Row, Col } from "../../../Common.Components/src/Index";

export interface IFilePickerProps extends IBaseProps {
    file: File | null;
    OnChanged: (file: File) => void;
    Files: Array<string>;
    Disabled: boolean;
}

export interface IFilePickerState {
    IsUploading: boolean;
}

export class FilePicker extends BaseComponent<IFilePickerProps, IFilePickerState> {

    constructor(props: IFilePickerProps) {
        super(props);
        this.state = { IsUploading: false };

    }

    render(): JSX.Element {
        return (<div className="ms-Table-div">
            {!this.props.Disabled &&
                <div>
                    <input type="file" onChange={(e) => this.onChange(e.target.files)}
                        hidden
                        accept="application/pdf"
                        ref={(input) => { this.input = input; }} />
                    <Row>
                        <Col Size={2}>
                            <DefaultButton text="Choisir un fichier" className="button-no-margin"
                                onClick={this.SelectFile} />
                        </Col>
                        <Col Size={10}>
                            <Label> {this.GetFileName()}</Label>
                        </Col>
                    </Row>
                </div>}
            {this.props.Files.length > 0 &&
                <Row>
                    <Col Size={2}>
                        <Label>  Fichiers attachés </Label>
                    </Col>
                    <Col Size={10}>
                        {this.props.Files.map((link, index) =>
                            <Row key={index}> <Link href={link}> {this.GetFileNameFomLink(link)} </Link></Row>

                        )}
                    </Col>

                </Row>
            }

        </div>);
    }

    private GetFileName = (): string => {
        try {
            if (this.props.file !== null && this.props.file !== undefined) {
                return this.props.file.name;
            } else {
                return "Aucun fichier attaché";
            }
        } catch (e) {
            return "";
        }
    }
    private GetFileNameFomLink = (link: string) => {
        let split: Array<string> = link.split("/");
        return split.pop() as string;
    }
    private SelectFile = (): void => {
        if (this.input !== null) {
            this.input.click();
        }
    }


    private onChange = (selectorFiles: FileList | null): void => {
        if (selectorFiles !== null && selectorFiles.length > 0) {
            this.props.OnChanged(selectorFiles[0]);
        }
    }

    private input: HTMLInputElement | null = null;
}