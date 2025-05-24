import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDayId: null,
}
const selectedDaySlice = createSlice({
  name: "selectedDay",
  initialState,
  reducers: {
    setSelectedDayId: (state, action) => {
      state.selectedDayId = action.payload;
    },
  },
});

export const { setSelectedDayId } = selectedDaySlice.actions;
export default selectedDaySlice.reducer;
