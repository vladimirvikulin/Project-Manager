import React, {useState} from 'react';
import MyButton from './ui/button/MyButton';
import MyInput from './ui/input/MyInput';

const AddGroupForm = ({addGroup}) => {
    const [title, setTitle] = useState('')
    const addNewGroup = (e) => {
        e.preventDefault()
        const newGroup = {
          id: Date.now(),
          title,
          tasks: [],
        }
        addGroup(newGroup)
        setTitle('')
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