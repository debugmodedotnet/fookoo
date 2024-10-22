import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { first, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export const checkIfEmailVerifiedGuard: CanActivateFn = (route, state) => {
  const afAuth = inject(AngularFireAuth);
  const router = inject(Router);
  return new Observable<boolean>(obs => {
    afAuth.user.pipe(first()).subscribe(async user => {
      console.log(user);
      if (user && !user.emailVerified) {
        router.navigateByUrl('verify-email');
        obs.next(false);
        return;
      }
      obs.next(true);
      return;
    })
  });
};
