import React from 'react';

export default class QuestListItemComponent extends React.Component {

    likesHandle() {
        const id = this.props.id;
        const likeIcon = this.refs.likeIcon;
        const likesCount = this.refs.likesCount;
        const isLiked = this.props.quest.isLiked;
        this.props.quest.isLiked = !this.props.quest.isLiked;
        const likedHeartClass = 'fa-heart';
        const dislikedHeartClass = 'fa-heart-o';
        const url = `/quests/${id}/likes`;
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
                    this.props.quest.isLiked = true;
                } else if (isLiked && data.status === 200) {
                    likeIcon.classList.add(dislikedHeartClass);
                    likeIcon.classList.remove(likedHeartClass);
                    likesCount.innerText = parseInt(likesCount.innerText, 10) - 1;
                    this.props.quest.isLiked = false;
                }
            })
    }

    render() {
        var isLiked = this.props.quest.isLiked;
        return (
            <li className="quest-list__item" id={this.props.id}>
                <div className="quest-list__image-container">
                    <img className="quest-list__image" src={this.props.link}/>
                </div>
                <div className="quest-list__entry">
                    <h3 className="quest-list__name">
                        <a className="quest-list__link"
                           href={"/quests/"+this.props.quest._id}>{this.props.quest.name}</a>
                    </h3>
                    <div className="quest-list__author">
                        <i className="fa fa-user" aria-hidden="true"></i>
                        <a href="#"
                           className="quest-list__link">{this.props.quest.author.username}</a>
                    </div>
                    <div className="quest-list__date-container">
                        <i className="fa fa-calendar-o" aria-hidden="true"></i>
                        <time className="quest-list__date">{this.props.date}</time>
                    </div>
                    <div className="quest-list__description">
                        {this.props.quest.description}
                    </div>
                    <hr className="quest-list__line"/>

                    <div className="quest-list__bottom-meta-inf-wrap">
                        <span className="quest-list__post-like" onClick={this.likesHandle.bind(this)}>
                            <span className="quest-list__like">
                                <i ref="likeIcon"
                                   className={"fa " + (isLiked ? "fa-heart" : "fa-heart-o")}
                                   aria-hidden="true"></i>
                                <span ref="likesCount"
                                      className="quest-list__like-count">{this.props.likes.length}
                                </span>
                            </span>
                        </span>
                    </div>
                </div>
            </li>
        );
    }
}
