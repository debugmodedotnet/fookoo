import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  private afAuth = inject(AngularFireAuth);
  private fb = inject(FormBuilder);

  user?: firebase.User;
  showPassword = false;
  updatePasswordForm: FormGroup;
  showUpdatePasswordForm = false;
  showPopup = false;

  constructor() {
    this.updatePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        // this.loadUserData(user.uid);
      } else {
        // this.user = null;
      }
    });
  }

  // loadUserData(uid: string) {
  //   this.firestore.collection('users').doc(uid).get().subscribe(doc => {
  //     if (doc.exists) {
  //       this.user = doc.data();
  //     }
  //   });
  // }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleUpdatePasswordForm(): void {
    this.showUpdatePasswordForm = !this.showUpdatePasswordForm;
    if (!this.showUpdatePasswordForm) {
      this.updatePasswordForm.reset();
    }
  }

  updatePassword(): void {
    if (this.updatePasswordForm.valid) {
      const currentPassword = this.updatePasswordForm.get('currentPassword')?.value;
      const newPassword = this.updatePasswordForm.get('newPassword')?.value;
      const confirmPassword = this.updatePasswordForm.get('confirmPassword')?.value;

      if (newPassword !== confirmPassword) {
        return;
      }

      this.afAuth.currentUser.then(user => {
        if (user && user.email) {
          const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
          user.reauthenticateWithCredential(credential).then(() => {
            user.updatePassword(newPassword).then(() => {
              this.toggleUpdatePasswordForm();
              this.showPopup = true;
              setTimeout(() => {
                this.showPopup = false;
              }, 3000);
            });
          });
        }
      });
    }
  }
}
