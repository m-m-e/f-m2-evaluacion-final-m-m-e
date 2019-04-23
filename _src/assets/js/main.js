'use strict';

//elements to use
const input = document.querySelector('#search');
const button = document.querySelector('.btn');
const results = document.querySelector('.results');
const favorites = document.querySelector('.favorites');
const api = 'http://api.tvmaze.com/search/shows?q=';
const savedFavorites = JSON.parse(localStorage.getItem('favorites'));
let favoritesList = [];

//check if saved data and print favourites if so
const printFavorites = list => {
  favorites.innerHTML = '';
  console.log('faves', list);
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const newFave = document.createElement('li');
    newFave.classList.add('fave');
    newFave.setAttribute('data-id', i);
    const newFaveTitle = document.createElement('h3');
    newFaveTitle.classList.add('fave-title');
    const newFaveTitleContent = document.createTextNode(item.title);

    const newFaveImage = document.createElement('img');
    newFaveImage.classList.add('fave-image');
    newFaveImage.style = 'height: 200px';
    newFaveImage.setAttribute('src', item.image);
    newFaveImage.setAttribute('alt', item.title);

    newFaveTitle.appendChild(newFaveTitleContent);
    newFave.appendChild(newFaveImage);
    newFave.appendChild(newFaveTitle);
    favorites.appendChild(newFave);
  }
};

// function to see if saved data
const checkFavorites = () => {
  if (savedFavorites) {
    console.log('saved favorites', savedFavorites);
    let favoritesList = [savedFavorites];
    console.log('newlist', favoritesList[0]);
    printFavorites(favoritesList[0]);
  }
  else {
    console.log('no favorites!');
  }
};

checkFavorites();
    
//function to print series WITHIN CONTAINER
const showSeries = (container, array) => {
  container.innerHTML = '';
  for (let i=0; i< array.length; i++) {
    const thisSeries = array[i];
    const newCard = document.createElement('li');
    newCard.classList.add('results-card');
    newCard.setAttribute('data-id', i);
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
    
    newTitle.appendChild(newTitleContent);
    newCard.appendChild(newTitle);
    newCard.appendChild(newImage);
    newCard.addEventListener('click', handler);
    
    container.appendChild(newCard);
  }
};

const handler = () => {
  makeFavorites(event);
};

//function to apply style changes to favourites and save in an array
const makeFavorites = event => {
  const target = event.currentTarget;
  target.classList.toggle('favorite');
  const id = parseInt(target.dataset.id);
  if (target.classList.contains('favorite')) {
    const newSeries = {
      id: id,
      title: target.childNodes[0].innerHTML,
      image: target.childNodes[1].src
    };
    console.log(newSeries);
    favoritesList.push(newSeries);
  }

  printFavorites(favoritesList);
  saveFavorites(favoritesList);
  
};

const saveFavorites = list => {
  localStorage.setItem('favorites', JSON.stringify(list));
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
      showSeries(results, seriesData);
    });
};


//add listener to button

button.addEventListener('click', getSeries);
input.addEventListener('keyup',function(e){
  if (e.keyCode === 13) {
    getSeries();
  }
});