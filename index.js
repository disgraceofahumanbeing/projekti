'use strict';
const http = require('http');
const path = require('path');

const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const Tietovarasto = require('./kirjatietokanta');

const optiot = {
    host: 'localhost',
    port: 3306,
    user: 'nico',
    password: 'buHHkBqU',
    database: 'kirjatietokanta'
};

const kirja = new Tietovarasto(optiot);

const palvelin = http.createServer(app);

const valikkopolku = path.join(__dirname,'sivut','valikko.html');
const kaikkipolku = path.join(__dirname,'sivut','haeKaikki.html');
const yksipolku = path.join(__dirname,'sivut','haku.html');
const lisaapolku = path.join(__dirname,'sivut','lisaaUusi.html');
const poistopolku = path.join(__dirname,'sivut','poista.html');
const paivitapolku = path.join(__dirname,'sivut','paivita.html');

app.use(express.static(path.join(__dirname,'resurssit')));

app.get('/', (req,res)=>res.sendFile(valikkopolku));
app.get('/haeKaikki',(req,res)=>res.sendFile(kaikkipolku));
app.get('/haeyksi',(req,res)=>res.sendFile(yksipolku));
app.get('/lisaa',(req,res)=>res.sendFile(lisaapolku));
app.get('/poista',(req,res)=>res.sendFile(poistopolku));
app.get('/paivita',(req,res)=>res.sendFile(paivitapolku));

app.get('/kaikki', async(req,res)=>{
    try{
        const tulos = await kirja.haeKaikki();
        res.json(tulos);
    }
    catch(virhe){
        console.log(virhe.message);
        res.end();
    }
});

app.post('/yksi', express.json(), async(req,res)=>{
    try{
        const kirjaID = req.body.kirjaID;
        const tulos = await kirja.hae(kirjaID);
        res.json(tulos);
    }
    catch(virhe){
        console.log(virhe.message);
        res.end();
    }
});

app.post('/lisaa', express.json(),async (req,res)=>{
    try{
        const teos =req.body;
        const tulos = await kirja.lisaa(teos);
        res.json(tulos);
    }
    catch(virhe){
        console.log(virhe.message);
        res.end();
    }
});

app.post('/poista',express.json(), async(req,res)=>{
    try{
        const kirjaID = req.body.kirjaID;
        const tulos = await kirja.poista(kirjaID);
        res.json(tulos);
     }
     catch(virhe){
         console.log(virhe.message);
         res.end();
     }
});

app.post('/paivita', express.json(), async (req,res)=>{
    try{
        const teos = req.body;
        const tulos = await kirja.paivita(teos);
        res.json(tulos);
    }
    catch(virhe){
        console.log(virhe.message);
        res.end();
    }
});

palvelin.listen(port,host, ()=>console.log(`Palvelin ${host} portissa ${port}`));