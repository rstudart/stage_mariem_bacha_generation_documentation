import {
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode,
    IColumn,
    SearchBox,
    BaseComponent,
    IBaseProps,
} from "office-ui-fabric-react";
import React from "react";
// import Pagination from "office-ui-fabric-react-pagination";

export interface IListComponentProp extends IBaseProps<any> {
    EnableSearch: boolean;
    Columns: Array<IColumn>;
    SearchColumn?: string;
    Data: Array<any>;
    Title: string;
}

export interface IListComponentState {
    CurrentPage: number;
    TotalPages: number;
    FiltedData: Array<any>;
    PagedData: Array<any>;
    SearchText: string;

}

export class ListComponent extends BaseComponent<IListComponentProp, IListComponentState> {
    public render(): JSX.Element {
        return <div>
            <div className="ms-Grid">
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                        <span className="ms-fontSize-xxl">{this.props.Title}</span>
                    </div>
                </div>
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 ms-smPush9 ms-lgPush7 ms-mdPush7">
                        <SearchBox labelText="Recherche" onChange={this.SearchTextChanged} />
                    </div>
                </div>
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                        <DetailsList
                            columns={this.props.Columns}
                            items={this.state.PagedData}
                            setKey="set"
                            selectionMode={SelectionMode.none}
                            layoutMode={DetailsListLayoutMode.fixedColumns}
                            compact={true} />
                    </div>
                </div>
            </div>
        </div>;
    }
    constructor(prop: IListComponentProp) {
        super(prop);
        this.state = {
            CurrentPage: 1,
            TotalPages: 1,
            FiltedData: [],
            PagedData: [],
            SearchText: ""
        };
        this.componentDidMount = () => this.ApplyPaging(this.FetchData(""), 1);
    }

    private SearchTextChanged = (value: string): void => {
        this.setState({
            SearchText: value
        });
        this.ApplyPaging(this.FetchData(value), 1);
    }

    private IsNullOrWhiteSpace(str: string): boolean {
        return str === null || str.match(/^ *$/) !== null;
    }

    private HasValue(element: any, value: string, columns: Array<IColumn>, searchColumn?: string): boolean {
        if (searchColumn !== undefined) {
            return ((element[searchColumn]) as string)
                .toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1;
        } else {
            for (let colName of columns) {
                if (((element[colName.key]) + "")
                    .toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1) {
                    return true;
                }
            }
            return false;
        }
    }

    private FetchData = (text: string): Array<any> => {
        if (this.props.EnableSearch && !this.IsNullOrWhiteSpace(text)) {
            return this.props.Data.filter(data =>
                this.HasValue(data,
                    text,
                    this.props.Columns,
                    this.props.SearchColumn));
        } else {
            return this.props.Data;
        }
    }

    private ApplyPaging = (data: Array<any>, pageNumber: number): void => {
        let totalPages: number = (data.length / 10) + ((data.length % 10 !== 0) ? 1 : 0);
        this.setState({
            CurrentPage: pageNumber,
            PagedData: data.slice((pageNumber - 1) * 10, 10),
            TotalPages: totalPages,
            FiltedData: data
        });
    }
}

