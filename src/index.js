
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchImages } from './js/fetchImage';
import { createMarkupCard } from './js/markup';

const perPage = 40;
let searchQuery = '';
let page = 1;

// const API_KEY = '36047185-510fc5005b993828af62621e5';
// // const BASE_URL = 'https://pixabay.com/api/';
// const API_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`;

// // const API_URL = `${BASE_URL}?key=${API_KEY}&q=${images}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadButton);



function onSubmit(e) {
  e.preventDefault();

  searchQuery = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

  if (searchQuery === '') {
    alertNoEmptySearch();
    return;
  }

  fetchImages(searchQuery, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNotFound();
      } else {
        gallery.insertAdjacentHTML('beforeend', createMarkupCard(data.hits));
        alertImgFound(data);
      }
      if (data.totalHits > perPage) {
        loadMoreBtn.classList.remove('is-hidden');
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      form.reset();
    });
}

function onLoadButton(e) {
  page += 1;

  fetchImages(searchQuery, page, perPage)
    .then(({ data }) => {
      gallery.insertAdjacentHTML('beforeend', createMarkupCard(data.hits));
      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page > totalPages) {
        onLoadButton.classList.add('is-hidden');
        alertEndOfSearch();
      }
    })
    .catch(error => console.log(error));
}

function alertImgFound(data) {
  Notify.success(`${data.totalHits} images found.`);
}

function alertNotFound() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function alertNoEmptySearch() {
  Notify.failure(
    'The search string cannot be empty. Please specify your search query.'
  );
}

function alertEndOfSearch() {
  Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
}

// const modalWindow = function () {
//   const lightbox = new SimpleLightbox('.gallery a', {
//     captionsData: 'alt',
//     captionDelay: 300,
//   });
//   return lightbox;
// };





