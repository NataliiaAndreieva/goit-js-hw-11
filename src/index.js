
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchImages } from './js/fetchImage';
import { createMarkupCard } from './js/markup';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearchForm(e) {
  e.preventDefault();
  window.scrollTo({ top: 0 });
  page = 1;
  query = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('load-more-isHidden');

  if (query === '') {
    alertNoEmptySearch();
    return;
  }

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoImagesFound();
      } else {
        createMarkupCard(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        alertImagesFound(data);

        if (data.totalHits > perPage) {
          loadMoreBtn.classList.remove('load-more-isHidden');
        }
      }
    })
    .catch(error => console.log(error));
}

function alertImagesFound(data) {
  Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function alertNoEmptySearch() {
  Notify.failure(
    'The search string cannot be empty. Please specify your search query.'
  );
}

function alertNoImagesFound() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function onLoadMore() {
  loadMoreBtn.classList.add('load-more-isHidden');
  page += 1;
  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.hits.length === 0) {
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }

      createMarkupCard(data.hits);
      simpleLightBox.refresh();
      loadMoreBtn.classList.remove('load-more-isHidden');
    })
    .catch(error => console.log(error));
}

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const fullHeight = document.body.offsetHeight;

  if (scrollY + viewportHeight >= fullHeight) {
    onLoadMore();
  }
});