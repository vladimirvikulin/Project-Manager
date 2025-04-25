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

export const fetchUpdateProfile = createAsyncThunk('auth/fetchUpdateProfile', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await axios.patch('/auth/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Не вдалося оновити профіль');
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

export const fetchUserById = createAsyncThunk('auth/fetchUserById', async (userId, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/users/${userId}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Не вдалося отримати дані користувача');
    }
});

const initialState = {
    data: null,
    status: 'loading',
    error: null,
    userProfile: null,
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
            .addCase(fetchUpdateProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUpdateProfile.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchUpdateProfile.rejected, (state, action) => {
                state.status = 'error';
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
            })
            .addCase(fetchUserById.pending, (state) => {
                state.status = 'loading';
                state.userProfile = null;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.userProfile = action.payload;
                state.error = null;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.status = 'error';
                state.userProfile = null;
                state.error = action.payload;
            });
    },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);
export const selectAuthData = (state) => state.auth.data;
export const selectAuthError = (state) => state.auth.error;
export const selectUserProfile = (state) => state.auth.userProfile;
export const { logout } = authSlice.actions;

export default authSlice.reducer;