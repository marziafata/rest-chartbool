$(document).ready(function() {

    //creo la variabile dell'url di chiamata ajax
    var url_personale = "http://157.230.17.132:4010/sales";
    //importo moment in tutte le lingue (url locales in html) per avere i mesi in italiano
    moment.locale('it');

    // variabili globali dei grafici per poter gestire gli aggiornamenti
    var grafico_linee;
    var grafico_torta;

    disegna_grafici(false);

    // intercetto il click sul pulsante di ricerca
    $('.pulsante_inserisci').click(function(){
        //leggo i valori delle select e dell'input
        var select_venditore = $('#salesman').val();
        var select_mesi = $('.months').val();
        var nuova_vendita = $('.testo_inserimento').val();
        //trasformo la data nel formato corretto
        var select_mesi_giusta = moment(select_mesi, 'YYYY/MM/DD').format('l');

        //creo una variabile con i dati dell'oggetto recuperati
        var nuovo_inserimento = {
            'salesman': select_venditore,
            'amount': nuova_vendita,
            'date': select_mesi_giusta
        };

        // chiamata ajax POST
        $.ajax({
            'url': url_personale,
            'type': 'POST',
            'data': nuovo_inserimento,
            'success': function (data) {

                disegna_grafici(true);
            },
            'error': function() {
                alert('Si è verificato un errore...');
            }// fine error
        });//fine ajax

    });//fine click


    // funzione per recuperare i dati e disegnare i grafici
    // riceve come parametro una variabile booleana:
    // se aggiorna == true, significa che i grafici sono già stati disegnati e bisogna solo aggiornarli
    // se aggiorna == false, significa che i grafici non sono ancora stati disegnati
    //creo una funzione della chiamata ajax che estrapola i dati e disegna i grafici
    function disegna_grafici(aggiorna) {
        //chiamata ajax
        $.ajax({
            'url': url_personale,
            'method': 'GET',
            'success': function (data) { // + log dei dati (data) da fare sempre quando iniziamo => vediamo cosa arriva dall'API

                //GRAFICO LINE VENDITE MENSILI
                //salvo in una variabile l'oggetto che contiene i mesi con i valori delle vendite mensili (restituito dalla funzione)
                var dati_mensili = oggetto_dati_vendite_mensili(data);
                //creo una variabile con le chiavi dell'oggetto (i mesi), che saranno le etichette del grafico
                var chiavi_line = Object.keys(dati_mensili);
                //creo una variabile con i valori che saranno i dati del grafico
                var valori_line = Object.values(dati_mensili);

                if(!aggiorna) {
                    //disegno per la prima volta il grafico
                    //disegno il grafico passandogli i parametri delle etichette e dei dati
                    disegna_linee(chiavi_line, valori_line);
                } else {
                    //aggiorno il grafico
                    //modifico i dati del grafico impostando l'array con i dati aggiornati
                    grafico_linee.config.data.datasets[0].data = valori_line;
                    grafico_linee.update();
                }//fine if


                //GRAFICO PIE
                //salvo in una variabile l'oggetto che contiene i venditori con le loro vendite (restituito dalla fuunzione)
                var dati_venditori = oggetto_vendite_venditori(data);
                //creo una variabile con le chiavi dell'oggetto (i venditori), che saranno le etichette del grafico
                var chiavi = Object.keys(dati_venditori);
                //creo una variabile con i valori che saranno i dati del grafico
                var valori = Object.values(dati_venditori);

                if(!aggiorna) {
                    //disegno per la prima volta il grafico
                    //disegno il grafico passandogli i parametri delle etichette e dei dati
                    disegna_torta(chiavi, valori);
                } else {
                    //aggiorno il grafico
                    //modifico i dati del grafico impostando l'array con i dati aggiornati
                    grafico_torta.config.data.datasets[0].data = valori;
                    grafico_torta.update();
                }//fine if


            },// fine success
            'error': function () {
                alert('Si è verificato un errore...');
            }// fine error

        }); //fine ajax
    }// fine funzione disegna grafici


    function oggetto_dati_vendite_mensili(dati) {
        //creo un oggetto con i mesi: posso scriverlo a mano perchè i mesi sono 12 e non cambiano, oppure farli scrivere a moment
        var mese = {
            'gennaio': 0,
            'febbraio': 0,
            'marzo': 0,
            'aprile': 0,
            'maggio': 0,
            'giugno': 0,
            'luglio': 0,
            'agosto': 0,
            'settembre': 0,
            'ottobre': 0,
            'novembre': 0,
            'dicembre': 0
        };//fine oggetto mese


        //ciclo dati per tirarmi fuori gli elementi che mi servono. In questo caso l'API mi restituisce un array di oggetti che posso ciclare per tirare fuori i singoli oggetti su cui applicare la dot.notation per ottenere gli elementi che mi servono, MA! non è sempre valido. Ogni API è diverso, prima guardare sempre cosa contiene l'API per valutare come tirare fuori i dati in base a come è costruito => non c'è una regola! Dipende da come è costruita l'API.
        for (var i = 0; i < dati.length; i++) {
            //recupero la vendita corrente che è un oggetto
            var vendita_corrente = dati[i];
            //l'importo delle vendite
            var importo_corrente = parseInt(vendita_corrente.amount);
            //recupero la data della vendita corrente
            var giorno_corrente = vendita_corrente.date;
            //estrapolo il mese con moment nel formato esteso
            var mese_corrente = moment(giorno_corrente, 'DD/MM/YYYY').format('MMMM');
            //aggiungo all'oggetto mese i valori delle vendite
            mese[mese_corrente] += importo_corrente;
        }//fine ciclo for
        return mese;
    }//fine funzione oggetto dati vendite mensili

    function oggetto_vendite_venditori(dati) {

        //creo un oggetto vuoto dove andare a inserire i venditori e le vendite corrispondenti
        var venditori = {};
        var totale_vendite = 0;

        for (var i = 0; i < dati.length; i++) {
            //tecupero la vendita corrente
            var vendita_corrente = dati[i];
            //con la dot notation recupero l'importo delle vendite
            var importo_corrente = parseInt(vendita_corrente.amount);
            //recupero i nomi dei venditori
            var venditore_corrente = vendita_corrente.salesman;
            //verifico se l'oggetto dei venditori contiene già la chiave del venditore corrente
            if (!venditori.hasOwnProperty(venditore_corrente)) {
                // il venditore corrente NON è presente nell'oggetto dei venditori
                // creo una nuova chiave con il venditore corrente
                // e assegno il valore con la vendita corrente
                //prendo l'oggetto[creo la chiave con il nome corrente] = assegno il valore
                venditori[venditore_corrente] = importo_corrente;
            } else {
                //prendo l'oggetto[leggo la chiave con il nome corrente] = sommo il valore a quello già presente
                venditori[venditore_corrente] += importo_corrente;
            }//fine if vendite venditori (pie)

            //calcolo il totale delle vendite che mi serve per il calcolo delle percentuali
            totale_vendite += importo_corrente;

        };//fine ciclo for

        //TRASFORMARE TUTTI I VALORI IN PERCENTUALI
        //ciclo l'oggetto
        for (var nome_venditore in venditori) {
            //recupero l'importo totale di questo venditore: dall'oggetto venditori accedo al valore della [chiave]
            var importo_venditore = venditori[nome_venditore];
            //calcolo la percentuale delle sue vendite sul totale e applico tofixed per avere solo un numero dopo la virgola
            var percentuale = (importo_venditore * 100 / totale_vendite).toFixed(1);
            //imposto la percentuale come valori_line
            venditori[nome_venditore] = percentuale;
        }

        return venditori;

    }//fine funzione dati vendite venditori

    //funzione per creare il grafico torta
    function disegna_torta(etichette, dati) {
        var ctx = $('#torta-venditore')[0].getContext('2d');

        grafico_torta = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: etichette,
                datasets: [{
                    label: '€',
                    data: dati,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Grafico delle vendite per venditore:',
                    fontSize: 25
                }
            }
        });//fine grafico PIE
    }//fine funzione grafico torta

    //funzione per disegnare il grafico linee
    function disegna_linee(etichette, dati) {

        var ctx = $('#linee-mese')[0].getContext('2d');

        grafico_linee = new Chart(ctx, {
            type: 'line',
            data: {
                labels: etichette,
                datasets: [{
                    label: '€',
                    data: dati,
                    pointBorderColor: 'rgba(255, 99, 132, 1)',
                    pointBackgroundColor: 'rgba(255, 99, 132, 0.5)',
                    pointBorderWidth: 1,
                    borderColor: 'rgba(0, 0, 0, 0,7)',
                    fill: false,
                    borderWidth: 3
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Grafico delle vendite per mese:',
                    fontSize: 25
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });//fine grafico line
    }//fine funzione grafico linee

});//fine document ready
