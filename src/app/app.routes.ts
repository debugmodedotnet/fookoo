import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { userAuthGuard } from './services/user-auth.guard';
import { isAdminGuard } from './services/isadminguard.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'ng-india', loadComponent: () => import('./ng-india/ng-india.component').then(m => m.NgIndiaComponent) },
  { path: 'signup', loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent), canActivate: [userAuthGuard] },
  { path: 'events', loadComponent: () => import('./event/event.component').then(m => m.EventComponent) },
  { path: 'event/:id', loadComponent: () => import('./event-details/event-details.component').then(m => m.EventDetailsComponent) },
  { path: 'instructor/:id', loadComponent: () => import('./instructor-details/instructor-details.component').then(m => m.InstructorDetailsComponent) },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [isAdminGuard, userAuthGuard],
    children: [
      { path: 'event', loadComponent: () => import('./create-event/create-event.component').then(m => m.CreateEventComponent) },
      { path: 'instructor', loadComponent: () => import('./create-instructor/create-instructor.component').then(m => m.CreateInstructorComponent) },
      { path: 'youtube', loadComponent: () => import('./youtube-setting/youtube-setting.component').then(m => m.YoutubeSettingComponent) },
      { path: 'instructor-setting', loadComponent: () => import('./instructor-setting/instructor-setting.component').then(m => m.InstructorSettingComponent) },
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

