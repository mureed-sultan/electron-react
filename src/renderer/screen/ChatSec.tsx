import React, { useState, useEffect } from 'react';
import userImg from '../../../assets/userzzz.png';
import sendButtonImg from '../../../assets/icons/sendimg.png';
import pendilIcon from '../../../assets/icons/pencilicon.png';

function ChatSec() {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState('');
  const [chats, setChats] = useState([]);
  const [globalUsr, setGlobalUsr] = useState('');
  const [chatSend, setChatSend] = useState('');

  useEffect(() => {
    const fetchUsersListener = (arg) => setUsers(arg);
    window.electron.ipcRenderer.on('fetch-users', fetchUsersListener);
    window.electron.ipcRenderer.sendMessage('fetch-users');
    return () => {
      window.electron.ipcRenderer.removeEventListener(
        'fetch-users',
        fetchUsersListener
      );
    };
  }, []);
  useEffect(() => {
    const fetchChatListener = (arg) => {
      setChats(arg);
    };
    if (activeUser) {
      window.electron.ipcRenderer.on('fetch-chat', fetchChatListener);
      window.electron.ipcRenderer.sendMessage('fetch-chat');
      return () => {
        window.electron.ipcRenderer.removeEventListener(
          'fetch-chat',
          fetchChatListener
        );
      };
    }
  }, [activeUser]);
  useEffect(() => {
    const activeUserListener = (arg) => setGlobalUsr(arg);
    window.electron.ipcRenderer.on('active-user', activeUserListener);
    window.electron.ipcRenderer.sendMessage('active-user');
    return () => {
      window.electron.ipcRenderer.removeEventListener(
        'active-user',
        activeUserListener
      );
    };
  }, []);
  const handleItemClick = (user) => {
    setActiveUser(user);
    window.electron.ipcRenderer.sendMessage('select-user-chat', user);
  };

  const chatMessages = chats.map((message, index) => (
    <li
      key={index}
      className={`message ${
        message.sender === globalUsr ? 'right-message' : 'left-message'
      }`}
    >
      <span>
        <p className="message-text">{message.message}</p>
        <p className="timestamp">{message.date}</p>
      </span>
    </li>
  ));

  const userList = users.map((user, index) => {
    const lastChat = chats.find((chat) => chat.sender === user);
    return (
      <li
        key={index}
        className={`users-render ${activeUser === user ? 'active' : ''}`}
        onClick={() => handleItemClick(user)}
      >
        <img src={userImg} id="chatperson-image" alt="" />
        <div className="chat-user">
          <p>{user}</p>
          {lastChat && <span className='chat-review'>{lastChat.message}</span>}
        </div>
      </li>
    );
  });
  const mesgSend = () => {
    window.electron.ipcRenderer.sendMessage('updata-chat', chatSend);
    const fetchChatListener = (arg) => {
      setChats(arg);
    };
    window.electron.ipcRenderer.on('fetch-chat', fetchChatListener);
    window.electron.ipcRenderer.sendMessage('fetch-chat');
    document.getElementById('message-input').value = '';
  };

  return (
    <div className="full-container">
      <div className="users-list">
        <ul id="userList" className="user-list">
          {userList}
        </ul>
        <div className="pencil">
          <img src={pendilIcon} alt="" />
        </div>
      </div>
      <div id="chat-window">
        <div className="chat-person">
          <img src={userImg} id="chatperson-image" alt="No Image" />
          <p id="chatperson-name">
            {activeUser ? `${activeUser}` : 'No User Selected'}
          </p>
        </div>
        <div className="chat-section">
          <ul id="chat-messages" className="chat-message">
            {chatMessages}
          </ul>
          <div className="chat-input-box">
            <input
              onChange={(e) => {
                setChatSend(e.target.value);
              }}
              type="text"
              id="message-input"
              placeholder="Message"
            />
            <button type="button" id="send-button" onClick={mesgSend}>
              <img src={sendButtonImg} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ChatSec;
