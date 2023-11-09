import { createSlice } from '@reduxjs/toolkit';

export const moodSlice = createSlice({
    name: 'mood',
    initialState: {
        currentUser: 'omirza@gmail.com',
        currentProject: { "_id": 1, "project_name": "2023-11 Agent survey" },
        // projectArr: [{ "_id": 1, "project_name": "2023-11 Agent survey" }, { "_id": 2, "project_name": "Untitled" }, { "_id": 3, "project_name": "Untitled" }],
        projectArr: [],
        data: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.currentUser = action.payload;
        },
        createProject: (state, action) => {
            state.projectArr.push(action.payload);
        },
        setProject: (state, action) => {
            state.currentProject = action.payload;
        },
        setProjectArr: (state, action) => {
            state.projectArr = action.payload;
        },
        deleteProject: (state, action) => {
            state.projectArr = state.projectArr.filter(el => el !== action.payload);
            state.currentProject = null;
        },
        setData: (state, action) => {
            state.data = action.payload;
        },
    },
});

// Export actions for use in components
export const {
    setUser,
    createProject,
    setProject,
    setProjectArr,
    deleteProject,
    setData,
} = moodSlice.actions;

// Export the reducer function for store configuration
export default moodSlice.reducer;