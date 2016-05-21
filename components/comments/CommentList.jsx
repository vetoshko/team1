import React from 'react';
import Comment from "./Comment.jsx";

export default class CommentList extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            comments: params.comments,
            newComment:"",
            questId: params._id,
            currentUserId: ""
        };
    }

    addComment() {
        fetch('/quests/'+this.props.id +'/comments', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({text: this.state.newComment}),
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json();
        }).then(json => {
            this.state.comments.push(this.commentObjectToReactComment(json.comment));
            this.setState({newComment: ""});
        });
    }

    commentObjectToReactComment(comment) {
        comment.author = comment.author._id;
        return comment;
    }

    change(element) {
        this.setState({newComment: element.target.value});
    }

    componentWillMount () {
        var done = ((err, data) => {
            if (!err && data.user) {
                this.setState({currentUserId: data.user._id});
                this.setState({comments: this.props.comments});
            }
        });
        fetch('/users/getCurrentUser', {
            method: 'get',
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            done(null, json);
        }).catch(err => {
            done(err);
        });
    }

    render() {
        var commentNodes = this.state.comments ? this.state.comments.map(
            (comment) => <Comment {...comment} questId={this.props.id} currentUserId={this.state.currentUserId} key={comment._id} />) : '';
        return (
            <div className="comment-list">
                <div className="comment-list__header">
                    Комментарии:
                </div>
                <ul>
                    {commentNodes}
                </ul>
                <input className="comment-list__text-field" type="text" placeholder="Ваш комментарий" value={this.state.newComment} onChange={this.change.bind(this)}/>
                <input className="comment-list__add-button" type="button" value="Добавить" onClick={this.addComment.bind(this)}/>
            </div>
        );
    }
}
