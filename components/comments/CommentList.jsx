import React from 'react';
import Comment from "./Comment.jsx";

export default class CommentList extends React.Component {
    render() {
        var commentNodes = this.props.comments ? this.props.comments.map(
            (comment) => <Comment {...comment} key={comment._id} />) : '';
        return (
            <div className="comment-list">
                <div className="comment-list__header">
                    Комментарии:
                </div>
                <ul>
                    {commentNodes}
                </ul>
            </div>
        );
    }
}
