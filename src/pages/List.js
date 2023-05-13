import React from 'react';
import ListGroup from '../components/ListGroup';
import AddGroupForm from '../components/AddGroupForm'
import '../styles/App.css'
import MySelect from '../components/ui/select/MySelect';

const List = ({groups, setGroups, addGroup, removeGroup, addCompleted, addNotCompleted, setLocalGroups, selectedSort, sort}) => {
    return (
        <div>
            <AddGroupForm addGroup = {addGroup}/>
            <div>
                <MySelect
                    value={selectedSort}
                    onChange={sort}
                    defaultValue='Сортування'
                    options={[
                        {value: 'groupTitle', name: 'За назвою групи'},
                        {value: 'taskTitle', name: 'За назвою задачі'}
                    ]}
                />
            </div>
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