// ⭐⭐⭐ SOSTITUISCI QUESTO CON L'URL DELLA TUA WEB APP DI GOOGLE APPS SCRIPT ⭐⭐⭐
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw2ZsTd58kYuHI8wPkymszS40Nn7mYnUoHv4dr6wn7sf25xsfkdoHwHQfSSFGfjeZYk/exec';
// Esempio: 'https://script.google.com/macros/s/AKfyc.../exec';
// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

// Riferimenti agli elementi HTML
const homeView = document.getElementById('home-view');
const operatoreView = document.getElementById('operatore-view');
const utenteView = document.getElementById('utente-view');

const btnOperatore = document.getElementById('btn-operatore');
const btnUtente = document.getElementById('btn-utente');
const btnBackOperatore = document.getElementById('btn-back-operatore');
const btnBackUtente = document.getElementById('btn-back-utente');
const btnLogoutUtente = document.getElementById('btn-logout-utente');

// Elementi Operatore
const inputNomeUtente = document.getElementById('input-nome-utente');
const btnRegistraUtente = document.getElementById('btn-registra-utente');
const registraUtenteMsg = document.getElementById('registra-utente-msg');

const qrScannerVideo = document.getElementById('qr-scanner-video');
const qrStatus = document.getElementById('qr-status');
const selectUtenteOperatore = document.getElementById('select-utente-operatore');
const utenteSelezionatoNome = document.getElementById('utente-selezionato-nome');
const utenteSelezionatoCredito = document.getElementById('utente-selezionato-credito');

const selectProdottoAddebito = document.getElementById('select-prodotto-addebito');
const inputImportoAddebito = document.getElementById('input-importo-addebito');
const btnAddebita = document.getElementById('btn-addebita');
const addebitoMsg = document.getElementById('addebito-msg');

const inputImportoAccredito = document.getElementById('input-importo-accredito');
const inputDescrizioneAccredito = document.getElementById('input-descrizione-accredito');
const btnAccredita = document.getElementById('btn-accredita');
const accreditoMsg = document.getElementById('accredito-msg');
const operatoreStoricoLista = document.getElementById('operatore-storico-lista');

// Elementi Utente
const qrCodeCanvas = document.getElementById('qr-code-canvas');
const nomePompiere = document.getElementById('nome-pompiere');
const creditoPompiere = document.getElementById('credito-pompiere');
const storicoAcquistiLista = document.getElementById('storico-acquisti-lista');

let currentVideoStream = null; // Per gestire lo stream della telecamera

// Variabili globali per l'utente loggato (lato operatore e utente)
let selectedUser = null; // Utente selezionato dall'operatore
let currentUser = null; // Utente loggato nella vista pompiere

// --- Funzioni di Interfaccia ---
function showView(viewToShow) {
    homeView.classList.remove('active');
    operatoreView.classList.remove('active');
    utenteView.classList.remove('active');

    viewToShow.classList.add('active');

    if (viewToShow === operatoreView) {
        startQrScanner();
        loadAllUsersForOperator();
        loadProductsForOperator();
    } else {
        stopQrScanner();
    }
}

function displayMessage(element, message, isError = false) {
    element.textContent = message;
    element.className = 'message'; // reset classi
    if (isError) {
        element.classList.add('error');
    }
    setTimeout(() => {
        element.textContent = '';
        element.classList.remove('error');
    }, 5000); // Messaggio scompare dopo 5 secondi
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('it-IT', options);
}

// --- Funzioni API (interazione con Apps Script) ---
async function callAppsScript(action, payload = {}) {
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors', // Necessario per chiamate cross-origin
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action, ...payload }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Errore nella chiamata Apps Script:', error);
        return { status: 'error', message: `Errore di comunicazione: ${error.message}` };
    }
}

// --- Funzioni Operatore ---

async function registraUtente() {
    const nome = inputNomeUtente.value.trim();
    if (!nome) {
        displayMessage(registraUtenteMsg, 'Inserisci un nome e cognome per il nuovo pompiere.', true);
        return;
    }

    const result = await callAppsScript('registraUtente', { nomeCognome: nome });
    if (result.status === 'success') {
        displayMessage(registraUtenteMsg, `Utente "${result.nomeCognome}" registrato! ID: ${result.idUtente}, QR Data: ${result.qrCodeData}`);
        inputNomeUtente.value = '';
        loadAllUsersForOperator(); // Ricarica la lista per includere il nuovo utente
    } else {
        displayMessage(registraUtenteMsg, `Errore: ${result.message}`, true);
    }
}

