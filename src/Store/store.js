// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/authSlice";
import selectedDayReducer from "../slice/selectedDaySlice"

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (serializedState === null) return undefined;
    return {
      auth: JSON.parse(serializedState),
    };
  } catch (e) {
    console.warn("Could not load state", e);
    return undefined;
  }
};

// Save auth state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state.auth);
    localStorage.setItem('authState', serializedState);
  } catch (e) {
    console.warn("Could not save state", e);
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    selectedDay: selectedDayReducer
  },
  preloadedState: loadState(),
});

// Listen to store updates and persist
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
