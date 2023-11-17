import {AbstractControl, FormControl, ValidationErrors} from '@angular/forms';

export class CustomValidators {

  private static emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  private static isEmpty(value: any): boolean {
    return value === undefined
      || value === null
      || value.toString() === '';
  }

  public static required(control: AbstractControl): ValidationErrors | null {
    const formControl = control as FormControl;
    const value = formControl.value;

    return value === undefined || value === null || value.toString().trim() === ''
      ? {required: true}
      : null;
  }

  public static satellite(control: AbstractControl): ValidationErrors | null {
    const formControl = control as FormControl;
    const value = formControl.value;

    return value === undefined || value === null || value.toString().trim() === 'none'
      ? {satellite: true}
      : null;


  }

  public static emails(control: AbstractControl): ValidationErrors | null {
    const formControl = control as FormControl;
    const value = formControl.value as string;

    if (CustomValidators.isEmpty(value)) {
      return null;
    }

    const parts = value.split(';');
    let isValid = true;

    parts.forEach(part => {
      if (!part.trim().toLowerCase().match(CustomValidators.emailRegExp)) {
        isValid = false;
      }
    });

    return isValid
      ? null
      : {emails: true};
  }

  public static fileMaxSize(maxSize: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const formControl = control as FormControl;
      const fileSize: number | null = formControl?.value?.size ?? null;

      if (fileSize === null || fileSize <= maxSize) {
        return null;
      }

      return {fileMaxSize: true};
    };
  }

  static lessThanPlus90Days(control: AbstractControl) {
    if (control && control.value && control.value.length === 10) {
      const differenceInTime = new Date(CustomValidators.changeDateFormat(control.value)).getTime() - new Date().getTime();
      if ((differenceInTime / (1000 * 3600 * 24)) > 90) {
        return {lessThanPlus90Days: true};
      }
    }
    return null;
  }

  static lessThanCurentDate(control: AbstractControl) {
    if (control && control.value && control.value.length === 10) {
      const differenceInTime = new Date(CustomValidators.changeDateFormat(control.value)).getTime() - new Date().getTime();
      if ((differenceInTime / (1000 * 3600 * 24)) > 0) {
        return {lessThanCurentDate: true};
      }
    }
    return null;
  }

  static changeDateFormat(dateString: string): string {
    return dateString.substr(3, 3) + dateString.substr(0, 3) + dateString.substr(6, 4);
  }


}
