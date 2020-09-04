import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

declare let OT: any;

interface VideoAPISession {
  apiKey: string;
  sessionId: string;
  token: string;
}
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}
@Injectable({
  providedIn: 'root',
})
export class VonageVideoAPI {
  constructor(private http: HttpClient) {}

  private initServer(): Observable<VideoAPISession> {
    return this.http.get<VideoAPISession>(
      environment.VONAGE_VIDEOAPI_SERVER_BASE_URL + '/session'
    );
  }

  private initOTSession(): Observable<{
    session: any;
    apiKey: string;
    sessionId: string;
    token: string;
  }> {
    return this.initServer().pipe(
      map((res) => {
        const { apiKey, sessionId, token } = res;
        return {
          session: OT.initSession(apiKey, sessionId),
          apiKey,
          sessionId,
          token,
        };
      })
    );
  }

  sendAudio(mediaStream: MediaStream, divIDToBeReplace: string = 'voice') {
    return this.initOTSession().pipe(
      map((res) => {
        const pubOptions = { videoSource: null };
        const { session, token } = res;
        const publisher = OT.initPublisher(
          divIDToBeReplace,
          pubOptions,
          handleError
        );

        return { publisher, session, token };
      }),
      map(({ publisher, session, token }) => {
        session.connect(token, function (error) {
          // If the connection is successful, publish to the session
          if (error) {
            handleError(error);
          } else {
            session.publish(publisher, handleError);
          }
        });
      })
    );
  }
  recieverInitializeSession(
    todoWithStream: (MediaStream) => void,
    divIDToBeReplace: string = 'subscriber'
  ) {
    return this.initOTSession().pipe(
      map((res) => {
        const { session, token } = res;
        session.connect(token, (error) => {
          // If the connection is successful, publish to the session
          if (error) {
            handleError(error);
          } else {
            // session.publish(publisher, handleError);
          }
        });
        session.on('streamCreated', (event) => {
          todoWithStream(event.stream);
          const subscriber = session.subscribe(
            event.stream,
            divIDToBeReplace,
            {
              insertDefaultUI: true,
              insertMode: 'replace',
              width: '100%',
              height: '100%',
            },
            handleError
          );
          // subscriber.on('videoElementCreated', (event) => {
          //   videoParent.appendChild(event.element);
          // });
        });
      })
    );
  }

  senderInitializeSession(divIDToBeReplace: string = 'publisher') {
    return this.initOTSession().pipe(
      map((res) => {
        const { session, token } = res;
        // Subscribe to a newly created stream

        // Create a publisher
        const publisher = OT.initPublisher(
          divIDToBeReplace,
          {
            insertMode: 'replace',
            width: '100%',
            height: '100%',
          },
          handleError
        );
        return { publisher, session, token };
        // Connect to the session
      }),
      map(({ publisher, session, token }) => {
        session.connect(token, function (error) {
          // If the connection is successful, publish to the session
          if (error) {
            handleError(error);
          } else {
            session.publish(publisher, handleError);
          }
        });
      })
    );
  }
}