import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [],
  },
  reducers: {
    setLikeNotification(state, action) {
      if (action.payload.type === "like") {
        // Check if notification for this user and post already exists
        const existingNotificationIndex = state.likeNotification.findIndex(
          (item) =>
            item.userId === action.payload.userId &&
            item.postId === action.payload.postId
        );

        if (existingNotificationIndex === -1) {
          // Only add if it doesn't already exist
          state.likeNotification.push(action.payload);
        }
      } else if (action.payload.type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (item) =>
            item.userId !== action.payload.userId ||
            item.postId !== action.payload.postId
        );
      }
    },
  },
});

export const { setLikeNotification } = rtnSlice.actions;
export default rtnSlice.reducer;
