"use client";

import { useState, useEffect } from "react";

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: string;
}

export default function IndexDBPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState("");
    const [db, setDb] = useState<IDBDatabase | null>(null);

    // Inisialisasi IndexedDB
    useEffect(() => {
        const request = indexedDB.open("TodoDB", 1);

        request.onerror = (event) => {
            console.error("Database error: ", event);
        };

        request.onsuccess = (event) => {
            const database = (event.target as IDBOpenDBRequest).result;
            setDb(database);
            loadTodos(database);
        };

        request.onupgradeneeded = (event) => {
            const database = (event.target as IDBOpenDBRequest).result;

            // Buat object store baru
            if (!database.objectStoreNames.contains("todos")) {
                const objectStore = database.createObjectStore("todos", {
                    keyPath: "id",
                    autoIncrement: true,
                });
                objectStore.createIndex("text", "text", { unique: false });
                objectStore.createIndex("completed", "completed", { unique: false });
            }
        };
    }, []);

    // Load todos dari IndexedDB
    const loadTodos = (database: IDBDatabase) => {
        const transaction = database.transaction(["todos"], "readonly");
        const objectStore = transaction.objectStore("todos");
        const request = objectStore.getAll();

        request.onsuccess = (event) => {
            const result = (event.target as IDBRequest).result;
            setTodos(result);
        };
    };

    // Tambah todo
    const addTodo = () => {
        if (!db || newTodo.trim() === "") return;

        const transaction = db.transaction(["todos"], "readwrite");
        const objectStore = transaction.objectStore("todos");

        const todo = {
            text: newTodo,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        const request = objectStore.add(todo);

        request.onsuccess = () => {
            loadTodos(db);
            setNewTodo("");
        };
    };

    // Toggle todo
    const toggleTodo = (id: number) => {
        if (!db) return;

        const transaction = db.transaction(["todos"], "readwrite");
        const objectStore = transaction.objectStore("todos");
        const request = objectStore.get(id);

        request.onsuccess = (event) => {
            const todo = (event.target as IDBRequest).result;
            todo.completed = !todo.completed;

            const updateRequest = objectStore.put(todo);
            updateRequest.onsuccess = () => {
                loadTodos(db);
            };
        };
    };

    // Hapus todo
    const deleteTodo = (id: number) => {
        if (!db) return;

        const transaction = db.transaction(["todos"], "readwrite");
        const objectStore = transaction.objectStore("todos");
        const request = objectStore.delete(id);

        request.onsuccess = () => {
            loadTodos(db);
        };
    };

    // Hapus semua todo
    const clearAll = () => {
        if (!db) return;

        const transaction = db.transaction(["todos"], "readwrite");
        const objectStore = transaction.objectStore("todos");
        const request = objectStore.clear();

        request.onsuccess = () => {
            loadTodos(db);
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
            <div className="max-w-3xl mx-auto space-y-6">

                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold">Todo List with IndexedDB</h1>
                    <p className="text-sm opacity-90">Database Browser untuk data kompleks</p>
                </div>

                {/* Input Form */}
                <div className="bg-white p-6 rounded-xl shadow">
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
                                        onChange={() => toggleTodo(todo.id)}
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