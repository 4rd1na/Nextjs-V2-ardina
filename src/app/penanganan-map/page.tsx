"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Import Map secara dynamic tanpa SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height: '400px' }}>
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading map...</p>
            </div>
        </div>
    )
});

export default function PenangananMap() {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState(false);

    // Fungsi untuk mendapatkan lokasi user
    const getUserLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setLoading(false);
                },
                (error) => {
                    alert("Error mendapatkan lokasi: " + error.message);
                    setLoading(false);
                }
            );
        } else {
            alert("Geolocation tidak didukung pada browser ini.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Penanganan Map | Peta Sederhana</h1>
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <button
                        onClick={getUserLocation}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
                    >
                        {loading ? "Loading..." : "Dapatkan Lokasi Saya"}
                    </button>

                    {userLocation && (
                        <p className="mt-2 text-gray-600">
                            Lokasi Anda: Latitude {userLocation[0].toFixed(4)}, Longitude {userLocation[1].toFixed(4)}
                        </p>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <MapComponent userLocation={userLocation} />
                </div>
            </div>
        </div>
    );
}