import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { AngularFirestore } from '@angular/fire/firestore';
import UserInterface from '../interfaces/user-profile.model';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router, private afs: AngularFirestore) {}

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate([""]);
  }

  isLoggedIn() {
    return !!this.afAuth.auth.currentUser;
  }

  createUserDocument() {

    const user = this.afAuth.auth.currentUser;

    const userProfile: UserInterface = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      specialty: "",
      ip: ""
    };

    return this.afs.doc(`users/${user.uid}`).set(userProfile)
  }

  updateUserProfile(userProfile: UserInterface) {
    return this.afs.doc(`users/${userProfile.uid}`).update(userProfile)
  }

}
