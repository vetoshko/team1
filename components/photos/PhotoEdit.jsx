import React from 'react';

export default class PhotoEdit extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            questId: params.questId,
            photo: params.photo,
            description: params.photo.description,
            deleted: false,
            editMode: false
        };
    }

    startEditing() {
        this.setState({editMode: true});
    }

    editComment(element) {
        this.setState({newText: element.target.value});
    }

    updateDescription (event) {
        this.setState({description: event.target.value});
    }

    saveDescription () {
        fetch('/quests/'+this.state.questId +'/'+this.state.photo._id, {
            method: 'put',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({description: this.state.description}),
            credentials: 'same-origin'
        }).then(response => {
            if (response.status == 200) {
                this.state.photo.description = this.state.description;
            } else {
                this.state.description = this.state.photo.description;
            }
            this.setState({editMode: false});
        });
    }

    deletePhoto() {
        fetch('/quests/'+this.state.questId+'/'+this.state.photo._id, {
            method: 'delete',
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
            <div className="photo-description__edit-form">
                <input className="photo-description__edit-input" type="text" value={this.state.description} onChange={this.updateDescription.bind(this)}/>
                <input className="photo-description__edit-button" type="button" value="Сохранить" onClick={this.saveDescription.bind(this)}/>
            </div> :
            <div className="photo-description">
                {this.state.description}
                <input className="comment__edit" type="button" value="Редактировать" onClick={this.startEditing.bind(this)}/>
            </div>;
        return (
            <li className="photo-form" >
                <img src={this.state.photo.link}/>
                {editMode}
                <input className="photo-form__delete-button" type="button" value="Удалить" onClick={this.deletePhoto.bind(this)}/>
            </li>
        );
    }
}