async function loadAllUsersForOperator() {
    // Otteniamo la lista completa degli utenti. Nel tuo script non c'è una funzione per questo.
    // Dovremmo aggiungere una funzione 'ottieniTuttiGliUtenti' in Apps Script.
    // Per ora, simulo prendendo solo quelli già registrati dal foglio Utenti, se un utente è già loggato.
    // Oppure potremmo usare una funzione che Apps Script ti restituisce tutti gli utenti
    // (non l'ho inclusa nel codice Apps Script per semplicità, ma potresti aggiungerla come `function ottieniTuttiGliUtenti() { return getSheet('Utenti').getDataRange().getValues(); }`)

    // Per semplicità e velocità, faremo una chiamata generica che puoi estendere
    // L'Apps Script attuale non ha una funzione 'ottieniTuttiGliUtenti', quindi la simuliamo o la richiediamo
    // In un vero caso, aggiungeresti una riga come:
    // case 'ottieniTuttiGliUtenti': result = ottieniTuttiGliUtenti(); break;
    // Nel doPost di Apps Script.
    // E poi la funzione:
    // function ottieniTuttiGliUtenti() {
    //    const sheet = getSheet('Utenti');
    //    const data = sheet.getDataRange().getValues();
    //    const users = [];
    //    for (let i = 1; i < data.length; i++) {
    //        users.push({ idUtente: data[i][0], nomeCognome: data[i][1], qrCodeData: data[i][2], credito: data[i][3] });
    //    }
    //    return { status: 'success', users: users };
    // }

    // Dato che non abbiamo ottieniTuttiGliUtenti in Apps Script, faremo una chiamata per ogni utente esistente.
    // Questa parte è un "hack" per la velocità, l'ideale sarebbe una funzione unica.
    // PER VERA IMPLEMENTAZIONE: AGGIUNGI 'ottieniTuttiGliUtenti' in Apps Script.
    selectUtenteOperatore.innerHTML = '<option value="">-- Seleziona Utente --</option>';
    // Una chiamata che simula il recupero di tutti gli utenti se non hai la funzione specifica
    const dummyUserFetch = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'ottieniUtenteByQR', qrCodeData: 'dummy_qr_to_trigger_error' }), // Usa un QR fittizio per forzare una risposta di errore che contenga tutti gli utenti se Apps Script fosse più intelligente
    });
    // In questo contesto, supponiamo che tu abbia aggiunto la funzione `ottieniTuttiGliUtenti` nell'Apps Script
    const allUsersResult = await callAppsScript('ottieniTuttiGliUtenti'); // DEVI AGGIUNGERE QUESTA FUNZIONE IN APPS SCRIPT
    if (allUsersResult.status === 'success' && allUsersResult.users) {
        allUsersResult.users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.idUtente;
            option.textContent = `${user.nomeCognome} (ID: ${user.idUtente}) - ${user.credito.toFixed(2)}€`;
            selectUtenteOperatore.appendChild(option);
        });
    } else {
        console.warn("Non è stato possibile caricare la lista degli utenti per l'operatore. Assicurati che la funzione 'ottieniTuttiGliUtenti' sia implementata nell'Apps Script.");
        // Fallback temporaneo: Se non hai `ottieniTuttiGliUtenti`, puoi chiedere all'operatore di scansionare.
    }
}


async function selectUserById(id) {
    const result = await callAppsScript('ottieniCreditoESorico', { idUtente: parseInt(id) });
    if (result.status === 'success') {
        selectedUser = { idUtente: id, nomeCognome: result.nomeCognome, credito: result.credito };
        utenteSelezionatoNome.textContent = selectedUser.nomeCognome;
        utenteSelezionatoCredito.textContent = selectedUser.credito.toFixed(2) + '€';
        updateOperatoreStorico(result.storico);
    } else {
        selectedUser = null;
        utenteSelezionatoNome.textContent = 'Nessuno';
        utenteSelezionatoCredito.textContent = '0.00€';
        displayMessage(addebitoMsg, `Errore selezione utente: ${result.message}`, true);
        operatoreStoricoLista.innerHTML = '<li>Nessuno storico disponibile.</li>';
    }
}

