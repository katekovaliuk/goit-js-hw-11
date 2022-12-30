import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PicturesAPI } from './js/pixabayAPI.js';
import { LoadMoreBtn } from './js/loadMoreBtn.js';
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
import simpleLightbox from 'simplelightbox';


const refs = {
    searchForm: document.querySelector('#search-form'),  
    buttonSubmit: document.querySelector('form button'),
    // loadMoreBtn: document.querySelector('.load-more'),
    gallery: document.querySelector('.gallery'),
}

refs.searchForm.addEventListener('submit', onFormSubmit);

const pictureAPI = new PicturesAPI();
const loadMoreBtn = new LoadMoreBtn('load-more', onLoadMoreBtn);
const simpleLightBox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionDelay: 250,
    captionSelector: 'img',
    captionPosition: 'bottom',
    captionsData: 'alt',
});
simpleLightBox.on('show.simpleLigthBox', function (e) { });



async function onFormSubmit(e) {

    e.preventDefault();
    clearRequestedInfo();

    pictureAPI.query = e.currentTarget.elements.searchQuery.value.trim()
    if (pictureAPI.query === '') {
        Notify.warning('Enter something');
        return;
    }

    pictureAPI.resetPage();

    try {
        const { hits, totalHits } = await pictureAPI.getImagesFromAPI();
            if (hits.length === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                refs.gallery.innerHTML = '';
                loadMoreBtn.hide();
                return;
            }
        
        Notify.success(`Hooray! We found ${totalHits} images.`)
        renderGallery(hits);
        simpleLightBox.refresh()
        if (totalHits < 40) {
            loadMoreBtn.hide();
            Notify.info(`We're sorry, but you've reached the end of search results.`)
        } else {
            loadMoreBtn.show();
        }
        
        // console.log(data);
    } catch (error) {
           Notify.failure('Something wrong')
    }    
    
}


function renderGallery(hits) {
      const markup = hits
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `<div class="photo-card">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`;
        })
        .join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);

}

async function onLoadMoreBtn() {
    loadMoreBtn.loading();
      try {
          const { hits } = await pictureAPI.getImagesFromAPI();
          if (hits.length < 40) {
              Notify.info(`We're sorry, but you've reached the end of search results.`)
              loadMoreBtn.hide();
          };
          renderGallery(hits);
          simpleLightBox.refresh();
          loadMoreBtn.endLoading();

          
        // console.log(data);
    } catch (error) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.')    
    }  
}


function clearRequestedInfo() {
    refs.gallery.innerHTML = '';
};
