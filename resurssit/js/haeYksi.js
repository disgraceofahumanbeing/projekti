'use strict';

(function(){
    let tulosalue;
    let kirjaid;

    document.addEventListener('DOMContentLoaded', alusta);

    function alusta(){
        tulosalue = document.getElementById('tulosalue');
        kirjaid = document.getElementById('kirjaid');
        document.getElementById('laheta').addEventListener('click', laheta);
    }

    async function laheta() {
        const id = kirjaid.value;
        try{
            const optiot = {
                method: 'POST',
                body: JSON.stringify({kirjaID: id}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const data = await fetch('/yksi', optiot);
            const tulos = await data.json();
            paivita(tulos);
        }
        catch(virhe){
            reject(ohjelmavirhe(virhe));
        }
    }

    function paivita(teos){
        if(teos.viesti){
            muodostaViesti(teos.viesti);
        }
        else{
            muodostakirja(teos);
        }
    }
    function muodostaViesti(viesti){
    tulosalue.innerHTML=`<p class="eiloydy">${viesti}</p>`;
    }
    function muodostakirja(teos){
        tulosalue.innerHTML=`
        <p><span class="selite">Kirjan ID:</span> ${teos.kirjaID}</p>
        <p><span class="selite">Nimi:</span> ${teos.nimi}</p>
        <p><span class="selite">Tekijä:</span> ${teos.tekija}</p>
        <p><span class="selite">Painovuosi:</span> ${teos.painovuosi}</p>
        <p<<span class="selite">Lukumäärä:</span> ${teos.lukumaara}</p>`;
    }
})();