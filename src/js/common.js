import "./css/styles.css";
import Notiflix from 'notiflix';
import axios from "axios";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { createMarkupCard } from './markup';

const API_KEY = '36047185-510fc5005b993828af62621e5';
const API_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}& image_type=photo & orientation=horizontal & safesearch=true & per_page=40 & page=${ page }`;

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const perPage = 40;

form.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', handleLoadMore)

async function serviceImg(query, page = 1) {
  try {
     const response = await axios.get(API_URL);
  return response.data.hits;
  }
  catch (error) {
    console.error(error);
    Notiflix.Notify.failure('Error');
    return [];

  }
  
}

async function handleLoadMore(e) {
  e.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    Notiflix.Notify.warning('')
  }
}

