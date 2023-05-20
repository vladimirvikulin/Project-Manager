import { configureStore } from '@reduxjs/toolkit';
import groupReducer from './slices/groups.js'
import authReducer from './slices/auth.js'

const store = configureStore({
    reducer: {
        groups: groupReducer,
        auth: authReducer,
    }
})
export default store;