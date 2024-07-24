import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { userAuthGuard } from './services/user-auth.guard';
import { isAdminGuard } from './services/isadminguard.guard';


export const routes: Routes = [
  { path: 'home', component: HomeComponent },

  { path: 'signup', loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent), canActivate: [userAuthGuard] },

  { path: 'events', loadComponent: () => import('./event/event.component').then(m => m.EventComponent) },
  { path: 'event/:id', loadComponent: () => import('./event-details/event-details.component').then(m => m.EventDetailsComponent) },
  { path: 'event-listing', loadComponent: () => import('./event-listing/event-listing.component').then(m => m.EventListingComponent) },

  { path: 'instructor/:instructorId', loadComponent: () => import('./instructor-details/instructor-details.component').then(m => m.InstructorDetailsComponent) },
  { path: 'instructor-listing', loadComponent: () => import('./instructor-listing/instructor-listing.component').then(m => m.InstructorListingComponent) },

  { path: 'job-list', loadComponent: () => import('./jobs/job-list/job-list.component').then(m => m.JobListComponent) },
  { path: 'job-detail', loadComponent: () => import('./jobs/job-detail/job-detail.component').then(m => m.JobDetailComponent) },
  { path: 'view-job', loadComponent: () => import('./profile/viewjob/viewjob.component').then(m => m.ViewJobComponent) },
  { path: 'job', loadComponent: () => import('./profile/job/job.component').then(m => m.JobComponent) },
  // { path: 'jobs', loadComponent: () => import('./jobs/jobs.component').then(m => m.JobsComponent) },
  { path: 'jobs', loadComponent: () => import('./jobs/all-jobs/all-jobs.component').then(m => m.AllJobsComponent)},
  { path: 'jobs/:id', loadComponent: () => import('./jobs/jobs.component').then(m => m.JobsComponent) },

  { path: 'youtube-listing', loadComponent: () => import('./youtube-listing/youtube-listing.component').then(m => m.YoutubeListingComponent) },  

  { path: 'ng-india', loadComponent: () => import('./ng-india/ng-india.component').then(m => m.NgIndiaComponent) },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [isAdminGuard, userAuthGuard],
    children: [
      { path: 'event', loadComponent: () => import('./create-event/create-event.component').then(m => m.CreateEventComponent) },
      { path: 'instructor', loadComponent: () => import('./create-instructor/create-instructor.component').then(m => m.CreateInstructorComponent) },
      { path: 'youtube', loadComponent: () => import('./youtube-setting/youtube-setting.component').then(m => m.YoutubeSettingComponent) },
      { path: 'quiz', loadComponent: () => import('./quiz/quiz.component').then(m => m.QuizComponent) },
      { path: 'instructor-setting', loadComponent: () => import('./instructor-setting/instructor-setting.component').then(m => m.InstructorSettingComponent) },
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

