$(document).ready(function() {

// Utilizziamo la libreria chart.js per creare dei bellissimi grafici che mostreranno dei dati aggregati
// Fate una chiamata ajax per recuperare la lista di vendite fatte dai venditori di un'azienda nel 2017
// http://157.230.17.132:4010/sales
// Con questi dati create:
// un grafico a linee per rappresentare le vendite di ogni mese (occhio alla gestione dei colori)
// un grafico a torta per rappresentare le vendite di ogni venditore


    //chiamata ajax
    $.ajax({
        'url': "http://157.230.17.132:4010/sales",
        'method': 'GET',
        'success': function (data) {

            var venditori = {};
            var mese = {};
            //ciclo data per tirarmi fuori gli elementi che mi servono. In questo caso l'API mi restituisce un array di oggetti che posso ciclare per tirare fuori i singoli oggetti su cui applicare la dot.notation per ottenere gli elementi che mi servono, MA! non è sempre valido. Ogni API è diverso, prima guardare sempre cosa contiene l'API per valutare come tirare fuori i dati in base a come è costruito => non c'è una regola! Dipende da come è costruita l'API.
            for (var i = 0; i < data.length; i++) {
                // recupero l'elemento corrente, che corrisponde ad un oggetto
                // questo oggetto rappresenta le vendite di un determinato venditore in una determinata data
                var vendita_corrente = data[i];
                //con la dot notation recupero dall'oggetto i dati che mi servono per costruire i grafici

                //per il grafico LINE:
                //la data
                var giorno_corrente = data[i].date;

                //estrapolo il mese con moment
                var mese_corrente = moment(giorno_corrente, 'DD/MM/YYYY').format('MMMM');
                //l'importo delle vendite
                var importo_corrente = data[i].amount;

                //per il grafico PIE:
                //i venditori
                var venditore_corrente = data[i].salesman;


                //verifico se l'oggetto dei venditori contiene già la chiave del venditore corrente
                if (!venditori.hasOwnProperty(venditore_corrente)) {
                    // il venditore corrente NON è presente nell'oggetto dei venditori
                    // creo una nuova chiave con il venditore corrente
                    // e assegno il valore con la vendita corrente
                    venditori[venditore_corrente] = importo_corrente;
                } else {
                    //se è già presente, somma il valore della vendita corrispondente a quello già inserito
                    venditori[venditore_corrente] += importo_corrente;
                }

                // verifico se l'oggetto dei mesi contiene già la chiave del mese corrente
                if (!mese.hasOwnProperty(mese_corrente)) {
                    // il mese corrente NON è presente nell'oggetto dei mesi
                    // creo una nuova chiave con il mese corrente
                    // e assegno il valore con la vendita corrente
                    mese[mese_corrente] = importo_corrente;
                } else {
                    //se è già presente, somma il valore della vendita corrispondente a quello già inserito
                    mese[mese_corrente] += importo_corrente;
                }


            };//fine ciclo for


            //creo una variabile con le chiavi dell'oggetto venditori => corrisponde al nome del venditore
            var chiavi = Object.keys(venditori);
            //creo  una variabile con i valori dell'oggetto venditori => corrisponde all'importo delle vendite
            var valori = Object.values(venditori);

            //primo grafico torta
            var ctx = $('#torta-venditore')[0].getContext('2d');

            var myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: chiavi,
                    datasets: [{
                        label: '# of Votes',
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
                        text: 'Grafico delle vendite per venditore:'
                    }
                }
            });

            //creo una variabile con le chiavi dell'oggetto mese => corrisponde al mese in esame
            var chiavi_line = Object.keys(mese);
            console.log(chiavi_line);
            //creo  una variabile con i valori dell'oggetto mese => corrisponde all'importo delle vendite per quel mese
            var valori_line = Object.values(mese);
            console.log(valori_line);

            //Secondo grafico linea
            var ctx = $('#linee-mese')[0].getContext('2d');

            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chiavi_line,
                    datasets: [{
                        label: '€',
                        data: valori_line,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(200, 99, 132, 0.2)',
                            'rgba(80, 20, 235, 0.2)',
                            'rgba(300, 50, 86, 0.2)',
                            'rgba(255, 100, 100, 0.2)',
                            'rgba(0, 102, 255, 0.2)',
                            'rgba(90, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(200, 99, 132, 1)',
                            'rgba(80, 20, 235, 1)',
                            'rgba(300, 50, 86, 1)',
                            'rgba(255, 100, 100, 1)',
                            'rgba(0, 102, 255, 1)',
                            'rgba(90, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Grafico delle vendite per mese:'
                    }
                }
            });

        },// fine success
        'error': function () {
            alert('Si è verificato un errore...');
        }// fine error

    }); //fine ajax

});//fine document ready
