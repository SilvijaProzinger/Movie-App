let urlBase = 'https://api.themoviedb.org/3/';
let key = config.MY_KEY;
let pageNumber = 1;
let moviesDiv = document.getElementById('moviesContainer');
let load = document.getElementById('loadButton');
let goToTop = document.getElementById('topButton');
let movieDiv = document.getElementById('movieDiv');
let movieContent = document.getElementById('movieWindow');
let movieRoulette = document.getElementById('rouletteButton');
let movieRouletteDiv = document.getElementById('movieRoulette');
//let genre = '';

let starDiv = document.querySelector('.stars')
//let starsNodeList = starDiv.children
let stars = Array.prototype.slice.call(starDiv.children)
//let allStars = stars.length

/*let moviez = [
  { key: 0, title: 'Interstellar'}
]*/

let rated = [
  { key: 0, movieId: '419704', rating: 7 }
]

let uniqueId

// fetch movies on homepage 
const fetchMovie = () =>  {
  //by default fetch the top rated movies
  let url = `${urlBase}discover/movie?api_key=${key}&language=en-US&sort_by=popularity.desc&page=${pageNumber}`; 
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
    getMovies(data)
  })
  // WHILE TESTING
  //window.localStorage.clear();
}

fetchMovie();

//load more movies
const loadMore = () => {
  let url = `${urlBase}discover/movie?api_key=${key}&language=en-US&sort_by=popularity.desc&page=${++pageNumber}`; 
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
    console.log(data);
    getMovies(data);
  })
}

const getMovies = (data) => {
  let output = '';
  data.results.forEach(function(movie){
    output += `
      <ul class="movie">
        <img class="moviePoster" src='https://image.tmdb.org/t/p/w342/${movie.poster_path}'>
        <li class="movieName" onclick="fetchMovieInfo('${movie.id}')">${movie.title}</li>
        <br>
        <li class="movieText">Language: ${movie.original_language}</li>
        <li class="rating">${movie.vote_average}</li>
      </ul>
    `;
  });
  moviesDiv.innerHTML += output;
}

load.addEventListener('click', loadMore);


//show info for each clicked movie
const fetchMovieInfo = (id) => {
  if (movieDiv.style.display === "block") {
      movieDiv.style.display = "none";
  } else {
      movieDiv.style.display = "block";
  }

  //save the movie id inside the local storage so that we can fetch the movie based on its id
  localStorage.setItem('movieId', id);
  uniqueId = id

  let url =`${urlBase}movie/${id}?api_key=${key}&language=en-US`; 
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        getMovieInformation(data);
    })
}

const getMovieInformation = (data) => {
  let movie = data
  let production = movie.production_companies.map(company => company.name)
  let output = `
    <h2 class="title">${movie.title}</h2>
    <hr>
    <img class="poster" src='https://image.tmdb.org/t/p/w500/${movie.poster_path}' alt='${movie.original_title}'>
    <h4 class="movieSummary">${movie.overview}</h4>
    <h4 class="movieInformation">Rating: ${movie.vote_average}</h4>
    <h4 class="movieInformation">Popularity: ${movie.popularity}</h4>
    <h4 class="movieInformation">Language: ${movie.original_language}</h4>
    <h4 class="movieInformation">Production companies: ${production}</h4>`;
  movieContent.innerHTML = `<button class="button close-button" id="closeModal">X</button>` + output;

  /*moviez.push({key: moviez.length + 1, title: movie.original_title })
  console.log(moviez)
  localStorage.setItem('moviez', JSON.stringify(moviez));*/
  checkRating()
}

const checkRating = () => {
  const found = rated.some(el => el.movieId === uniqueId);

  //if the movie is already rated run the already rated function to show the rating from local storage
  if (found){
    alreadyRated()
  }
}

starDiv.addEventListener('click', function(e) {
    let index = stars.indexOf(e.target)
    let rating = stars.length - index
    const found = rated.some(el => el.movieId === uniqueId);
    handleRating(rating)
})

//find the movie's rating in rated array and then slice the stars so that the rated number of stars is marked as rated
const alreadyRated = () => {
  let foundRating = rated.find(item => item.movieId === uniqueId)
  let value = foundRating.rating
  console.log(value)
  //mark the right amount of stars by substracting the rating from the length (because the css makes them flow in reverse)
  stars.slice(stars.length - value).forEach(function(el){
    el.classList.add('selected')
  })
}

