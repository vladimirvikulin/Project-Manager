import React from 'react';
import ListGroup from '../components/ListGroup';
import AddGroupForm from '../components/AddGroupForm'
import '../styles/App.css'
import GroupsFilter from '../components/GroupsFilter';

const List = ({sortedAndSearch, groups, setGroups, addGroup, removeGroup, addCompleted, addNotCompleted, setLocalGroups, filter, setFilter}) => {
    return (
        <div>
            <AddGroupForm addGroup = {addGroup}/>
            <GroupsFilter filter={filter} setFilter={setFilter}/>
            {sortedAndSearch.length
                ?
                <div>
                     {sortedAndSearch.map((group) => <ListGroup 
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