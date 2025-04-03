const selectedLahtovaluutta = document.querySelector('#selectedLahtovaluutta');
const selectedKohdevaluutta = document.querySelector('#selectedKohdevaluutta');
const lahtovaluutta = document.querySelector('#lahtovaluutta');
const kohdevaluutta = document.querySelector('#kohdevaluutta');

const valintanuoli = '<i class="fa fa-chevron-down"></i>';
let defaultSourceCurrency = 'EUR'; // Oletusvaluutta
let defaultSourceCountry = 'EU'; // Oletusmaa (Suomi)
let defaultSourceCurrencyName = 'Euro'; // Oletusvaluutan nimi

let defaultTargetCurrency = 'USD'; // Oletusvaluutta
let defaultTargetCountry = 'US'; // Oletusmaa (Suomi)
let defaultTargetCurrencyName = 'US Dollar'; // Oletusvaluutan nimi

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
        // Luo valuuttavalintalista
        const maalista = data.filter(maa => !['EUR','USD'].includes(maa['CurrencyCode']));
        createOptionsList(maalista,lahtovaluutta);
        createOptionsList(maalista,kohdevaluutta);
        console.log('kohdevaluutta:',kohdevaluutta);
        // Aseta oletusvaluutta ja maa
        setDefaultOption('selectedLahtovaluutta');
        setDefaultOption('selectedKohdevaluutta');
    })
    .catch(error => console.error('Virhe JSON-tiedoston latauksessa:', error));
}

const setOptionContent = (maakoodi,valuuttakoodi,selite) => 
    `<img src="https://flagcdn.com/w40/${maakoodi}.png" alt="${maakoodi}">` +
    `<span>${valuuttakoodi} (${selite})</span>`


const setSelectedOption = event => {
    let option = event.currentTarget;
    console.log('setSelectedOption,option:',option);
    const select = option.closest('.currency-select').querySelector('.selected-option');
    console.log('setSelectedOption,select:',select);
    select.innerHTML = option.innerHTML + valintanuoli;
    select.setAttribute('data-value', option.dataset.value);
    // Piilota valintalista
    const selects = option.closest('.options');
    selects.style.display = 'none';
   }

const setDefaultOption = selected => {
    let defaultCountry = defaultSourceCountry;
    let valuuttakoodi = defaultSourceCurrency;
    let selite = defaultSourceCurrencyName;
        
    if (selected === 'selectedKohdevaluutta') {
        defaultCountry = defaultTargetCountry;
        valuuttakoodi = defaultTargetCurrency;
        selite = defaultTargetCurrencyName;
        }

    const selectedOption = document.querySelector('#'+selected);
    selectedOption.innerHTML = setOptionContent(defaultCountry.toLowerCase(), valuuttakoodi, selite) + valintanuoli;
    selectedOption.setAttribute('data-value',valuuttakoodi);
    }
    

const createOption = (maakoodi,valuuttakoodi,selite) => {
    let option = document.createElement('div');
    option.classList.add('option');
    option.setAttribute('data-value', valuuttakoodi);
    option.innerHTML = setOptionContent(maakoodi,valuuttakoodi,selite);
    option.addEventListener('click', setSelectedOption);
    return option;
    }

const createOptionsList = (maalista,lista) => {
     maalista.forEach(maa => {
        console.log('createOptionsList,maa:',maa);
        let maakoodi = maa['CountryCode']?.toLowerCase() || 'fi'; // Oletus Suomi
        let valuuttakoodi = maa['CurrencyCode'];
        let selite = !['EUR', 'USD'].includes(valuuttakoodi) ? maa['CurrencyName'] : maa['CountryName'];
        let optionElement = createOption(maakoodi,valuuttakoodi,selite);
        lista.appendChild(optionElement);
    });
}


selectedLahtovaluutta.addEventListener('click', () => {
    lahtovaluutta.style.display = lahtovaluutta.style.display === 'block' ? 'none' : 'block';
    });

selectedKohdevaluutta.addEventListener('click', () => {
    kohdevaluutta.style.display = kohdevaluutta.style.display === 'block' ? 'none' : 'block';
    });    

document.querySelectorAll('#lahtovaluutta .option').forEach(option => 
    option.addEventListener('click', setSelectedOption));

document.querySelectorAll('#kohdevaluutta .option').forEach(option => 
    option.addEventListener('click', setSelectedOption));
    
    // Sulje klikattaessa ulkopuolelle
window.addEventListener('click', e => {
    console.log('e.target:',e.target);
    if (!document.querySelector('#currencySelectLahtovaluutta').contains(e.target) && 
        !document.querySelector('#currencySelectKohdevaluutta').contains(e.target)) {
        lahtovaluutta.style.display = 'none';
        kohdevaluutta.style.display = 'none';
    }
});

// Lataa maatunnukset JSON-tiedostosta
haeMaatunnukset();