const handleRating = (rating) => { 
  //push the rating and movie id to rated array so that we can save it in local storage
  rated.push({key: length + 1, movieId: uniqueId, rating: rating })
  console.log(rated)
  localStorage.setItem('rated', JSON.stringify(rated))
  console.log('Movie id is: ', uniqueId, ' and star rating: ', rating)
}

starDiv.addEventListener('click', function(e) {
  stars.forEach(function(el) {
    el.classList.remove('selected')
  })
  e.target.classList.add('selected')
})

/* if the event target is the dynamically added button close, call the close function, due to the fact that dynamically created buttons 
can't use the onclick method */
document.body.addEventListener( 'click', function(event){
  if (event.srcElement.id == 'closeModal') {
    close();
  };
});

const close = () => {
  movieDiv.style.display = 'none';
  stars.forEach(function(el) {
    el.classList.remove('selected')
  })
}

// add a button which will jump to the top if the user scrolls down
window.onscroll = function(){
  scrollFunction()
};

const scrollFunction = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    goToTop.style.display = "block";
  } else {
    goToTop.style.display = "none";
  }
}

//when the button is clicked go to top of page
const topFunction = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

goToTop.addEventListener('click', topFunction);

//add the movie roulette function
const openMovieRoulette = () => {
  console.log('clicked')
  if (movieRouletteDiv.style.display === "block") {
      movieRouletteDiv.style.display = "none";
  } else {
      movieRouletteDiv.style.display = "block";
  }
}

//add the fetch movie by genre function
const getRouletteMovie = () => {
  event.preventDefault()
  let checked = document.querySelector('input[name="genre"]:checked').value
  console.log(checked)
  //close the roulette form
  movieRouletteDiv.style.display = "none"

  let genreId = ''
  //the genre id changes based on what the user selected
  switch(checked) {
    case 'action': 
      genreId = 28
      break
    case 'horror':
      genreId = 27
      break
    case 'drama':
      genreId = 18
      break
    case 'fantasy':
      genreId = 14
      break
    case 'animated':
      genreId = 16
      break
    case 'comedy':
      genreId = 35
      break
  }

  let randomPage = Math.floor(Math.random(1) * Math.floor(500));
  let randomId = Math.floor(Math.random() * Math.floor(19));
  console.log(randomPage, randomId)

  let proxy = `https://cors-anywhere.herokuapp.com/`
  let url = `${urlBase}discover/movie?api_key=${key}&language=en-US&include_adult=false&include_video=false&with_original_language=en&page=${randomPage}&with_genres=${genreId}`
  movieContent.innerHTML = `<h3>Searching through the database, this might take a moment...</h3>`
  fetch(proxy + url)
      .then((res) => res.json())
      .then((data) => {
      console.log(data.results)
      let movie = data.results[randomId]
      uniqueId = data.results[randomId].id.toString()
      let output = `
        <h2 class="title">${movie.title}</h2>
        <hr>
        <img class="poster" src='https://image.tmdb.org/t/p/w500/${movie.poster_path}' alt='${movie.original_title}'>
        <h4 class="movieSummary">${movie.overview}</h4>
        <h4 class="movieInformation">Rating: ${movie.vote_average}</h4>
        <h4 class="movieInformation">Popularity: ${movie.popularity}</h4>
        <h4 class="movieInformation">Language: ${movie.original_language}</h4>`;
      movieContent.innerHTML = `<button class="button close-button" id="closeModal">X</button>` + output;
      })
      .catch(error => 
        movieContent.innerHTML = `<button class="button close-button" id="closeModal">X</button>` + '<h3>Sorry! There has been a server error. Try again later.</h3>'
      ) 

if (movieDiv.style.display === "block") {
    movieDiv.style.display = "none";
  } else {
    movieDiv.style.display = "block";
  }
}

movieRoulette.addEventListener('click', openMovieRoulette);
//close the roulette 
document.getElementById('closeRoulette').addEventListener('click', function closeRoulette(){
   movieRouletteDiv.style.display = "none"
})

/* genres ids: action 28, animation 16, comedy 35, drama 18, fantasy 14, horror 27 */