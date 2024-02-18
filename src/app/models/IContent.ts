import { IMedia } from "./IMedia";

export interface IContent {
    id: number,
    name: string,
    description: string,
    media: IMedia[]
}