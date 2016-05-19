import React from 'react';
import ReactDOM from 'react-dom';
import UserInfo from "./userInfoComponent.jsx";
import QuestList from "../questList/questList";

class User extends React.Component{
    constructor(params) {
        super(params);
        this.state = {
            user: {}
        };
    }

    componentDidMount() {
        //получаем инфу по юзеру
        this.setState({user: {}});
    }

    render () {
        return (
            <article class="user-page">
                <UserInfo user={this.state.user} param="show"/>
                <QuestList id={this.state.user._id} checkin={1}/>
                <QuestList id={this.state.user._id} own={1}/>
            </article>
        );

    }
}

ReactDOM.render(
    <User />,
    document.getElementById('user')
);
