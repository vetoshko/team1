import React from 'react';

export default class ShortQuestListItem extends React.Component {
    constructor(params) {
        super(params);
    }

    render() {
        return (
            <div className="short-quest">
                <span className="short-quest__name">
                    <a href={`/quests/${this.props.id}`}>{this.props.name}</a>
                </span>
                <span className="short-quest__author">
                    <a href={`/users/${this.props.author._id}`}>{this.props.author.username}</a>
                </span>
                <img src={this.props.link} className="short-quest__image" />
                <span className="short-quest__description">{this.props.description}</span>
            </div>
        );
    }
}
