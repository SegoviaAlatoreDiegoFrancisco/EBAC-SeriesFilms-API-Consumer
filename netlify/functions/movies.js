export default async (request) => {
    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
        return Response.json({ error: "TMDB_API_KEY No está configurada." }, { status: 500 });
    }

    const params = new URL(request.url).searchParams;
    const query = params.get("query")?.trim();
    const endpoint = query ? "search/movie" : "movie/popular";
    const tmdbUrl = new URL(`https://api.themoviedb.org/3/${endpoint}`);

    tmdbUrl.searchParams.set("api_key", apiKey);
    tmdbUrl.searchParams.set("language", params.get("language") || "es-MX");
    tmdbUrl.searchParams.set("page", params.get("page") || "1");

    if (query) {
        tmdbUrl.searchParams.set("query", query);
        tmdbUrl.searchParams.set(
            "include_adult",
            params.get("include_adult") || "false"
        );
    }

    const response = await fetch(tmdbUrl);

    return new Response(await response.text(), {
        status: response.status,
        headers: { "content-type": "application/json" }
    });
};