import React from 'react';

export default class InfoComponent extends React.Component {

    render() {
        return (<div className="user-info__container">
            <div className="user-info__avatar-update">
                <div className="user-info__avatar-container">
                    <img className="user-info__avatar" src={this.props.user.avatar}/>
                </div>/**/
                <form action={"/users/" + this.user._id} method="put" className="user-info__avatar-form">
                    <input className="user-info__avatar-input" name="avatar" type="file"
                           accept="image/*"/>
                    <button className="user-info__avatar-button" type="submit">Обновить</button>
                </form>
            </div>
            <form action={"/users/" + this.user._id} method="put" className="user-info__form">
                <div className="user-info__login">
                    <label className="user-info__label">Логин:
                        <input className="user-info__data-edit" name="username"
                               value={this.props.user.username}/>
                    </label>
                </div>
                <div className="user-info__phone">
                    <label className="user-info__label">Телефон:
                        <input className="user-info__data-edit" name="phone" type="tel"
                               value={this.props.user.phone}/>
                    </label>
                </div>
                <div className="user-info__email">
                    <label className="user-info__label">Email:
                        <input className="user-info__data-edit" name="email" type="email"
                               value={this.props.user.email}/>
                    </label>
                </div>
                <button className="user-info__save" type="submit">Сохранить</button>
            </form>
        </div>)
    }
}
