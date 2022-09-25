import React, { Fragment, useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import Peer from "simple-peer";
import { withRouter } from 'react-router-dom'

const VideoWrapper = React.forwardRef((props, ref) => {
  return (
    <div className='video-wrapper'>
      <video {...props} ref={ref}/>
    </div>
  )
})
const UserVideo = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", stream => {
      console.log("stream")
      ref.current.srcObject = stream;
    })
  }, []);

  return (
    <VideoWrapper playsInline autoPlay ref={ref} />
  );
}

console.log("window.innerHeight = ", window.innerHeight / 2)
const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2
};

const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef({});
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.match.params.id;

  useEffect(() => {
    socketRef.current = io.connect("/");
    let videoStream;
    navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true }).then(stream => {
      userVideo.current.srcObject = stream;
      videoStream = stream;
      socketRef.current.emit("join room", roomID);
      //#1
      socketRef.current.on("all users", users => {
        console.log("all users")
        const peers = [];
        users.forEach(userID => {
          console.log("userID = ", userID)
          const peer = createPeer(userID, socketRef.current.id, stream)
          peersRef.current.push({
            peerID: userID,
            peer
          })

          peers.push({
            peerID: userID,
            peer
          });
        })

        setPeers(peers);
      });

      //%1
      socketRef.current.on("user joined", payload => {
        console.log("user joined = ", payload.callerID)
        const peer = addPeer(payload.signal, payload.callerID, stream)
        peersRef.current.push({
          peerID: payload.callerID,
          peer
        })

        setPeers(users => [...users, {
          peerID: payload.callerID,
          peer
        }]);
      })
    })

    //#4
    socketRef.current.on("receiving returned signal", payload => {
      console.log("receiving returned signal")
      const item = peersRef.current.find(p => p.peerID === payload.id)
      console.log("Sending signal one more time payload.signal = ", payload.signal)
      console.log("ID Peer що прийняв наш запит = ", payload.id)
      item.peer.signal(payload.signal);
    })

    socketRef.current.on("remove user", payload => {
      console.log("remove user = ", payload)

      setPeers(users => {
        console.log("users = ", users)
        return users.filter(user => {
          if (user.peerID === payload.id) {
            user.peer.destroy();
            return false
          }

          return true;
        })
      });
    })

    return () => {
      socketRef.current.disconnect();
      stopVideo(videoStream)
    };
  }, []);

  function stopVideo(stream) {
    stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }

  function onExit() {
    console.log("onExit")
    props.history.push('/rooms');
  }

  //#2
  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      config: {
        iceServers: [
          {
            urls: "stun:openrelay.metered.ca:80",
          },
          {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
          {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
          {
            urls: "turn:openrelay.metered.ca:443?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
        ],
      },
      trickle: false,
      stream
    })

    peer.on("signal", signal => {
      console.log("Inital signal = ", signal)
      socketRef.current.emit("sending signal", { userToSignal, callerID, signal });
    })

    peer.on('connect', () => {
      console.log("Intitiator peer connected")
    })

    return peer;
  }

  //%2
  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      config: {
        iceServers: [
          {
            urls: "stun:openrelay.metered.ca:80",
          },
          {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
          {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
          {
            urls: "turn:openrelay.metered.ca:443?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
        ],
      },
      trickle: false,
      stream
    })

    //%4
    peer.on("signal", signal => {
      console.log("signal which reciver get = ", signal)
      socketRef.current.emit("returning signal", { signal, callerID });
    })

    peer.on('connect', () => {
      console.log("Second peer connected")
    })

    //%3
    console.log("peer.signal(incomingSignal)", incomingSignal)
    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <div className='conference-container'>
      <div className='videos-wrapper'>
        <VideoWrapper muted ref={userVideo} autoPlay playsInline />
        {peers.map(({ peer }, index) => {
          return (
            <UserVideo key={index} peer={peer} />
          );
        })}
      </div>
      <div className='actions-wrapper'>
        <button className='btn btn-danger' onClick={onExit}>
          Leave
        </button>
      </div>
    </div>
  );
}

Room.propTypes = {
}

export default withRouter(Room)
