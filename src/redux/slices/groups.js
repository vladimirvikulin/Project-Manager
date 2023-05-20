import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios.js';

export const fetchGroups = createAsyncThunk('groups/fetchGroups', async () => {
    const {data} = await axios.get('/groups');
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
    }
});

export default groupsSlice.reducer