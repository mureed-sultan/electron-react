import React, { useState, useEffect } from 'react';
import userImg from '../../../assets/userzzz.png';
import sendButtonImg from '../../../assets/icons/sendimg.png';
import pendilIcon from '../../../assets/icons/pencilicon.png';

interface ChatMessage {
  sender: string;
  message: string;
  date: string;
}

function ChatInterface() {
  const [users, setUsers] = useState<string[]>([]);
  const [activeUser, setActiveUser] = useState<string>('');
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [globalUsr, setGlobalUsr] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    const fetchUsersListener = (arg: string[]) => setUsers(arg);
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
    const activeUserListener = (arg: string) => setGlobalUsr(arg);
    window.electron.ipcRenderer.on('active-user', activeUserListener);
    window.electron.ipcRenderer.sendMessage('active-user');
    return () => {
      window.electron.ipcRenderer.removeEventListener(
        'active-user',
        activeUserListener
      );
    };
  }, []);

  useEffect(() => {
    if (activeUser) {
      const fetchChatListener = (arg: ChatMessage[]) => setChats(arg);
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

  const handleUserClick = (user: string, event: React.MouseEvent) => {
    if (event.type === 'click' || event.type === 'keydown') {
      if (event.type === 'keydown' && event.key !== 'Enter') {
        return;
      }
      setActiveUser(user);
      window.electron.ipcRenderer.sendMessage('select-user-chat', user);
    }
  };
  const userList = users.map((user, index) => {
    const lastChat = chats.find((chat) => chat.sender === user);
    return (
      <li
        key={index}
        className={`users-render ${activeUser === user ? 'active' : ''}`}
        onClick={(e) => handleUserClick(user, e)}
        onKeyDown={(e) => handleUserClick(user, e)}
        role="button"
        tabIndex={0}
      >
        <img src={userImg} id="chatperson-image" alt="" />
        <div className="chat-user">
          <p>{user}</p>
          {lastChat && <span className="chat-review">{lastChat.message}</span>}
        </div>
      </li>
    );
  });

  const mesgSend = () => {
    if (inputValue.trim() !== '') {
      window.electron.ipcRenderer.sendMessage('updata-chat', inputValue);
      setInputValue('');

      const fetchChatListener = (arg: ChatMessage[]) => {
        setChats(arg);
      };
      window.electron.ipcRenderer.on('fetch-chat', fetchChatListener);
      window.electron.ipcRenderer.sendMessage('fetch-chat');
    }
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
          <img src={userImg} id="chatperson-image" alt="No img found" />
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
                setInputValue(e.target.value);
              }}
              value={inputValue}
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

export default ChatInterface;
