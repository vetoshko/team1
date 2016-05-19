import React from 'react';
import ReactDOM from 'react-dom';
import CommentList from "../comments/CommentList.jsx";
import PhotoList from "../photos/PhotoList.jsx";
import QuestEdit from "./QuestEdit.jsx";
import 'whatwg-fetch';

export class Quest extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            _id: params._id,
            name: params.name,
            author: params.author,
            description: params.description,
            city: params.city,
            comments: params.comments,
            photo: params.photo,
            likes: params.likes,
            url: params.url
        };
    }

    componentWillMount() {
        var done = (data => {
            this.setState(data.quest);
        });
        fetch(this.state.url +'/info', {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json();
        }).then(function (text) {
            done(text);
        }).catch(err => {
            done(err);
        });
    }

    edit() {
        ReactDOM.render(
            <QuestEdit url={this.state.url} />,
            document.getElementById('quest-info')
        );
    }

    deleteQuest() {
        fetch(this.state.url, {
            method: 'delete',
            credentials: 'same-origin'
        });
        location.assign('/quests');
    }

    render() {
        var likesAmount;
        if (!this.state.likes) {
            likesAmount = 0;
        } else {
            likesAmount = this.state.likes.length
        }
        var photos = this.state.photo ? this.state.photo.map(
            (photo) =>
                <div className="photo-list" key={photo._id}>
                    <img src={photo.link}/>
                    <div className="photo__description">
                        {photo.description}
                    </div>
                </div>) : '';
        return (
            <div className="quest-info">
                <div className="quest-info__name">
                    {this.state.name}
                </div>
                <div className="quest-info__likes">
                    {likesAmount} ♥
                </div>
                <div className="quest-info__author">
                    {this.state.author}
                </div>
                <div className="quest-info__city">
                    {this.state.city}
                </div>
                <div className="quest-info__description">
                    {this.state.description}
                </div>
                <div className="photo-list">
                    <div className="photo-list__header">
                        Фотографии:
                    </div>
                    <ul>
                        {photos}
                    </ul>
                </div>
                <input className="quest-form__edit-button" type="button" value="Редактировать" onClick={this.edit.bind(this)}/>
                <input className="quest-form__delete-button" type="button" value="Удалить" onClick={this.deleteQuest.bind(this)}/>
                <CommentList comments={this.state.comments} id={this.state._id} key={this.state.url}/>
            </div>
        );
    }
}

export function render(url) {
    ReactDOM.render(
        <Quest url={url} />,
        document.getElementById('quest-info')
    );
}
