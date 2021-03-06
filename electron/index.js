/**
 * Änderungen in dieser Datei werden bei erneutem Start der App
 * mit `npx cap open electron` wirksam.
 *
 * ACHTUNG: Wenn diese App einen Syntaxfehler enthält, dann bleibt
 * der Aufruf von `npx cap open electron` ohne Fehlermeldung hängen!
 */

const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const { CapacitorSplashScreen, configCapacitor }    = require('@capacitor/electron');

const isDevMode = require('electron-is-dev');
const fs        = require('fs');

const path  = require('path');
const shell = require('electron').shell

const URL_HILFESEITE = "https://github.com/MDecker-MobileComputing/Ionic_Leetspeak/blob/master/README.md#leetspeak-app-ionic-app-in-electron-container";

// Place holders for our windows so they don't get garbage collected.
let mainWindow = null;

// Placeholder for SplashScreen ref
let splashScreen = null;

//Change this if you do not wish to have a splash screen
let useSplashScreen = true;

// Create simple menu for easy devtools access, and for demo
const menuTemplateDev = [
  {
    label: 'Options',
    submenu: [
      {
        label: 'Open Dev Tools',
        click() { mainWindow.openDevTools(); },
      },
    ],
  },
];

const aboutDialogOptionen  = {
  buttons: ["OK"],
  message: "Leetspeak-Translator ist eine in Electron verpackte Ionic-App.\n\n2022 by MD"
};

/**
 * Eigenes Menü für Electron-App definieren, siehe auch
 * https://coursetro.com/posts/code/119/Working-with-Electron-Menus---Tutorial
 */
function erzeugeEigenesMenue() {

  const onLoeschMenu  = function(){ mainWindow.webContents.send("befehl-von-electron", "Dummy-Argument"); };
  const onBeendenMenu = function(){ app.quit(); };
  const onHilfeMenu   = function(){ shell.openExternal(URL_HILFESEITE); };
  const onUeberMenu   = function(){ dialog.showMessageBox(aboutDialogOptionen); };

  const aktionenMenuArray = [
      {label: "Formular löschen", click: onLoeschMenu, accelerator: "CmdOrCtrl+L" },
      {type:  "separator"},
      {label: "Beenden", click: onBeendenMenu }
  ];

  const hilfeMenuArray = [
      {label: "Hilfeseite im Browser öffnen", click: onHilfeMenu },
      {type:  "separator" },
      {label: "Über diese App", click: onUeberMenu },
  ];

  const aktionenMenu = { label: "Aktionen", submenu: aktionenMenuArray };
  const hilfeMenu    = { label: "Hilfe"   , submenu: hilfeMenuArray    };

  const menu = Menu.buildFromTemplate([ aktionenMenu, hilfeMenu ]);

  Menu.setApplicationMenu(menu);
}

async function createWindow () {

  mainWindow = new BrowserWindow({
    height: 920,
    width: 1600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'node_modules', '@capacitor', 'electron', 'dist', 'electron-bridge.js')
    }
  });

  configCapacitor(mainWindow);

  if (isDevMode) {
    // Set our above template to the Menu Object if we are in development mode, dont want users having the devtools.
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplateDev));
    // If we are developers we might as well open the devtools by default.
    mainWindow.webContents.openDevTools();
  }

  if(useSplashScreen) {
    splashScreen = new CapacitorSplashScreen(mainWindow);
    splashScreen.init();
  } else {
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    mainWindow.webContents.on('dom-ready', () => {
      mainWindow.show();
    });
  }

  erzeugeEigenesMenue();
}

/**
 * Event-Handler für Empfang von "Befehl" von Ionic, nämlich um das aktuelle
 * Übersetzungsergebnis als lokale Datei zu speichern.
 *
 * Achtung: die Methode `dialog.showSaveDialog()` ist eine asynchrone Methode,
 * die deshalb mit `await` aufgerufen wird; deshalb muss die Callback-Funktion
 * selbst mit `async` deklariert werden.
 */
ipcMain.on("befehl-von-ionic", async (event, uebersetzungsergebnis) => {

  const saveDialogOptionen = {
    titel: "Speichern Textdatei mit Übersetzungsergebnis",
    defaultPath: app.getPath("documents") + "/Leetspeek-Ergebnis.txt",
  }

  const saveDialogErgebnis = await dialog.showSaveDialog(saveDialogOptionen);
  if (saveDialogErgebnis.canceled) {

    dialog.showMessageBox({ buttons: ["Ok"], message: `Vorgang abgebrochen.` });
    return;
  }

  const zieldatei = saveDialogErgebnis.filePath;

  try {

    fs.writeFileSync(zieldatei, uebersetzungsergebnis + "\n", "utf-8");

    dialog.showMessageBox({ buttons: ["Ok"], message: `Datei "${zieldatei}" wurde erstellt.` });
  }
  catch(ex) {

    dialog.showErrorBox("Fehler", "Datei konnte nicht geschrieben werden: " + ex);
    return;
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
