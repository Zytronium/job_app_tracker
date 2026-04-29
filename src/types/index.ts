export type ApplicationStatus =
  | 'Applied'
  | 'Phone Screen'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn'

export type EmploymentType =
    | 'Full-Time'
    | 'Part-Time'
    | 'Contract'
    | 'Internship'
    | 'Other'

export type LocationType =
    | 'On-Site'
    | 'Hybrid'
    | 'Remote'
    | 'Other'

export type PayType =
    | 'Hourly'
    | 'Salary'
    | 'Commission'
    | 'Other'

export interface JobApplication {
  id: string
  companyName: string
  positionName: string
  dateApplied: string
  jobDescriptionSummary?: string
  jobTags?: string[] // i.e. web development, python scripting, or database management; use this, position name, and company name for searching
  payRange?: number[] // min 1 number, max 2 numbers, both positive or zero
  payType?: PayType
  employmentType?: EmploymentType
  location?: string
  locationType?: LocationType
  duration?: string
  benefits?: string[]
  jobMatch?: number // 1-5
  extraNotes?: string
  status: ApplicationStatus
  createdAt: string
  updatedAt: string
}

export type SortField = 'dateApplied' | 'companyName' | 'positionName' | 'createdAt'
export type SortDirection = 'asc' | 'desc'
