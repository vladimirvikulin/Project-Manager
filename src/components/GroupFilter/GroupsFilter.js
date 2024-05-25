import React from 'react';
import MyInput from '../ui/input/MyInput';
import MySelect from '../ui/select/MySelect';
import PropTypes from 'prop-types';

const GroupsFilter = ({filter, setFilter}) => {
    return (
        <div>
        <MyInput
            value={filter.searchGroup}
            onChange={e =>setFilter({...filter, searchGroup: e.target.value})}
            placeholder='Пошук...'
        />
        <MySelect
            value={filter.selectedSort}
            onChange={selectedSort => setFilter({...filter, selectedSort})}
            defaultValue='Сортування'
            options={[
                {value: 'groupTitle', name: 'За назвою групи'},
                {value: 'taskTitle', name: 'За назвою задачі'}
            ]}
        />
    </div>
    );
};

GroupsFilter.propTypes = {
    filter: PropTypes.shape({
        searchGroup: PropTypes.string.isRequired,
        selectedSort: PropTypes.string.isRequired
    }).isRequired,
    setFilter: PropTypes.func.isRequired
};

export default GroupsFilter;