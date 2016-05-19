import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import moment from 'moment';
import 'moment/locale/ru';
import QuestListItemComponent from "./questListItemComponent.jsx";

var getAll = function (callback) {
    fetch('/quests/questsList', {
        method: 'get',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then(function (response) {
        return response.json();
    }).then(function (jsonResponse) {
        callback(null, jsonResponse.quests);
    }).catch(err => {
        callback(err);
    });
};

export default class QuestList extends React.Component {

    constructor(params) {
        super(params);
        this.state = {
            quests: []
        };
    }

    componentDidMount() {
        getAll((err, data) => {
            if (err) {
                console.log('Quests load error :' + err);
                return;
            }
            this.setState({quests: data});
        });
    }

    render() {

        var questNodes = this.state.quests.map(quest =>
            <QuestListItemComponent key={quest._id}
                                    id={quest._id}
                                    quest={quest}
                                    link={quest.photo[0].link}
                                    likes={quest.likes}
                                    date={moment(quest.date).format('MMMM DD, YYYY')}
                                    checkin={this.props.checkin}
                                    own={this.props.own}/>
        );

        return (
            <div className="quest-list">
                {this.props.checkin ? <h1 className="quest-list__title">
                    начатые и пройденные квесты
                </h1> : null}
                {this.props.own ? <h1 className="quest-list__title">
                    созданные квесты
                </h1> : null}
                <ul className='quest-list__list'>
                    {questNodes}
                </ul>
            </div>
        );
    }
}

ReactDOM.render(
    <QuestList />,
    document.getElementById('list')
);
