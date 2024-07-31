import { AbstractControl, 
    ValidationErrors, 
    ValidatorFn } from '@angular/forms';

export const SalValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const minSal = control.get('MinSalary');
  const maxSal = control.get('MaxSalary');

  if (minSal && maxSal) {
    const minSalValue = Number(minSal.value);
    const maxSalValue = Number(maxSal.value);

    // Validate only if both values are provided
    if (!isNaN(minSalValue) && !isNaN(maxSalValue)) {
      if (minSalValue < 10000) {
        return { minSalaryError: true }; // Min salary error
      }
      if (minSalValue >= maxSalValue) {
        return { salError: true }; // Min salary should be less than max salary
      }
    }
  }
  
  return null;
};

