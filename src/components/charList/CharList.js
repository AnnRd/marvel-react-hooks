import { useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charListEnd, setCharListEnd] = useState(false);
    const [selected, setSelected] = useState(null); //мое для активного стиля

    const marvelService = useMarvelService();

    useEffect(() => {
        onRequest(); //при первичной загрузке => аргумента нет и метод ориенируется на _baseOffset в MarvelService
    }, []); //пустой массив для отслеживания - функция выполнится только один раз -- при создании компонента.Имитация componentDidMount. useEffect вызыввается после рендера всего.

    const onRequest = (offset) => {
        onCharListLoading();

        marvelService
            .getAllCharacters(offset)
            .then(onCharLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
       setNewItemsLoading(true);
    }

    const onCharLoaded = (newCharList) => {
        let end = false;
        if (newCharList.length < 9) {
            end = true;
        }

        setCharList(charList => [...charList, ...newCharList]); //развернула старый массив персонажей и за ним добавила новый. При первичной загрузке charlist - пустой массив
        setLoading(loading => false);
        setNewItemsLoading(newItemsLoading => false);
        setOffset(offset => offset + 9);
        setCharListEnd(charListEnd => end);
    }

    const onError = () => {
        setError(true);
        setLoading(loading => false);
    }

    const handleClick = ()  => {
        setSelected(selected => props.charId);
      }

    function renderCharacters(arr) {
        const characters = arr.map( obj => {
            let imgStyle = {'objectFit' : 'cover'};
            if (obj.thumbnail.includes('image_not_available')) {
                imgStyle = {'objectFit' : 'unset'};
            }            

            let selectedClass = 'char__item  char__item_selected';

            return (
                <li
                className={props.charId === obj.id ? selectedClass : 'char__item'}
                key={obj.id}
                onClick={() => {
                    handleClick();
                    props.onCharSelected(obj.id)
                }}>
                    <img src={obj.thumbnail} alt={obj.name}  style={imgStyle}/>
                    <div className="char__name">{obj.name}</div>
                </li>
            )
            
        });

        return (
            <ul className="char__grid">
                {characters}
            </ul>
        ) //Для центровки спиннера/ошибки
    }
        
    const items = renderCharacters(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !loading && !error ? items : null;

    return (
        <div className="char__list">
                {content}
                {spinner}
                {errorMessage}
            <button
            className="button button__main button__long"
            disabled={newItemsLoading}
            style={{'display': charListEnd ? 'none' : 'block'}}
            onClick={() => {onRequest(offset)}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )   
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;