import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios.js';
import { fetchGroups } from './groups.js';

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
    const { data } = await axios.post('/auth/login', params);
    return data;
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
    const { data } = await axios.get('/auth/me');
    return data;
});

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const { data } = await axios.post('/auth/register', params);
    return data;
});

export const fetchManageInvitation = createAsyncThunk('auth/fetchManageInvitation', async ({ groupId, action }, { dispatch }) => {
    const { data } = await axios.post('/auth/invitations', { groupId, action });
    dispatch(fetchGroups());
    return { groupId, action, message: data.message, group: data.group };
});

const initialState = {
    data: null,
    status: 'loading',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuth.pending, (state) => {
                state.status = 'loading';
                state.data = null;
            })
            .addCase(fetchAuth.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchAuth.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            })
            .addCase(fetchAuthMe.pending, (state) => {
                state.status = 'loading';
                state.data = null;
            })
            .addCase(fetchAuthMe.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchAuthMe.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            })
            .addCase(fetchRegister.pending, (state) => {
                state.status = 'loading';
                state.data = null;
            })
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchRegister.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            })
            .addCase(fetchManageInvitation.fulfilled, (state, action) => {
                const { groupId, action: invitationAction } = action.payload;
                if (state.data && state.data.pendingInvitations) {
                    state.data.pendingInvitations = state.data.pendingInvitations.map((invite) =>
                        invite.groupId === groupId && invite.status === 'pending'
                            ? { ...invite, status: invitationAction === 'accept' ? 'accepted' : 'declined' }
                            : invite
                    );
                }
            });
    },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);
export const selectAuthData = (state) => state.auth.data;

export const { logout } = authSlice.actions;

export default authSlice.reducer;