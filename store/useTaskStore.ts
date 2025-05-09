import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import React from "react";
import { Task } from "@/app/[locale]/(protected)/master-data/assignment-invoice-copy/content-table/components/columns";

interface TaskStore {
  tasks: Task[]; // State untuk menyimpan array Task
  addTask: (task: Task) => void; // Fungsi untuk menambahkan task baru
  updateTask: (type_id: string, updatedTask: Partial<Task>) => void; // Fungsi untuk memperbarui task
  removeTask: (type_id: string) => void; // Fungsi untuk menghapus task
  clearTasks: () => void; // Fungsi untuk menghapus semua task
}

const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [], // State awal berupa array kosong
      addTask: (task) =>
        set(() => ({
          tasks: [task], // Tambahkan task baru ke array
        })),
      updateTask: (type_id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map(
            (task) =>
              task.type_id === type_id ? { ...task, ...updatedTask } : task // Perbarui task berdasarkan type_id
          ),
        })),
      removeTask: (type_id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.type_id !== type_id), // Hapus task berdasarkan type_id
        })),
      clearTasks: () =>
        set(() => ({
          tasks: [], // Kosongkan array task
        })),
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTaskStore;
