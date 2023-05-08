import React, {useState} from 'react';
import ListGroup from './ListGroup';
import AddGroupForm from './AddGroupForm';

const List = () => {
    const [groups, setGroups] = useState([])
    const addGroup = (newGroup) => {
      setGroups([...groups, newGroup])
    }
    const removeGroup = (group) => {
      setGroups(groups.filter(i => i.id !== group.id))
    }
    return (
        <div>
            <AddGroupForm addGroup = {addGroup}/>
            {groups.length
                ?
                <div>
                     {groups.map((group) => <ListGroup  group={group} removeGroup={removeGroup} key={group.id}/>)}
                </div>
                : <h1 className="list">Список груп порожній</h1>
            }
            
        </div>
    );
};

export default List;