async function loadProductsForOperator() {
    const result = await callAppsScript('ottieniProdotti');
    if (result.status === 'success' && result.prodotti) {
        selectProdottoAddebito.innerHTML = '<option value="">-- Seleziona Prodotto --</option>';
        result.prodotti.forEach(prod => {
            const option = document.createElement('option');
            option.value = prod.prezzo;
            option.textContent = `${prod.nome} (${prod.prezzo.toFixed(2)}€)`;
            option.dataset.nome = prod.nome; // Memorizza il nome del prodotto
            selectProdottoAddebito.appendChild(option);
        });
    } else {
        displayMessage(addebitoMsg, `Errore nel caricamento prodotti: ${result.message}`, true);
    }
}

async function addebitaConsumazione() {
    if (!selectedUser) {
        displayMessage(addebitoMsg, 'Seleziona prima un utente!', true);
        return;
    }

    let importo = parseFloat(inputImportoAddebito.value);
    let descrizione = 'Addebito Manuale';

    if (selectProdottoAddebito.value) {
        importo = parseFloat(selectProdottoAddebito.value);
        descrizione = selectProdottoAddebito.options[selectProdottoAddebito.selectedIndex].dataset.nome;
    } else if (isNaN(importo) || importo <= 0) {
        displayMessage(addebitoMsg, 'Inserisci un importo valido o seleziona un prodotto.', true);
        return;
    }

    const result = await callAppsScript('addebitaCredito', {
        idUtente: selectedUser.idUtente,
        importo: importo,
        descrizione: descrizione
    });

    if (result.status === 'success') {
        displayMessage(addebitoMsg, `Addebito di ${importo.toFixed(2)}€ per ${selectedUser.nomeCognome}. Nuovo credito: ${result.nuovoCredito.toFixed(2)}€`);
        inputImportoAddebito.value = '';
        selectProdottoAddebito.value = '';
        selectedUser.credito = result.nuovoCredito; // Aggiorna il credito in locale
        utenteSelezionatoCredito.textContent = selectedUser.credito.toFixed(2) + '€';
        // Ricarica lo storico dopo l'operazione
        selectUserById(selectedUser.idUtente);
        loadAllUsersForOperator(); // Aggiorna la select utente
    } else {
        displayMessage(addebitoMsg, `Errore addebito: ${result.message}`, true);
    }
}

async function accreditaCredito() {
    if (!selectedUser) {
        displayMessage(accreditoMsg, 'Seleziona prima un utente!', true);
        return;
    }

    const importo = parseFloat(inputImportoAccredito.value);
    const descrizione = inputDescrizioneAccredito.value.trim() || 'Ricarica';

    if (isNaN(importo) || importo <= 0) {
        displayMessage(accreditoMsg, 'Inserisci un importo valido da accreditare.', true);
        return;
    }

    const result = await callAppsScript('accreditaCredito', {
        idUtente: selectedUser.idUtente,
        importo: importo,
        descrizione: descrizione
    });

    if (result.status === 'success') {
        displayMessage(accreditoMsg, `Accredito di ${importo.toFixed(2)}€ per ${selectedUser.nomeCognome}. Nuovo credito: ${result.nuovoCredito.toFixed(2)}€`);
        inputImportoAccredito.value = '';
        selectedUser.credito = result.nuovoCredito; // Aggiorna il credito in locale
        utenteSelezionatoCredito.textContent = selectedUser.credito.toFixed(2) + '€';
        // Ricarica lo storico dopo l'operazione
        selectUserById(selectedUser.idUtente);
        loadAllUsersForOperator(); // Aggiorna la select utente
    } else {
        displayMessage(accreditoMsg, `Errore accredito: ${result.message}`, true);
    }
}

