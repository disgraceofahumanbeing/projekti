'use strict';

(function (){
    let kirjaIdkentta;
    let nimikentta;
    let tekijakentta;
    let painovuosikentta;
    let lukumaarakentta;
    let viestialue;

    document.addEventListener('DOMContentLoaded', alusta);

    function alusta(){
        kirjaIdkentta = document.getElementById('kirjaid');
        nimikentta = document.getElementById('nimi');
        tekijakentta = document.getElementById('tekija');
        painovuosikentta = document.getElementById('painovuosi');
        lukumaarakentta = document.getElementById('lukumaara');

        viestialue = document.getElementById('viestialue');
        document.getElementById('laheta').addEventListener('click',laheta);
    }
    async function laheta(){
        const kirjaID = kirjaIdkentta.value;
        const nimi = nimikentta.value;
        const tekija = tekijakentta.value;
        const painovuosi = painovuosikentta.value;
        const lukumaara = lukumaarakentta.value;
        try{
            const optiot = {
                method: 'POST',
                body: JSON.stringify({
                    kirjaID,
                    nimi,
                    tekija,
                    painovuosi,
                    lukumaara
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const data = await fetch('/lisaa', optiot);
            const tulos = await data.json();
            if(tulos.viesti){
                viestialue.textContent = tulos.viesti;
            }
        }
        catch(virhe){
            console.log(virhe.message)
        }
    }
})();