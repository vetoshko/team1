import React from 'react';

export default class Comment extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            username: params.username,
            text: params.text,
            date: params.date,
            id: params._id
        };
    }

    render() {
        return (
            <li>
                <div className="comment-info">
                    <div className="comment-info__author">
                        {this.state.id}. {this.state.username}
                    </div>
                    <div className="comment-info__date">
                        {this.state.date}
                    </div>
                </div>
                <div className="comment__text">
                    {this.props.text}
                </div>
            </li>);

    }
}
