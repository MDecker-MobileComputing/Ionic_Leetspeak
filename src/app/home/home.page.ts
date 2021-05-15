import { Component, NgZone } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  /** String-Variable ist an TextArea zur Eingabe des zu übersetzenden Texts gebunden. */
  private eingabeText = "";

  /** String-Variable ist an TextArea zur Darstellung Übersetzungsergebnis gebunden. */
  private ausgabeText = "";

  /** Variable hat genau dann den Wert `true`, wenn die App als Electron-App ausgeführt wird. */
  private laueftInElectron = false;

  /**
   * Konstruktor für Dependency Injection.
   *
   * API-Dokuk für Klasse `ElectronService`: https://www.npmjs.com/package/ngx-electron
   */
  constructor(private alertCtrl: AlertController,
              private toastController: ToastController,
              private electronService: ElectronService,
              private ngZone: NgZone) {

      this.laueftInElectron = electronService.isElectronApp;
      if (this.laueftInElectron) {

        let betriebssystem = "";
        if (electronService.isWindows) {

          betriebssystem = "Windows";

        } else if (electronService.isLinux) {

          betriebssystem = "Linux";

        } else if (electronService.isMacOS) {

          betriebssystem = "MacOS";

        } else {

          betriebssystem = "unbekanntes Betriebssystem";
        }

        this.electronEventHandlerRegistrieren();

        this.zeigeToast(`App läuft in Electron (${betriebssystem}).`);

      } else {

        this.zeigeToast("App läuft NICHT in Electron.");
      }
  }

  /**
   * Event-Handler für Befehle von Electron-Container registrieren.
   *
   * siehe auch
   * * https://github.com/ThorstenHans/ngx-electron/issues/2
   * * https://github.com/ThorstenHans/electron-ngx-sample/blob/master/src/components/kittendetails/kittendetails.ts#L28
   */
  private electronEventHandlerRegistrieren() {

    this.electronService.ipcRenderer.on("befehl-von-electron", (event, args) => {

      this.ngZone.run( () => { this.onLoeschen(); });
    });
  }


  /**
   * Event-Handler-Methode für Button "Text in Leetspeak umwandeln".
   */
  private onUebersetzen() {

    const inputText = this.eingabeText.trim();
    if (inputText.length === 0) {

      this.zeigeDialog("Ungültige Eingabe", "Bitte zu übersetztenden Text eingeben.");
    }

    this.ausgabeText = this.buchstabenErsetzen(inputText);
  }

  /**
   * Methode nicht Buchstabenersetzungen für "Übersetzung" nach Leetspeak vor.
   * Die Übersetzungsregeln entsprechen "Level 1" von https://md5decrypt.net/en/Leet-translator/
   * (Ersetzung von "r" auf "2" wurde aber nicht übernommen).
   *
   * Für die Ersetzungen werden reguläre Ausdrücke der Form `/a/gi` verwendet, wobei `a` der zu
   * ersetzende Buchstabe ist. Damit auch mehrere Vorkommen in einem String übersetzt werden,
   * wird mit `g` die Option "global" gesetzt, und mit "i" wird die Unterscheidung von
   * Groß-/Kleinschreibung ausgeschaltet.
   *
   * @param eingabe Zu übersetzender Text.
   * @returns Als Übersetzungsergebnis anzuzeigender Text.
   */
  private buchstabenErsetzen(eingabe: string): string {

    return eingabe.replace(/a/gi, "4")
                  .replace(/b/gi, "8")
                  .replace(/e/gi, "3")
                  .replace(/g/gi, "9")
                  .replace(/i/gi, "1")
                  .replace(/l/gi, "1") // auch "i" wird schon auf Ziffer "1" abgebildet
                  .replace(/o/gi, "0")
                  .replace(/s/gi, "5")
                  .replace(/z/gi, "2");
  }

  /**
   * Event-Handler-Methode für Button "In Zwischenablage kopieren"; dieser Button ist
   * nur sichtbar, wenn die App in Electron läuft und gerade ein Übersetzungsergebnis
   * angezeigt wird.
   */
  private inElectronClipboardKopieren() {

    this.electronService.clipboard.writeText(this.ausgabeText);

    this.zeigeDialog("Info", "Übersetzung wurde in die Zwischenablage kopiert.");
  }

  /**
   * Event-Handler-Methode für Button "Als lokale Datei speichern"; dieser Button ist
   * nur sichtbar, wenn die App in Electron läuft und gerade ein Übersetzungsergebnis
   * angezeigt wird.
   */
  private dateiViaElectronSpeichern() {

    this.electronService.ipcRenderer.send("befehl-von-ionic", this.ausgabeText);
  }

  /**
   * Event-Handler-Methode für Button "Text löschen". Wird auch ausgeführt, wenn Menüpunkt
   * "Formular löschen" in Electron-Container ausgeführt wird.
   */
   private onLoeschen() {

    this.eingabeText = "";
    this.ausgabeText = "";
  }

 /**
   * Hilfsmethode: Alert anzeigen, siehe auch https://ionicframework.com/docs/api/alert
   *
   * @param titel Titel des Dialogs
   * @param nachricht Im Dialog anzuzeigender Text
   */
  async zeigeDialog(titel: string, nachricht: string) {

    const meinAlert =
          await this.alertCtrl.create({
              header  : titel,
              message : nachricht,
              buttons : [ "Ok" ]
          });

    await meinAlert.present();
  }

  /**
   * Hilfsmethode: Toast anzeigen, siehe auch https://ionicframework.com/docs/api/toast
   *
   * @param nachricht Im Toast anzuzeigender Text
   */
   async zeigeToast(nachricht: string) {

    const toast =
          await this.toastController.create({
              message : nachricht,
              duration: 2000  // 2000 ms = 2 seconds
          });

    await toast.present();
  }

}
