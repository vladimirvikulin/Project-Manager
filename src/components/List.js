import React from 'react';
import ListGroup from './ListGroup';

const List = ({groups}) => {

    return (
        <div>
            {groups.map((group) => <ListGroup  group={group} key={group.id}/>)}
        </div>
    );
};

export default List;