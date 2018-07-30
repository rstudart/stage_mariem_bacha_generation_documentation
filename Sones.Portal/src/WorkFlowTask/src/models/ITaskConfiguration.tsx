import { IAction } from "./IAction";
import { IField } from "./IField";

export interface ITaskConfiguration {
    Fields: Array<IField>;
    Actions: Array<IAction>;
    Title: string;
}