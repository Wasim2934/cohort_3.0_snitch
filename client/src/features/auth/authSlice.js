import { createSlice } from "@reduxjs/toolkit";

const storedSession = (() => {
  try {
    return JSON.parse(localStorage.getItem("snitch-session") || "null");
  } catch {
    return null;
  }
})();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedSession?.user || null,
    accessToken: storedSession?.accessToken || null,
  },
  reducers: {
    saveSession(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    clearSession(state) {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { saveSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
