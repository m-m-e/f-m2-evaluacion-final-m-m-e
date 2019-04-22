'use strict';

//elements to use
const input = document.querySelector('#search');
const button = document.querySelector('.btn');
const results = document.querySelector('.results');
const api = 'http://api.tvmaze.com/search/shows?q=';


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
    });
};

//function to print series WITHIN CONTAINER


//function to add checkbox for favourites


//function to apply style changes to favourites


//function to save favourites 


//add listener to button

button.addEventListener('click', getSeries);