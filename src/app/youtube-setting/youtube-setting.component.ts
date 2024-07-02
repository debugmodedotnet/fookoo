import { Component } from '@angular/core';
import { IYoutubeVideos } from '../modules/home-youtube';
import { YoutubeVideoService } from '../services/youtube-video.service';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-youtube-setting',
  standalone: true,

  imports: [ ReactiveFormsModule, NgFor, NgIf],

  templateUrl: './youtube-setting.component.html',
  styleUrl: './youtube-setting.component.scss'
})
export class YoutubeSettingComponent {
  videos: IYoutubeVideos[] = [];
  videoForm: FormGroup;
  editMode = false;
  currentVideoId?: string;
  formVisible = false;

  constructor(private youtubeVideoService: YoutubeVideoService, private fb: FormBuilder) {
    this.videoForm = this.fb.group({
      Info: [''],
      Title: [''],
      Thumbnail: [''],
      Link: [''],
      Tech: [''],
      displayAtHomePage: [false]
    });
  }

  ngOnInit(): void {
    this.loadVideos();
  }

  loadVideos() {
    this.youtubeVideoService.getVideos().subscribe(
      videos => {
        this.videos = videos;
      },
      error => {
        console.error('Error loading videos:', error);
      }
    );
  }

  addOrUpdateVideo() {
    if (this.editMode && this.currentVideoId) {
      this.updateVideo(this.currentVideoId, this.videoForm.value);
    } else {
      this.addVideo(this.videoForm.value);
    }
  }

  addVideo(video: IYoutubeVideos) {
    this.youtubeVideoService.addVideo(video).then(() => {
      this.resetForm();
      this.loadVideos(); // Reload videos after adding
    }).catch(error => {
      console.error('Error adding video:', error);
    });
  }

  updateVideo(id: string, video: IYoutubeVideos) {
    this.youtubeVideoService.updateVideo(id, video).then(() => {
      this.resetForm();
      this.loadVideos(); // Reload videos after update
    }).catch(error => {
      console.error('Error updating video:', error);
    });
  }

  editVideo(video: IYoutubeVideos) {
    this.videoForm.patchValue(video);
    this.editMode = true;
    this.currentVideoId = video.id;
    this.formVisible = true; // Show the form
  }

  deleteVideo(id: string | undefined) {
    if (id) {
      this.youtubeVideoService.deleteVideo(id).then(() => {
        this.loadVideos(); // Reload videos after deletion
      }).catch(error => {
        console.error('Error deleting video:', error);
      });
    } else {
      console.error('Video ID is undefined, cannot delete.');
    }
  }

  resetForm() {
    this.videoForm.reset({
      Info: '',
      Title: '',
      Thumbnail: '',
      Link: '',
      Tech: '',
      displayAtHomePage: false
    });
    this.editMode = false;
    this.currentVideoId = undefined;
    this.formVisible = false; // Hide the form
  }

  showForm() {
    this.formVisible = true;
  }

  hideForm() {
    this.formVisible = false;
  }

}
