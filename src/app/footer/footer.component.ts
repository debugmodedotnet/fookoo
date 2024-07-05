import { Component, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IFooter } from '../modules/footer';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {

  footer?: IFooter;

  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getFooterDetails();
  }

  getFooterDetails() {
    this.firestore.collection('layout').doc('footer').valueChanges().subscribe(footer => {
      console.log(footer);
      this.footer = footer as IFooter;
    });
  }

}