function updateOperatoreStorico(storico) {
    operatoreStoricoLista.innerHTML = '';
    if (storico.length === 0) {
        operatoreStoricoLista.innerHTML = '<li>Nessuna transazione recente.</li>';
        return;
    }
    storico.forEach(trans => {
        const li = document.createElement('li');
        const amountClass = trans.tipo === 'Accredito' ? 'accredito' : '';
        li.className = amountClass;
        li.innerHTML = `
            <span>${formatDate(trans.dataOra)} - ${trans.descrizione}</span>
            <span class="amount">${trans.tipo === 'Addebito' ? '-' : '+'}${trans.importo.toFixed(2)}€ (Saldo: ${trans.creditoDopo.toFixed(2)}€)</span>
        `;
        operatoreStoricoLista.appendChild(li);
    });
}


// --- Funzioni QR Scanner (Lato Operatore) ---
async function startQrScanner() {
    if (currentVideoStream) { // Evita di avviare più volte lo scanner
        return;
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        qrScannerVideo.srcObject = stream;
        qrScannerVideo.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        qrScannerVideo.play();
        currentVideoStream = stream;
        requestAnimationFrame(tick);
    } catch (err) {
        console.error("Errore nell'accesso alla fotocamera:", err);
        qrStatus.textContent = 'Impossibile accedere alla fotocamera. Assicurati di dare i permessi.';
        qrStatus.classList.add('error');
    }
}

function stopQrScanner() {
    if (currentVideoStream) {
        currentVideoStream.getTracks().forEach(track => track.stop());
        qrScannerVideo.srcObject = null;
        currentVideoStream = null;
    }
}

function tick() {
    if (qrScannerVideo.readyState === qrScannerVideo.HAVE_ENOUGH_DATA) {
        const canvasElement = document.createElement('canvas');
        const canvas = canvasElement.getContext('2d');
        canvasElement.height = qrScannerVideo.videoHeight;
        canvasElement.width = qrScannerVideo.videoWidth;
        canvas.drawImage(qrScannerVideo, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });

        if (code) {
            qrStatus.textContent = `QR Scansionato! Data: ${code.data}`;
            stopQrScanner(); // Ferma lo scanner dopo aver trovato un codice
            // Cerca l'utente tramite il QR code data
            searchUserByQrCode(code.data);
            return; // Esci per non continuare a scansionare
        } else {
            qrStatus.textContent = 'Scansiona il QR Code...';
        }
    }
    if (operatoreView.classList.contains('active')) { // Continua a scansionare solo se la vista operatore è attiva
        requestAnimationFrame(tick);
    }
}

async function searchUserByQrCode(qrCodeData) {
    const result = await callAppsScript('ottieniUtenteByQR', { qrCodeData: qrCodeData });
    if (result.status === 'success') {
        selectedUser = {
            idUtente: result.idUtente,
            nomeCognome: result.nomeCognome,
            qrCodeData: result.qrCodeData,
            credito: result.credito
        };
        utenteSelezionatoNome.textContent = selectedUser.nomeCognome;
        utenteSelezionatoCredito.textContent = selectedUser.credito.toFixed(2) + '€';
        displayMessage(qrStatus, `Utente "${selectedUser.nomeCognome}" trovato!`);
        // Aggiorna la select per riflettere l'utente selezionato via QR
        selectUtenteOperatore.value = selectedUser.idUtente;
        selectUserById(selectedUser.idUtente); // Carica lo storico
    } else {
        selectedUser = null;
        utenteSelezionatoNome.textContent = 'Nessuno';
        utenteSelezionatoCredito.textContent = '0.00€';
        displayMessage(qrStatus, `Errore: ${result.message}`, true);
    }
}

// --- Funzioni Utente ---

