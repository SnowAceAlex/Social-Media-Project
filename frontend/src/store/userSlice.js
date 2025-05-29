import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser(state, action) {
        state.currentUser = action.payload;
        if (action.payload) {
            sessionStorage.setItem("currentUser", JSON.stringify(action.payload));
        }
        },
        logout(state) {
        state.currentUser = null;
        sessionStorage.removeItem("currentUser");
        },
        updateProfilePic(state, action) {
        if (state.currentUser && state.currentUser.user) {
            state.currentUser.user.profile_pic_url = action.payload;
            sessionStorage.setItem("currentUser", JSON.stringify(state.currentUser));
        }
        }
    },
});

export const { setCurrentUser, logout, updateProfilePic } = userSlice.actions;
export default userSlice.reducer;