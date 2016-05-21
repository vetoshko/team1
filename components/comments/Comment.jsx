import React from 'react';
import moment from 'moment';
import 'moment/locale/ru';

export default class Comment extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            author: params.author,
            text: params.text,
            date: params.date,
            id: params._id,
            newText: "",
            questId: params.questId,
            editMode: false,
            deleted: false,
            username: ""
        };
    }

    componentWillMount() {
        fetch('/users/'+this.props.author, {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            credentials: 'same-origin'
        }).then(response => {
            return response.json();
        }).then(json => {
            if (json.doc) {
                this.setState({username: json.doc.username});
            }
        });
    }

    startEditing() {
        this.setState({editMode: true, newText: this.state.text});
    }

    editComment(element) {
        this.setState({newText: element.target.value});
    }

    saveComment() {
        if (this.state.newText === "") {
            return;
        }
        fetch('/quests/'+this.state.questId +'/comments', {
            method: 'put',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({commentId: this.state.id, text: this.state.newText}),
            credentials: 'same-origin'
        }).then(response => {
            if (response.status < 400) {
                this.setState({text: this.state.newText, editMode: false});
            }
        });
    }

    deleteComment() {
        fetch('/quests/'+this.props.questId +'/comments', {
            method: 'delete',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({commentId: this.state.id}),
            credentials: 'same-origin'
        }).then(response => {
            if (response.status < 400) {
                this.setState({deleted: true});
            }
        });
    }

    render() {
        if (this.state.deleted) {
            return null;
        }

        var editMode = this.state.editMode ?
            <div className="comment__edit-input-container">
                <textarea className="comment__edit-input" type="text" value={this.state.newText}
                       onChange={this.editComment.bind(this)}/>
                <input className="comment__edit-button" type="button" value="Сохранить"
                       onClick={this.saveComment.bind(this)}/>
            </div> :
            <button className="comment__edit" title="Редактировать"
                    onClick={this.startEditing.bind(this)}>
                <i className="fa fa-pencil" aria-hidden="true"></i></button>;

        var editArea = this.state.author == this.props.currentUserId ?
            <div className="comment__edit-area">
                {editMode}
                <button className="comment__delete-button" title="Удалить"
                        onClick={this.deleteComment.bind(this)}
                        style={this.state.editMode ? {display: 'none'} : {display: 'inline'}}>
                    <i className="fa fa-trash-o" aria-hidden="true"></i></button>
            </div> : "";
        var authorLink = '/users/' + this.state.author + '/profile';

        return (
            <li>
                <div className="comment-info">
                    <div className="comment-info__author">
                        <a href="{authorLink}" className="comment-info__link">{this.state.username}</a>
                    </div>
                    <div className="comment-info__date">
                        {moment(this.state.date).format('MMMM DD YYYY, h:mm:ss')}
                    </div>
                </div>
                <div className="comment__text"
                     style={this.state.editMode ? {display: 'none'} : {display: 'block'}}>
                    {this.state.text}
                </div>
                {editArea}
            </li>);

    }
}
