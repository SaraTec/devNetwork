import React, { Fragment, useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props) => {
  /* const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", stream => {
      console.log("stream")
      ref.current.srcObject = stream;
    })
  }, []);

  return (
    <StyledVideo playsInline autoPlay ref={ref} />
  ); */
  return (
    <h1>
      {`new peer is connected ${props.peer}`}
    </h1>
  )
}


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
    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
      userVideo.current.srcObject = stream;
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

          peers.push(peer);
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

        setPeers(users => [...users, peer]);
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
  }, []);

  //#2
  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
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
    <Container>
      <StyledVideo muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => {
        return (
          <Video key={index} peer={peer} />
        );
      })}
    </Container>
  );
}

Room.propTypes = {
}

export default Room