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
  certificates: Certificate[] = [
    { id: 1, image: 'assets/images/certificates/certificate-1.png' },
    { id: 2, image: 'assets/images/certificates/certificate-2.png' },
    { id: 3, image: 'assets/images/certificates/certificate-3.png' },
    { id: 4, image: 'assets/images/certificates/certificate-4.png' },
  ];

  showSharePopup = false;
  selectedCertificate: Certificate | null = null;

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

  openSharePopup(certificate: Certificate) {
    this.selectedCertificate = certificate;
    this.showSharePopup = true;
  }

  closeSharePopup() {
    this.showSharePopup = false;
    this.selectedCertificate = null;
  }

  shareTo(platform: string) {
    if (!this.selectedCertificate) return;

    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out my certificate!');
    let shareUrl = '';

    switch (platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'instagram':
        alert('Instagram does not support direct sharing. You can copy the link and share it manually on Instagram.');
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }

    this.closeSharePopup();
  }
}