'use strict';

//elements to use
const input = document.querySelector('#search');
const button = document.querySelector('.btn');
const results = document.querySelector('.results');
const favorites = document.querySelector('.favorites');
const messageBox = document.querySelector('.messages');
const api = 'http://api.tvmaze.com/search/shows?q=';
const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
let savedFavoritesList = savedFavorites;
let favoritesList = [];

const countResults = array => {
  const numberOfResults = array.length;
  messageBox.innerHTML = `Número de resultados: ${numberOfResults}`;
};


//Print favourites if so
const printFavorites = list => {
  favorites.innerHTML = '';
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
    newFaveImage.setAttribute('src', item.image);
    newFaveImage.setAttribute('alt', item.title);

    const deleteButton = document.createElement('img');
    deleteButton.classList.add('delete');
    deleteButton.setAttribute('src', 'assets/images/delete.png');
    deleteButton.addEventListener('click', deleteHandler);

    newFaveTitle.appendChild(newFaveTitleContent);
    newFave.appendChild(newFaveImage);
    newFave.appendChild(newFaveTitle);
    newFave.appendChild(deleteButton);
    favorites.appendChild(newFave);
  }
  const deleteAll = document.createElement('img');
  deleteAll.classList.add('delete-all');
  deleteAll.setAttribute('height', '25px');
  deleteAll.setAttribute('src', 'assets/images/delete.png');
  deleteAll.addEventListener('click', deleteEverything);
  favorites.appendChild(deleteAll);

  if (savedFavorites.length === 0) {
    deleteAll.classList.add('hidden');
  }
};

// function to see if saved data
const checkFavorites = () => {
  if (savedFavorites) {
    console.log('saved favorites', savedFavorites);
    printFavorites(savedFavoritesList);
    return savedFavoritesList;
  }
  else {
    console.log('no favorites!');
    const newMessage = document.createElement('li');
    newMessage.classList.add('favorites-message');
    const newMessageContent = document.createTextNode('No hay favoritos! Añadirlos hacer clic en una serie...');
    newMessage.appendChild(newMessageContent);
    favorites.appendChild(newMessage);
  }
};

checkFavorites();

//function to print series WITHIN CONTAINER
const showSeries = (container, array) => {
  container.innerHTML = '';
  countResults(array);
  for (let i=0; i< array.length; i++) {
    const thisSeries = array[i];
    const newCard = document.createElement('li');
    newCard.classList.add('results-card');
    newCard.setAttribute('data-id', i);

    const newTitle = document.createElement('h2');
    newTitle.classList.add('results-title');
    const newTitleContent = document.createTextNode(thisSeries.name);
    for (const item of savedFavorites) {
      if (item.title === thisSeries.name){
        newCard.classList.add('favorite');
      }
    }

    const newImage = document.createElement('img');
    newImage.classList.add('results-image');
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
    newCard.addEventListener('click', favoritesHandler);

    container.appendChild(newCard);
  }
};

const favoritesHandler = () => {
  if (savedFavorites) {
    makeFavorites(event, savedFavoritesList);
  }
  else {
    makeFavorites(event, favoritesList);
  }
};
const saveFavorites = list => {
  localStorage.setItem('favorites', JSON.stringify(list));
};

//function to apply style changes to favourites and save in an array
const makeFavorites = (event, list) => {
  const target = event.currentTarget;
  target.classList.toggle('favorite');

  if (target.classList.contains('favorite')) {
    const newSeries = {
      title: target.childNodes[0].innerHTML,
      image: target.childNodes[1].src
    };
    list.push(newSeries);
  }
  saveFavorites(list);

  printFavorites(list);
};

//function to fetch data
const getSeries = () => {
  const search = input.value;
  const url = `${api}${search}`;
  const seriesData = [];
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          const item = data[i].show;
          const series = {};
          series.name = item.name;
          if (item.image !== null) {
            series.image = item.image.original;
          }
          seriesData.push(series);
        }
        showSeries(results, seriesData);
      }
      else {
        const newMessage = document.createElement('li');
        newMessage.classList.add('results-message');
        const newMessageContent = document.createTextNode('No hay resultados! Intenta otra vez :)');
        newMessage.appendChild(newMessageContent);
        results.appendChild(newMessage);
      }
    });
};


//add listener to button

button.addEventListener('click', getSeries);
input.addEventListener('keyup',function(e){
  if (e.keyCode === 13) {
    getSeries();
  }
});

//functions to delete favourites
function deleteHandler(){
  deleteFave(event);
}

function deleteFave(event) {
  const id = parseInt(event.currentTarget.parentElement.dataset.id);
  savedFavorites.splice(id, 1);
  console.log(savedFavorites);
  printFavorites(savedFavorites);
  saveFavorites(savedFavorites);
}


function deleteEverything() {
  savedFavorites.length = 0;
  printFavorites(savedFavorites);
  saveFavorites(savedFavorites);
}
