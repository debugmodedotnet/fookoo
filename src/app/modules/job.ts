export interface Job {
  id?: string;
  userId?: string;
  email: string;
  companyName: string;
  position: string;
  CompanyUrl: string;
  qualification: string;
  Location: string;
  jobType: string;
  Tag: string;
  SkillsRequired: string[];
  Responsibilities: string[];
  MinSalary: number;
  MaxSalary: number;
  noticePeriod: string;
  JobDescription: string;
  CompanyTwitter?: string;
  CompanyLinkedIn?: string;
  CompanyGithub?: string;
  isActive?: boolean;
  createdTime: string;
}

