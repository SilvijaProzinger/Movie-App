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
let genre = '';

const fetchMovie = () =>  {
	//by default fetch the top rated movies
    let url = `${urlBase}discover/movie?api_key=${key}&language=en-US&sort_by=popularity.desc&page=${pageNumber}`; 
      fetch(url)
      .then((res) => res.json())
      .then((data) => {
      getMovies(data)
    })
}

fetchMovie();

//load more movies
const loadMore = () => {
	console.log('clicked')
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
	console.log('clicked');
  if (movieDiv.style.display === "block") {
      movieDiv.style.display = "none";
  } else {
      movieDiv.style.display = "block";
  }

  //save the movie id inside the local storage so that we can fetch the movie based on its id
  localStorage.setItem('movieId', id);

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
    <h2>${movie.title}</h2>
    <hr>
    <img class="moviePoster" src='https://image.tmdb.org/t/p/w185/${movie.poster_path}' alt='${movie.original_title}'>
    <h4>${movie.overview}</h4>
    <h4>Rating: ${movie.vote_average}</h4>
    <h4>Popularity: ${movie.popularity}</h4>
    <h4>Language: ${movie.original_language}</h4>
    <h4>Production companies: ${production}</h4>`;
  movieContent.innerHTML = `<button class="button close-button" id="closeModal">X</button>` + output;
}

/* if the event target is the dynamically added button close, call the close function, due to the fact that dynamically created buttons 
can't use the onclick method */
document.body.addEventListener( 'click', function(event){
  if (event.srcElement.id == 'closeModal') {
    close();
  };
});

const close = () => {
  movieDiv.style.display = 'none';
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
  //document.getElementById('loaderAnimation').style.display = 'block'

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
  let url = `${urlBase}discover/movie?api_key=${key}&language=en-US&include_adult=false&include_video=false&page=${randomPage}&with_genres=${genreId}`
  movieContent.innerHTML = `<h3>Loading...</h3>`
  fetch(proxy + url)
      .then((res) => res.json())
      .then((data) => {
      console.log(data.results)
      let movie = data.results[randomId]
      let output = `
        <h2>${movie.title}</h2>
        <hr>
        <img class="moviePoster" src='https://image.tmdb.org/t/p/w185/${movie.poster_path}' alt='${movie.original_title}'>
        <h4>${movie.overview}</h4>
        <h4>Rating: ${movie.vote_average}</h4>
        <h4>Popularity: ${movie.popularity}</h4>
        <h4>Language: ${movie.original_language}</h4>`;
      movieContent.innerHTML = `<button class="button close-button" id="closeModal">X</button>` + output;
      })
      .catch(error => 
        movieContent.innerHTML = '<h3>Sorry! There has been a server error. Try again later.</h3>'
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