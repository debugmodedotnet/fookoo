import { Component, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-instructor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-instructor.component.html',
  styleUrl: './create-instructor.component.scss',
})
export class CreateInstructorComponent {
  instructorForm: FormGroup;
  private firestore = inject(AngularFirestore);

  constructor() {
    this.instructorForm = new FormGroup({
      Name: new FormControl('', Validators.required),
      Position: new FormControl(''),
      Skills: new FormControl('', Validators.maxLength(200)),
      Bio: new FormControl('', Validators.maxLength(200)),
      X: new FormControl(''),
      Facebook: new FormControl(''),
      Instagram: new FormControl(''),
      LinkedIn: new FormControl(''),
    });
  }

  

  onSubmit() {
    if (this.instructorForm.valid) {
      this.firestore.collection('instructor').add(this.instructorForm.value)
        .then(docRef => {
          console.log(`Document written with ID: ${docRef.id}`);
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    }
  }

}
