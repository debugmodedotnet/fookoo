export interface Job {
  id?: string;
  userId?: string;
  email?: string;
  PhoneNo?: string;
  companyName: string;
  position: string;
  CompanyUrl: string;
  qualification: string;
  Location: string;
  Remote: boolean;
  Tag?: string;
  SkillsRequired: string[];
  Responsibilities: string[];
  MinSalary: number;
  MaxSalary: number;
  JobDescription: string;
  CompanyTwitter?: string;
  CompanyLinkedIn?: string;
  CompanyGithub?: string;
  isActive?: boolean;
  //postedTime?: string;
}

