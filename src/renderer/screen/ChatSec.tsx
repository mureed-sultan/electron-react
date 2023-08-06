import React, { useState, useEffect } from 'react';
import userImg from '../../../assets/userzzz.png';

function ChatSec() {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState('');
  const [chats, setChats] = useState([]);
  let globalUsr = "";
  useEffect(() => {
    const fetchUsers = () => {
      window.electron.ipcRenderer.once('fetch-users', (arg) => {
        setUsers(arg);
      });
      window.electron.ipcRenderer.sendMessage('fetch-users');
    };
    fetchUsers();
  }, []);
  useEffect(() => {
    const fetchChat = () => {
      window.electron.ipcRenderer.on('fetch-chat', (arg) => {
        setChats(arg);
      });
      window.electron.ipcRenderer.sendMessage('fetch-chat');
    };
    if (activeUser) {
      fetchChat();
    }
  }, [activeUser]);
  useEffect(() => {
    const globalUser = () => {
      window.electron.ipcRenderer.on('active-user', (arg) => {
        return globalUsr = arg
      });
      window.electron.ipcRenderer.sendMessage('active-user');
    };
    globalUser()
  }, []);
  const handleItemClick = (user) => {
    setActiveUser(user);
    window.electron.ipcRenderer.sendMessage('select-user-chat', user);
  };
  const chatMessages = chats.map((message, index) => {
    const isCurrentUser = message.sender === globalUsr;
    return (
      <div
        key={index}
        className={`message ${isCurrentUser ? 'right-message' : 'left-message'}`}
      >
        <p className="sender">{message.sender}</p>
        <p className="timestamp">{message.date}</p>
        <p className="message-text">{message.message}</p>
      </div>
    );
  });

  const userList = users.map((user, index) => (
    <li
      key={index}
      className={`users-render ${activeUser === user ? 'active' : ''}`}
      onClick={() => handleItemClick(user)}
    >
      <img src={userImg} id="chatperson-image" alt="" />
      <div className="chat-user">
        <p>{user}</p>
      </div>
    </li>
  ));
  return (
    <div>
      <div className="full-container">
        <div className="users-list">
          <ul id="userList" className="user-list">
            {userList}
          </ul>
        </div>
        <div id="chat-window">
          <div className="chat-person">
            <img src={userImg} id="chatperson-image" alt="" />
            <p id="chatperson-name">
              {activeUser ? `${activeUser}` : 'No User Selected'}
            </p>
          </div>
          <div className="chat-section">
            <div id="chat-messages" className="chat-message">
              {chatMessages}
            </div>
            <div className="chat-input-box">
              <input type="text" id="message-input" placeholder="Message" />
              <button type="button" id="send-button">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ChatSec;
