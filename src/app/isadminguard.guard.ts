import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './services/user.service';
import { catchError, map, of, tap } from 'rxjs';

export const isAdminGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const userService = inject(UserService);

  return userService.getCurrentUser().pipe(
    map(user => {
      if (user) {
        console.log('User logged in');
        return true;
      } else {
        console.log('User not logged in');
        return false;
      }
    }),
    tap(isLoggedIn => {
      if (!isLoggedIn) {
        router.navigate(['/login']);
      }
    }),
    catchError((err) => {
      console.error(err);
      router.navigate(['/login']);
      return of(false);
    })
  );
};
