import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

export type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  error: string | null;
  updateUserError: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  error: null,
  updateUserError: null
};

const setTokens = (refreshToken: string, accessToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
  setCookie('accessToken', accessToken);
};

const clearTokens = () => {
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
};

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserApi();

      if (data.success) {
        return data.user;
      }

      clearTokens();
      return rejectWithValue('Не удалось получить данные пользователя');
    } catch {
      clearTokens();
      return rejectWithValue('Не удалось получить данные пользователя');
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: TLoginData, { rejectWithValue }) => {
    try {
      const data = await loginUserApi(credentials);
      setTokens(data.refreshToken, data.accessToken);
      return data.user;
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message || 'Ошибка авторизации'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (credentials: TRegisterData, { rejectWithValue }) => {
    try {
      const data = await registerUserApi(credentials);
      setTokens(data.refreshToken, data.accessToken);
      return data.user;
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message || 'Ошибка регистрации'
      );
    }
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  try {
    await logoutApi();
  } finally {
    clearTokens();
  }
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (userData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const data = await updateUserApi(userData);

      if (data.success) {
        return data.user;
      }

      return rejectWithValue('Не удалось обновить данные пользователя');
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message ||
          'Не удалось обновить данные пользователя'
      );
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearUpdateUserError: (state) => {
      state.updateUserError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.user = null;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
        state.updateUserError = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.updateUserError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserError = action.payload as string;
      });
  }
});

export const { clearUserError, clearUpdateUserError } = userSlice.actions;

export default userSlice.reducer;
