/* Objektien ja taulukoiden silmukointia:
Objekti: 
Object.keys(objekti) palauttaa objektin avaimet taulukkona.
Object.entries(objekti) palauttaa objektin avaimet ja arvot taulukkona.

Taulukko: 
for (const alkio of taulukko) {console.log(alkio);} silmukoi taulukon alkiot.
for (const indeksi in taulukko) {console.log(indeksi,taulukko[indeksi]);} silmukoi taulukon alkiot ja indeksit.
for (const [indeksi,alkio] of taulukko.entries()) {console.log(indeksi,alkio);} silmukoi taulukon alkiot ja indeksit.
for (let i = 0; i < taulukko.length; i++) {console.log(taulukko[i]);} silmukoi taulukon alkiot.
taulukko.forEach((alkio,indeksi) => {console.log(alkio,indeksi);}) silmukoi taulukon alkiot.
taulukko.map((alkio,indeksi) => {return alkio * 2;}) palauttaa uuden taulukon, jossa on alkioita kaksi kertaa enemmän.
taulukko.filter((alkio,indeksi) => {return alkio > 5;}) palauttaa uuden taulukon, jossa on vain ne alkiot, jotka ovat suurempia kuin 5.
taulukko.reduce((summa,alkio) => {return summa + alkio;},0) palauttaa taulukon alkioiden summan.
taulukko.find((alkio,indeksi) => {return alkio > 5;}) palauttaa ensimmäisen alkion, joka on suurempi kuin 5.

Tehtävä: suodata pois ne symbolit valuuttasymbolit-json-objektista, joille 
ei löydy valuuttakurssia valuuttakurssit-json-objektista.

Maiden lippuja: 
`https://flagcdn.com/w40/countrycode.png`, 
`https://flagsapi.com/w40/${COUNTRYCODE}.png` tai
`https://flagsapi.com/COUNTRYCODE/flat/32.png`
Maiden maa-, valuutta- ja puhelinverkkotunnukset : https://docs.nium.com/docs/currency-and-country-codes
*/  


function menuToggle() {
    var x = document.querySelector("nav");
    x.classList.toggle("responsive");
    console.log("myFunction:", x.classList);
    }


let counter = 0;
/* function count() {
    counter++;
    document.querySelector('h1').innerHTML = counter;
    }
*/

const count = () => {
    counter++;
    document.querySelector('h1').innerHTML = counter;
    }

 //document.querySelector('button').addEventListener('click', count);
 //document.querySelector('button').onclick = setInterval(count, 1000);

//const valuuttakurssitApi = 'https://api.exchangeratesapi.io/latest?base=EUR';
//const valuuttakurssitApi = 'https://api.boffsaopendata.fi/referencerates/api/ExchangeRate?currencies=USD';

const API_KEY = '30f9bfbf2c8af9d58a2f00cc';
let baseCurrency = 'EUR';
let targetCurrency = 'USD';
const baseCurrencyInit = baseCurrency;
const targetCurrencyInit = targetCurrency;
let rates = {};
let rate = 0;
const valuuttasymbolitApi = `https://openexchangerates.org/api/currencies.json`;
const valuuttakurssitApi = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`;
//const valuuttakurssitApi2 = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${baseCurrency}/${targetCurrency}`;
//const valuuttakurssitApi2 = 'https://v6.exchangerate-api.com/v6/' + API_KEY + '/pair/' + baseCurrency + '/' + targetCurrency;
//const valuuttakurssitApi2 = `https://v6.exchangerate-api.com/v6/${API_KEY}/enriched/GBP/JPY`

