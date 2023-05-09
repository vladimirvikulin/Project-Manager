import React, {useState} from 'react';
import ListGroup from '../components/ListGroup';
import AddGroupForm from '../components/AddGroupForm'
import '../styles/App.css'

const List = ({addCompleted, addNotCompleted}) => {
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
                     {groups.map((group) => <ListGroup 
                     group={group} removeGroup={removeGroup}
                     addCompleted={addCompleted} addNotCompleted={addNotCompleted}
                     key={group.id}/>)}
                </div>
                : <h1 className="list">Список груп порожній</h1>
            }
            
        </div>
    );
};

export default List;