import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { userAuthGuard } from './services/user-auth.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },

  { path: 'signup', loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'forgot-password', loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },

  { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent), canActivate: [userAuthGuard] },
  { path: 'profile-share', loadComponent: () => import('./profile-share/profile-share.component').then(m => m.ProfileShareComponent) },
  { path: 'p/:name/:uid', loadComponent: () => import('./profile-share/profile-share.component').then(m => m.ProfileShareComponent) },

  { path: 'event/:id', loadComponent: () => import('./event-details/event-details.component').then(m => m.EventDetailsComponent) },
  { path: 'events', loadComponent: () => import('./event-listing/event-listing.component').then(m => m.EventListingComponent) },

  { path: 'mentor/:instructorId', loadComponent: () => import('./instructor-details/instructor-details.component').then(m => m.InstructorDetailsComponent) },
  { path: 'mentors', loadComponent: () => import('./instructor-listing/instructor-listing.component').then(m => m.InstructorListingComponent) },

  { path: 'view-job', loadComponent: () => import('./profile/viewjob/viewjob.component').then(m => m.ViewJobComponent) },
  { path: 'applied-job', loadComponent: () => import('./profile/applied-job/applied-job.component').then(m => m.AppliedJobComponent) },
  { path: 'jobs/:id', loadComponent: () => import('./job-details/job-details.component').then(m => m.JobDetailsComponent) },
  { path: 'jobs', loadComponent: () => import('./job-listing/job-listing.component').then(m => m.JobListingComponent) },
  { path: 'post-job', loadComponent: () => import('./post-jobs/post-jobs.component').then(m => m.PostJobsComponent) },

  { path: 'youtube-listing', loadComponent: () => import('./youtube-listing/youtube-listing.component').then(m => m.YoutubeListingComponent) },

  { path: 'test-skills', loadComponent: () => import('./quiz-list/quiz-list.component').then(m => m.QuizListComponent), canActivate: [userAuthGuard] },
  { path: 'test-skills/:Name', loadComponent: () => import('./quiz/quiz.component').then(m => m.QuizComponent), canActivate: [userAuthGuard] },

  { path: 'ng-india', loadComponent: () => import('./ng-india/ng-india.component').then(m => m.NgIndiaComponent) },

  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

