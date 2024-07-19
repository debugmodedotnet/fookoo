import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Certificate {
  id: number;
  image: string;
}

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent {
  certificates: any[] = [
    { id: 1, image: 'assets/images/certificates/certificate-1.png' },
    { id: 3, image: 'assets/images/certificates/certificate-3.png' },
  ];

  showSharePopup = false;
  showConfirmationPopup = false;
  selectedPlatform: string = '';
  shareUrl: string = '';

  addCertificate() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const newCertificate: Certificate = {
            id: this.certificates.length + 1,
            image: e.target.result
          };
          this.certificates.push(newCertificate);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  }

  openSharePopup(certificate: any) {
    this.showSharePopup = true;
  }

  closeSharePopup() {
    this.showSharePopup = false;
  }
 
  confirmShare(platform: string, url: string) {
    this.selectedPlatform = platform;
    this.shareUrl = url;
    this.showConfirmationPopup = true;
  }

  share(confirm: boolean) {
    if (confirm) {
      window.open(this.shareUrl, '_blank');
    }
    this.showConfirmationPopup = false;
  }
}
