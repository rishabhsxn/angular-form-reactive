import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';

type validator = {
  [key: string]: boolean;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signUpForm: FormGroup;
  forbiddenUsernames: string[] = ['Anna', 'John'];
  forbiddenEmails: string[] = ['test@test.com'];

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      userData: new FormGroup({
        username: new FormControl(null, [
          Validators.required,
          this.forbiddenUsernamesValidator.bind(this),
        ]),
        email: new FormControl(
          null,
          [Validators.required, Validators.email],
          this.forbiddenEmailsValidator.bind(this)
        ),
      }),
      gender: new FormControl(this.genders[0]),
      hobbies: new FormArray([]),
    });

    this.signUpForm.valueChanges.subscribe((newVal) => {
      console.log(newVal);
    });

    this.signUpForm.statusChanges.subscribe((newStatus) => {
      console.log(newStatus);
    });
  }

  onSubmit(): void {
    console.log(this.signUpForm);
    this.signUpForm.reset();
  }

  onAddHobby(): void {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signUpForm.get('hobbies')).push(control);
  }

  getHobbyControls(): AbstractControl[] {
    return (<FormArray>this.signUpForm.get('hobbies')).controls;
  }

  forbiddenUsernamesValidator(control: FormControl): validator {
    if (this.forbiddenUsernames.includes(control.value))
      return { usernameIsForbidden: true };
    return null;
  }

  forbiddenEmailsValidator(
    control: FormControl
  ): Promise<validator> | Observable<validator> {
    const promise = new Promise<validator>((resolve, reject) => {
      setTimeout(() => {
        if (this.forbiddenEmails.includes(control.value))
          resolve({ emailIsForbidden: true });
        else resolve(null);
      }, 1500);
    });
    return promise;
  }
}
