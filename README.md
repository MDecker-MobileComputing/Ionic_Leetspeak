# Leetspeak #

Simple Ionic app with Angular, to demonstrate how an Ionic app can be
packaged into an [Electron app](https://www.electronjs.org/).
The function of the app is it to translate the text provided by the user
to [Leetspeak](https://en.wikipedia.org/wiki/Leet), which is realized by simple letter substitutions.

**Example:**
* Input:  *"The quick brown fox jumps over the lazy dog."*
* Output: *"Th3 qu1ck 8r0wn f0x jump5 0v3r th3 142y d09."*

<br>

----

## Configure Electron for an Ionic project ##

see [this README file in German](https://github.com/MDecker-MobileComputing/Ionic_Wuerfel/blob/electron/README_electron.md)

<br>

For building the Electron app for different operating systems one of the following commands can be executed:
```
npm run electron4win
npm run electron4mac
npm run electron4linux
```

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
