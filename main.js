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
            //ciclo data per tirarmi fuori gli elementi che mi servono. In questo caso l'API mi restituisce un array di oggetti che posso ciclare per tirare fuori i singoli oggetti su cui applicare la dot.notation per ottenere gli elementi che mi servono, MA! non è sempre valido. Ogni API è diverso, prima guardare sempre cosa contiene l'API per valutare come tirare fuori i dati in base a come è costruito => non c'è una regola! Dipende da come è costruita l'API.
            for (var i = 0; i < data.length; i++) {
                //recupero tutti gli oggetti contenuti dentro l'array
                var oggetti = data[i];
                console.log(oggetti);
                //con la dot notation recupero dall'oggetto i dati che mi servono per costruire i grafici

                //per il grafico LINE:
                //la data
                var giorno = data[i].date;
                console.log('data: ');
                console.log(giorno);
                //l'importo delle vendite
                var importo = data[i].amount;
                console.log('euro: ');
                console.log(importo);

                //per il grafico PIE:
                //i venditori
                var venditore = data[i].salesman;
                console.log('venditore: ');
                console.log(venditore);

            };//fine ciclo for

            //array contenitore degli oggetti
            var array_restituito = data;
            console.log(array_restituito);

        },// fine success
        'error': function () {
            alert('Si è verificato un errore...');
        }// fine error

    }); //fine ajax

});//fine document ready
