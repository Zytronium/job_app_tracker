export type ApplicationStatus =
  | 'Applied'
  | 'Phone Screen'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn'

export interface JobApplication {
  id: string
  companyName: string
  positionName: string
  dateApplied: string
  jobDescriptionSummary?: string
  salarySpecified?: string
  extraNotes?: string
  status: ApplicationStatus
  createdAt: string
  updatedAt: string
}

export type SortField = 'dateApplied' | 'companyName' | 'positionName' | 'createdAt'
export type SortDirection = 'asc' | 'desc'
