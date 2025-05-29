/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ELocaleString } from "./schema";

export const CA_STRINGS: ELocaleString[] = [
  {
    key: `PAGE_TITLE`,
    description: `Web page title for all pages`,
    text: `Projecte Euphonia`,
  },
  {
    key: `HELP_LINK`,
    description: `Help hyperlink HREF property when the user needs help or has questions.`,
    text: `http://g.co/disabilitysupport`,
  },
  {
    key: `WELCOME_TITLE`,
    description: `Signup screen and consent screen titles`,
    text: `Et donem la benvinguda al Projecte Euphonia!`,
  },
  {
    key: `We're exploring how Google products and services
          that use speech as an input method could work better for more people. We're seeking
          voice contributions from adults who have difficulty being understood by others.
          Voice samples can help us improve how Google understands individuals with speech
          impairments.`,
    description: `Signup screen`,
    text: `Estem explorant com els productes i serveis de Google
           que utilitzen la parla com a mètode d'entrada podrien funcionar millor per a més persones. 
           Busquem contribucions de veu de les persones adultes que tenen dificultats 
           per ser enteses per les altres. Les mostres de veu poden ajudar-nos a millorar 
           la manera en què Google entén les persones amb dificultats de la parla.`,
  },
  {
    key: `<b>IMPORTANT:</b> If you're filling out
          this form on behalf of someone else, please ensure you have their permission
          to do so.`,
    description: `Signup screen`,
    text: `<b>IMPORTANT:</b> Si ompliu aquest formulari a nom d'una altra persona, 
          si us plau assegureu-vos de comptar amb la seva autorització per fer-ho.`,
  },
  {
    key: `Questions? <a id=signuphelplink target="_blank">Contact Us</a>`,
    description: `Signup screen`,
    text: `Dubtes <a id=signuphelplink target="_blank">Contacta amb nosaltres</a>`,
  },
  {
    key: `Already enrolled? &nbsp;`,
    description: `Signup screen`,
    text: `Ja estàs inscrit/a? &nbsp;`,
  },
  {
    key: `Click to sign in and continue recording`,
    description: `Signup screen`,
    text: `Fes clic per iniciar sessió i continuar l'enregistrament`,
  },
  {
    key: `To get started, please confirm your eligibility:`,
    description: `Signup screen`,
    text: `Per començar, sisplau confirma si compleixes els requisits:`,
  },
  {
    key: `Strangers, or voice technologies like Google Assistant, have difficulty understanding my speech (not because of an accent)`,
    description: `Signup screen eligibility question`,
    text: `Les persones desconegudes, o les tecnologies de veu com l'Assistent de Google, tenen dificultats per entendre la meva parla (no degut a l'accent)`,
  },
  {
    key: `I am at least 18 years of age`,
    description: `Signup screen eligibility question`,
    text: `Tinc almenys 18 anys`,
  },
  {
    key: `Sign in and continue`,
    description: `Signup screen button`,
    text: `Inicia sessió i continua`,
  },
  {
    key: `You will need to sign in with your Google
         Account to contribute to the project. If you do not have a Google Account, you can
         create one when you click to continue.`,
    description: `Signup screen instructions`,
    text: `Hauràs d'iniciar la sessió amb el teu compte de Google per contribuir al projecte. 
          Si no tens un compte de Google, pots crear-ne un en fer clic per continuar.`,
  },
  {
    key: `Next`,
    description: `Interest form button, advance to the next screen`,
    text: `Següent`,
  },
  {
    key: `Go Back`,
    description: `Interest form and consent form buttons, go back to the previous screen`,
    text: `Enrere`,
  },
  {
    key: `You must type your name to agree to the terms.`,
    description: `Consent form screen, require consent to proceed`,
    text: `Has d'escriure el teu nom per acceptar les condicions.`,
  },
  {
    key: `Reset form and start over`,
    description: `Interest form button, clear fields and start over`,
    text: `Reinicia el formulari i torna a començar`,
  },
  {
    key: `You are enrolling as <b id=whoisenrolling>&nbsp;</b>.
          Please review the following agreement: <span id=consentcounter></span>`,
    description: `Consent screen instructions`,
    text: `T'inscrius com
        <b id=whoisenrolling>&nbsp;</b>.
        Sisplau, revisa el següent acord:
        <span id=consentcounter></span>`,
  },
  {
    key: `Enroll`,
    description: `Consent screen, final action; consents to the program and allows recording`,
    text: `Inscriu-te`,
  },
  {
    key: `Next Agreement`,
    description: `Consent screen, to agree to the current consent and then see the next one. Only shows when there are multiple consents`,
    text: `Següent Acord`,
  },
  {
    key: `INSTRUCTIONS_TITLE`,
    en: `Thanks for signing up for Project Euphonia!`,
    description: `Instructions screen title`,
    text: `Gràcies per inscriure't al Projecte Euphonia!`,
  },
  {
    key: `INSTRUCTIONS_VIDEO_HTML`,
    description: `Instructional video iframe from YouTube`,
    text: `
    <iframe width="560" height="315" src="https://www.youtube.com/embed/y-ewGIghpyo?si=KxOHE_nyfqWdPaAC" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    `,
  },
  {
    key: `INSTRUCTIONS_HTML`,
    en: `    <ul>
      <li>Please take a moment to watch this video introduction.</li>
      <li>On the next screen, you'll see <b>cards</b> to read aloud.</li>
      <li>You'll want to be in a <b>quiet setting</b> and avoid any background noise.</li>
      <li>You'll press the blue Record button, and then <b>read the
      card aloud</b>, as accurately as possible.</li>
      <li>When you are <b>finished speaking</b>, press the blue button again to stop recording.</li>
      <li>When you finish recording all the cards, you're done!</li>
      <li>Having trouble recording? <a target="_blank" href="http://g.co/disabilitysupport">Contact us</a> for help.</li>`,
    description: `Instructions screen details`,
    text: `<ul>
      <li>Sisplau dedica un moment a veure aquest vídeo d'introducció.</li>
      <li>A la pantalla següent, veuràs <b>targetes</b> per llegir en veu alta.</li>
      <li>Hauràs d'estar en un <b>entorn tranquil i silenciós</b> i evitar qualsevol soroll de fons.</li>
      <li>Fes clic al botó Enregistra de color blau i després <b>llegeix la targeta en veu alta</b>, 
      amb la màxima precisió possible.</li>
      <li>Has de pulsar el botó blau Enregistrar i , a continuació, <b>llegir la targeta en veu alta</b>, amb la major precisió possible.</li>
      <li>Quan hagis <b>acabat de parlar</b>, torna a fer clic al botó blau per aturar l'enregistrament.</li>
      <li>Quan acabis d'enregistrar totes les targetes, ja estaràs!</li>
      <li>Tens problemes per enregistrar? 
      Posa't en <a target="_blank" href="http://g.co/disabilitysupport">contacte</a>
      amb nosaltres per demanar ajuda.</li>`,
  },
  {
    key: `Get Started`,
    description: `Instructions screen button to continue to next screen`,
    text: `Comença`,
  },
  {
    key: `Microphone Setup`,
    description: `Microphone and settings screen title`,
    text: `Configuració del micròfon`,
  },
  {
    key: `
          In order to record your speech, we need permission to use your microphone
          through your web browser. <b>Please click "Allow"</b> to grant use of your microphone.`,
    description: `Microphone permission instructions`,
    text: `Per enregistrar la teva parla, Euphonia necessita permís per utilitzar el teu micròfon a través del navegador web.
          <b>Sisplau fes clic a "Permetre"</b>
          per autoritzar l'ús del micròfon.`,
  },
  {
    key: `
          We could not access your microphone due to a permission problem. You'll need to allow access
          in order to continue.`,
    description: `Microphone permission error message`,
    text: `Euphonia no ha pogut accedir al teu micròfon a causa d'un problema amb l'autorització. 
          Per poder continuar, has d'autoritzar l'accés.`,
  },
  {
    key: `
          It looks like your microphone permission is blocked. You'll need to <b>allow access</b>
          by clicking the <b>address bar of your browser</b>, and/or <b>reset permission</b> for the microphone.`,
    description: `Microphone permission error message`,
    text: `Sembla que el teu permís de l'accés al micròfon està bloquejat. 
          Hauràs de <b>permetre l'accés</b> fent clic a la <b>barra d'adreces del teu navegador</b>,
          and/or <b>restablint el permís</b> per al micròfon.`,
  },
  {
    key: `
          Your microphone is all set! You can start recording as soon as you're ready.`,
    description: `Microphone permission success message`,
    text: `El teu micròfon ja està configurat! Pots començar a enregistrar quan puguis.`,
  },
  {
    key: `Use the default microphone`,
    description: `Let's the user choose the browser's default recording device instead of picking one explicitly`,
    text: `Utilitza el micròfon per defecte`,
  },
  {
    key: `Save`,
    description: `Microphone configuration screen, accept changes to microphone device`,
    text: `Desa`,
  },
  {
    key: `Try again`,
    description: `Microphone permission failure retry button`,
    text: `Torna a provar`,
  },
  {
    key: `Start recording!`,
    description: `Microphone setup screen button, continue to recording screen`,
    text: `Comença a enregistrar!`,
  },
  {
    key: `Microphone settings`,
    description: `Microphone setup screen title`,
    text: `Configuració del micròfon`,
  },
  {
    key: `Previous card`,
    description: `Recording screen button, go back to prior card`,
    text: `Targeta anterior`,
  },
  {
    key: `Next card`,
    description: `Recording screen button, go forward to next card`,
    text: `Targeta següent`,
  },
  {
    key: `Replay`,
    description: `Recording screen button, listen to previously recorded audio`,
    text: `Reprodueix`,
  },
  {
    key: `Stop`,
    description: `Recording screen button, to interrupt a recording that's currently being played back`,
    text: `Atura`,
  },
  {
    key: `Delete`,
    description: `Recording screen button, delete a previous recording`,
    text: `Suprimeix`,
  },
  {
    key: `Deleting...`,
    description: `Recording screen button, shown briefly while the recording is being deleted`,
    text: `Suprimint...`,
  },
  {
    key: `Record`,
    description: `Recording screen button, record audio for a card`,
    text: `Enregistra`,
  },
  {
    key: `Record Again`,
    description: `Recording screen button, record audio for a card that already has been recorded`,
    text: `Torna a enregistrar`,
  },
  {
    key: `(this card is done)`,
    description: `Labels tasks that have already been recorded once`,
    text: `(aquesta targeta està feta)`,
  },
  {
    key: `Cancel`,
    description: `Recording screen button and microphone setting screen button, cancel recording / microphone changes`,
    text: `Cancel·la`,
  },
  {
    key: `Done`,
    description: `Recording screen button, shown while recording to end the recording and start uploading it`,
    text: `Fet`,
  },
  {
    key: `Automatic swipe`,
    description: `Label for the checkbox that controls if recording will be automatic swipped after recording ends`,
    text: `Deslliça automàticament`,
  },
  {
    key: `Starting...`,
    description: `Recording screen button, shown briefly just before the microphone starts listening`,
    text: `Començant...`,
  },
  {
    key: `Now recording...`,
    description: `Recording screen button, shown briefly just before the microphone starts listening`,
    text: `Està enregistrant...`,
  },
  {
    key: `Recording uploaded!`,
    description: `Recording screen message when the recording uploaded successfully`,
    text: `S'ha pujat l'enregistrament!`,
  },
  {
    key: `Recording uploaded! Here's the next card.`,
    description: `Recording screen message when the recording uploads successfully and the next card is automatically displayed`,
    text: `S'ha pujat l'enregistrament! Aquí tens la següent targeta.`,
  },
  {
    key: `Recording deleted.`,
    description: `Recording screen message when a recording has just been deleted`,
    text: `Enregistrament suprimit.`,
  },
  {
    key: `Recording canceled.`,
    description: `Recording screen message when a recording has just been canceled`,
    text: `Enregistrament cancel·lat.`,
  },
  {
    key: `No recording to delete.`,
    description: `Error message when the user deletes but nothing is selected.`,
    text: `No hi ha cap enregistrament per suprimir.`,
  },
  {
    key: `No recording to play.`,
    description: `Error message when the user replays but nothing is selected.`,
    text: `No hi ha cap enregistrament per reproduir.`,
  },
  {
    key: `Upload failed, your audio may not be saved.`,
    description: `Error message when the user's recording was not received by the server.`,
    text: `No s'ha pogut pujar l'enregistrament, és possible que l'àudio no s'hagi desat.`,
  },
  {
    key: `Canceling...`,
    description: `Recording screen button, shown briefly when the recording is being canceled`,
    text: `Cancel·lant...`,
  },
  {
    key: `Uploading...`,
    description: `Recording screen button, shown briefly when the recording is being uploaded`,
    text: `S'està pujant...`,
  },
  {
    key: `?`,
    description: `Recording screen button, go to help screen`,
    text: `?`,
  },
  {
    key: `&#x1F50A;`,
    description: `Speak prompt button, which uses computerized speech to play the prompt audibly`,
    text: `&#x1F50A;`,
  },
  {
    key: `Continue`,
    description: `Sign up screen and consent screen buttons, continue to the next page`,
    text: `Continua`,
  },
  {
    key: `No assignments`,
    description: `Recording screen, message when the user has no cards to work on`,
    text: `Sense tasques`,
  },
  {
    key: `<b>{number_of_completed_cards}</b> of <b>{total_number_of_tasks_needed}</b> cards <b>done</b>`,
    description: `Recording screen, progress message of tasks completed so far`,
    text: `<b>{number_of_completed_cards}</b> de <b>{total_number_of_tasks_needed}</b> targetes <b>fetes</b>`,
  },
  {
    key: `Thank you!`,
    description: `Done screen title, shown when the user has finished at least one pass`,
    text: `Gràcies!`,
  },
  {
    key: `          Great work! You've gone through the cards once, and recorded
            <b class=count>{number_of_completed_cards} cards</b>
            out of the total (<b>{total_number_of_tasks_needed} cards</b>).
            When you're ready, you can click the button below to finish up the rest of the cards.      `,
    description: `Done screen instructions, asks the user to go finish the rest of the cards`,
    text: `
    Molt bé! Has repassat les targetes una vegada i has enregistrat
        <b class=count>{number_of_completed_cards} targetes</b>
        del total de
        (<b>{total_number_of_tasks_needed} targetes</b>).
        Quan estiguis a punt, pots fer clic al botó a baix per acabar la resta de targetes.`,
  },
  {
    key: `          You're almost done! You've gone through the cards once, and recorded
            <b class=count>{number_of_completed_cards} cards</b>
            out of the total (<b>{total_number_of_tasks_needed} cards</b>).
            When you're ready, you can click the button below to finish up the rest of the cards.      `,
    description: `Done screen instructions, asks the user to go finish the rest of the cards.
        This version displays when the user has done more than 75% of the work.`,
    text: `Gairebé acabes! Has repassat les targetes una vegada i has enregistrat
          <b class=count>{number_of_completed_cards} targetes</b>
          del total de
          (<b>{total_number_of_tasks_needed} targetes</b>).
          Quan estiguis a punt, pots fer clic al botó a baix per acabar la resta de targetes.`,
  },
  {
    key: `Continue Recording`,
    description: `Done screen and instructions screen buttons, return to the recording screen`,
    text: `Continua enregistrant`,
  },
  {
    key: `Continue recording!`,
    description: `Microphone settings screen, return to the recording screen`,
    text: `Continua a enregistrar!`,
  },
  {
    key: `You previously indicated that you are eligible.`,
    description: `Signup screen, a message showing that the participant has already completed this form`,
    text: `Has indicat prèviament que compleixes els requisits.`,
  },
  {
    key: `You have already completed this form.`,
    description: `Interest form screen, a message showing that the participant has already completed this form`,
    text: `Ja has omplert aquest formulari.`,
  },
  {
    key: `Country is required.`,
    description: `Interest form screen, a message showing that a required field needs to be filled in.`,
    text: `El camp del país és obligatori.`,
  },
  {
    key: `State is required.`,
    description: `Interest form screen, a message showing that a required field needs to be filled in.`,
    text: `El camp de l'estat és obligatori.`,
  },
  {
    key: `Please tell us if someone will be helping you record.`,
    description: `Interest form screen, a message showing that a required field needs to be filled in.`,
    text: `Sisplau digues si algú t'acompanyarà a enregistrar.`,
  },
  {
    key: `Please tell us how to email the person helping you.`,
    description: `Interest form screen, a message showing that a required field needs to be filled in.`,
    text: `Sisplau digues com enviar un correu electrònic a la persona que t'acompanya.`,
  },
  {
    key: `You'll need to give consent to proceed.`,
    description: `Interest form screen, a message showing that a required field needs to be filled in.`,
    text: `Hauràs de donar el teu consentiment per procedir.`,
  },
  {
    key: `Please write your initials next to your consent.`,
    description: `Interest form screen, a message showing that a required field needs to be filled in.`,
    text: `Sisplau escriu les teves inicials al costat del teu consentiment.`,
  },
  {
    key: `You'll need to accept the terms to proceed.`,
    description: `Interest form screen, a message showing that a required field needs to be filled in.`,
    text: `Hauràs d'acceptar les condicions per procedir.`,
  },
  {
    key: `You have already consented.`,
    description: `Consent screen, a message showing that the participant has already completed this form`,
    text: `Ja has donat el teu consentiment.`,
  },
  {
    key: `By typing my name here, I agree to these terms:`,
    description: `Consent screen, instructs the user to type their name in the adjacent text field`,
    text: `En escriure el meu nom aquí, accepto aquestes condicions:`,
  },
  {
    key: `&nbsp;(Agreement {which_agreement_number} of {total_number_of_agreements})`,
    description: ``,
    text: `&nbsp;(Acord {which_agreement_number} de {total_number_of_agreements})`,
  },
  {
    key: `Congratulations! You're all done!`,
    description: `Progress bar display when there are no tasks left to do`,
    text: `Enhorabona! Ja ho tens!`,
  },
  {
    key: `Congratulations!`,
    description: `Title of the done screen`,
    text: `Enhorabona!`,
  },
  {
    key: `Review Recordings (optional)`,
    description: `Button on done screen which returns to the recording screen, if the user wants to listen to recordings`,
    text: `Revisa Enregistraments (opcional)`,
  },
  {
    key: `
        You have completed all your cards! We'll be reviewing them soon, and if everything
        looks good, you'll be receiving an email from rewards@perks.com within the next 7-10
        business days with a link to claim your gift card.
        <br/><br/>
        <b>Thank you for contributing <b class=count>{number_of_completed_cards} cards</b> to the project!</b>
        <br/><br/>
        (If you wish, you can now go back and review your recordings, but this is not necessary. <b>You're done!</b>)`,
    description: `Descriptive text on the done screen`,
    text: `Has completat totes les targetes! Aviat les revisarem i,
        si tot està bé, rebràs un correu electrònic de
        rewards@perks.com
        els propers 7-10 dies laborables amb un enllaç per reclamar la teva targeta regal.
        <br/><br/>
        <b>Gràcies per contribuir amb
        <b class=count>{number_of_completed_cards} targetes</b>
        al Projecte Euphonia!
        </b><br/><br/>
        (Si ho desitges, ara pots tornar enrere i revisar els teus enregistraments, tot i que això no és necessari.
        <b>Ja has acabat!!</b>)`,
  },
  {
    key: `__INTEREST_FORM_HTML__`,
    description: `The HTML for the interest form; all HTML IDs must be intact exactly as is!`,

    // Each translatable string is on a line by itself to make it a little easier to translate
    text: `
    <div class=title
    >Projecte RAPNIC: Formulari d'interès</div>
    <p>Aquest formulari recull informació demogràfica necessària per garantir la diversitat del nostre dataset de veu.</p>
    <p>Amb el teu consentiment, recollirem informació sobre el teu perfil, ús de tecnologia assistiva, característiques de la parla i patrons vocals.</p>
    <p>El consentiment específic per al tractament de les teves dades de veu serà sol·licitat posteriorment.</p>
    <div class=sectiontitle
    >Informació personal</div>
    <div class=formbox>
      <div class=fieldname><label for=ifname
      >Nom</label>
      <span class=optional
      >(Opcional)</span>
      </div>
      <div class=fielddescription
      >Sobrenom, nom i cognom, només nom, etc. Qualsevol forma en la que vulguis ser referit!</div>
      <input id=ifname class=formtext />
    </div>
    
    <div class=formbox>
      <div class=fieldname><label for=ifcountry
      >A quina província resideixes?</label>
      <span class=required>*</span></div>
      <select id=ifprovince class=formselect>
        <option disabled>-- Catalunya --</option>
        <option value="Barcelona">Barcelona</option>
        <option value="Girona">Girona</option>
        <option value="Lleida">Lleida</option>
        <option value="Tarragona">Tarragona</option>
        <option disabled>-- País Valencià --</option>
        <option value="Alacant">Alacant</option>
        <option value="Castelló">Castelló</option>
        <option value="València">València</option>
        <option disabled>-- Illes Balears --</option>
        <option value="Illes Balears">Illes Balears</option>
        <option disabled>-- Altres territoris --</option>
        <option value="Andorra">Andorra</option>
        <option value="Catalunya Nord">Catalunya Nord</option>
        <option value="L'Alguer">L'Alguer</option>
        <option value="Altres territoris de l'Estat espanyol">Altres territoris de l'Estat espanyol</option>
        <option value="Altres països">Altres països</option>
      </select>
    </div>
    
    <div class=formbox>
      <div class=fieldname><label for=ifcity
      >A quina ciutat vius?</label>
      <span class=optional
      >(Opcional)</span>
      </div>
      <input id=ifcity class=formtext />
    </div>
    
    <div class=formbox>
      <div class=fieldname><label for=ifdialect
      >Quina varietat dialectal del català parles?</label>
      <span class=required>*</span></div>
      <select id=ifdialect class=formselect>
        <option value="Central (Barcelona, Girona)">Central (Barcelona, Girona)</option>
        <option value="Balear">Balear</option>
        <option value="Nord-Occidental (Lleida)">Nord-Occidental (Lleida)</option>
        <option value="Septentrional">Septentrional</option>
        <option value="València meridional">València meridional</option>
        <option value="Alacantí">Alacantí</option>
        <option value="València septentrional">València septentrional</option>
        <option value="Tortosí">Tortosí</option>
        <option value="València central">València central</option>
        <option value="Alguerès">Alguerès</option>
        <option value="L'Alguer">L'Alguer</option>
        <option disabled>-- Altres --</option>
        <option value="No estic segur/a">No estic segur/a</option>
        <option value="Altres">Altres</option>
      </select>
    </div>

    <div class=formbox>
      <div class=fieldname><label for=ifdisorder
      >Tipologia de trastorn</label>
      <span class=required>*</span></div>
      <div class=fielddescription
      >Aquesta informació ens ajuda a ajustar els models als diferents tipus de parla de la manera més precisa possible. Les dades són completament anonimitzades.
      </div>
      <div class=checkboxrow>
        <input name=ifdisorder type=radio class=formradio id="Síndrome de Down" />
        <label for="Síndrome de Down">Síndrome de Down</label><br>
      </div>
      <div class=checkboxrow>
        <input name=ifdisorder type=radio class=formradio id="Paràlisi cerebral" />
        <label for="Paràlisi cerebral">Paràlisi cerebral</label><br>
      </div>
      <div class=checkboxrow>
        <input name=ifdisorder type=radio class=formradio id="Danys cerebrals adquirits" />
        <label for="Danys cerebrals adquirits">Danys cerebrals adquirits</label><br>
      </div>
      <div class=checkboxrow>
        <input name=ifdisorder type=radio class=formradio id="Esclerosi múltiple" />
        <label for="Esclerosi múltiple">Esclerosi múltiple</label><br>
      </div>
      <div class=checkboxrow>
        <input name=ifdisorder type=radio class=formradio id="Altres trastorns de la parla" />
        <label for="Altres trastorns de la parla">Altres trastorns de la parla</label><br>
      </div>
      <div class=checkboxrow>
        <input name=ifdisorder type=radio class=formradio id="Prefereixo no especificar-ho" />
        <label for="Prefereixo no especificar-ho">Prefereixo no especificar-ho</label><br>
      </div>
    </div>
    
   <div class=formbox>
      <div class=fieldname><label for=ifgender
      >Sexe</label>
      <span class=required>*</span></div>
      <div class=checkboxrow>
        <input name=ifgender type=radio class=formradio id="Dona" />
        <label for="Dona">Dona</label><br>
      </div>
      <div class=checkboxrow>
        <input name=ifgender type=radio class=formradio id="Home" />
        <label for="Home">Home</label><br>
      </div>
      <div class=checkboxrow>
        <input name=ifgender type=radio class=formradio id="No binari" />
        <label for="No binari">No binari</label><br>
      </div>
      <div class=checkboxrow>
        <input name=ifgender type=radio class=formradio id="Prefereixo no respondre" />
        <label for="Prefereixo no respondre">Prefereixo no respondre</label><br>
      </div>
    </div>
    
   <div class=formbox>
      <div class=fieldname><label for=ifage
      >Edat</label>
      <span class=required>*</span></div>
      <div class=checkboxrow>
        <input name=ifage type=radio class=formradio id="18-30" />
        <label for="18-30">18-30</label><br>
      </div>
      <div class=checkboxrow>
        <input name=ifage type=radio class=formradio id="31-45" />
        <label for="31-45">31-45</label><br>
      </div>
      <div class=checkboxrow>
        <input name=ifage type=radio class=formradio id="46-60" />
        <label for="46-60">46-60</label><br>
      </div>
      <div class=checkboxrow>
        <input name=ifage type=radio class=formradio id="61-75" />
        <label for="61-75">61-75</label><br>
      </div>
      <div class=checkboxrow>
        <input name=ifage type=radio class=formradio id="+75" />
        <label for="+75">Més de 75</label><br>
      </div>
    </div>

    <div class=sectiontitle
    >Informació addicional</div>
    
    <div class=formbox>
      <div class=fieldname><label for=ifreferral
      >Si us plau, digue'ns com has conegut aquest projecte</label>
      <span class=optional
      >(Opcional)</span>
      </div>
      <div class=checkboxrow>
        <input type=checkbox id=ifreferralentity />
        <label for=ifreferralentity
        >A través d'una entitat col·laboradora</label>
      </div>
      <div class=checkboxrow>
        <input type=checkbox id=ifreferralfriends />
        <label for=ifreferralfriends
        >A través d'un familiar o amic</label>
      </div>
      <div class=checkboxrow>
        <input type=checkbox id=ifreferralmedia />
        <label for=ifreferralmedia
        >A través de mitjans de comunicació o xarxes socials</label>
      </div>
      <div class=checkboxrow>
        <input type=checkbox id=ifreferralother />
        <label id=ifreferralotherlabel for=ifreferralother
        >Altres:</label>
        <input type=text class=formtext id=ifdeviceothertext aria-labelledby="ifdeviceotherlabel" />
      </div>

    </div>
    
    <div class=formbox>
      <div class=fieldname
      >Quin dispositiu utilitzaràs per fer els enregistraments?
      <span class=optional
      >(Opcional)</span>
      </div>
      <div class=checkboxrow>
        <input type=checkbox id=ifdevicecomputer />
        <label for=ifdevicecomputer
        >Un ordinador amb connexió a internet, equipat amb micròfon i altaveus</label>
      </div>
      <div class=checkboxrow>
        <input type=checkbox id=ifdeviceandroid />
        <label for=ifdeviceandroid
        >Un telèfon o tauleta Android (com Samsung, Pixel, Nexus, etc.)</label>
      </div>
      <div class=checkboxrow>
        <input type=checkbox id=ifdeviceiphone />
        <label for=ifdeviceiphone
        >Un iPhone o iPad </label>
      </div>
      <div class=checkboxrow>
        <input type=checkbox id=ifdeviceother />
        <label id=ifdeviceotherlabel for=ifdeviceother
        >Altres:</label>
        <input type=text class=formtext id=ifdeviceothertext aria-labelledby="ifdeviceotherlabel" />
      </div>
    </div>
    
    <div class=formbox id=helperbox>
      <div class=fieldname
      >Algú t'ajudarà a enregistrar les mostres de veu?
      <span class=required>*</span></div>
      <div class=fielddescription
      >Per exemple, un familiar, logopeda, o altra persona</div>
      <div class=checkboxrow>
        <input type=radio name=ifhelper id=ifhelperno selected />
        <label for=ifhelperno
        >No, participaré de forma independent</label>
      </div>
      <div class=checkboxrow>
        <input type=radio name=ifhelper id=ifhelperyes />
        <label for=ifhelperyes
        >Sí, algú m'ajudarà</label>
      </div>
    </div>
    
    <div class=sectiontitle
    >Projecte RAPNIC: Consentiment de recol·lecció d'informació personal sensible</div>
    
    <div class=formbox>
    <p><em>En omplir aquest formulari, dones consentiment al consorci del projecte RAPNIC per processar les teves dades personals per als objectius del projecte.*</em></p>

    <p><em>Les teves dades es conservaran en servidors segurs amb accés limitat només a personal seleccionat del projecte. La teva informació demogràfica podrà vincular-se a les mostres de veu recollides, però el teu nom i adreça electrònica no seran difosos en cap cas. Tens dret a revocar el consentiment en qualsevol moment escrivint a isocial@isocial.cat.</em></p>

    <p><em>*El consorci del projecte RAPNIC està format per la Fundació iSocial, Col·lectivaT i la Universitat de Barcelona, en col·laboració amb la Fundació Catalana de Síndrome de Down, Fundació El Maresme, Fundació Ampans, Grup Alba, Fundació Astres i Fundació Aspace.</em></p>

      <div class=checkboxrow>
        <input type=checkbox id=ifformconsent />
        <label id=ifformconsentlabel for=ifformconsent>
          Dono el meu consentiment i escriuré les meves inicials aquí:
    <span class=required>*</span>
        </label>
        <input type=text class=formtext id=ifconsentinitials aria-labelledby="ifformconsentlabel" />
      </div>
    </div>

    <div class=formbox>
      <div class=fieldname><label for=ifotherinfo>
        Tens alguna altra informació que vulguis compartir amb nosaltres?
        </label>
        <span class=optional
        >(Opcional)</span>
      </div>
      <input id=ifotherinfo class=formtext />
    </div>
`,
  },
];
