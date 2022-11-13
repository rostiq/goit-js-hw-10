import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

function dataCleaner() {
  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';
}

function countrySearch() {
    const inputValue = inputRef.value.trim();
    
    if (inputValue === '') {
        dataCleaner();
        return;
    }
    
    fetchCountries(inputValue)
    .then(data => {
        dataCleaner();
        if (data.length > 10) {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        }
        else if (data.length >= 2 && data.length <= 10) {
            return countryListRef.innerHTML = data.map(
                ({ name, flags }) =>
                `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`,
                )
                .join('');
            }
            else if (data.length === 1) {
                return countryInfoRef.innerHTML = data.map(
                    ({ name, capital, population, flags, languages }) =>
                    `<img src="${flags.svg}" alt="${name.official}" width="300" height="200">
                    <div>   
                    <h2>${name.official}</h2>
                    <p>Capital: ${capital}</p>
                    <p>Population: ${population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</p>
                    <p>Languages: ${Object.values(languages).join(', ')}</p>
                    </div>`,
                    )
                    .join('');
                }
                dataCleaner();
            })
            .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name.');
        dataCleaner();
    });
}

function autoFillInput(event) {
    if (event.target.nodeName !== 'LI') {
        return;
    }
    inputRef.value = event.target.textContent;
    countrySearch();
    inputRef.value = '';
}

inputRef.addEventListener('input', debounce(countrySearch, DEBOUNCE_DELAY));

countryListRef.addEventListener('click', autoFillInput);
