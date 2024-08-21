import { movieID } from './movie_genre.js';

const API_KEY = 'api_key=831d73c5dad44f6474b9661c7a098d6e';
const base_url = 'https://api.themoviedb.org/3';

const TOP_URL = base_url + '/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200&' + API_KEY;
const POP_URL = base_url + '/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&' + API_KEY;
const UP_URL = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=10751&' + API_KEY;
const ANI_URL = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=16&' + API_KEY

const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const BDIMG_URL = 'https://image.tmdb.org/t/p/original';
const SRCH_URL = base_url + '/search/movie?' + API_KEY;

const form = document.getElementById('search_form');
const search = document.getElementById('search_input');

const wrapper1 = document.getElementById('popular_movies_wrapper')
const wrapper2 = document.getElementById('top_movies_wrapper')
const wrapper3 = document.getElementById('upcoming_movies_wrapper')
const wrapper4 = document.getElementById('animated_movies_wrapper')
const wrapper5 = document.getElementById('searched_movies_wrapper')


getMovies(TOP_URL, 'top_movies_wrapper', 'top_movies');
getMovies(POP_URL, 'popular_movies_wrapper', 'popular_movies');
getMovies(UP_URL, 'upcoming_movies_wrapper', 'upcoming_movies');
getMovies(ANI_URL, 'animated_movies_wrapper', 'animated_movies');
getBackdrop(POP_URL)



function getMovies(url, wrapperId, sliderId) {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data.results);
        showMovies(data.results, wrapperId, sliderId);
    })
    .catch(err => console.error(err));
}

function getBackdrop(url) {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data.results);
        showBackdrop(data)
    })
    .catch(err => console.error(err));
}

function getDetails(url) {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data.results);
        showDetails(data)
    })
    .catch(err => console.error(err));
}


function showBackdrop(data) {
    const backdropContainer = document.querySelector('.home_backdrop'); 

        const movie = data.results[0]
        const { title, backdrop_path, overview, genre_ids } = movie;

        const movieGenres = genre_ids.map(genreId => {
            const genre = movieID.find(item => item.id === genreId);
            return genre ? genre.name : '';
        }).join(' • '); // Join genres with comma separation

        const backdropEl = document.createElement('div');
        backdropEl.classList.add('backdrop-item'); // Optionally add a class for styling

        backdropEl.innerHTML = `
            <img src="${BDIMG_URL + backdrop_path}" alt="${title}">
            <h1>${title}</h1>
            <p class="backdrop-genres">${movieGenres}</p>
            <p class="backdrop-desc">${overview}</p>
        `;

        backdropContainer.appendChild(backdropEl);

}

function showDetails(movie) {
    const backdropContainer = document.querySelector('.home_backdrop'); 

    const { title, backdrop_path, overview, genres } = movie;

    const movieGenres = genres.map(genre=>{
        return(genre.name)
    }).join(' • ')

    const backdropEl = document.createElement('div');
    backdropEl.classList.add('backdrop-item'); // Optionally add a class for styling

    backdropEl.innerHTML = `
        <img src="${BDIMG_URL + backdrop_path}" alt="${title}">
        <h1>${title}</h1>
        <p class="backdrop-genres">${movieGenres}</p>
        <p class="backdrop-desc">${overview}</p>
    `;

    backdropContainer.innerHTML = ''; // Clear existing content
    backdropContainer.appendChild(backdropEl);
}





let currentMovie;

function showMovies(data, wrapperId, sliderId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) {
        console.error(`Element with ID ${wrapperId} not found.`);
        return;
    }
    data.forEach(movie => {
        const { id, original_title, poster_path, vote_average, genre_ids } = movie;

        const movieGenres = genre_ids.map(genreId => {
            const genre = movieID.find(item => item.id === genreId);
            return genre ? genre.name : '';
        }).slice(0, 2).join(' • ');

        const movieEl = document.createElement('li');
        movieEl.classList.add('splide__slide');
        movieEl.innerHTML = `
        <button class="movie_button" id="movie_button" data-movie-id="${id}">            
            <div class="movie_poster">
            <div class="poster_wrapper">
                <img id="posterimg" src="${IMG_URL + poster_path}" alt="">
            </div>
                <div class="img_overlay">
                    <img id="star" src="star.svg" alt="star">${vote_average.toFixed(1)}<br>${movieGenres}
                </div>
            </div>
        </button>
        `;

        currentMovie = {id, original_title}
        wrapper.appendChild(movieEl);
    });

    new Splide(`#${sliderId}`, {
        perPage: 7,
        gap: '1rem',
        pagination: false,
        arrows: true,
    }).mount();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value
    if (searchTerm) {
        getMovies(SRCH_URL + '&query=' + searchTerm , 'searched_movies_wrapper' , 'searched_movies' );
        window.scrollTo({
            top: 500,
            behavior: 'smooth'  
        })
}});

function setupWrapperClickListener(wrapper) {
    if (wrapper) {
        wrapper.addEventListener('click', (e) => {
            const movieButton = e.target.closest('.movie_button');
            if (movieButton) {
                e.preventDefault();
                const movie_id = movieButton.getAttribute('data-movie-id');
                console.log( movie_id +  ' clicked');
                getDetails(`https://api.themoviedb.org/3/movie/${movie_id}?${API_KEY}&language=en-US`)
            }
                window.scrollTo({
                    top: 150,
                    behavior: 'smooth'  
                })
        })
    }
}

setupWrapperClickListener(wrapper1);
setupWrapperClickListener(wrapper2);
setupWrapperClickListener(wrapper3);
setupWrapperClickListener(wrapper4);
setupWrapperClickListener(wrapper5);

