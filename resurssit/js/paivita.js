'use strict';

(function(){
let kirjaIdkentta;
let nimikentta;
let tekijakentta;
let painovuosikentta;
let lukumaarakentta;
let viestialue;

let hakutila=true;

document.addEventListener('DOMContentLoaded', alusta);

    function alusta(){
        kirjaIdkentta=document.getElementById('kirjaid');
        nimikentta=document.getElementById('nimi');
        tekijakentta=document.getElementById('tekija');
        painovuosikentta=document.getElementById('painovuosi');
        lukumaarakentta=document.getElementById('lukumaara');

        viestialue=document.getElementById('viestialue');

        vaihdaLukutila(hakutila);

        document.getElementById('laheta').addEventListener('click', laheta);
    }

    async function laheta(){
        viestialue.textContent='';
        try{
            if(hakutila){
                const num=kirjaIdkentta.value;
                const optiot={
                    method: 'POST',
                    body: JSON.stringify({kirjaID:num}),
                    headers:{'Content-Type':'application/json'}
                };
                const data=await fetch('/yksi', optiot);
                const tulos=await data.json();
                if(tulos.viesti){
                    viestialue.textContent=tulos.viesti;
                }
                else{
                    paivitaKentat(tulos);
                }
            }
            else{
                //hakutila oli false
                const kirjaID=kirjaIdkentta.value;
                const nimi=nimikentta.value;
                const tekija=tekijakentta.value;
                const painovuosi=painovuosikentta.value;
                const lukumaara=lukumaarakentta.value;

                const optiot={
                    method: 'POST',
                    body: JSON.stringify({
                        kirjaID,
                        nimi,
                        tekija,
                        painovuosi,
                        lukumaara
                    }),
                    headers: {'Content-Type':'application/json'}
                };
                const data=await fetch('/paivita', optiot);
                const tulos=await data.json();
                if(tulos.viesti){
                    viestialue.textContent=tulos.viesti;
                }
                hakutila=true;
                vaihdaLukutila(hakutila);
            }
        }
        catch(virhe){
            reject(ohjelmavirhe(virhe));
        }
    }

    function vaihdaLukutila(tila){
        if(tila){
            kirjaIdkentta.removeAttribute('readonly');
            nimikentta.setAttribute('readonly', true);
            tekijakentta.setAttribute('readonly', true);
            painovuosikentta.setAttribute('readonly', true);
            lukumaarakentta.setAttribute('readonly', true);
        }
        else{
            kirjaIdkentta.setAttribute('readonly', true);
            nimikentta.removeAttribute('readonly');
            tekijakentta.removeAttribute('readonly');
            painovuosikentta.removeAttribute('readonly');
            lukumaarakentta.removeAttribute('readonly');
        }
    }

    function paivitaKentat(teos){
        kirjaIdkentta.value=teos.kirjaID;
        nimikentta.value=teos.nimi;
        tekijakentta.value=teos.tekija;
        painovuosikentta.value=teos.painovuosi;
        lukumaarakentta.value=teos.lukumaara;
        hakutila=false;
        vaihdaLukutila(hakutila)
    }

})();