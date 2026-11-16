
# Series y películas — API Consumer

Aplicación web de práctica que consume APIs y construye su contenido dinámicamente. El proyecto utiliza HTML semántico, JavaScript vanilla, Axios y SASS.

# Desplegado en Netlify

- [Sitio para consultar Series y Películas]([api-consummer-segovia.netlify.app](https://api-consummer-segovia.netlify.app/))

## Funcionalidades

- Muestra series populares y permite buscarlas por nombre usando TVmaze.
- Muestra películas populares y permite buscarlas por nombre usando TMDB.
- Genera tarjetas de contenido dinámicamente.
- Incluye carruseles horizontales con controles de navegación.
- Presenta mensajes de carga y error en las secciones de resultados.

## Tecnologías

- HTML semántico
- JavaScript vanilla
- Axios
- SASS y CSS
- Netlify Functions para consultar TMDB sin exponer la API key en el navegador

## APIs utilizadas

- [TVmaze API](https://www.tvmaze.com/api) — series y búsqueda de series.
- [The Movie Database (TMDB) API](https://developer.themoviedb.org/docs) — películas populares y búsqueda de películas.

## Ejecutar localmente

Para probar las consultas de películas, ejecuta el proyecto con Netlify Dev. Un servidor estático como Live Server no ejecuta las Netlify Functions.

1. Crea un archivo `.env` en la raíz del proyecto:

   ```env
   TMDB_API_KEY=tu_api_key_de_TMDB
   ```
