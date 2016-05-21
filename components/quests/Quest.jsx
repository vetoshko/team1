import React from 'react';
import ReactDOM from 'react-dom';
import CommentList from "../comments/CommentList.jsx";
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

    getRoles(quest, callback) {
        var done = ((err, data) => {
            if (err) {
                console.log(err);
            } else {
                this.setState({
                    quest,
                    userRole: data.userRole,
                    questStatus: data.questStatus,
                    photosStatus: data.photos
                }, callback);
            }
        });
        fetch('/users/getCurrentState?questId=' + quest._id, {
            method: 'get',
            credentials: 'same-origin'
        }).then(function(response) {
            return response.json();
        }).then(function(text) {
            done(null, text);
        }).catch(err => {
            done(err);
        });
    }

    startQuest() {
        var done = ((err, data) => {
            if (err) {
                console.log(err);
            } else {
                if (data.status === 200) {
                    this.setState({
                        questStatus: 'started'
                    });
                }
            }
        });
        fetch('/users/startQuest', {
            method: 'post',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
           },
            credentials: 'same-origin',
            body: JSON.stringify({questId: this.state._id})
        }).then(function(response) {
            console.log(response);
            return response;
        }).then(function(text) {
            done(null, text);
        }).catch(err => {
            done(err);
        });

    }
    componentWillMount() {
        var done = ((err, data) => {
            if (err) {
                console.log(err);
            } else {
                this.getRoles(data.quest, () => {
                    this.setState(data.quest);
                });
            }
        });
        fetch(this.state.url + '/info', {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json();
        }).then(function(text) {
            done(null, text);
        }).catch(err => {
            done(err);
        });
    }

    edit() {
        ReactDOM.render(
            <QuestEdit url={this.state.url}/>, document.getElementById('quest-info'));
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
        if (!this.state._id) {
            return null;
        }
        if (!this.state.likes) {
            likesAmount = 0;
        } else {
            likesAmount = this.state.likes.length
        }
        var photos = this.state.photo
            ? this.state.photo.map((photo) => {
                var photoElement;
                if (this.state.photosStatus && !this.state.photosStatus[photo._id] &&
                    this.state.userRole === 'user' && this.state.questStatus === 'started') {
                    return (
                        <div className="photo-list" key={photo._id}>
                            <img src={photo.link}/>
                            <div className="photo__description">
                                {photo.description}
                            </div>
                            <input type="button" value="Сдать"/>
                        </div>
                    )
                } else {
                    return (
                        <div className="photo-list" key={photo._id}>
                            <img src={photo.link}/>
                            <div className="photo__description">
                                {photo.description}
                            </div>
                        </div>
                    )
                }
                {photoElement}
            })
            : '';

        var buttonsBlock = this.state.userRole === 'admin' || this.state.questStatus === 'author'
            ? <div className="buttons">
                    <input className="quest-form__edit-button" type="button" value="Редактировать" onClick={this.edit.bind(this)}/>
                    <input className="quest-form__delete-button" type="button" value="Удалить" onClick={this.deleteQuest.bind(this)}/>
                </div>
            : '';
        var startButton = this.state.questStatus === 'notStarted' && this.state.userRole === 'user'
            ? (<input className="" type="button" value="Начать квест" onClick={this.startQuest.bind(this)}/>)
            : '';
        return (
            <div className="quest-info">
                <div className="quest-info__name">
                    {this.state.name}
                </div>
                <div className="quest-info__likes">
                    {likesAmount}
                    ♥
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
                {buttonsBlock}
                {startButton}
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
