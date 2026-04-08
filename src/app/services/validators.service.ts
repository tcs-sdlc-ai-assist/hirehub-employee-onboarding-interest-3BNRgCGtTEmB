import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fullNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return { required: true };
    }
    if (value.trim().length < 2) {
      return { minLength: { requiredLength: 2, actualLength: value.trim().length } };
    }
    const pattern = /^[a-zA-Z\s]+$/;
    if (!pattern.test(value)) {
      return { invalidName: true };
    }
    return null;
  };
}

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return { required: true };
    }
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!pattern.test(value)) {
      return { invalidEmail: true };
    }
    return null;
  };
}

export function mobileValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return { required: true };
    }
    const pattern = /^\d{10,15}$/;
    if (!pattern.test(value)) {
      return { invalidMobile: true };
    }
    return null;
  };
}