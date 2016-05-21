import React from 'react';

export default class PhotoEdit extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            questId: params.questId,
            photo: params.photo,
            description: params.photo.description,
            deleted: false
        };
        console.log(this.state);
    }

    updateDescription (event) {
        this.setState({description: event.target.value});
    }

    saveDescription (event) {
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
            this.setState({});
        });
    }

    deletePhoto(photoId) {
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
        return (
            <li className="photo-form" >
                <img src={this.state.photo.link}/>
                <input className="photo-form__description" type="text" value={this.state.description}
                    onChange={this.updateDescription.bind(this)}/>
                <input className="photo-form__save-button" type="button" value="Сохранить" onClick={this.saveDescription.bind(this)}/>
                <input className="photo-form__delete-button" type="button" value="Удалить" onClick={this.deletePhoto.bind(this)}/>
            </li>
        );
    }
}
