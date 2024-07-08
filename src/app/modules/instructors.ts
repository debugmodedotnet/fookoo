// src/app/models/instructor.ts
export interface IInstructor {
  InstructorImg: string;
  Name: string;
  Position: string;
  Bio: string;
  Email: string;
  Phone: string;
  Address: string;
  Facebook?: string;
  Instagram?: string;
  Twitter?: string;
  LinkedIn?: string;
  YouTube?: string;
  GitHub?: string;
  Skill1?: string;
  Skill2?: string;
  Skill3?: string;
  Skill4?: string;
  Courses: Array<{
    Title: string;
    Duration: string;
    Level: string;
    Rating: number;
    Price: string;
  }>;
}
