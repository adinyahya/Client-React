import React, { useState, useEffect } from "react"
import queryString from 'query-string'
const io = require("socket.io-client");
let socket = io("http://localhost:5000", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});


const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'localhost:5000';
    useEffect(() => {
        const {name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, (error) => {
            // alert(error);
        });
        return () => {
            socket.emit('disconnect');

            socket.off();
        }

    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
        setMessages([...messages, message]);
        })
    }, [messages]);

    const sendMessage = (event) => {
        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
          }
    }

    console.log(message, messages);
    return (
        <div className="outerContainer">
            <div className="container">
                <input value={message} onChange={(event) => setMessage(event.target.value)} 
                onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                />
            </div>

        </div>
    )
}

export default Chat;