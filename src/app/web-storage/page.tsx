"use client";

import { useState, useEffect } from "react";

interface SavedData {
    local: {
        name: string | null;
        theme: string | null;
        preferences: string | null;
    };
    session: {
        filter: string | null;
        page: string | null;
    }
}

export default function WebStoragePage() {
    const [name, setName] = useState("");
    const [theme, setTheme] = useState("light");
    const [filter, setFilter] = useState("");
    const [savedData, setSavedData] = useState<SavedData | null>(null);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") || "light";
        setTheme(storedTheme);
        loadAllData();
    }, []);

    const loadAllData = () => {
        const local = {
            name: localStorage.getItem("userName"),
            theme: localStorage.getItem("theme"),
            preferences: localStorage.getItem("preferences"),
        };

        const session = {
            filter: sessionStorage.getItem("filter"),
            page: sessionStorage.getItem("page"),
        };

        setSavedData({ local, session });
    };

    // Fungsi untuk simpan nama di local storage
    const saveName = () => {
        localStorage.setItem("userName", name);
        loadAllData();
    }

    // Fungsi untuk simpan tema di local storage
    const saveTheme = (newTheme: string) => {
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
        loadAllData();
    }

    // Fungsi untuk simpan preferensi di local storage
    const savePreferences = () => {
        const preferences = JSON.stringify({ fontSize: "medium", notifications: true });
        localStorage.setItem("preferences", preferences);
        loadAllData();
    };

    // Fungsi untuk simpan filter & page di session storage
    const saveFilter = () => {
        sessionStorage.setItem("filter", filter);
        sessionStorage.setItem("page", "1");
        loadAllData();
    };

    // Fungsi untuk clear semua storage
    const clearAll = () => {
        localStorage.clear();
        sessionStorage.clear();
        setName("");
        setFilter("");
        setTheme("light");
        setSavedData(null);
    };

    return (
        <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50"}`}>
            <div className="max-w-5xl mx-auto p-6 space-y-6">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold">Web Storage</h1>
                    <p className="text-sm opacity-90">Local Storage vs Session Storage</p>
                </div>

                {/* Input Section */}
                <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-4 md:p-6 rounded-lg shadow-lg`}>
                    <h2 className="text-xl font-bold mb-4">Contoh Penyimpanan Data</h2>

                    <div className="space-y-4">
                        {/* Nama */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Nama Pengguna</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Masukkan nama..."
                                    className="flex-1 px-3 py-2 border rounded-lg text-gray-900"
                                />
                                <button
                                    onClick={saveName}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Simpan
                                </button>
                            </div>
                            <p className="text-xs mt-1 opacity-70">Simpan di Local Storage</p>
                        </div>

                        {/* Tema */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Tema</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => saveTheme("light")}
                                    className={`px-4 py-2 rounded-lg ${theme === "light" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}
                                >
                                    Light
                                </button>
                                <button
                                    onClick={() => saveTheme("dark")}
                                    className={`px-4 py-2 rounded-lg ${theme === "dark" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}
                                >
                                    Dark
                                </button>
                            </div>
                            <p className="text-xs mt-1 opacity-70">Simpan di Local Storage</p>
                        </div>

                        {/* Filter */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Filter Pencarian</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    placeholder="Masukan Filter..."
                                    className="flex-1 px-3 py-2 border rounded-lg text-gray-900"
                                />
                                <button
                                    onClick={saveFilter}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Simpan
                                </button>
                            </div>
                            <p className="text-xs mt-1 opacity-70">Simpan di Local Storage</p>
                        </div>

                        {/* Simpan All sebagai JSON */}
                        <div>
                            <button
                                onClick={savePreferences}
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Simpan Preferensi (Local Storage JSON)
                            </button>
                        </div>
                        {/* Clear All JSON */}
                        <div>
                            <button
                                onClick={clearAll}
                                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Hapus Semua Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Display Data */}
                {savedData && (
                    <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}>
                        <h2 className="text-xl font-bold mb-4">Data Tersimpan</h2>
                        <div className="grid md:grid-cols-2 gap-4">

                            {/* Local Storage */}
                            <div>
                                <h3 className="font-bold text-green-600 mb-2">Local Storage</h3>
                                <div className="space-y-1 text-sm font-mono bg-green-50 text-gray-900 p-3 rounded-lg">
                                    <div>userName: {savedData.local.name || "null"}</div>
                                    <div>theme: {savedData.local.theme || "null"}</div>
                                    <div className="break-all">preferences: {savedData.local.preferences || "null"}</div>
                                </div>
                            </div>

                            {/* Session Storage */}
                            <div>
                                <h3 className="font-bold text-orange-600 mb-2">Session Storage</h3>
                                <div className="space-y-1 text-sm font-mono bg-green-50 text-gray-900 p-3 rounded-lg">
                                    <div>searchFilter: {savedData.session.filter || "null"}</div>
                                    <div>currentPage: {savedData.session.page || "null"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}