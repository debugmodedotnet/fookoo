import { EventDetailsComponent } from './event-details/event-details.component';
import { InstructorDetailsComponent } from './instructor-details/instructor-details.component';
import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: 'home1', component: HomeComponent },
    { path: 'signup', loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent) },
    { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
    { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
    { path: 'events', loadComponent: () => import('./event/event.component').then(m => m.EventComponent) },
    { path: 'create-event', loadComponent: () => import('./create-event/create-event.component').then(m => m.CreateEventComponent) },
    { path: 'create-instructor', loadComponent: () => import('./create-instructor/create-instructor.component').then(m => m.CreateInstructorComponent) },
    { path: 'event-details', loadComponent: () => import('./event-details/event-details.component').then(m => m.EventDetailsComponent) },
    { path: 'instructor-details/:id', loadComponent: () => import('./instructor-details/instructor-details.component').then(m => m.InstructorDetailsComponent) },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];