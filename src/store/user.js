import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: 0,
}
export const user = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1
        },
    },
})

export const { increment, } = user.actions;
export default user.reducer;
