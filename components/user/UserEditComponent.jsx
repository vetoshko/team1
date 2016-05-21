import React from 'react';

export default class UserEdit extends React.Component {
    constructor(params) {
        super(params);
        console.log(params);
        this.state = {
            username: params.user.username,
            phone: params.user.phone,
            email: params.user.email
        };
    };


    edit() {
        fetch(`/users/${this.props.user._id}`, {
            method: 'put',
            credentials: 'same-origin',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                username: this.state.username,
                phone: this.state.phone,
                email: this.state.email
            })
        }).then(response => {
            location.reload();
        });
    }

    change(param, element) {
        var state = {};
        state[param] = element.target.value;
        this.setState(state);
    }

    render() {
        return (
            <div className="user-info__container">
                    <div className="user-info__login">
                        <label className="user-info__label">Логин:
                            <input type="text" className="user-info__data-edit" name="username"
                                   value={this.state.username} onChange={this.change.bind(this, 'username')}/>
                        </label>
                    </div>
                    <div className="user-info__phone">
                        <label className="user-info__label">Телефон:
                            <input className="user-info__data-edit" name="phone" type="tel"
                                   value={this.state.phone} onChange={this.change.bind(this, 'phone')}/>
                        </label>
                    </div>
                    <div className="user-info__email">
                        <label className="user-info__label">Email:
                            <input className="user-info__data-edit" name="email" type="email"
                                   value={this.state.email} onChange={this.change.bind(this, 'email')}/>
                        </label>
                    </div>
                    <button className="user-info__save" onClick={this.edit.bind(this)}>Сохранить</button>
            </div>)
    }
}
