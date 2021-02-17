import {Request} from "express"

interface IApplicationRequest {
    userId: number,
    permissions: Array<{id: number, name: string}>
}

interface IFileField {
    file: Express.Multer.File
}

export type ApplicationRequest = IApplicationRequest & Request
export type ApplicationRequestWithFile = ApplicationRequest & IFileField