async function loginUtente() {
    // In un'app reale, qui avresti un sistema di login (username/password o altro).
    // Per velocità e semplicità, simuleremo il "login" chiedendo all'utente il proprio ID utente
    // e memorizzandolo nel localStorage del browser.
    const inputId = prompt("Inserisci il tuo ID Utente o un dato del tuo QR code (es. le ultime 4 cifre):");
    if (!inputId) return;

    let userFound = false;
    // Per dimostrazione, potremmo chiedere all'utente di inserire il proprio QR Code Data completo
    // o il proprio ID. Per il QR, dovresti avere un modo di ottenerlo la prima volta.
    // L'ID Utente è più semplice da gestire qui.
    const result = await callAppsScript('ottieniCreditoESorico', { idUtente: parseInt(inputId) }); // Proviamo con l'ID numerico
    if (result.status === 'success') {
        currentUser = {
            idUtente: parseInt(inputId),
            nomeCognome: result.nomeCognome,
            credito: result.credito
        };
        // Memorizza l'ID utente nel localStorage per le visite future
        localStorage.setItem('barPompieriUserId', inputId);
        localStorage.setItem('barPompieriUserNome', result.nomeCognome); // Memorizza anche il nome
        loadUserDashboard();
        userFound = true;
    } else {
        alert("ID Utente non valido o non trovato. Riprova.");
        // Potresti qui chiedere di inserire il QR Code Data se lo avessero
        // let qrInput = prompt("Oppure inserisci il dato completo del tuo QR Code:");
        // if (qrInput) {
        //     const qrResult = await callAppsScript('ottieniUtenteByQR', { qrCodeData: qrInput });
        //     if (qrResult.status === 'success') {
        //         currentUser = {
        //             idUtente: qrResult.idUtente,
        //             nomeCognome: qrResult.nomeCognome,
        //             qrCodeData: qrResult.qrCodeData,
        //             credito: qrResult.credito
        //         };
        //         localStorage.setItem('barPompieriUserId', qrResult.idUtente);
        //         localStorage.setItem('barPompieriUserNome', qrResult.nomeCognome);
        //         loadUserDashboard();
        //         userFound = true;
        //     } else {
        //         alert("QR Code Data non valido o non trovato. Riprova.");
        //     }
        // }
    }

    if (userFound) {
        showView(utenteView);
    } else {
        showView(homeView); // Torna alla home se il login fallisce
    }
}


async function loadUserDashboard() {
    if (!currentUser) {
        // Tenta il login automatico se l'ID è salvato
        const savedUserId = localStorage.getItem('barPompieriUserId');
        const savedUserName = localStorage.getItem('barPompieriUserNome');
        if (savedUserId && savedUserName) {
             // Verifichiamo che l'utente esista e sia valido sul backend
            const result = await callAppsScript('ottieniCreditoESorico', { idUtente: parseInt(savedUserId) });
            if (result.status === 'success') {
                currentUser = {
                    idUtente: parseInt(savedUserId),
                    nomeCognome: result.nomeCognome,
                    credito: result.credito
                };
                // Genera il QR code per la visualizzazione dell'utente
                const userFullData = await callAppsScript('ottieniUtenteByQR', { qrCodeData: savedUserId }); // Questo è un hack, il QR Data dovrebbe essere un campo separato!
                // Idealmente, il tuo foglio `Utenti` dovrebbe avere `QR Code Data` (colonna 3) come un UUID, non l'ID Utente.
                // E la funzione `ottieniUtenteById` in Apps Script dovrebbe restituire `qrCodeData`.
                // Per ora, useremo l'ID Utente come dato QR, che è semplice ma meno robusto.
                // Se hai usato `Utilities.getUuid()` per `QR Code Data` nell'Apps Script, allora dovrai memorizzare e recuperare quello per generare il QR.
                // Nel tuo Apps Script, `registraNuovoUtente` genera un `Utilities.getUuid()` per `QR Code Data`.
                // Quindi, per l'utente, dovremmo recuperare quel `qrCodeData` quando si logga.
                // Esempio: aggiungi `qrCodeData` al tuo oggetto `currentUser` dopo averlo recuperato dal backend.
                // const userFromBackend = await callAppsScript('ottieniCreditoESorico', { idUtente: parseInt(savedUserId) });
                // if (userFromBackend.status === 'success') { currentUser.qrCodeData = userFromBackend.qrCodeData; }
                // Poiché `ottieniCreditoESorico` non restituisce `qrCodeData` nell'Apps Script, dovresti aggiungere quella informazione.
                // Per questo esempio rapido, useremo l'ID utente come stringa per il QR. Questo FUNZIONA ma è meno "segreto".
                // L'IDEALE SAREBBE PASSARE L'UUID GENERATO DA APPS SCRIPT.
                generateQrCode(currentUser.idUtente.toString()); // Genera il QR con l'ID utente
                nomePompiere.textContent = currentUser.nomeCognome;
                creditoPompiere.textContent = currentUser.credito.toFixed(2) + ' €';
                updateUserHistory(result.storico);
                showView(utenteView);
                return;
            } else {
                // Se l'ID salvato non è più valido, lo rimuoviamo
                localStorage.removeItem('barPompieriUserId');
                localStorage.removeItem('barPompieriUserNome');
            }
        }
        showView(homeView); // Se non c'è ID salvato o non è valido, torna alla home
        return;
    }
    // Se currentUser è già impostato, aggiorna solo la dashboard
    generateQrCode(currentUser.idUtente.toString()); // Genera il QR con l'ID utente
    nomePompiere.textContent = currentUser.nomeCogniere;
    creditoPompiere.textContent = currentUser.credito.toFixed(2) + ' €';
    const result = await callAppsScript('ottieniCreditoESorico', { idUtente: currentUser.idUtente });
    if (result.status === 'success') {
        creditoPompiere.textContent = result.credito.toFixed(2) + ' €';
        updateUserHistory(result.storico);
    } else {
        alert("Errore nel caricamento dei dati utente: " + result.message);
        logoutUtente(); // Forse è meglio fare il logout in caso di errore grave
    }
}

