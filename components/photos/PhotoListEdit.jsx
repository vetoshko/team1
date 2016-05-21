import React from 'react';
import PhotoEdit from "./PhotoEdit.jsx";

export default class PhotoListEdit extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            questId: params.questId,
            photos: params.photos,
            newPhoto: ''
        };
    }

    addPhoto(element) {
        fetch('/quests/'+this.state.questId, {
            method: 'put',
            body: JSON.stringify(this.state)
        });
    }

    change(element) {
        this.setState({newPhoto: element.target.files[0]});
    }


    render() {
        var photoNodes = this.state.photos ? this.state.photos.map(
            (photo) =>
                <PhotoEdit photo={photo} questId={this.state.questId} key={photo._id} />
        ) : '';
        return (
            <div className="photo-list-editor">
                <div className="photo-list-editor__header">
                    Фотографии:
                </div>
                <ul>
                    {photoNodes}
                </ul>
                <form onSubmit={this.addPhoto} encType="multipart/form-data">
                    <input className="photo-add-button" type="file" value="" onChange={this.change.bind(this)}/>
                    <input className="photo-add-button" type="submit" value="Добавить" />
                </form>
            </div>
        );
    }
}
