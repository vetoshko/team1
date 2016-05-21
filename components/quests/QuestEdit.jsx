import React from 'react';
import ReactDOM from 'react-dom';
import CommentList from "../comments/CommentList.jsx";
import PhotoListEdit from "../photos/PhotoListEdit.jsx";
import {Quest} from "./Quest.jsx";
import 'whatwg-fetch';

export default class QuestEdit extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            _id: params._id,
            name: params.name,
            author: params.author,
            description: params.description,
            city: params.city,
            comments: params.comments,
            photo: params.photo,
            likes: params.likes,
            url: params.url
        };
        console.log(this.state);
    }

    change(param, element) {
        var state = {};
        state[param] = element.target.value;
        this.setState(state);
    }

    save() {
        var url = this.state.url;
        var done = function (url) {
            ReactDOM.render(
                <Quest url={url} />,
                document.getElementById('quest-info')
            );
        };
        fetch('/quests/'+this.state._id, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state),
            credentials: 'same-origin'
        }).then(function () {
            done(url);
        }).catch(err => {
            done(err);
        });
    }

    render() {
        return (
            <div className="quest-form">
                <input className="quest-form__name" type="text"
                       value={this.state.name || ''} onChange={this.change.bind(this, 'name')}/>
                <input className="quest-form__city" type="text"
                       value={this.state.city || ''} onChange={this.change.bind(this, 'city')}/>
                <input className="quest-form__description" type="text"
                       value={this.state.description || ''} onChange={this.change.bind(this, 'description')} />
                <PhotoListEdit photos={this.state.photo} questId={this.state._id} />
                <input className="quest-form__save-button" type="button" value="Сохранить" onClick={this.save.bind(this)}/>
            </div>
        );
    }
}
