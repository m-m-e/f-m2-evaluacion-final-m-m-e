'use strict';

//elements to use
const input = document.querySelector('#search');
const button = document.querySelector('.btn');
const results = document.querySelector('.results');
const api = 'http://api.tvmaze.com/search/shows?q=';


//function to print series WITHIN CONTAINER
const showSeries = array => {
  for (let i=0; i< array.length; i++) {
    const thisSeries = array[i];
    const newCard = document.createElement('div');
    newCard.classList.add('results-card');
    const newTitle = document.createElement('h2');
    newTitle.classList.add('title');
    const newTitleContent = document.createTextNode(thisSeries.name);

    const newImage = document.createElement('img');
    newImage.classList.add('image');
    newImage.style = 'height: 200px';
    newImage.setAttribute('alt', thisSeries.name);
    if (thisSeries.image) {
      newImage.setAttribute('src', thisSeries.image);
    }
    else {
      newImage.setAttribute('src', 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV');
    }

    const newCheckbox = document.createElement('input');
    newCheckbox.classList.add('checkbox');
    newCheckbox.setAttribute('type', 'checkbox');

    newTitle.appendChild(newTitleContent);
    newCard.appendChild(newTitle);
    newCard.appendChild(newImage);
    newCard.appendChild(newCheckbox);
    results.appendChild(newCard);
  }
};

//function to apply style changes to favourites
const showFavorites = () => {
  const allResults = document.querySelectorAll('.results-card');
  console.log(allResults);
  for (let i = 0; i <allResults.length; i++) {
    if (allResults[i].childNodes[2].checked) {
      allResults[i].classList.add('favourite');
    }
  }
};

//function to add listeners to checkboxes
const checkboxListener = () => {
  const allCheckboxes = document.querySelectorAll('.checkbox');
  for (const checkbox of allCheckboxes) {
    checkbox.addEventListener('change', showFavorites);
  }
};

//function to fetch data
const getSeries = () => {
  const search = input.value;
  const url = `${api}${search}`;
  const seriesData = [];
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      for (let i = 0; i < data.length; i++) {
        const item = data[i].show;
        const series = {};
        series.name = item.name;
        if (item.image !== null) {
          series.image = item.image.original;
        }
        seriesData.push(series);
      }
      console.log('array of series', seriesData);
      showSeries(seriesData);
    });
};


//function to save favourites 


//add listener to button

button.addEventListener('click', getSeries);