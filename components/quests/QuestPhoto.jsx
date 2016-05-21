import React from 'react';
import ReactDOM from 'react-dom';
import {Quest} from "./Quest.jsx";
import CheckInPhoto from './CheckInPhoto.jsx';
import 'whatwg-fetch';

export default class QuestPhoto extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            questId: params.questId,
            photosStatus: params.photosStatus,
            userRole: params.userRole,
            questStatus: params.questStatus,
            photo: params.photo
        };
    }

    checkInPhoto() {
        ReactDOM.render(
            <CheckInPhoto photoId={this.state.photo._id}
                          questId={this.state.questId}
            />, document.getElementById(this.state.photo._id));
    }

    render() {
        console.log('called', this.state);
        if (this.state.photosStatus && !this.state.photosStatus[this.state.photo._id] &&
            this.state.userRole === 'user' && this.state.questStatus === 'started') {
            return (
                <div className="photo-list__elem" id={this.state.photo._id}>
                    <img src={this.state.photo.link}/>
                    <div className="photo__description">
                        {this.state.photo.description}
                    </div>
                    <input type="button" onClick={this.checkInPhoto.bind(this)} value="Сдать"/>
                </div>
            )
        } else {
            return (
                <div className="photo-list__elem" id={this.state.photo._id}>
                    <img src={this.state.photo.link}/>
                    <div className="photo__description">
                        {this.state.photo.description}
                    </div>
                </div>
            )
        }
    }
}
