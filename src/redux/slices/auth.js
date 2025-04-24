import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios.js';
import { fetchGroups } from './groups.js';

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params, { dispatch, rejectWithValue }) => {
    try {
        const { data } = await axios.post('/auth/login', params);
        await dispatch(fetchAuthMe());
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Не вдалося авторизуватися');
    }
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/auth/me');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Не вдалося отримати дані користувача');
    }
});

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params, { dispatch, rejectWithValue }) => {
    try {
        const { data } = await axios.post('/auth/register', params);
        await dispatch(fetchAuthMe());
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Не вдалося зареєструватися');
    }
});

export const fetchManageInvitation = createAsyncThunk('auth/fetchManageInvitation', async ({ groupId, action }, { dispatch, rejectWithValue }) => {
    try {
        const { data } = await axios.post('/auth/invitations', { groupId, action });
        await dispatch(fetchAuthMe());
        dispatch(fetchGroups());
        return { groupId, action, message: data.message, group: data.group };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Не вдалося обробити запрошення');
    }
});

const initialState = {
    data: null,
    status: 'loading',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuth.pending, (state) => {
                state.status = 'loading';
                state.data = null;
                state.error = null;
            })
            .addCase(fetchAuth.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchAuth.rejected, (state, action) => {
                state.status = 'error';
                state.data = null;
                state.error = action.payload;
            })
            .addCase(fetchAuthMe.pending, (state) => {
                state.status = 'loading';
                state.data = null;
                state.error = null;
            })
            .addCase(fetchAuthMe.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchAuthMe.rejected, (state, action) => {
                state.status = 'error';
                state.data = null;
                state.error = action.payload;
            })
            .addCase(fetchRegister.pending, (state) => {
                state.status = 'loading';
                state.data = null;
                state.error = null;
            })
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchRegister.rejected, (state, action) => {
                state.status = 'error';
                state.data = null;
                state.error = action.payload;
            })
            .addCase(fetchManageInvitation.fulfilled, (state, action) => {
                const { groupId } = action.payload;
                if (state.data && state.data.pendingInvitations) {
                    state.data.pendingInvitations = state.data.pendingInvitations.filter(
                        (invite) =>
                            !(invite.groupId.toString() === groupId.toString() && invite.status === 'pending')
                    );
                }
            });
    },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);
export const selectAuthData = (state) => state.auth.data;
export const selectAuthError = (state) => state.auth.error;
export const { logout } = authSlice.actions;

export default authSlice.reducer;