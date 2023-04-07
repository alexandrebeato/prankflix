const electron = require('electron');

const windowWidth = 400;
const windowHeight = 250;
let howManyTimesUserClickedOnTheEmoji = 0;
let closeApplication = false;

const createWindow = () => {
  const window = new electron.BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    maximizable: false,
    resizable: false,
    title: 'PrankFlix',
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
    } else {
      electron.app.quit();
    }
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
      electron.app.quit();
    }
  });
});
