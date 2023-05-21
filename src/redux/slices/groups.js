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

export const fetchUpdateGroup = createAsyncThunk('groups/fetchUpdateGroup', async ({updatedGroup, groupId}) => {
    const {data} = await axios.patch(`/groups/${groupId}`, updatedGroup);
    return data;
});

export const fetchCreateTask= createAsyncThunk('groups/fetchCreateTask', async ({newTask, id}) => {
    const {data} = await axios.post(`/tasks/${id}`, newTask);
    return data;
});

export const fetchDeleteTask= createAsyncThunk('groups/fetchDeleteTask', async ({groupId, taskId}) => {
    const {data} = await axios.delete(`/tasks/${groupId}/${taskId}/`);
    return data;
});

export const fetchUpdateTask = createAsyncThunk('groups/fetchUpdateTask', async ({updatedTask, groupId, taskId}) => {
    const {data} = await axios.patch(`/tasks/${groupId}/${taskId}/`, updatedTask);
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
        //Get all groups
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
        //Create group
        [fetchCreateGroup.fulfilled]: (state, action) => {
            state.groups.items.push(action.payload);
        },
        //Remove group
        [fetchRemoveGroup.pending]: (state, action) => {
            state.groups.items = state.groups.items.filter((obj) => obj._id !== action.meta.arg);
        },
        //Update group
        [fetchUpdateGroup.fulfilled]: (state, action) => {
            console.log(action)
            state.groups.items = state.groups.items.map(group => {
                if (group._id === action.meta.arg.id) {
                  return action.payload
                }
                return group;
              });
        },
        //Create task
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
        //Delete task
        [fetchDeleteTask.fulfilled]: (state, action) => {
            state.groups.items = state.groups.items.map(group => {
                if (group._id === action.meta.arg.groupId) {
                  return {
                    ...group,
                    tasks: action.payload
                  };
                }
                return group;
              });
        },
        //Update task
        [fetchUpdateTask.fulfilled]: (state, action) => {
            state.groups.items = state.groups.items.map(group => {
                if (group._id === action.meta.arg.groupId) {
                  return {
                    ...group,
                    tasks: action.payload,
                  };
                }
                return group;
              });
        },
    }
});

export default groupsSlice.reducer