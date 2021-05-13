import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

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

  /**
   * Konstruktor für Dependency Injection.
   */
  constructor(private alertCtrl: AlertController) {}

  /**
   * Event-Handler-Methode für Button "Text in Leetspeak umwandeln".
   */
  private onUebersetzen() {

    const text = this.eingabeText.trim();
    if (text.length === 0) {

      this.zeigeDialog("Ungültige Eingabe", "Bitte zu übersetztenden Text eingeben.");
    }

    this.ausgabeText = "";
  }

  /**
   * Event-Handler-Methode für Button "Text löschen".
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

}
