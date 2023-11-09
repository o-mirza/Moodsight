import { configureStore } from '@reduxjs/toolkit';
import moodReducer from './moodSlice.js';

export const store = configureStore({
    reducer: {
        mood: moodReducer,
    },
});