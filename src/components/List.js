import React from 'react';
import ListGroup from './ListGroup';

const List = ({groups, removeGroup}) => {
    return (
        <div>
            {groups.map((group) => <ListGroup  group={group} removeGroup={removeGroup} key={group.id}/>)}
        </div>
    );
};

export default List;