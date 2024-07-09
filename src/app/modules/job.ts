export interface Job {
  id?: string; // Firestore document ID, optional
  CompanyName: string;
  CompanyUrl: string;
  JobDescription: string;
  SkillsRequired: string;
  Responsibilities: string;
  Position: string;
  Location: string;
  Remote: boolean;
  CompanyGithub: string;
  CompanyTwitter: string;
  CompanyLinkedIn: string;
  Email: string;
  PhoneNo: string;
  Tag: string;
  ImageUrl: string;
  userId?: string; // ID of the user who created the job
}

