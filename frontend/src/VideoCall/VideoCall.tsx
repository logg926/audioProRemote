import React, { useState, useEffect } from "react";

// Using import.
import * as mediasoupClient from "mediasoup-client";

// Also using import with destructuring assignment.
import {
  types,
  version,
  detectDevice,
  Device,
  parseScalabilityMode,
} from "mediasoup-client";

import io from "socket.io-client";
import { RoomClient, addListeners } from "./RoomClient";

const socket: any = io("https://localhost:3016");

// navigator.mediaDevices.enumerateDevices().then(devices =>
//     devices.forEach(device => {

//         console.log(device)
//     //   let el = null
//     //   if ('audioinput' === device.kind) {
//     //     el = audioSelect
//     //   } else if ('videoinput' === device.kind) {
//     //     el = videoSelect
//     //   }
//     //   if(!el) return

//     //   let option = document.createElement('option')
//     //   option.value = device.deviceId
//     //   option.innerText = device.label
//     //   el.appendChild(option)
//     })
//   )

socket.request = function request(type: any, data = {}) {
  return new Promise((resolve, reject) => {
    socket.emit(type, data, (data: any) => {
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data);
      }
    });
  });
};

let rc: any = null;

function joinRoom(name: any, room_id: any) {
  if (rc && rc.isOpen()) {
    console.log("already connected to a room");
  } else {
    rc = new RoomClient(
      localMedia,
      remoteVideos,
      remoteAudios,
      window.mediasoupClient,
      socket,
      room_id,
      name,
      roomOpen
    );
    addListeners();
  }
}

const VideoCall = () => {
  useEffect(() => {
    if (socket) {
      //連線成功在 console 中打印訊息
      console.log("success connect!");
      //設定監聽
      initWebSocket();
    }
  }, [socket]);

  const initWebSocket = () => {
    //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
    if (!!socket) {
      socket.on("getMessage", (message: string) => {
        console.log(message);
      });
    }
  };

  return (
    <>
      <input type="button" value="連線" />
      {/* <input type='button' value='送出訊息' onClick={sendMessage} /> */}
    </>
  );
};

export default VideoCall;
