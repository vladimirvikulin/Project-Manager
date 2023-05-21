import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios.js';

export const fetchGroups = createAsyncThunk('groups/fetchGroups', async () => {
    const {data} = await axios.get('/groups');
    return data;
});

export const fetchCreateGroup = createAsyncThunk('groups/fetchCreateGroup', async (params) => {
    const {data} = await axios.post('/groups', params);
    return data;
});

export const fetchRemoveGroup = createAsyncThunk('groups/fetchRemoveGroup', async (id) => {
    await axios.delete(`/groups/${id}`);
});

export const fetchCreateTask= createAsyncThunk('groups/fetchCreateTask', async ({newTask, id}) => {
    const {data} = await axios.post(`/tasks/${id}`, newTask);
    return data;
});

const initialState = {
    groups: {
        items: [],
        status: 'loading',
    }
};

const groupsSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchGroups.pending]: (state) => {
            state.groups.status = 'loading';
            state.groups.items = [];
        },
        [fetchGroups.fulfilled]: (state, action) => {
            state.groups.status = 'loaded';
            state.groups.items = action.payload;
        },
        [fetchGroups.rejected]: (state) => {
            state.groups.status = 'error';
            state.groups.items = [];
        },
        [fetchCreateGroup.fulfilled]: (state, action) => {
            state.groups.items.push(action.payload);
        },
        [fetchRemoveGroup.pending]: (state, action) => {
            state.groups.items = state.groups.items.filter((obj) => obj._id !== action.meta.arg);
        },
        [fetchCreateTask.fulfilled]: (state, action) => {
            state.groups.items = state.groups.items.map(group => {
                if (group._id === action.meta.arg.id) {
                  return {
                    ...group,
                    tasks: [...group.tasks, action.payload]
                  };
                }
                return group;
              });
        },
    }
});

export default groupsSlice.reducer