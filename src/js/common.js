import "../css/styles.css";
import Notiflix from 'notiflix';
import axios from "axios";

import { createMarkupCard } from './markup';

const perPage = 40;
let searchQuery = '';
let page = 1;

const API_KEY = '36047185-510fc5005b993828af62621e5';
// const API_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`;

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', handleLoadMore)

async function serviceImg(searchQuery, page = 1) {
  try {
    const response = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}&q=${searchQuery}`);
    return response.data.hits;
  } catch (error) {
    console.error(error);
    // Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    // return [];
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    Notiflix.Notify.warning('Please enter a search query');
    return;
  }
  const images = await serviceImg(searchQuery, page);
  if (images.length === 0) {
    Notiflix.Notify.warning('No images found');
    return;
  }
  renderImages(images);
  loadMoreBtn.classList.remove('is-hidden');
}

function renderImages(images) {
  const markup = createMarkupCard(images);
  gallery.insertAdjacentHTML('beforeend', markup);
}

let isLoading = false;

async function handleLoadMore() {
  if (isLoading) {
    return;
  }
  isLoading = true;
  page += 1;
  const images = await serviceImg(searchQuery, page);
  if (images.length > 0) {
    renderImages(images);
    isLoading = false;
  }
  else {
    Notiflix.Notify.warning('No more images to load');
    loadMoreBtn.classList.add('is-hidden');
  }
}












