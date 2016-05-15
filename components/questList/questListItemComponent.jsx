import React from 'react';

export default class QuestListItemComponent extends React.Component {

    likeshandle() {

    }

    render() {
        return (
            <li className="quest-list__item" id={this.props.id}>
                <h3 className="quest-list__field-name">
                    <a href="#">{this.props.quest.name}</a>
                </h3>
                <div className="quest-list__author">
                    <i className="fa fa-user" aria-hidden="true"></i>
                    <a>{this.props.quest.author.username}</a>
                </div>
                <div className="quest-list__main">
                    <div className="quest-list__image-container">
                        <img className="quest-list__image" src={this.props.link}/>
                    </div>
                    <div className="quest-list__description">
                        {this.props.quest.description}
                    </div>
                </div>
                <div className="quest-list__more">
                    <div className="quest-list__date">
                        <div className="quest-list__date-icon">
                            <i className="fa fa-calendar-o" aria-hidden="true"></i>
                        </div>
                        <time className="quest-list__date">{this.props.date}</time>
                    </div>
                    <div className="quest-list__likes" onclick={this.likeshandle()}>
                        <div className="quest-list__like-count">{this.props.likes}</div>
                        <div className="quest-list__like-icon">
                            <i className="fa fa-heart-o" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}