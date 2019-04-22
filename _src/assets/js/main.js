'use strict';

//elements to use
const input = document.querySelector('#search');
const button = document.querySelector('.btn');
const results = document.querySelector('.results');
const api = 'http://api.tvmaze.com/search/shows?q=';

//function to add listeners to checkboxes
const checkboxListener = () => {
  const allCheckboxes = document.querySelectorAll('.checkbox');
  for (const checkbox of allCheckboxes) {
    checkbox.addEventListener('change', makeFavorites);
  }
};


//function to print series WITHIN CONTAINER
const showSeries = array => {
  results.innerHTML = '';
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

    const newCheckbox = document.createElement('input');
    newCheckbox.classList.add('checkbox');
    newCheckbox.setAttribute('type', 'checkbox');
    
    
    newTitle.appendChild(newTitleContent);
    newCard.appendChild(newTitle);
    newCard.appendChild(newImage);
    newCard.appendChild(newCheckbox);
    results.appendChild(newCard);
  }
  checkboxListener();
};

//function to apply style changes to favourites and call save function
const makeFavorites = () => {
  const allResults = document.querySelectorAll('.results-card');

  // console.log(allResults);
  const favoritesList = [];
  for (let i = 0; i <allResults.length; i++) {
    const seriesItem = allResults[i];
    const newSeries = {
      id: seriesItem.id,
      title: seriesItem.childNodes[0].innerHTML,
      image: seriesItem.childNodes[1].src
    };
    if (seriesItem.childNodes[2].checked) {
      seriesItem.classList.add('favorite');
      console.log('favourites:', favoritesList);
      favoritesList.push(newSeries);
    }
    else {
      seriesItem.classList.remove('favorite');
    }
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


//add listener to button

button.addEventListener('click', getSeries);
input.addEventListener('keyup',function(e){
  if (e.keyCode === 13) {
    getSeries();
  }
});