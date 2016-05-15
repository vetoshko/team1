import React from 'react';

export default class PhotoList extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            photos: params.photos
        };
    }

    render() {
        var photoNodes = this.state.photos ? this.state.photos.map(
            (photo) =>
                <li>
                    <img src={photo.link} />
                    <div className="photo__description">
                        {photo.description}
                    </div>
                </li>
        ) : '';
        return (
            <div className="photo-list">
                <div className="photo-list__header">
                    Фотографии:
                </div>
                <ul>
                    {photoNodes}
                </ul>
            </div>
        );
    }
}
