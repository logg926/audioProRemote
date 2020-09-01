import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SendingService {
  constructor() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator['webkitGetUserMedia'] ||
      navigator['mozGetUserMedia'];
    this.setup();
  }

  myWebCam = new Subject<MediaStream>();
  // Create an observable to watch the subject and send out a stream of updates (You will subscribe to this to get the update stream)
  public myWebCam$ = this.myWebCam.asObservable(); // Has a $

  setup(): void {
    const onSuccess: NavigatorUserMediaSuccessCallback = (stream) => {
      console.log(stream);
      this.myWebCam.next(stream);
    };
    const onError = (error) => {
      console.error(error);
    };
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then(onSuccess)
      .catch(onError);
  }
}
