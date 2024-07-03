import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InstructorDetailsComponent } from './instructor-details/instructor-details.component';
import { userAuthGuard } from './services/user-auth.guard';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'signup', loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent) },
    { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
    { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent), canActivate: [userAuthGuard] },
    { path: 'events', loadComponent: () => import('./event/event.component').then(m => m.EventComponent) },
    { path: 'event-details/:id', loadComponent: () => import('./event-details/event-details.component').then(m => m.EventDetailsComponent) },
    { path: 'instructor-details/:id', loadComponent: () => import('./instructor-details/instructor-details.component').then(m => m.InstructorDetailsComponent) },
    {
      path: 'admin',
      component: AdminComponent,
      children: [
        { path: 'create-event', loadComponent: () => import('./create-event/create-event.component').then(m => m.CreateEventComponent) },
        { path: 'create-instructor', loadComponent: () => import('./create-instructor/create-instructor.component').then(m => m.CreateInstructorComponent) },
        { path: 'youtube-setting', loadComponent: () => import('./youtube-setting/youtube-setting.component').then(m => m.YoutubeSettingComponent) },
        // Add more child routes here as needed
      ]
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
  ];