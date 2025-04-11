import MyButton from '../ui/button/MyButton';
import MyInput from '../ui/input/MyInput';
import styles from './Task.module.css';

const Task = (props) => {
    const { task } = props;

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
                </div>
                : 
                <div className={styles.taskInfo}>
                    <div className={!task.status ? styles.close : ''}>
                        <MyButton onClick={() => props.priorityTask(task)}>
                            Пріорітет
                        </MyButton>    
                        <div className={styles.taskTitle}>
                            {props.number}. {task.title}
                        </div>
                        <div className={styles.taskDetails}>
                            <span>Тривалість: {task.duration} дн.</span>
                            <span>Дедлайн: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Не вказано'}</span>
                            <span>Залишилось: {calculateDaysLeft(task.deadline)}</span>
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
                    <MyButton onClick={() => props.editTask(task)}>
                        Змінити
                    </MyButton>
                    <MyButton onClick={() => props.removeTask(task)}>
                        Видалити
                    </MyButton>
                    <MyButton onClick={() => props.statusTask(task)}>
                        {task.status ? 'Закрити' : 'Відкрити'}
                    </MyButton>
                </div>
            }
        </div>
    );
};

export default Task;