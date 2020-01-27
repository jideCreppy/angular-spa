import { Component, OnInit } from '@angular/core';
import { FirebaseAuth } from '@angular/fire';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  user: any;

  action: 'login' | 'signup' = 'signup';

  constructor(private afAuth: AngularFireAuth, private router: Router, private auth: AuthService) { }

  ngOnInit() {
  }

  async onSubmit(form: NgForm) {

    this.loading = true;
    const {firstName, lastName, email, password} = form.value;

    let resp

    try{
      if (this.isLogin) {
        resp = await this.afAuth.auth.signInWithEmailAndPassword(email,password);
      } else {
        resp = await this.afAuth.auth.createUserWithEmailAndPassword(email,password);
        await resp.user.updateProfile({
          displayName: `${firstName} ${lastName}`
        })

        await this.auth.createUserDocument();
      }
      this.router.navigate(['/profile', resp.user.uid]);
      form.reset();
  } catch(error){
      console.log(error.message)
  }
    this.loading = false;
  }

  get isLogin() {
    return this.action === 'login';
  }

  get isSignup() {
    return this.action === 'signup';
  }

}
