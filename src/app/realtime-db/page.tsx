"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNotification } from "@/components/NotificationComponent";

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: string;
    user_id: string;
}

export default function RealtimeDBPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState("");
    const [loading, setLoading] = useState(true);
    const [permissionRequested, setPermissionRequested] = useState(false);
    const { sendNotification, requestPermission, isPermissionGranted } = useNotification();

    //Request permission saat komponen pertama render
    useEffect(() => {
        const askPermission = async () => {
            if (!permissionRequested && isPermissionGranted() !== true) {
                await requestPermission();
                setPermissionRequested(true);
            }
        };
        askPermission();
    }, [isPermissionGranted, requestPermission, permissionRequested]);

    // Inisialisasi supabase
    useEffect(() => {
        loadTodos();

        //Subscribe ke Realtime Database
        const channel = supabase
            .channel('todo-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'todos'
            }, (payload) => {
                console.log("Changes received:", payload);
                loadTodos(); // Panggil ulang loadTodos setiap ada perubahan
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Load todos dari supabase
    const loadTodos = async () => {
        try {
            // 1. Ambil data user aktif
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                setLoading(false);
                return;
            }

            // 2. Ambil data todos yang HANYA miliki user tersebut (.eq("user_id", user.id))
            const { data, error } = await supabase
                .from("todos")
                .select("*")
                .eq("user_id", user.id) // <--- Tambahkan filter ini
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTodos(data || []);
            setLoading(false);
        } catch (error) {
            console.error("Error loading todos", error);
            setLoading(false);
        }
    };

    // Tambah todo
    const addTodo = async () => {
        try {
            // Ambil user login
            const {
                data: { user },
                error: userError
            } = await supabase.auth.getUser();

            if (userError || !user) {
                console.error("User belum login");
                return;
            }

            const { error } = await supabase
                .from("todos")
                .insert({
                    text: newTodo,
                    completed: false,
                    user_id: user.id
                });

            if (error) throw error;

            setNewTodo("");
        } catch (error) {
            console.error("Error adding todo", error);
        }
    };

    // Toggle todo
    const toggleTodo = async (id: number, currentStatus: boolean) => {
        try {
            const { error } = await supabase.from("todos")
                .update({ completed: !currentStatus })
                .eq("id", id);

            if (error) throw error;
        } catch (error) {
            console.error("Error toggling todo", error);
        }
    };

    // Hapus todo
    const deleteTodo = async (id: number) => {
        try {
            const { error } = await supabase.from("todos")
                .delete()
                .eq("id", id);

            if (error) throw error;
        } catch (error) {
            console.error("Error deleting todo", error);
        }
    };

    // Hapus semua todo
    const clearAll = async () => {
        try {
            const { error } = await supabase
                .from("todos")
                .delete()
                .neq("id", 0);

            if (error) throw error;

            await sendNotification({
                title: "All todos cleared",
                body: "Successfully cleared all todos",
                icon: "/favicon.ico"
            });
        } catch (error) {
            console.error("Error clearing all todos", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
                <p className="text-gray-500 text-lg">Loading todos...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                    <h1 className="text-xl md:text-3xl font-bold">Todo List with Supabase and Send Notification</h1>
                    <p className="text-sm md:text-base">
                        {isPermissionGranted()
                            ? "Notifikasi diizinkan"
                            : "Notifikasi tidak diizinkan. Silahkan izinkan notifikasi untuk menerima pembaruan realtime"
                        }
                    </p>
                </div>

                {/* Input Form */}
                <div className="bg-white p-4 md:p-6 rounded-xl shadow">
                    <h2 className="text-xl font-bold mb-4">Tambah Todo</h2>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addTodo()}
                            placeholder="Apa yang ingin anda lakukan"
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                        />
                        <button
                            onClick={addTodo}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                            Tambah
                        </button>
                    </div>
                </div>

                {/* List Todo */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Daftar Todo ({todos.length})</h2>
                        {todos.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                            >
                                Hapus Semua
                            </button>
                        )}
                    </div>

                    {todos.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <p className="text-4xl mb-2">-</p>
                            <p>Tidak ada todo yang tersedia</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {todos.map((todo) => (
                                <div
                                    key={todo.id}
                                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => toggleTodo(todo.id, todo.completed)}
                                        className="w-5 h-5 cursor-pointer"
                                    />

                                    <span className={`flex-1 text-sm ${todo.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                                        {todo.text}
                                    </span>

                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}