import { EventDetailsComponent } from './event-details/event-details.component';
import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'signup', loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent) },
    { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
    { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
    { path: 'events', loadComponent: () => import('./event/event.component').then(m => m.EventComponent) },
    { path: 'event-details', loadComponent: () => import('./event-details/event-details.component').then(m => m.EventDetailsComponent) },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];


