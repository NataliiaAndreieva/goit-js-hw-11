import "./css/styles.css";
import Notiflix from 'notiflix';
import axios from "axios";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '36047185-510fc5005b993828af62621e5';
const API_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}& image_type=photo & orientation=horizontal & safesearch=true & per_page=40 & page=${ page }`;

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

async function serviceImg(query, page = 1) {
  const response = await axios.get(API_URL);
  return response;
}
