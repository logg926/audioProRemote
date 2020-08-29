import React, { useState, useEffect } from 'react';

// Using import.
import * as mediasoupClient from "mediasoup-client";

// Also using import with destructuring assignment.
import {
  types,
  version,
  detectDevice,
  Device,
  parseScalabilityMode
} from "mediasoup-client";

import io from 'socket.io-client'

const socket = io('https://localhost:3016')

const VideoCall = ()=>{

    
    useEffect(()=>{
        if(socket){
            //連線成功在 console 中打印訊息
            console.log('success connect!')
            //設定監聽
            initWebSocket()
        }
    },[socket])

    const initWebSocket = () => {
        //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
        if (!!socket){
            socket.on('getMessage', (message: string) => {
            console.log(message)
        })}
    }

    return <>
    <input type='button' value='連線'  />
    {/* <input type='button' value='送出訊息' onClick={sendMessage} /> */}
    </>
}

export default VideoCall;