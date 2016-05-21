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

var search = function (callback) {
    fetch('/quests/search', {
        method: 'post',
        body: JSON.stringify({
            search: document.getElementById('search').value
        }),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then(function (response) {
        return response.json();
    }).then(function (jsonResponse) {
        callback(null, jsonResponse.hits);
    }).catch(err => {
        callback(err);
    });
};

export default class QuestList extends React.Component {

    constructor(params) {
        super(params);
        this.state = {
            quests: [],
            search: false
        };
    }

    componentDidMount() {
        getAll((err, data) => {
            if (err) {
                console.log('Quests load error :' + err);
                return;
            }
            this.setState({quests: this.orderQuests(data)});
        });
        document.getElementById('search-form').addEventListener('submit', this.onSubmit.bind(this))
    }

    onSubmit(e) {
        e.preventDefault();
        if (this.state.search) {
            getAll((err, data) => {
                if (err) {
                    console.log('Quests load error :' + err);
                    return;
                }
                this.setState({quests: data});
            });
        }
        search((err, data) => {
            if (err) {
                console.log('Quests load error :' + err);
                return;
            }
            var arr = data.filter(function (item) {
                return item !== null;
            }).map(function (item) {
                return item._id;
            });
            var newData = this.state.quests.filter(function (item) {
                return ~arr.indexOf(item._id);
            });
            this.setState({quests: this.orderQuests(newData), search: true});
        });
    }

    orderQuests(quests) {
        return quests.sort((q1, q2) => {
            if (q1.likes.length === q2.likes.length) {
                return q2.date - q1.date;
            }
            return q2.likes.length - q1.likes.length;
        })
    }

    render() {

        var questNodes = this.state.quests.map(quest =>
            <QuestListItemComponent key={quest._id}
                                    id={quest._id}
                                    quest={quest}
                                    link={quest.photo[0].link}
                                    likes={quest.likes}
                                    date={moment(quest.date).format('MMMM DD, YYYY')}/>
        );

        var noSearchResults = function () {
            return !this.state.quests.length && this.state.search;
        };

        var emptyBD = function () {
            return !this.state.quests.length && !this.state.search;
        };

        return (
            <ul className='quest-list'>
                <div className="quest-list__empty-list-massage"
                     style={emptyBD.call(this) ? {display : 'block'} : {display : 'none'}}>
                    Список квестов пуст. <a href="/newQuest">Создайте</a> первый квест!
                </div>
                <div className="quest-list__empty-list-massage"
                     style={noSearchResults.call(this) ? {display : 'block'} : {display : 'none'}}>
                    Ничего не найдено.
                </div>
                {questNodes}
            </ul>
        );
    }
}

ReactDOM.render(
    <QuestList />,
    document.getElementById('list')
);
