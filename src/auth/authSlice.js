import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      const { user, token } = action.payload;      
      state.user = user;
      state.token = token;
    },
  },
});

export const { setUserData } = authSlice.actions;
export default authSlice.reducer;
