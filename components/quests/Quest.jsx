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
            url: params.url,
            isLiked: params.isLiked
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
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json();
        }).then(function (text) {
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
            return response;
        }).then(function (text) {
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
        }).then(function (text) {
            done(null, text);
        }).catch(err => {
            done(err);
        });
    }

    edit() {
        ReactDOM.render(
            <QuestEdit {...this.state}/>,
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

    handleLike() {
        const id = this.state._id;
        const likeIcon = this.refs.likeIcon;
        const likesCount = this.refs.likesCount;
        const isLiked = this.state.isLiked;
        var newState = this.state;
        newState.isLiked = !newState.isLiked;
        const likedHeartClass = 'fa-heart';
        const dislikedHeartClass = 'fa-heart-o';
        const url = `/quests/${id}/likes`;
        const self = this;
        fetch(url, {
            method: (isLiked ? 'delete' : 'post'),
            credentials: 'same-origin'
        })
            .then((data) => {
                if (data.status === 401) {
                    location.assign('/signin');
                } else if (!isLiked && data.status === 201) {
                    likeIcon.classList.add(likedHeartClass);
                    likeIcon.classList.remove(dislikedHeartClass);
                    likesCount.innerText = parseInt(likesCount.innerText, 10) + 1;
                    newState.isLiked = true;
                    self.setState(newState);
                } else if (isLiked && data.status === 200) {
                    likeIcon.classList.add(dislikedHeartClass);
                    likeIcon.classList.remove(likedHeartClass);
                    likesCount.innerText = parseInt(likesCount.innerText, 10) - 1;
                    newState.isLiked = false;
                    self.setState(newState);
                }
            })
    }

    render() {
        if (!this.state._id) {
            return null;
        }

        var photos = this.state.photo
            ? this.state.photo.map((photo) => {
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
        })
            : '';

        var buttonsBlock = this.state.userRole === 'admin' || this.state.questStatus === 'author'
            ? <div className="buttons">
            <input className="quest-form__edit-button" type="button" value="Редактировать"
                   onClick={this.edit.bind(this)}/>
            <input className="quest-form__delete-button" type="button" value="Удалить"
                   onClick={this.deleteQuest.bind(this)}/>
        </div>
            : '';
        var startButton = this.state.questStatus === 'notStarted' && this.state.userRole === 'user'
            ? (<input className="" type="button" value="Начать квест" onClick={this.startQuest.bind(this)}/>)
            : '';
        var authorLink = '/users/' + this.state.author._id + '/profile';
        return (
            <div className="quest-info">
                <div className="quest-info__name">
                    {this.state.name}
                </div>
                <span className="quest-list__post-like" onClick={this.handleLike.bind(this)}>
                    <span className="quest-list__like">
                        <i ref="likeIcon"
                           className={"fa " + (this.state.isLiked ? "fa-heart" : "fa-heart-o")}
                           aria-hidden="true"></i>
                        <span ref="likesCount"
                              className="quest-list__like-count">{this.state.likes.length}
                        </span>
                    </span>
                </span>
                <div className="quest-info__author">
                    <a href={authorLink}>{this.state.author.username}</a>
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
                <CommentList comments={this.state.comments} id={this.state._id} key={this.state._id}/>
            </div>
        );
    }
}

export function render(url) {
    ReactDOM.render(
        <Quest url={url}/>,
        document.getElementById('quest-info')
    );
}
