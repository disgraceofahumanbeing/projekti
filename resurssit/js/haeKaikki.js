'use strict';

(function(){

    document.addEventListener('DOMContentLoaded', alusta);

    async function alusta(){
        try{
            const data = await fetch('/kaikki');
            const kirja = await data.json();
            const taulukko = document.getElementById('tulostaulukko');
            for (let teos of kirja){
                const tr = document.createElement('tr');
                tr.appendChild(createElement(teos.kirjaID));
                tr.appendChild(createElement(teos.nimi));
                tr.appendChild(createElement(teos.tekija));
                tr.appendChild(createElement(teos.painovuosi));
                tr.appendChild(createElement(teos.lukumaara));
                taulukko.appendChild(tr);
            }
        }
        catch(virhe){
            console.log(virhe.message);
        }
    }
    function createElement(data){
        const td = document.createElement('td');
        td.textContent=data;
        return td;
    }
})();