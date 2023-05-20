import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ListGroup from '../../components/Group/Group';
import AddGroupForm from '../../components/AddGroupForm'
import styles from './List.module.css'
import GroupsFilter from '../../components/GroupsFilter';
import MyModal from '../../components/ui/modal/MyModal';
import MyButton from '../../components/ui/button/MyButton';
import { fetchGroups } from '../../redux/slices/groups';
const List = (props) => {
    const dispatch = useDispatch();
    const { groups } = useSelector(state => state.groups);
    const isGroupsLoading = groups.status === 'loading';
    React.useEffect(() => {
        dispatch(fetchGroups());
    }, []);
    return (
        <div>
            <MyButton onClick={() => props.setModalGroupVisible(true)}>
                Створити групу
            </MyButton>
            <MyModal visible={props.modalGroupVisible} setVisible={props.setModalGroupVisible}>
                <AddGroupForm addGroup = {props.addGroup}/>
            </MyModal>
            <GroupsFilter filter={props.filter} setFilter={props.setFilter}/>
                <div>
                     {isGroupsLoading? <h1 className={styles.list}>Завантаження</h1>:groups.items.map((group) => 
                     <ListGroup 
                        group={group} groups={props.groups} setGroups={props.setGroups} 
                        removeGroup={props.removeGroup} setLocalGroups={props.setLocalGroups}
                        key={group._id}/>
                    )}
                </div>
        </div>
    );
};

export default List;