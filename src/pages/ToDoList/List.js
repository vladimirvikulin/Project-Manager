import React, {useState, useMemo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ListGroup from '../../components/Group/Group';
import AddGroupForm from '../../components/AddGroupForm'
import styles from './List.module.css'
import GroupsFilter from '../../components/GroupsFilter';
import MyModal from '../../components/ui/modal/MyModal';
import MyButton from '../../components/ui/button/MyButton';
import { fetchGroups, fetchRemoveGroup } from '../../redux/slices/groups';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate } from 'react-router-dom';

const List = ({setStatisticsGroup}) => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();
    const { groups } = useSelector(state => state.groups);
    const isGroupsLoading = groups.status === 'loading';
    React.useEffect(() => {
        dispatch(fetchGroups());
    }, []);
    const [filter, setFilter] = useState({selectedSort: '', searchGroup: ''});
    const [modalGroupVisible, setModalGroupVisible] = useState(false);
    const removeGroup = (group) => {
        dispatch(fetchRemoveGroup(group._id));
    }
    const sorted = useMemo (() => {
        if (filter.selectedSort === 'groupTitle') return [...groups.items].sort((a, b) => a['title'].localeCompare(b['title']));
        else if (filter.selectedSort === 'taskTitle') {
            const filtered = [...groups.items].map(group => ({
                ...group,
                tasks: [...group.tasks].sort((a, b) => a.title.localeCompare(b.title))
              }));
            return filtered;
      }
      return groups.items
    }, [filter.selectedSort, groups.items]);

    const sortedAndSearch = useMemo (() => {
      return sorted.filter(group => group.title.toLowerCase().includes(filter.searchGroup));
    }, [sorted, filter.searchGroup]);
    if (!isAuth) {
        return <Navigate to='/login'/>
    }
    return (
        <div>
            <MyButton onClick={() => setModalGroupVisible(true)}>
                Створити групу
            </MyButton>
            <MyModal visible={modalGroupVisible} setVisible={setModalGroupVisible}>
                <AddGroupForm setModalGroupVisible = {setModalGroupVisible}/>
            </MyModal>
            <GroupsFilter filter={filter} setFilter={setFilter}/>
                <div>
                     {isGroupsLoading? <h1 className={styles.list}>Завантаження</h1>:sortedAndSearch.map((group) => 
                     <ListGroup 
                        group={group} setStatisticsGroup={setStatisticsGroup}
                        removeGroup={removeGroup}
                        key={group._id}/>
                    )}
                </div>
        </div>
    );
};

export default List;