import React from 'react';
import ListGroup from '../components/ListGroup';
import AddGroupForm from '../components/AddGroupForm'
import '../styles/App.css'

const List = ({groups, setGroups, addGroup, removeGroup, addCompleted, addNotCompleted, setLocalGroups}) => {
    return (
        <div>
            <AddGroupForm addGroup = {addGroup}/>
            {groups.length
                ?
                <div>
                     {groups.map((group) => <ListGroup 
                     group={group} groups={groups} setGroups={setGroups} removeGroup={removeGroup} setLocalGroups={setLocalGroups}
                     addCompleted={addCompleted} addNotCompleted={addNotCompleted}
                     key={group.id}/>)}
                </div>
                : <h1 className="list">Список груп порожній</h1>
            }
            
        </div>
    );
};

export default List;