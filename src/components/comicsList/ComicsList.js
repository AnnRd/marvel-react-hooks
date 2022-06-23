import { useEffect, useState } from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {
    const [comicsItem, setComicsItem] = useState([]);


    const {loading, error, getComics} = useMarvelService();

    // useEffect(async () => {
    //     const result = await getComics();

    //     console.log(result);
    // }, [])

    useEffect(() => {
        getComics().then(onComicsLoaded);
    }, [])

    const onComicsLoaded = (com) => {
        setComicsItem(com)
    }

    const renderComics = (arr) => {
        const comics = arr.map(obj => {
            // let imgStyle = {'objectFit' : 'cover'};
            // if (obj.image.includes('image_not_available')) {
            //     imgStyle = {'objectFit' : 'unset'};
            // }

            return (
                <li key={obj.id} className="comics__item">
                    <a href="#">
                        <img src={obj.image} alt="ultimate war" className="comics__item-img"/>
                        <div className="comics__item-name">{obj.name.toUpperCase()}</div>
                        <div className="comics__item-price">{obj.price}</div>
                    </a>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
            {comics}
            </ul>
)
     
    }

   const items = renderComics(comicsItem);
   const errorMessage = error ? <ErrorMessage/> : null;
   const spinner = loading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {items}
            {spinner}
            {errorMessage}
            <button className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )

    
}

export default ComicsList;