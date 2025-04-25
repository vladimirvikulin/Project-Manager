import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Group from '../../components/Group/Group';
import AddGroupForm from '../../components/AddGroupForm/AddGroupForm';
import styles from './List.module.css';
import GroupsFilter from '../../components/GroupFilter/GroupsFilter';
import MyModal from '../../components/ui/modal/MyModal';
import { fetchGroups, fetchRemoveGroup, selectGroups } from '../../redux/slices/groups';
import { selectIsAuth } from '../../redux/slices/auth';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FaPlus, FaChartBar, FaProjectDiagram } from 'react-icons/fa';

const List = () => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { groups } = useSelector(selectGroups);
    const isGroupsLoading = groups.status === 'loading';

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    const checkTaskStatistics = () => {
        let completed = 0;
        let notCompleted = 0;
        const priorityCounts = [];
        const taskDurations = [];
        const missedDeadlines = [];
        const dependencyStats = { withDependencies: 0, withoutDependencies: 0 };

        groups.items.forEach((group) => {
            const { title, tasks } = group;

            const priorityCount = tasks.reduce(
                (count, task) => count + (task.priority ? 1 : 0),
                0
            );
            priorityCounts.push({ group: title, count: priorityCount });

            tasks.forEach((task) => {
                task.status ? ++notCompleted : ++completed;

                const duration = task.duration || 1;
                const existingDuration = taskDurations.find(d => d.duration === duration);
                if (existingDuration) {
                    existingDuration.count += 1;
                } else {
                    taskDurations.push({ duration, count: 1 });
                }

                if (task.deadline) {
                    const deadlineDate = new Date(task.deadline);
                    const today = new Date();
                    if (deadlineDate < today && task.status) {
                        const groupMissed = missedDeadlines.find(md => md.group === title);
                        if (groupMissed) {
                            groupMissed.count += 1;
                        } else {
                            missedDeadlines.push({ group: title, count: 1 });
                        }
                    }
                }

                if (task.dependencies && task.dependencies.length > 0) {
                    dependencyStats.withDependencies += 1;
                } else {
                    dependencyStats.withoutDependencies += 1;
                }
            });
        });

        priorityCounts.sort((a, b) => b.count - a.count);
        const topPriorityGroups = priorityCounts.slice(0, 6);

        taskDurations.sort((a, b) => a.duration - b.duration);

        const statistics = {
            topPriorityGroups,
            completed,
            notCompleted,
            taskDurations,
            missedDeadlines,
            dependencyStats,
            groups: groups.items.map(group => ({
                group: group.title,
                count: group.tasks.length,
            })),
            type: 'general',
        };
        navigate('/statistics', { state: { statistics } });
    };

    const [filter, setFilter] = useState({ selectedSort: '', searchTask: '' });
    const [modalGroupVisible, setModalGroupVisible] = useState(false);

    const removeGroup = (group) => {
        dispatch(fetchRemoveGroup(group._id));
    };

    const sorted = useMemo(() => {
        const items = [...groups.items];
        if (filter.selectedSort === 'groupTitle') {
            return items.sort((a, b) => a.title.localeCompare(b.title));
        } else if (filter.selectedSort === 'taskTitle') {
            return items.map(group => ({
                ...group,
                tasks: [...group.tasks].sort((a, b) => a.title.localeCompare(b.title))
            }));
        } else if (filter.selectedSort === 'createdAtAsc') {
            return items.map(group => ({
                ...group,
                tasks: [...group.tasks].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            }));
        } else if (filter.selectedSort === 'createdAtDesc') {
            return items.map(group => ({
                ...group,
                tasks: [...group.tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            }));
        } else if (filter.selectedSort === 'deadlineAsc') {
            return items.map(group => ({
                ...group,
                tasks: [...group.tasks].sort((a, b) => {
                    const dateA = a.deadline ? new Date(a.deadline) : new Date('9999-12-31');
                    const dateB = b.deadline ? new Date(b.deadline) : new Date('9999-12-31');
                    return dateA - dateB;
                })
            }));
        } else if (filter.selectedSort === 'deadlineDesc') {
            return items.map(group => ({
                ...group,
                tasks: [...group.tasks].sort((a, b) => {
                    const dateA = a.deadline ? new Date(a.deadline) : new Date('9999-12-31');
                    const dateB = b.deadline ? new Date(b.deadline) : new Date('9999-12-31');
                    return dateB - dateA;
                })
            }));
        }
        return items;
    }, [filter.selectedSort, groups.items]);

    const sortedAndSearch = useMemo(() => {
        if (!filter.searchTask) return sorted;
        return sorted.filter(group =>
            group.tasks.some(task => task.title.toLowerCase().includes(filter.searchTask))
        );
    }, [sorted, filter.searchTask]);

    if (!isAuth) {
        return <Navigate to='/login' />;
    }

    return (
        <div>
            <div className={styles.actions}>
                <button className={styles.iconButton} onClick={() => checkTaskStatistics()} aria-label="Загальна статистика">
                    <FaChartBar />
                    <span className={styles.tooltip}>Загальна статистика</span>
                </button>
                <Link to="/network">
                    <button className={styles.iconButton} aria-label="Мережевий графік">
                        <FaProjectDiagram />
                        <span className={styles.tooltip}>Мережевий графік</span>
                    </button>
                </Link>
                <button onClick={() => setModalGroupVisible(true)} className={styles.iconButton} aria-label="Створити групу">
                    <FaPlus />
                    <span className={styles.tooltip}>Створити групу</span>
                </button>
            </div>
            <MyModal visible={modalGroupVisible} setVisible={setModalGroupVisible}>
                <AddGroupForm setModalGroupVisible={setModalGroupVisible} />
            </MyModal>
            <GroupsFilter filter={filter} setFilter={setFilter} />
            <div>
                {isGroupsLoading ? <h1 className={styles.list}>Завантаження</h1> : sortedAndSearch.map((group) =>
                    <Group
                        group={group}
                        removeGroup={removeGroup}
                        key={group._id}
                    />
                )}
            </div>
        </div>
    );
};

export default List;