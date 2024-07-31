import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './services/user.service';
import { catchError, map, of, tap } from 'rxjs';

export const isAdminGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const userService = inject(UserService);

  return userService.getCurrentUser().pipe(
    map(user => {
      if (user && user.role === 'admin') {
        // User is logged in and is an admin
        console.log('User is an admin');
        return true;
      } else {
        // User is not logged in or not an admin
        console.log('User is not an admin');
        return false;
      }
    }),
    tap(isAdmin => {
      if (!isAdmin) {
        // Redirect to home page if not admin
        router.navigate(['/home']);
      }
    }),
    catchError((err) => {
      console.error(err);
      // Redirect to home page on error
      router.navigate(['/home']);
      return of(false);
    })
  );
};
