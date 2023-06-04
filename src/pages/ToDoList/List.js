import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ListGroup from '../../components/Group/Group';
import AddGroupForm from '../../components/AddGroupForm/AddGroupForm'
import styles from './List.module.css'
import GroupsFilter from '../../components/GroupFilter/GroupsFilter';
import MyModal from '../../components/ui/modal/MyModal';
import MyButton from '../../components/ui/button/MyButton';
import { fetchGroups, fetchRemoveGroup, selectGroups } from '../../redux/slices/groups';
import { selectIsAuth } from '../../redux/slices/auth';
import { Link, Navigate } from 'react-router-dom';

const List = ({setStatistics}) => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();
    const { groups } = useSelector(selectGroups);
    const isGroupsLoading = groups.status === 'loading';
    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);
    const checkTaskStatistics = () => {
        let completed = 0;
        let notCompleted = 0;
        const priorityCounts = [];
        groups.items.forEach((group) => {
            const { title, tasks } = group;
            const priorityCount = tasks.reduce(
                (count, task) => count + (task.priority ? 1 : 0),
                0
            );
            priorityCounts.push({ group: title, count: priorityCount });
        });
        priorityCounts.sort((a, b) => b.count - a.count);
        const topPriorityGroups = priorityCounts.slice(0, 6);
        groups.items.map((group) => group.tasks.map((task) => task.status ? ++notCompleted : ++completed));
        const statistics = {
            topPriorityGroups,
            completed,
            notCompleted,
          };
        setStatistics(statistics);
    }
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
            <div>
                <Link className={styles.link} to='/statistics/'>
                    <MyButton onClick={() => checkTaskStatistics()} >Загальна статистика</MyButton>
                </Link>
            </div>
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
                        group={group} setStatistics={setStatistics}
                        removeGroup={removeGroup}
                        key={group._id}/>
                    )}
                </div>
        </div>
    );
};

export default List;