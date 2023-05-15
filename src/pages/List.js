import React from 'react';
import ListGroup from '../components/ListGroup';
import AddGroupForm from '../components/AddGroupForm'
import '../styles/App.css';
import GroupsFilter from '../components/GroupsFilter';
import MyModal from '../components/ui/modal/MyModal';
import MyButton from '../components/ui/button/MyButton';

const List = (props) => {
    return (
        <div>
            <MyButton onClick={() => props.setModalGroupVisible(true)}>
                Створити групу
            </MyButton>
            <MyModal visible={props.modalGroupVisible} setVisible={props.setModalGroupVisible}>
                <AddGroupForm addGroup = {props.addGroup}/>
            </MyModal>
            <GroupsFilter filter={props.filter} setFilter={props.setFilter}/>
            {props.sortedAndSearch.length
                ?
                <div>
                     {props.sortedAndSearch.map((group) => 
                     <ListGroup 
                        group={group} groups={props.groups} setGroups={props.setGroups} 
                        removeGroup={props.removeGroup} setLocalGroups={props.setLocalGroups}
                        addCompleted={props.addCompleted} addNotCompleted={props.addNotCompleted}
                        key={group.id}/>
                    )}
                </div>
                : <h1 className="list">Список груп порожній</h1>
            }
            
        </div>
    );
};

export default List;