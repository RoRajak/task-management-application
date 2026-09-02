import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "@/utils/api";
import { TaskInterface } from "@/utils/types";

interface TaskState {
  tasks: TaskInterface[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const addTask = createAsyncThunk<TaskInterface, TaskInterface, { rejectValue: string }>(
  "tasks/addTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await api.post("/todo/create-todo", taskData);
      return response.data as TaskInterface;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || "Failed to create task";
      return rejectWithValue(message);
    }
  }
);

export const updateTask = createAsyncThunk<TaskInterface, TaskInterface, { rejectValue: string }>(
  "tasks/updateTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await api.put(`/todo/update/${taskData._id}`, taskData);
      return response.data as TaskInterface;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || "Failed to update task";
      return rejectWithValue(message);
    }
  }
);

export const deleteTask = createAsyncThunk<string, string, { rejectValue: string }>(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      await api.delete(`/todo/delete-todo/${taskId}`);
      return taskId;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || "Failed to delete task";
      return rejectWithValue(message);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    status: "idle",
    error: null,
  } as TaskState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<TaskInterface>) => {
        state.status = "succeeded";
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to create task";
      })
      .addCase(updateTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<TaskInterface>) => {
        state.status = "succeeded";
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to update task";
      })
      .addCase(deleteTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to delete task";
      });
  },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;
