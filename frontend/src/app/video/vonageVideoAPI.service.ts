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
  constructor(private http: HttpClient) {
    this.recieverVid = new Subject<HTMLElement>();
    this.recieverVid$ = this.recieverVid.asObservable();
  }

  private initOTSession() {
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
    // const { apiKey, sessionId, token } = this.initServer();
    // return {
    //   session: OT.initSession(apiKey, sessionId),
    //   apiKey,
    //   sessionId,
    //   token,
    // };
  }

  recieverVid: Subject<HTMLElement>;
  recieverVid$: Observable<HTMLElement>;
  recieverInitializeSession(todoWithStream: (MediaStream) => void) {
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
            // 'subscriber',
            {
              insertDefaultUI: false,
              // insertMode: 'append',
              width: '100%',
              height: '100%',
            },
            handleError
          );
          subscriber.on('videoElementCreated', (event) => {
            this.recieverVid.next(event.element);
            // videoParent.appendChild(event.element);
          });
        });
        // return this.recieverVid;
      })
    );
  }

  private initServer(): Observable<VideoAPISession> {
    return this.http.get<VideoAPISession>(
      environment.VONAGE_VIDEOAPI_SERVER_BASE_URL + '/session'
    );

    // fetch(SERVER_BASE_URL + '/session')
    //   .then(function (res) {
    //     return res.json();
    //   })
    //   .then(function (res) {
    //     apiKey = res.apiKey;
    //     sessionId = res.sessionId;
    //     token = res.token;
    //     initializeSession();
    //   })
    //   .catch(handleError);

    // const apiKey = environment.VONAGE_API_KEY;
    // const sessionId = environment.VONAGE_API_sessionId;
    // const token = environment.VONAGE_API_token;
    // return { apiKey, sessionId, token };
  }

  senderInitializeSession() {
    return this.initOTSession().pipe(
      map((res) => {
        const { session, token } = res;
        // Subscribe to a newly created stream

        // Create a publisher
        const publisher = OT.initPublisher(
          'publisher',
          {
            insertMode: 'append',
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
