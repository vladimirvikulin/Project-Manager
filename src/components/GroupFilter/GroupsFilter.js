import React from 'react';
import MyInput from '../ui/input/MyInput';
import MySelect from '../ui/select/MySelect';

const GroupsFilter = ({filter, setFilter}) => {
    return (
        <div>
        <MyInput
            value={filter.searchTask}
            onChange={e => setFilter({...filter, searchTask: e.target.value.toLowerCase()})}
            placeholder='Пошук за назвою задачі...'
        />
        <MySelect
            value={filter.selectedSort}
            onChange={selectedSort => setFilter({...filter, selectedSort})}
            defaultValue='Сортування'
            options={[
                {value: 'groupTitle', name: 'За назвою групи'},
                {value: 'taskTitle', name: 'За назвою задачі'},
                {value: 'createdAtAsc', name: 'За датою створення (спочатку старі)'},
                {value: 'createdAtDesc', name: 'За датою створення (спочатку нові)'},
                {value: 'deadlineAsc', name: 'За дедлайном (спочатку ранні)'},
                {value: 'deadlineDesc', name: 'За дедлайном (спочатку пізні)'},
            ]}
        />
    </div>
    );
};

export default GroupsFilter;