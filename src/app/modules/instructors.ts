import { ICourse } from "../course";

export interface IInstructor {
  id?: string;
  Name: string;
  Bio: string;
  Email: string;
  InstructorImg?: string | null;  // Choose to make InstructorImg optional and allow null
  Position: string;
  Skill1: string;
  Skill2: string;
  Skill3: string;
  Skill4: string;
  LinkedIn: string;
  Twitter: string;
  Github: string;
  courses?: ICourse[];  // Include courses if it's needed
}

