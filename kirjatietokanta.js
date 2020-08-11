'use strict';

const Tietokanta = require('./tietokanta');
const ohjelmavirhe = virhe => {
    if(virhe) console.log(virhe);
    return new Error('Ohjelmavirhe');
  }

const kirjanTiedot = teos =>
[teos.kirjaID, teos.nimi, teos.tekija, teos.painovuosi, teos.lukumaara];

const kirjatiedotPaivitykseeen = teos =>
[teos.nimi, teos.tekija, teos.painovuosi, teos.lukumaara, teos.kirjaID];

//sql-lauseet
const haeKaikkiSql='select kirjaID, nimi, tekija, painovuosi, lukumaara from kirja';
const haeKirjaSql='select kirjaID,nimi,tekija,painovuosi,lukumaara from kirja where kirjaID=?';
const lisaaKirjaSql='insert into kirja(kirjaID,nimi,tekija,painovuosi,lukumaara) values(?,?,?,?,?)';
const poistaKirjaSql='delete from kirja where kirjaID=?';
const paivitaKirjaSql=`update kirja set nimi=?,tekija=?,painovuosi=?,lukumaara=? where kirjaID=?`;

module.exports = class Kirjatietokanta {
    constructor(optiot){
        this.varasto = new Tietokanta(optiot);
    }
    haeKaikki(){
        return new Promise(async (resolve,reject)=>{
            try{
                const tulos =await this.varasto.suoritaKysely(haeKaikkiSql);
                if(tulos.tulosjoukko){
                    resolve(tulos.kyselynTulos);
                }
                else{
                    reject(ohjelmavirhe());
                }
            }
            catch(virhe){
                console.log(virhe);
                reject(ohjelmavirhe());
            }
        });
    }
    hae(kirjaID){
        return new Promise(async (resolve,reject)=>{
            try{
                const tulos =await this.varasto.suoritaKysely(haeKirjaSql,[kirjaID]);
                if(tulos.tulosjoukko){
                    if(tulos.kyselynTulos.length>0){
                        resolve(tulos.kyselynTulos[0]);
                    }
                    else{
                        resolve({viesti:`Numerolla ${kirjaID} ei löytynyt kirjaa`});
                    }
                }
                else{
                    reject(ohjelmavirhe());
                }
            }
            catch(virhe){
                reject(ohjelmavirhe(virhe));
            }
        });
    }
    lisaa(teos){
        return new Promise(async (resolve,reject)=>{
            try{
                const hakutulos = await this.varasto.suoritaKysely(haeKirjaSql, [teos.kirjaID]);
                if(hakutulos.kyselynTulos.length===0){
                    const tulos = await this.varasto.suoritaKysely(lisaaKirjaSql, kirjanTiedot(teos));
                    if(tulos.kyselynTulos.muutetutRivitLkm===1) {
                        resolve({viesti: `Kirja numerolla ${teos.kirjaID} lisättiin`});
                    }
                    else{
                        resolve({viesti: 'Kirjaa ei lisätty'});
                    }                        
                }
                else{
                    resolve({viesti: `Numero ${teos.kirjaID} on jo käytössä`});
                }
            }
            catch(virhe){
                console.log(virhe);
                reject(ohjelmavirhe());
            }
        });
    }
    poista(kirjaID){
        return new Promise(async(resolve,reject)=>{
            try{
                const tulos= await this.varasto.suoritaKysely(poistaKirjaSql,[+kirjaID]);
                if(tulos.kyselynTulos.muutetutRivitLkm===0){
                    resolve({viesti: 'Antamallasi numerolla ei löytynyt kirjaa. Mitään ei poistettu'});
                }
                else{
                    resolve({viesti: `Kirja numerolla ${kirjaID} poistettiin`});
                }
            }
            catch(virhe){
                reject(ohjelmavirhe());
            }
        });
    }
    paivita(teos){
        return new Promise(async(resolve,reject)=>{
            try{
                const tulos=await this.varasto.suoritaKysely(paivitaKirjaSql, kirjatiedotPaivitykseeen(teos));
                if(tulos.kyselynTulos.muutetutRivitLkm===0){
                    resolve({viesti:'Tietoja ei päivitetty'});
                }
                else{
                    resolve({viesti:`Kirjan ${teos.kirjaID} tiedot päivitettiin`});
                }
            }
            catch(virhe){
                reject(ohjelmavirhe());
            }
        });
    }
}