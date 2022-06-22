import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component{
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemsLoading: false,
        offset: 210,
        charListEnd: false,
        selected: null,
    };

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest(); //запускается и при первичной загрузке => аргумента нет и метод ориенируется на _baseOffset в MarvelService
    }

    onRequest = (offset) => {
        this.onCharListLoading();

        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemsLoading: true
        })
    }

    onCharLoaded = (newCharList) => {
        let end = false;
        if (newCharList.length < 9) {
            end = true;
        }

        this.setState( ({charList, offset}) => ({
            charList: [...charList, ...newCharList],  //развернула старый массив персонажей и за ним добавила новый. При первичной загрузке charlist - пустой массив
            loading: false,
            newItemsLoading: false,
            offset: offset + 9,
            charListEnd: end,
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    handleClick = ()  => {
        this.setState({
          selected: this.props.charId
        })
      }

    renderCharacters(arr) {
        const characters = arr.map( obj => {
            let imgStyle = {'objectFit' : 'cover'};
            if (obj.thumbnail.includes('image_not_available')) {
                imgStyle = {'objectFit' : 'unset'};
            }            

            let selectedClass = 'char__item  char__item_selected';

            return (
                <li
                className={this.props.charId === obj.id ? selectedClass : 'char__item'}
                key={obj.id}
                onClick={() => {
                    this.handleClick();
                    this.props.onCharSelected(obj.id)
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
    

    render() {
        const {charList, loading, error, newItemsLoading, offset, charListEnd} = this.state;
        
        const items = this.renderCharacters(charList);

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
                onClick={() => {this.onRequest(offset)}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;