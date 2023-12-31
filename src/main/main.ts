/* eslint-disable promise/always-return */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import admin from 'firebase-admin';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import serviceAccount from '../../assets/json/electron-59067-firebase-adminsdk-5e07a-d8340b74cb.json';

const firebaseConfig = {
  apiKey: 'AIzaSyB2Mo0py70RAyKSId-h9uzGI7UZRukni3w',
  authDomain: 'electron-59067.firebaseapp.com',
  databaseURL: 'https://electron-59067-default-rtdb.firebaseio.com',
  projectId: 'electron-59067',
  storageBucket: 'electron-59067.appspot.com',
  messagingSenderId: '910549463067',
  appId: '1:910549463067:web:da2a4ad2e3e4c9639c08be',
  measurementId: 'G-9SF86WJ68J',
};

const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(appFirebase);
const usersRef = collection(db, 'users');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://electron-59067-default-rtdb.firebaseio.com',
});

const showUsers = () => {
  const users: string[] = [];
  getDocs(usersRef)
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log("No documents found in the 'users' collection.");
      } else {
        querySnapshot.forEach((doc) => {
          users.push(`${doc.data().firstName} ${doc.data().lastName}`);
          ipcMain.on('fetch-users', async (event, arg) => {
            event.reply('fetch-users', users);
          });
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching documents from 'users' collection:", error);
    });
};
showUsers();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}
let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  event.reply('ipc-example', 'Hellow to the World of ABC');
});
ipcMain.setMaxListeners(15);


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  // eslint-disable-next-line global-require
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    // width: 1440,
    width: 800,
    height: 784,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// eslint-disable-next-line promise/valid-params
app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch();
ipcMain.on('reg-user', async (event, firstNames, lastNames, pass) => {
  let usrReg = {};
  createUserWithEmailAndPassword(
    auth,
    `${firstNames.toLowerCase()}@email.com`,
    pass
  )
    .then((userCredential) => {
      console.log('User registration successful:', userCredential.user.email);
      usrReg = {
        firstName: firstNames,
        lastName: lastNames,
        phoneNumber: pass,
        emailId: `${firstNames.toLowerCase()}@email.com`,
      };
      addDoc(usersRef, usrReg)
        .then((docRef) => {
          console.log('Document written with ID:', docRef.id);
          ipcMain.on('user-accept', async (event, arg) => {
            event.reply('user-accept', true);
          });
        })
        .catch((error) => {
          console.error("Error adding document to 'users' collection:", error);
        });
    })
    .catch((error) => {
      console.error('User registration error:', error.code);
    });
});
let chatMessages: { id: string; date: string; sender: any; message: any }[] =
  [];
let userActive = 'Mureed Sultan';
ipcMain.on('active-user', async (event) => {
  event.reply('active-user', userActive);
});

let ref = admin.database().ref();
let dbref = admin.database().ref();

const getChat = () => {
  ref.on(
    'value',
    (snapshot) => {
      const messages = snapshot.val();
      chatMessages = [];
      if (messages) {
        Object.keys(messages).forEach((messageId) => {
          const { sender, message, timestamp } = messages[messageId];
          const date = new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          const isDuplicate = chatMessages.some((msg) => msg.id === messageId);
          if (!isDuplicate) {
            chatMessages.push({ id: messageId, date, sender, message });
            ipcMain.on('fetch-chat', async (event, arg) => {
              event.reply('fetch-chat', chatMessages);
            });
          }
        });
      } else {
        console.log('No messages found.');
        chatMessages = [];
      }
    },
    (errorObject) => {
      console.log(`The read failed: ${errorObject.name}`);
    }
  );
};

ipcMain.on('select-user-chat', async (event, arg) => {
  const sortedEmails = [userActive, arg].sort();
  const chatKey = `${sortedEmails[0]}_${sortedEmails[1]}`;
  dbref = admin.database().ref(`chats/${chatKey}`);
  ref = admin.database().ref(`chats/${chatKey}`);
  getChat();
});

ipcMain.on('updata-chat', async (event, arg) => {
  async function uploadChat(event, messages: any) {
    try {
      const newMessageRef = dbref.push();
      await newMessageRef.set({
        sender: userActive,
        message: messages,
        timestamp: Date.now(),
      });
      console.log('New message added to the database.');
    } catch (error) {
      console.error('Error adding new message to the database: ', error);
    }
  }
  uploadChat(event, arg);
});
ipcMain.on('auth-user', async (event, email, password) => {
  console.log(email, password);
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const { user } = userCredential;
      ipcMain.on('user-accept', async (event, arg) => {
        event.reply('user-accept', true);
      });
      getDocs(usersRef)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.data().emailId === user.email) {
              userActive = `${doc.data().firstName} ${doc.data().lastName}`;
            }
          });
        })
        .catch((error) => {
          console.error(
            "Error fetching documents from 'users' collection:",
            error
          );
        });
    })
    .catch((error) => {
      console.log(error.code);
    });
});

// setInterval(()=>{console.log(userActive)},5000)