const getApiUrl = baseCurrency => {
const api = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`;
console.log("getApiUrl,baseCurrency:",baseCurrency, 'api:',api);    
return api;
}

const suodataMaatunnukset = (json1,json2) => {
const filteredJson = Object.keys(json2)
    .reduce((obj, key) => {
        console.log("suodataMaatunnukset,key:",key);
        if (json1.hasOwnProperty(key)) {
            obj[key] = json1[key];
            }
        //console.log("suodataMaatunnukset,obj:",obj);
        return obj;
    }, {});

console.log("suodataMaatunnukset,filteredJson:",filteredJson);
return filteredJson;
}

const haeMaatunnukset = () => {
    fetch('./maatunnukset.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('haeMaatunnukset:',data);
        // Käsittele JSON-dataa
        data.forEach(maa => {
            console.log(`Valuutta: ${maa["CurrencyCode"]} ${maa["CurrencyName"]}, Maa: ${maa["CountryCode"]} ${maa["CountryName"]}, Puhelintunnus: ${maa["PhoneCode"]}`);
        });
    })
    .catch(error => console.error('Virhe JSON-tiedoston latauksessa:', error));
}


const alustaLomake = event => {
    event.preventDefault();
    document.querySelector('#maara').value = 0;
    document.querySelector('#tulos').innerHTML = '';
    document.querySelector('#valuuttakurssi').innerHTML = '';
    baseCurrency = baseCurrencyInit;
    targetCurrency = targetCurrencyInit;
    document.querySelector('#lahtovaluutta').value = baseCurrency;
    document.querySelector('#kohdevaluutta').value = targetCurrency;
    haeValuuttakurssit();
    laskeValuuttakurssi(event);
}

const naytaValuuttakurssi = () => {
const rateStr = rate.toLocaleString('fi-FI');      
document.querySelector('#valuuttakurssi').innerHTML = `1 ${baseCurrency} = ${rateStr} ${targetCurrency}`;
}

const laskeValuuttakurssi = event => {
targetCurrency = document.querySelector('#kohdevaluutta').value;    
rate = rates[targetCurrency];
const rateStr = rate.toLocaleString('fi-FI');  
console.log("laskeValuuttakurssi,event:",event,'event.target:',event.target);    
event.preventDefault();
console.log("laskeValuuttakurssi,rate:",rate);      
tulos = document.querySelector('#maara').value * rate;
console.log("laskeValuuttakurssi,tulos:",typeof(tulos));
tulos = tulos.toLocaleString('fi-FI');
document.querySelector('#tulos').innerHTML = tulos;
//document.querySelector('#valuuttakurssi').innerHTML = `1 ${baseCurrency} = ${rateStr} ${targetCurrency}`;
naytaValuuttakurssi();
return false;
}

const tyhjennaTulos = () => {
    document.querySelector('#tulos').innerHTML = '';
} 


const paivitaValuuttakurssit = event => {
    /* HUom. tämä on kesken */
    //baseCurrency = document.querySelector('#lahtovaluutta').value;
    //targetCurrency = document.querySelector('#kohdevaluutta').value;
    //document.querySelector('#valuuttakurssi').innerHTML = `1 ${baseCurrency} = ${rate} ${targetCurrency}`;
    baseCurrency = event.target.value;
    console.log("paivitaValuuttakurssit,base:",baseCurrency);
    const valuuttakurssitApi = getApiUrl(baseCurrency);
    fetch(valuuttakurssitApi)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
    })
    .then(data => {
        console.log("paivitaValuuttakurssit,data:",data);
        //lisaaValuuttasymbolit(data,"lahtovaluutta",baseCurrency);
        //lisaaValuuttasymbolit(data,"kohdevaluutta",targetCurrency);
        rates = data.conversion_rates;
        laskeValuuttakurssi(event);
    })
    .catch(error => {
        console.error(error);
    });
}


document.querySelector('#button-valuuttakurssi').addEventListener('click', laskeValuuttakurssi);
document.querySelector('#button-reset').addEventListener('click', alustaLomake);
document.querySelector('#lahtovaluutta').addEventListener('change', paivitaValuuttakurssit);
document.querySelector('#kohdevaluutta').addEventListener('change', laskeValuuttakurssi);
document.querySelector('#maara').addEventListener('keyup', laskeValuuttakurssi);


const lisaaValuuttasymbolit_org = (data,kentta,selectedCurrency) => {
    const select = document.querySelector('#' + kentta);
    for (const currency in data.conversion_rates) {
        const option = document.createElement('option');
        option.value = currency;
        option.innerHTML = currency;
        if (currency === selectedCurrency) {
            option.selected = true;
        }
        select.appendChild(option);
    }
}

const lisaaValuuttasymbolit = (data,kentta,selectedCurrency) => {
    const select = document.querySelector('#' + kentta);
    console.log("lisaaValuuttasymbolit,dataEntries:",Object.entries(data));
    for (let [currency,header] of Object.entries(data)) {
        const option = document.createElement('option');
        option.value = currency;
        option.innerHTML = `${currency} (${header})`;
        if (currency === selectedCurrency) {
            option.selected = true;
        }
        select.appendChild(option);
    }
}

const haeValuuttakurssit = () => {
    //const valuuttakurssitApi = getApiUrl(baseCurrency);
    fetch(valuuttakurssitApi)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
        })
    .then(data => {
        console.log("haeValuuttakurssit,data:",data);
        //lisaaValuuttasymbolit(data,"lahtovaluutta",baseCurrency);
        //lisaaValuuttasymbolit(data,"kohdevaluutta",targetCurrency);
        rates = data.conversion_rates;
        rate = data.conversion_rates[targetCurrency];
        haeValuuttaSymbolit(rates);
        naytaValuuttakurssi();
        })
    .catch(error => {
        console.error(error);
    });
}


const haeValuuttaSymbolit = rates => {
    //const valuuttakurssitApi = getApiUrl(baseCurrency);
    fetch(valuuttasymbolitApi)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
        })
    .then(data => {
        /* Suodatetaan pois ne symbolit, joille löydy valuuttakurssia. */
        //console.log("haeValuuttasymbolit,data:",data);
        const dataFiltered = suodataMaatunnukset(data,rates);
        console.log("haeValuuttasymbolit,rates:",rates);
        console.log("haeValuuttasymbolit,data suodatettuna:",dataFiltered);
        lisaaValuuttasymbolit(dataFiltered,"lahtovaluutta",baseCurrency);
        lisaaValuuttasymbolit(dataFiltered,"kohdevaluutta",targetCurrency);
        })
    .catch(error => console.log(error));
}

haeMaatunnukset();
haeValuuttaSymbolit();
haeValuuttakurssit();



//document.querySelector('#buttonValuuttakurssit').addEventListener('click', haeValuuttakurssit);
    