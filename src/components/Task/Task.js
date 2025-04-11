import MyButton from '../ui/button/MyButton';
import MyInput from '../ui/input/MyInput';
import MyCheckboxList from '../ui/checkbox/MyCheckboxList';
import styles from './Task.module.css';
import { FaStar, FaPencilAlt, FaTrash, FaLock, FaLockOpen } from 'react-icons/fa';

const Task = (props) => {
    const { task, taskOptions, tasks } = props;

    const calculateDaysLeft = (deadline) => {
        if (!deadline) return '—';
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const timeDiff = deadlineDate - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysLeft >= 0 ? `${daysLeft} дн.` : 'Прострочено';
    };

    return (
        <div className={task.priority ? `${styles.priorityTask} ${styles.task}` : styles.task}>
            {
                props.edit === task._id ? 
                <div className={styles.editForm}>
                    <MyInput 
                        value={props.value} 
                        onChange={e => props.setValue(e.target.value)} 
                        type="text" 
                        placeholder="Назва задачі"
                    />
                    <MyInput 
                        value={props.duration} 
                        onChange={e => props.setDuration(e.target.value)} 
                        type="number" 
                        placeholder="Тривалість (дні)" 
                        min="1"
                    />
                    <MyInput 
                        value={props.deadline} 
                        onChange={e => props.setDeadline(e.target.value)} 
                        type="date" 
                        placeholder="Дедлайн (опціонально)"
                    />
                    <MyCheckboxList
                        value={props.dependencies}
                        onChange={props.setDependencies}
                        label="Залежності (опціонально)"
                        options={taskOptions}
                    />
                </div>
                : 
                <div className={styles.taskInfo}>
                    <div className={!task.status ? styles.close : ''}>
                        <MyButton onClick={() => props.priorityTask(task)} className={styles.iconButton}>
                            <FaStar className={task.priority ? styles.activeIcon : ''} />
                        </MyButton>    
                        <div className={styles.taskTitle}>
                            {props.number}. {task.title}
                        </div>
                        <div className={styles.taskDetails}>
                            <span className={styles.detailLarge}>Тривалість: {task.duration} дн.</span>
                            <span className={styles.detailLarge}>Дедлайн: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Не вказано'}</span>
                            <span className={styles.detailLarge}>Залишилось: {calculateDaysLeft(task.deadline)}</span>
                            <span className={styles.detailSmall}>
                                Залежності: {task.dependencies.length 
                                    ? task.dependencies.map(id => tasks.find(t => t._id === id)?.title).join(', ') 
                                    : 'Немає'}
                            </span>
                        </div>
                    </div>
                </div>
            }
            {
                props.edit === task._id ? 
                <div className={styles.editButtons}>
                    <MyButton onClick={() => props.saveTask(task)}>
                        Зберегти
                    </MyButton>
                </div>
                :
                <div className={styles.taskButtons}>
                    <MyButton onClick={() => props.editTask(task)} className={styles.iconButton}>
                        <FaPencilAlt />
                    </MyButton>
                    <MyButton onClick={() => props.removeTask(task)} className={styles.iconButton}>
                        <FaTrash />
                    </MyButton>
                    <MyButton onClick={() => props.statusTask(task)} className={styles.iconButton}>
                        {task.status ? <FaLockOpen /> : <FaLock />}
                    </MyButton>
                </div>
            }
        </div>
    );
};

export default Task;