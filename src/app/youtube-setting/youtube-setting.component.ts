import { Component } from '@angular/core';
import { IYoutubeVideos } from '../modules/home-youtube';
import { YoutubeVideoService } from '../youtube-video.service';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-youtube-setting',
  standalone: true,
  imports: [ ReactiveFormsModule, NgFor],
  templateUrl: './youtube-setting.component.html',
  styleUrl: './youtube-setting.component.scss'
})
export class YoutubeSettingComponent {
  videos: IYoutubeVideos[] = [];
  videoForm: FormGroup;
  editMode = false;
  currentVideoId?: string;

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
    this.youtubeVideoService.getVideos().subscribe(videos => {
      this.videos = videos;
    });
  }

  addOrUpdateVideo() {
    if (this.editMode && this.currentVideoId) {
      this.youtubeVideoService.updateVideo(this.currentVideoId, this.videoForm.value).then(() => {
        this.resetForm();
      }).catch(error => {
        console.error('Error updating video:', error);
      });
    } else {
      this.youtubeVideoService.addVideo(this.videoForm.value).then(() => {
        this.resetForm();
      }).catch(error => {
        console.error('Error adding video:', error);
      });
    }
  }

  editVideo(video: IYoutubeVideos) {
    this.videoForm.patchValue(video);
    this.editMode = true;
    this.currentVideoId = video.id;
  }

  deleteVideo(id: string | undefined) {
    if (id) {
      this.youtubeVideoService.deleteVideo(id).then(() => {
        this.youtubeVideoService.getVideos().subscribe(videos => {
          this.videos = videos;
        });
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
  }
}