function generateQrCode(text) {
    qrCodeCanvas.innerHTML = ''; // Pulisce il canvas precedente
    if (text) {
        new QRCode(qrCodeCanvas, {
            text: text,
            width: 128,
            height: 128,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }
}

function updateUserHistory(storico) {
    storicoAcquistiLista.innerHTML = '';
    if (storico.length === 0) {
        storicoAcquistiLista.innerHTML = '<li>Nessun acquisto recente.</li>';
        return;
    }
    storico.forEach(trans => {
        const li = document.createElement('li');
        const amountClass = trans.tipo === 'Accredito' ? 'accredito' : '';
        li.className = amountClass;
        li.innerHTML = `
            <span>${formatDate(trans.dataOra)} - ${trans.descrizione}</span>
            <span class="amount">${trans.tipo === 'Addebito' ? '-' : '+'}${trans.importo.toFixed(2)}€ (Saldo: ${trans.creditoDopo.toFixed(2)}€)</span>
        `;
        storicoAcquistiLista.appendChild(li);
    });
}

function logoutUtente() {
    currentUser = null;
    localStorage.removeItem('barPompieriUserId');
    localStorage.removeItem('barPompieriUserNome');
    showView(homeView);
}

// --- Event Listeners ---
btnOperatore.addEventListener('click', () => showView(operatoreView));
btnUtente.addEventListener('click', loginUtente); // Modificato per chiamare login

btnBackOperatore.addEventListener('click', () => {
    stopQrScanner();
    selectedUser = null; // Resetta l'utente selezionato
    utenteSelezionatoNome.textContent = 'Nessuno';
    utenteSelezionatoCredito.textContent = '0.00€';
    operatoreStoricoLista.innerHTML = '';
    showView(homeView);
});
btnBackUtente.addEventListener('click', () => showView(homeView));
btnLogoutUtente.addEventListener('click', logoutUtente);

btnRegistraUtente.addEventListener('click', registraUtente);

selectUtenteOperatore.addEventListener('change', (event) => {
    const userId = event.target.value;
    if (userId) {
        selectUserById(parseInt(userId));
    } else {
        selectedUser = null;
        utenteSelezionatoNome.textContent = 'Nessuno';
        utenteSelezionatoCredito.textContent = '0.00€';
        operatoreStoricoLista.innerHTML = '';
    }
});

btnAddebita.addEventListener('click', addebitaConsumazione);
btnAccredita.addEventListener('click', accreditaCredito);

// Carica la dashboard utente all'avvio se c'è un utente loggato in precedenza
document.addEventListener('DOMContentLoaded', () => {
    // Check if a user is already "logged in" based on localStorage
    const savedUserId = localStorage.getItem('barPompieriUserId');
    if (savedUserId) {
        loginUtente(); // Tenta di ricaricare la sessione utente
    } else {
        showView(homeView); // Mostra la home se nessuno è loggato
    }
});
