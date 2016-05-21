import React from 'react';

export default class UserInfo extends React.Component {

    render() {
        return (
            <div className="user-info__container">
                <h4 className="user-info__header">Личные данные</h4>
                <div className="user-info__info">
                    <div className="user-info__login">
                        <span className="user-info__label">Логин</span>
                        <span className="user-info__data">{this.props.user.username}</span>
                    </div>
                    <div className="user-info__phone">
                        <span className="user-info__label">Телефон</span>
                        <span className="user-info__data">{this.props.user.phone}</span>
                    </div>
                    <div className="user-info__email">
                        <span className="user-info__label">Email</span>
                        <span className="user-info__data">{this.props.user.email}</span>
                    </div>
                </div>
            </div>
        );
    }
}
