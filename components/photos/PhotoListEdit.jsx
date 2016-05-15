import React from 'react';

export default class PhotoList extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            photos: params.photos,
            newPhoto: ''
        };
    }

    deletePhoto(photoId) {
        fetch('/quests/'+this.state.id+'/'+photoId, {
            method: 'delete'
        });
    }

    addPhoto(element) {
        fetch('/quests/'+this.state.id, {
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
                <li className="photo-form">
                    <img src={photo.link}/>
                    <input className="photo-form__description" type="text" value={photo.description}/>
                    <input className="photo-form__delete-button" type="button" value="Удалить" onClick={this.deletePhoto.bind(photo.id)}/>
                </li>
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
                    <input className="photo-add-button" type="file" value="" onChange={this.change}/>
                    <input className="photo-add-button" type="submit" value="Добавить" />
                </form>
            </div>
        );
    }
}
