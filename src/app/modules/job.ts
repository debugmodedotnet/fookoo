export interface Job {
  id?: string;  
  companyName: string;
  CompanyUrl: string;
  JobDescription: string;
  Responsibilities: string[];
  qualification: string[];
  SkillsRequired: string;
  Location: string;
  Remote: boolean;
  CompanyTwitter?: string;
  CompanyLinkedIn?: string;
  CompanyGithub?: string;
  position: string;
  email?: string;
  PhoneNo?: string;
  Tag?: string;
  ImageUrl: string;
  userId?: string; 
  Private?: boolean;
  MinSalary: number;
  MaxSalary: number;
}

