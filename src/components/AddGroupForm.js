import React, {useState} from 'react';
import MyButton from './ui/button/MyButton';
import MyInput from './ui/input/MyInput';
import { useDispatch } from 'react-redux';
import { fetchCreateGroup } from '../redux/slices/groups';

const AddGroupForm = ({setModalGroupVisible}) => {
    const [title, setTitle] = useState('')
    const dispatch = useDispatch();
    const addNewGroup = (e) => {
        e.preventDefault();
        const newGroup = {
          title,
          tasks: [],
          completed: 0,
          notCompleted: 0,
        }
        dispatch(fetchCreateGroup(newGroup));
        setModalGroupVisible(false);
        setTitle('');
      }
    return (
        <div>
            <form>
                <MyInput 
                    value = {title} 
                    onChange = {e => setTitle(e.target.value)} 
                    type = 'text' 
                    placeholder = 'Назва групи'
                />
                <MyButton onClick = {addNewGroup}>Додати групу</MyButton>
            </form>
        </div>
    );
}
export default AddGroupForm;