import { JobTaskStatus, Platform, ResponseStatus } from "../../../generated/prisma/enums"


export interface  ICreateJob {
    applicationDate?: string
    companyName:      string
    companyWebsite?:  string
    email?:           string
    response?:        ResponseStatus
    jobTaskStatus?:   JobTaskStatus
    platform?:        Platform
    position:         string
    location?:        string
    jobPostingUrl?:   string
    notes?:           string
}

