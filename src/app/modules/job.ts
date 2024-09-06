export interface Job {
  id?: string;
  userId?: string;
  email: string;
  companyName: string;
  position: string;
  CompanyUrl: string;
  qualification: string;
  tagline: string;
  Location: string;
  Remote: boolean;
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

