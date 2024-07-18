import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IAdvertisement } from '../modules/home-ads';

@Component({
  selector: 'app-hero-advertisement',
  standalone: true,
  imports: [],
  templateUrl: './hero-advertisement.component.html',
  styleUrl: './hero-advertisement.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeroAdvertisementComponent implements OnInit {


  advertisements?: IAdvertisement[];

  private firestore = inject(AngularFirestore);
  ngOnInit(): void {
    this.firestore.collection('homepagedata').doc('advertisements').collection('ads-list').valueChanges().subscribe(advertisements => {
      console.log("advertisements:", advertisements);
      this.advertisements = advertisements as IAdvertisement[];
    });
  }
}
