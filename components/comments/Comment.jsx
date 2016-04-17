import React from 'react';
import styles from './Comment.styl';

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
                <div className={styles.comment__meta}>
                    <div className={styles.comment__author}>
                        {this.state.id}. {this.state.username}
                    </div>
                    <div className={styles.comment__date}>
                        {this.state.date}
                    </div>
                </div>
                <div className={styles.comment__text}>
                    {this.props.text}
                </div>
            </li>);

    }
}
