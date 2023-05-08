import axios from 'axios';

export async function fetchImages(searchQuery, page, perPage) {
  const baseUrl = 'https://pixabay.com/api/';
  const KEY = '36047185-510fc5005b993828af62621e5';
  const filter = `?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  const response = await axios.get(`${baseUrl}${filter}`);
  return response;
}
