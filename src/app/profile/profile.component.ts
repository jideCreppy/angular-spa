import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreDocument, AngularFirestoreModule } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import UserInterface from '../interfaces/user-profile.model';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  // Fire Database variables
  private itemDoc: AngularFirestoreDocument<UserInterface>;
  item: Observable<UserInterface>;
  uid: string;

  // Fire storage variables
  downloadURL: Observable<string>;
  uploadProgress: Observable<number>;


  constructor(
      private afAuth: AngularFireAuth, 
      private afs: AngularFirestore, 
      private activatedRoute: ActivatedRoute, 
      private authService: AuthService,
      private afStorage: AngularFireStorage
    ) {
    this.uid = activatedRoute.snapshot.paramMap.get('id');
    this.itemDoc = this.afs.doc<UserInterface>(`users/${this.uid}`);
    this.item = this.itemDoc.valueChanges();

  
    this.downloadURL = this.afStorage.ref(`users/${this.uid}/profile-image`).getDownloadURL();



   }

  ngOnInit() {
  }

  async onSubmit(form:NgForm) {
    const {name,email,address,city,state,ip,specialty, zip, phone} = form.form.getRawValue()
    const userProfile : UserInterface = {
      uid: this.afAuth.auth.currentUser.uid,
      name,
      email,
      address,
      city,
      state,
      ip,
      specialty,
      zip,
      phone
    }

    await this.authService.updateUserProfile(userProfile);
  }

  fileChange(event) {

    this.downloadURL = null;

    const file = event.target.files[0];

    const filePath = `users/${this.uid}/profile-image`;

    const fileRef = this.afStorage.ref(filePath);


    const task = this.afStorage.upload(filePath, file)

    task.catch(error => console.log(error.message));

    this.uploadProgress = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize( () => {
        this.downloadURL = fileRef.getDownloadURL()
      })
    ).subscribe();



  }

}
