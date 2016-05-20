import React from 'react';

export default class Comment extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            username: params.author,
            text: params.text,
            date: params.date,
            id: params._id,
            newText: "",
            questId: params.questId,
            editMode: false,
            deleted: false
        };
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
            <div className="comment__edit-input">
                <input className="comment__edit-input" type="text" value={this.state.newText} onChange={this.editComment.bind(this)}/>
                <input className="comment__edit-button" type="button" value="Редактировать" onClick={this.saveComment.bind(this)}/>
            </div> :
            <input className="comment__edit" type="button" value="Редактировать" onClick={this.startEditing.bind(this)}/>;
        var editArea = this.state.username == this.props.currentUserId ?
            <div className="comment__edit-area">
                {editMode}
                <input className="comment__delete-button" type="button" value="Удалить" onClick={this.deleteComment.bind(this)}/>
            </div> : "";
        return (
            <li>
                <div className="comment-info">
                    <div className="comment-info__author">
                        {this.state.username}
                    </div>
                    <div className="comment-info__date">
                        {this.state.date}
                    </div>
                </div>
                <div className="comment__text">
                    {this.state.text}
                </div>
                {editArea}
            </li>);

    }
}
