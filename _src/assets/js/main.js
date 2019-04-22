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
    newImage.setAttribute('src', thisSeries.image);

    newTitle.appendChild(newTitleContent);
    newCard.appendChild(newTitle);
    newCard.appendChild(newImage);
    results.appendChild(newCard);
  }
};

//function to fetch data
const getSeries = () => {
  const search = input.value;
  const url = `${api}${search}`;
  console.log(url);
  const seriesData = [];
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      for (let i = 0; i < data.length; i++) {
        const item = data[i].show;
        const series = {};
        series.name = item.name;
        series.image = item.image.original;
        seriesData.push(series);
      }
      console.log(seriesData);
      showSeries(seriesData);
    });
};



//function to add checkbox for favourites


//function to apply style changes to favourites


//function to save favourites 


//add listener to button

button.addEventListener('click', getSeries);