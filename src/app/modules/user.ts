export interface IUser {
  id?: string;
  uid: string;
  age: number;
  bio: string;
  city: string;
  name: string;
  email: string;
  phone: number;
  tagline: string;
  github: string;
  twitter: string;
  linkedin: string;
  isadmin: boolean;
  photoURL: string;
  openforjob: boolean;
  position: string;
  skill1: string;
  skill2: string;
  skill3: string;
  skill4: string;
  education: string;
  experience: string;
  pastExperiences?: string[];
}