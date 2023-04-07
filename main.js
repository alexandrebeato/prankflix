const electron = require('electron');

const windowWidth = 400;
const windowHeight = 250;
const windowsOpened = [];
let howManyTimesUserClickedOnTheEmoji = 0;
let closeApplication = false;

const createWindow = () => {
  const window = new electron.BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    maximizable: false,
    resizable: false,
    alwaysOnTop: true,
    title: 'PrankFlix',
    icon: 'assets/img/icon.ico',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  window.loadFile('index.html');
  window.setMenuBarVisibility(false);
  setRandomWindowPosition(window);

  window.on('closed', () => {
    if (!closeApplication) {
      createWindow();
      createWindow();
    }
  });

  windowsOpened.push(window);
};

const openSadWindow = () => {
  const window = new electron.BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    maximizable: false,
    resizable: false,
    alwaysOnTop: true,
    title: 'PrankFlix',
    icon: 'assets/img/icon.ico',
    center: true,
  });

  window.loadFile('sad.html');
  window.setMenuBarVisibility(false);

  window.on('closed', () => {
    electron.app.quit();
  });
};

function setRandomWindowPosition(window) {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  const x = Math.floor(Math.random() * (width - windowWidth));
  const y = Math.floor(Math.random() * (height - windowHeight));
  window.setPosition(x, y);
}

electron.app.whenReady().then(() => {
  createWindow();

  electron.ipcMain.on('emoji-clicked', (event, message) => {
    howManyTimesUserClickedOnTheEmoji++;

    console.log(
      `User clicked on the emoji ${howManyTimesUserClickedOnTheEmoji} times!`
    );

    if (howManyTimesUserClickedOnTheEmoji >= 10) {
      closeApplication = true;
      windowsOpened.forEach((window) => {
        if (!window.isDestroyed()) window.close();
      });

      openSadWindow();
    }
  });
});
