import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IHero } from '../modules/hero';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [DatePipe, NgFor],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, AfterViewInit {

  hero?: IHero;
  private firestore = inject(AngularFirestore);

  ngOnInit(): void {
    this.getHeroData();
  }

  ngAfterViewInit(): void {
    this.setupScrollers();
  }

  getHeroData() {
    this.firestore.collection('homepagedata').doc('hero').valueChanges().subscribe(hero => {
      console.log("Hero:", hero);
      this.hero = hero as IHero;
    });
  }


  setupScrollers() {
    const scrollers: NodeListOf<Element> = document.querySelectorAll(".scroller");

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      scrollers.forEach((scroller: Element) => {
        scroller.setAttribute("data-animated", "true");

        const scrollerInner = scroller.querySelector(".scroller__inner");

        if (scrollerInner) {
          const children = Array.from(scrollerInner.children);
          const totalChildren = children.length;

          for (let i = 0; i < totalChildren; i++) {
            const duplicatedItem = children[i].cloneNode(true) as Element;
            duplicatedItem.setAttribute("aria-hidden", "true");
            scrollerInner.appendChild(duplicatedItem);
          }
        }
      });
    }
  }

}
