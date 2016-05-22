import React from 'react';
import ReactDOM from 'react-dom';
import CommentList from "../comments/CommentList.jsx";
import QuestEdit from "./QuestEdit.jsx";
import moment from 'moment';
import 'moment/locale/ru';
import QuestPhoto from './QuestPhoto.jsx';
import 'whatwg-fetch';

export class Quest extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            _id: params._id,
            name: params.name,
            author: params.author,
            date: params.date,
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
        }).then(function (response) {
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
                    data.quest.author = data.quest.author.username;
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
            <QuestEdit url={this.state.url}/>,
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
            console.log(photo);
            return <QuestPhoto
                questId={this.state._id}
                photosStatus={this.state.photosStatus}
                userRole={this.state.userRole}
                questStatus={this.state.questStatus}
                photo={photo}
                key={photo._id}
            />
        })
            : '';

        var buttonsBlock = this.state.userRole === 'admin' || this.state.questStatus === 'author'
            ? <div className="quest-form__container">
            <button className="quest-form__edit-button" onClick={this.edit.bind(this)}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
            </button>
            <button className="quest-form__delete-button"
                    onClick={this.deleteQuest.bind(this)}>
                <i className="fa fa-trash-o" aria-hidden="true"></i>
            </button>
        </div> : '';
        var startButton = this.state.questStatus === 'notStarted' && this.state.userRole === 'user'
            ? (<input className="quest-info__start" type="button" value="Начать квест"
                      onClick={this.startQuest.bind(this)}/>)
            : '';
        return (
            <div className="quest-info">
                {buttonsBlock}
                <h1 className="quest-info__name">
                    {this.state.name}
                </h1>
                <div className="quest-info__meta-inf-wrap">
                    <div className="quest-info__date">
                        {moment(this.state.date).format('MMMM DD, YYYY')}
                    </div>
                    <div className="quest-info__author">
                        <span>|</span>
                        <a href="#" className="quest-info__link">{this.state.author.username}</a>
                    </div>
                    <div className="quest-info__city">
                        <span>|</span>
                        {this.state.city}
                    </div>
                    <br/>
                    {startButton}
                </div>
                <div className="quest-info__description">
                    {this.state.description}
                </div>

                <div className="photo-list">
                    <ul>
                        {photos}
                    </ul>
                </div>

                <div className="quest-info__bottom-meta-inf-wrap">
                        <span className="quest-info__post-like"
                              onClick={this.handleLike.bind(this)}>
                    <span className="quest-info__like">
                        <i ref="likeIcon"
                           className={"fa " + (this.state.isLiked ? "fa-heart" : "fa-heart-o")}
                           aria-hidden="true"></i>
                        <span ref="likesCount"
                              className="quest-info__like-count">{this.state.likes.length}
                        </span>
                    </span>
                </span>
                </div>
                <CommentList comments={this.state.comments} id={this.state._id}
                             key={this.state.url}/>
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
