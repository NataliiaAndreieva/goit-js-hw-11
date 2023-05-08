
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchImages } from './js/fetchImage';
// import { createMarkupCard } from './js/markup';

const perPage = 40;
let searchQuery = '';
let page = 1;

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
        loadMoreBtn.classList.add('is-hidden');
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


function createMarkupCard(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
       return `
    <div class="photo-card">
    <a href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
      <div class="info">
        <p class="info-item">
          <b>Likes:<span>${likes}</span></b>
        </p>
        <p class="info-item">
          <b>Views:<span>${views}</span></b>
        </p>
        <p class="info-item">
          <b>Comments:<span>${comments}</span></b>
        </p>
        <p class="info-item">
          <b>Downloads:<span>${downloads}</span></b>
        </p>
      </div>
    </div >
     `;
      }
    )
    .join('');
  
}
// gallery.insertAdjacentHTML('beforeend', createMarkupCard(images));



