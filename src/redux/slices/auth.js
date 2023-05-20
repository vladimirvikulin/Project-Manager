import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: null,
    status: 'loading',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
});

export default authSlice.reducer