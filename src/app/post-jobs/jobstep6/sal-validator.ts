import { AbstractControl, 
    ValidationErrors, 
    ValidatorFn } from '@angular/forms';

export const SalValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const minSal = control.get('MinSalary');
  const maxSal = control.get('MaxSalary');
  if (minSal && maxSal && minSal.value >= maxSal.value) {
    return {
      salError: true,
    };
  }
  return null;
};

