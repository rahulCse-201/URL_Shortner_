import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const API = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
const TOKEN_KEY = 'linksmith-token'

export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null
  try {
    const { data } = await axios.get(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
    return { token, user: data.user }
  } catch (error) {
    localStorage.removeItem(TOKEN_KEY)
    return rejectWithValue(error.response?.data?.message || 'Session expired')
  }
})

export const logoutSession = createAsyncThunk('auth/logoutSession', async (_, { getState }) => {
  const token = getState().auth.token
  if (token) {
    try {
      await axios.post(`${API}/api/auth/logout`, {}, { headers: { Authorization: `Bearer ${token}` } })
    } catch {
      // Clear the local session even if the server cannot be reached.
    }
  }
  localStorage.removeItem(TOKEN_KEY)
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    status: localStorage.getItem(TOKEN_KEY) ? 'idle' : 'anonymous',
  },
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.status = 'authenticated'
    },
    clearCredentials(state) {
      state.user = null
      state.token = null
      state.status = 'anonymous'
    },
  },
  extraReducers(builder) {
    builder
      .addCase(restoreSession.pending, state => { state.status = 'checking' })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload?.user || null
        state.token = action.payload?.token || null
        state.status = state.user ? 'authenticated' : 'anonymous'
      })
      .addCase(restoreSession.rejected, state => {
        state.user = null
        state.token = null
        state.status = 'anonymous'
      })
      .addCase(logoutSession.fulfilled, state => {
        state.user = null
        state.token = null
        state.status = 'anonymous'
      })
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
