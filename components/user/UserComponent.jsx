import React from 'react';
import ReactDOM from 'react-dom';
import UserInfo from './UserInfoComponent.jsx';
import UserEdit from './UserEditComponent.jsx';
import ShortQuestList from './ShortQuestList.jsx';

class User extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            user: {}
        };
    }

    componentWillMount() {
        var pageOwner;
        fetch('/users/' + document.getElementById('user').getAttribute('data-userId'), {
            method: 'get',
            credentials: 'same-origin'
        }).then(response => {
            return response.json();
        }).then(json => {
            pageOwner = json.doc;
            return fetch('/users/getCurrentUser', {
                method: 'get',
                credentials: 'same-origin'
            });
        }).then(response => {
            if (response.status == 401) {
                return null;
            }
            return response.json();
        }).then(json => {
            if (!json) {
                return 'info';
            }
            if (json.user._id == pageOwner._id) {
                return 'edit';
            }
            return 'info';
        }).then(mode => {
            this.setState({
                user: pageOwner,
                mode
            });
        });
    }

    render() {
        if (!this.state.user._id) {
            return null;
        }

        var userBlock = this.state.mode == 'info' ? (
            <UserInfo user={this.state.user}/>
        ) : (
            <UserEdit user={this.state.user}/>
        );

        return (
            <article class="user-page">
                {userBlock}
                <span className="quests-label">Мои квесты</span>
                <ShortQuestList quests={this.state.user.ownedQuests}/>
                <span className="quests-label">Квесты, которые я проходил</span>
                <ShortQuestList quests={this.state.user.startedQuests}/>
            </article>
        );

    }
}

ReactDOM.render(
    <User />,
    document.getElementById('user')
);
