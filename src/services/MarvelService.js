import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=f65f5a21349dce7531dd6bd0db9e3868';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);

        return _transformCharacter(res.data.results[0]);
    }

    //для стр комиксов

    const getComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?${_apiKey}`);
        return res.data.results.map(_transformComics)
    }
    
    const _transformComics = (comics) => {
        console.log(comics);
        return {
            id: comics.id,
            name: comics.title,
            price: comics.prices[0].price === 0 ? 'Not available' : comics.prices[0].price + '$',
            image: comics.thumbnail.path + '.' + comics.thumbnail.extension
        }
    }

    const _transformCharacter = (character) => {
        return {
            id: character.id,
            name: character.name,
            description: character.description ? `${character.description.slice(0, 210)}...` : 'There`s no description for this character',
            thumbnail: character.thumbnail.path + '.' + character.thumbnail.extension,
            homepage: character.urls[0].url,
            wiki: character.urls[1].url,
            comics: character.comics.items,
        }
    }

    return {loading, error, getAllCharacters, getCharacter, clearError, getComics};
}

export default useMarvelService;