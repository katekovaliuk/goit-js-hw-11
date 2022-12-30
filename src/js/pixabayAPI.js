import axios from 'axios';

const API_KEY = '32407938-5c1f59848a63261ba72664717';

axios.defaults.baseURL = 'https://pixabay.com/api/'

export class PicturesAPI{
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    async getImagesFromAPI() {
        const options = new URLSearchParams({
            key: API_KEY,
            page: this.page,
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            per_page: 40,
        });
        
        const { data }= await axios(`?${options}`);
        // console.log(data);
        this.page += 1;
        return data;
    }

    resetPage(){
        this.page = 1;
    }

    get query(){
        return this.searchQuery;
    }
    set query(newQuery){
        this.searchQuery = newQuery;
    }
        

}

