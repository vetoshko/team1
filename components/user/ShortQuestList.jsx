import React from 'react';
import ShortQuestListItem from './ShortQuestListItemComponent.jsx';

export default class ShortQuestList extends React.Component {
    constructor(params) {
        super(params);
    }

    render() {
        var quests = this.props.quests.map(quest => (
            <ShortQuestListItem key={quest._id} id={quest._id} name={quest.name} link={quest.photo[0].link}
                                description={quest.description} author={quest.author}/>
        ));

        return (
            <div className="quest-list">
                {quests}
            </div>
        );
    }
}
