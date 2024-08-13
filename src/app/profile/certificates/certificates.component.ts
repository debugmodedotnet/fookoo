import { Component } from '@angular/core';
import { ICertificate } from '../../modules/certificate';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [],
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent {

  certificates: ICertificate[] = [
    { id: 1, image: 'assets/images/certificates/certificate-1.png' },
    { id: 2, image: 'assets/images/certificates/certificate-2.jpg' },
    { id: 3, image: 'assets/images/certificates/certificate-3.png' },
    { id: 4, image: 'assets/images/certificates/certificate-4.jpg' },
  ];

  selectedCertificate?: ICertificate;

  openShareModal(certificate: ICertificate) {
    this.selectedCertificate = certificate;
    console.log('Modal opened for certificate:', this.selectedCertificate);
  }
  
  shareOnLinkedIn() {
    if (this.selectedCertificate) {
      const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('Certificate')}&summary=${encodeURIComponent('Check out this certificate!')}&source=LinkedIn`;
      window.open(url, '_blank');
    }
  }

  shareOnWhatsApp() {
    if (this.selectedCertificate) {
      const url = `https://wa.me/?text=${encodeURIComponent('Check out this certificate: ' + window.location.href)}`;
      window.open(url, '_blank');
    }
  }

  shareOnTwitter() {
    if (this.selectedCertificate) {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this certificate: ' + window.location.href)}`;
      window.open(url, '_blank');
    }
  }

  shareOnInstagram() {
    if (this.selectedCertificate) {
      alert('Instagram sharing is not supported directly via a URL. Consider implementing a custom solution.');
    }
  }

}