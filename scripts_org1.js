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
let rates = {};
let rate = 0;
const valuuttakurssitApi = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`;
//const valuuttakurssitApi2 = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${baseCurrency}/${targetCurrency}`;
//const valuuttakurssitApi2 = 'https://v6.exchangerate-api.com/v6/' + API_KEY + '/pair/' + baseCurrency + '/' + targetCurrency;
//const valuuttakurssitApi2 = `https://v6.exchangerate-api.com/v6/${API_KEY}/enriched/GBP/JPY`

const getApiUrl = baseCurrency => {
const api = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`;
console.log("getApiUrl,baseCurrency:",baseCurrency, 'api:',api);    
return api;
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
document.querySelector('#valuuttakurssi').innerHTML = `1 ${baseCurrency} = ${rateStr} ${targetCurrency}`;
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
        lisaaValuuttasymbolit(data,"lahtovaluutta",baseCurrency);
        //lisaaValuuttasymbolit(data,"kohdevaluutta",targetCurrency);
        rates = data.conversion_rates;
    })
    .catch(error => {
        console.error(error);
    });
}


document.querySelector('#button-valuuttakurssi').addEventListener('click', laskeValuuttakurssi);
document.querySelector('#lahtovaluutta').addEventListener('change', paivitaValuuttakurssit);
//document.querySelector('#kohdevaluutta').addEventListener('change', paivitaValuuttakurssi);


const lisaaValuuttasymbolit = (data,kentta,selectedCurrency) => {
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
        lisaaValuuttasymbolit(data,"lahtovaluutta",baseCurrency);
        lisaaValuuttasymbolit(data,"kohdevaluutta",targetCurrency);
        rates = data.conversion_rates;
        rate = data.conversion_rates[targetCurrency];
        })
    .catch(error => {
        console.error(error);
    });
}




haeValuuttakurssit();

//document.querySelector('#buttonValuuttakurssit').addEventListener('click', haeValuuttakurssit);
    