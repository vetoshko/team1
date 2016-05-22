import React from 'react';
import QuestListItemComponent from "../questList/questListItemComponent.jsx";
import moment from 'moment';
import 'moment/locale/ru';


export default class ShortQuestList extends React.Component {
    constructor(params) {
        super(params);
    }

    render() {
        var quests = this.props.quests.map(quest => (
            <QuestListItemComponent key={quest._id} id={quest._id} quest={quest} name={quest.name} link={quest.photo[0].link}
                                likes={quest.likes} date={moment(quest.date).format('MMMM DD, YYYY')} description={quest.description} author={quest.author}/>
        ));

        return (
            <div className="quest-list">
                {quests}
            </div>
        );
    }
}
