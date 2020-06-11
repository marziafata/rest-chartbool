$(document).ready(function() {

// Utilizziamo la libreria chart.js per creare dei bellissimi grafici che mostreranno dei dati aggregati
// Fate una chiamata ajax per recuperare la lista di vendite fatte dai venditori di un'azienda nel 2017
// http://157.230.17.132:4010/sales
// Con questi dati create:
// un grafico a linee per rappresentare le vendite di ogni mese (occhio alla gestione dei colori)
// un grafico a torta per rappresentare le vendite di ogni venditore


//creo la variabile dell'url di chiamata ajax
var url_personale = "http://157.230.17.132:4010/sales";


        // intercetto il click sul pulsante di ricerca
        $('.pulsante_inserisci').click(function(){

            //leggo la select dei nomi
            var select_venditore = $('#salesman').val();
            console.log(select_venditore);

            //leggo la select dei mesi
            var select_mesi = $('.months').val();
            console.log(select_mesi);
            var select_mesi_giusta = moment(select_mesi, 'YYYY/MM/DD').format('l');

            //leggo il testo nell'input
            var nuova_vendita = $('.testo_inserimento').val().trim();
            console.log(nuova_vendita);
            // resetto l'input
            $('#testo-ricerca').val('');

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

                },// fine success
                'error': function () {
                    alert('Si è verificato un errore...');
                }// fine error

            }); //fine ajax

        });



    //chiamata ajax
    $.ajax({
        'url': url_personale,
        'method': 'GET',
        'success': function (data) { // + log dei dati (data) da fare sempre quando iniziamo => vediamo cosa arriva dall'API

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

            //creo un oggetto vuoto dove andare a inserire i venditori
            var venditori = {};

            //ciclo data per tirarmi fuori gli elementi che mi servono. In questo caso l'API mi restituisce un array di oggetti che posso ciclare per tirare fuori i singoli oggetti su cui applicare la dot.notation per ottenere gli elementi che mi servono, MA! non è sempre valido. Ogni API è diverso, prima guardare sempre cosa contiene l'API per valutare come tirare fuori i dati in base a come è costruito => non c'è una regola! Dipende da come è costruita l'API.
            for (var i = 0; i < data.length; i++) {
                //mi estraggo un oggetto alla volta
                var vendita_corrente = data[i];

                //con la dot notation recupero dall'oggetto i dati che mi servono per costruire i grafici

                //estrapolo le informazioni:
                //la data
                var giorno_corrente = vendita_corrente.date;
                //importo momenti in tutte le lingue (url locales in html) per avere i mesi in italiano
                moment.locale('it');
                //estrapolo il mese con moment nel formato esteso
                var mese_corrente = moment(giorno_corrente, 'DD/MM/YYYY').format('MMMM');
                //l'importo delle vendite
                var importo_corrente = parseInt(vendita_corrente.amount);

                //i venditori
                var venditore_corrente = vendita_corrente.salesman;


                //LINE
                //prendo l'oggetto[accedo alla chiave con il suo valore] e aggiungo l'importo
                mese[mese_corrente] += importo_corrente;

                //PIE
                //verifico se l'oggetto dei venditori contiene già la chiave del venditore corrente
                if (!venditori.hasOwnProperty(venditore_corrente)) {
                    // il venditore corrente NON è presente nell'oggetto dei venditori
                    // creo una nuova chiave con il venditore corrente
                    // e assegno il valore con la vendita corrente
                    //prendo l'oggetto[accedo alla chiave con il suo valore]
                    venditori[venditore_corrente] = importo_corrente;
                } else {
                    //se è già presente, somma il valore della vendita corrispondente a quello già inserito
                    venditori[venditore_corrente] += importo_corrente;
                }//fine if pie

            };//fine ciclo for

    
            //GRAFICO LINE VENDITE MENSILI
            //creo una variabile con le chiavi dell'oggetto mese => corrisponde al mese in esame
            var chiavi_line = Object.keys(mese);
            //creo  una variabile con i valori dell'oggetto mese => corrisponde all'importo delle vendite per quel mese
            var valori_line = Object.values(mese);


            var ctx = $('#linee-mese')[0].getContext('2d');

            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chiavi_line,
                    datasets: [{
                        label: '€',
                        data: valori_line,
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

            //GRAFICO PIE
            //creo una variabile con le chiavi dell'oggetto venditori => corrisponde al nome del venditore
            var chiavi = Object.keys(venditori);
            //creo  una variabile con i valori dell'oggetto venditori => corrisponde all'importo delle vendite
            var valori = Object.values(venditori);

            var ctx = $('#torta-venditore')[0].getContext('2d');

            var myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: chiavi,
                    datasets: [{
                        label: '€',
                        data: valori,
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



        },// fine success
        'error': function () {
            alert('Si è verificato un errore...');
        }// fine error

    }); //fine ajax

});//fine document ready
