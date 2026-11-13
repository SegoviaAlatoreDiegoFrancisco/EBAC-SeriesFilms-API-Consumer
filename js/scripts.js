// Construye una tarjeta del carrusel con el título, la descripción y si hay una URL, una imagen. Devuelve el elemento <li> para agregar a la lista
const createCard = ({title,imageUrl, description}) =>{
    const slide = document.createElement('li');
    slide.classList.add('carousel__slide');

    const article = document.createElement('article');
    article.classList.add('carousel__card');

    if (imageUrl){
        const img = document.createElement('img');
        img.classList.add('carousel__image');
        img.src=imageUrl;
        img.alt= (`Poster de ${title}`);
        img.loading = 'lazy';
        article.appendChild(img);
    }

    const heading = document.createElement('h2');
    heading.textContent=title;

    const sumary = document.createElement('p');
    sumary.textContent = description;

    article.append(heading, sumary);
    slide.appendChild(article);

    return slide;
}

//Convierte el contenido que llevan los resumenes de tvmaze en texto sin etiquetas
const getPlainText = (html ="")=>{
    const documentFromHtml = new DOMParser().parseFromString(html, "text/html");
    return documentFromHtml.body.textContent.trim();
}

//muestra un mensaje para el estado de la sección registra el error en la consola.
const showError = (section, message, error)=>{
    const status = section.querySelector('.carousel__status');
    status.textContent = message;
    console.error(error);
}

//solicita las series a TVmaze, crea tarjetas con los primeros 12 resultados y actualiza el mensaje de estado
const loadSeries = async (section) =>  {
    const list = section.querySelector(".carousel__list");
    const status = section.querySelector(".carousel__status");

    try{
        const response = await axios.get("http://api.tvmaze.com/shows", {
            params: {limit: 12}
        });

        const shows = response.data.slice(0,12);
        const cards = shows.map((show) => createCard({
            title: show.name,
            imageUrl: show.image?.medium,
            description: getPlainText(show.summary || "")
        }));
        console.log(response);
        list.replaceChildren(...cards);
        status.textContent = `${cards.length} series cargadas.`;
    }catch ( error){
        showError(section, "No fue posible cargar las series. Intenta de nuevo. ", error);
    }
};

//Busqueda por palabra clave
const searchSerie = async (section) =>{
    const list = section.querySelector(".carousel__list");
    const status = section.querySelector(".carousel__status");
    const showName = document.getElementById('serie-search').value.toLowerCase();
    if(showName){
        try{
            const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${showName}`,{params:{limit:12}});
    
            const shows = response.data.slice(0,12);
            const cards = shows.map((show)=> createCard({
                title:show.show.name,
                imageUrl: show.show.image?.medium,
                description: getPlainText(show.show.summary || "")
            }));
            console.log(response);
            list.replaceChildren(...cards);
            status.textContent = `${cards.length} series cargadas.`;
        }catch(error){
            showError(section, "No fue posible cargar las series. Intentalo de nuevo. ",error);
        }
    }
};
const serieSection = document.querySelector("#series");
document.getElementById('serie__search-button').addEventListener('click',() => searchSerie(serieSection));
document.getElementById('serie-search').addEventListener('keypress', function(e){
    if (e.key ==='Enter'){
        searchSerie(serieSection);
    }
})

//verifica que exista un TMDB_API_KEY, y crea tarjetas con los 12 primeros resultados
const loadMovies = async  (section) => {
    const list = section.querySelector(".carousel__list");
    const status = section.querySelector(".carousel__status");

    if(!TMDB_API_KEY){
        status.textContent ="Agrega la API correcta de TMDB para cargar películas.";
        return;
    }

    try{
        const response = await axios.get("https://api.themoviedb.org/3/movie/popular",{
            params:{
                api_key:TMDB_API_KEY,
                language: "es-MX",
                page:1
            }
        });
        
        const movies = response.data.results.slice(0,12);
        const cards = movies.map((movie)=> createCard({
            title:movie.title,
            imageUrl: movie.poster_path
            ?` https://image.tmdb.org/t/p/w500${movie.poster_path}`:"",
            description: movie.overview
        }));
        list.replaceChildren(...cards);
        status.textContent = `${cards.length} peliculas cargadas`;
    }catch(error){
        showError(section, "No fue posible cargar las películas. Vuelve a intentar mas tarde.",error);
    }
};

//añade a los botones la funcionalidad de desplazar el contenido adelante o atrás
const setupCarouselControls = () => {
    document.querySelectorAll(".carousel-section").forEach((section) =>{
        const list = section.querySelector(".carousel__list");
        
        section.querySelectorAll(".carousel__button").forEach((button) => {
            button.addEventListener("click", ()=>{
                const firstSlide = list.querySelector(".carousel__slide");
                
                if(!firstSlide) return;
                
                const styles = window.getComputedStyle(list);
                const gap = Number.parseFloat(styles.columnGap) || 0;
                const direction = Number(button.dataset.direction);
                
                list.scrollBy({
                    left:  direction * (firstSlide.getBoundingClientRect().width + gap),
                    behavior:"smooth"
                });
            });
        });
    });
};

const initializePage = ()=>{
    setupCarouselControls();
    const seriesSection = document.querySelector("#series");
    const moviesSection = document.querySelector("#movies");
    
    if(seriesSection) loadSeries(seriesSection);
    if(moviesSection) loadMovies(moviesSection);
};

document.addEventListener("DOMContentLoaded", initializePage, {once:true});