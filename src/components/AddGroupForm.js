import React, {useState} from 'react';

const AddGroupForm = ({addGroup}) => {
    const [title, setTitle] = useState('')
    const addNewGroup = (e) => {
        e.preventDefault()
        const newGroup = {
          id: Date.now(),
          title,
        }
        addGroup(newGroup)
        setTitle('')
      }
    return (
        <div>
            <form>
                <input 
                    value = {title} 
                    onChange = {e => setTitle(e.target.value)} 
                    type = 'text' 
                    placeholder = 'Назва групи'
                />
                <button onClick = {addNewGroup}>Додати групу</button>
            </form>
        </div>
    );
}
export default AddGroupForm;