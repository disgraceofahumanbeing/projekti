'use strict';
(function(){
    let viestialue;
    let kirjaid;

    document.addEventListener('DOMContentLoaded', alusta);

    function alusta(){
        viestialue=document.getElementById('viestialue');
        kirjaid=document.getElementById('kirjaid'),

        document.getElementById('laheta').addEventListener('click', laheta);
    }

    async function laheta(){
        const id = kirjaid.value;
        try{
            const optiot={
                method: 'POST',
                body: JSON.stringify({ kirjaID: id }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const data = await fetch('/poista', optiot);
            const tulos = await data.json();
            if(tulos.viesti){
                viestialue.textContent=tulos.viesti;
            }
        }
        catch(virhe){
            reject(ohjelmavirhe(virhe));
        }
    }
})();