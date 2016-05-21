import React from 'react';
import InfoComponent from './infoComponent.jsx';
import EditComponent from './editComponent.jsx';

export default class UserInfo extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            show: 1
        };
    }
    /*не знаю, как именно будут обновляться данные пользователя, так что для обратного случая пока
     функции нет*/
    showEditMode() {
        this.setState({show: null});
    }

    render() {
        return (
            <section className={this.state.show ? "user-info user-info_show" :"user-info user-info_edit"}>
                { this.state.show ?
                    <InfoComponent user={this.props.user} showEditMode={this.showEditMode}/>
                :
                    <EditComponent user={this.props.user}/>
                }
            </section>
        );
    }
}
