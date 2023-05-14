import React from 'react';
import ListGroup from '../components/ListGroup';
import AddGroupForm from '../components/AddGroupForm'
import '../styles/App.css'
import MySelect from '../components/ui/select/MySelect';
import MyInput from '../components/ui/input/MyInput';

const List = ({sortedAndSearch, groups, setGroups, addGroup, removeGroup, addCompleted, addNotCompleted, setLocalGroups, selectedSort, sort, searchGroup, setSearchGroup}) => {
    return (
        <div>
            <AddGroupForm addGroup = {addGroup}/>
            <div>
                <MyInput
                    value={searchGroup}
                    onChange={e =>setSearchGroup(e.target.value)}
                    placeholder='Пошук...'
                />
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