import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedClassyId: null,
}
const selectedClassSlice = createSlice({
    name: "selectedClass",
    initialState,
    reducers: {
        setSelectedClassId: (state, action) => {
            state.selectedClassyId = action.payload;
        },
    },
});

export const { setSelectedClassId } = selectedClassSlice.actions;
export default selectedClassSlice.reducer;
