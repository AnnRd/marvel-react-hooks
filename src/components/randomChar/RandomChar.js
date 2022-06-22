import { useState, useEffect } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
    const [character, setCharacter] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar();
    }, [])

    

    const onCharLoading = () => {
        setLoading(true);
    }

    const onCharLoaded = (character) => {
        setCharacter(character);
        setLoading(false);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); //  * (max - min) + min
        onCharLoading();

        marvelService
            .getCharacter(id)
            .then(onCharLoaded)
            .catch(onError)
    }

        const content = !loading && !error ? <View character={character}/> : null;
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error? <ErrorMessage/> : null;

        return (
            <div className="randomchar">
                {content}
                {spinner}
                {errorMessage}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={updateChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
      

}

const View = ({character}) => {
    const {name, description, thumbnail, homepage, wiki} = character;
    const notAvailableImg = thumbnail.includes('image_not_available');

    return (
        <div className="randomchar__block">
                    <img src={thumbnail} alt="Random character" style={{objectFit: notAvailableImg ? 'contain' : 'cover'}} className="randomchar__img"/>
                    <div className="randomchar__info">
                        <p className="randomchar__name">{name}</p>
                        <p className="randomchar__descr">
                            {description}
                        </p>
                        <div className="randomchar__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
    )
}

export default RandomChar;