# Leetspeak app (Ionic app in Electron container) #

Simple Ionic app with Angular, to demonstrate how an Ionic app can be
packaged into an [Electron app](https://www.electronjs.org/).
The function of the app is it to translate the text provided by the user
to [Leetspeak](https://en.wikipedia.org/wiki/Leet), which is realized by simple letter substitutions.

**Example:**
* Input:  *"The quick brown fox jumps over the lazy dog."*
* Output: *"Th3 qu1ck 8r0wn f0x jump5 0v3r th3 142y d09."*

<br>

----

## Screenshots ##

Screenshot of app when compiled for Android:

![Screenshot: App for Android](screenshot_AndroidApp.png)

<br>

Electron app compiled for Windows:

![Screenshot: App for Windows](screenshot_WindowsApp.png)

<br>

----

## Configure Electron for an Ionic project ##

See [this README file in German](https://github.com/MDecker-MobileComputing/Ionic_Wuerfel/blob/electron/README_electron.md)

<br>

If in your local clone there is no subfolder `npm_modules` in folder `electron`, then execute `npm install` in this folder.

<br>

Run the following script contained in the root folder of this repository to preview the Electron app:
```
./vorschauElectronApp.sh
```
The script will also perform the update needed when something in the Ionic code was changed.

<br>

For building the Electron app for different operating systems one of the following commands can be executed (before this the app must have been executed with `npx cap open electron`):
```
npm run electron4win
npm run electron4mac
npm run electron4linux
```
These commands are defined under `script` in file [package.json](./package.json).

<br>

Workaround needed to get app running with package [ngx-electron](https://www.npmjs.com/package/ngx-electron):
Increased version of package `@types/node` listed under `devDependencies` to version `15.0.3`, which was the latest
version according to [this page on *npmjs.com*](https://www.npmjs.com/package/@types/node) when the app was developed;
see also [this answer on *stackoverflow.com*](https://stackoverflow.com/a/66596834/1364368)

<br>

Custom menus for Electron app are defined in function `erzeugeEigenesMenue()` in file [electron/index.js](electron/index.js).

<br>

----

## License ##

See the [LICENSE file](LICENSE.md) for license rights and limitations (BSD 3-Clause License) for the files in this repository.

<br>
