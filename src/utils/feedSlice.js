import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: null,
    reducers:{
        addFeed:(state,action)=>{
            return action.payload;
        },
        removeUserFromFeed: (state, action) => {
            const newFeed = state.filter(user => user._id !== action.payload);
            return newFeed.length > 0 ? newFeed : null; // Return null if no
            
        },
        clearFeed:(state,action)=>{
            return null;
        }

    }
})

export const { addFeed ,removeUserFromFeed,clearFeed} = feedSlice.actions;
export default feedSlice.reducer;