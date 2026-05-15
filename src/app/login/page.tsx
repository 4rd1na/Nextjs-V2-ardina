"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const router = useRouter();

    //State Input
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [RECAPTCHAVAlue, setRECAPTCHAVAlue] = useState<string | null>(null);

    //State Error
    const [error, setError] = useState("");

    //Handle submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //1. Validasi Required (Wajib diisi)
        if (!email || !password) {
            setError("Email dan Password Wajib diisi!");
            return;
        }

        //1. Validasi Format Email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError("Format Email Tidak Valid!");
            return;
        }

        //3. Validasi Panjang Password
        if (password.length < 6) {
            setError("Password minimal 6 karakter!");
            return;
        }

        // 4. Validasi ReCAPTCHA
        // if (!RECAPTCHAVAlue) {
        //     setError("Silahkan verifikasi ReCAPTCHA!");
        //     return;
        // }

        try {
            setError("");

            // Proses masuk ke Supabase Auth menggunakan email dan password
            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            // Jika email tidak terdaftar atau password salah, lempar error ke block catch
            if (loginError) throw loginError;

            alert("Login Berhasil!");
            router.push("/");
        } catch (err: any) {
            // Menangkap pesan error dari server Supabase dan menampilkannya di UI
            setError(err.message || "Email atau password salah.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Masuk akun</h1>
                    <p className="text-sm text-gray-500 mt-2">Silahkan login untuk mengakses Dashboard</p>
                </div>
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan email Anda"
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan password Anda"
                        />
                    </div>

                    {/* ReCHAPTCHA */}
                    {/* <div className="flex justify-center py-2">
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECHAPTCHA_SITE_KEY!}
                            onChange={(value) => setRECAPTCHAVAlue(value)}
                        />
                    </div> */}

                    <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg">
                        Masuk Sekarang
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Belum punya akun?{" "}
                    <Link href="/register" className="text-blue-500 hover:underline">
                        Daftar
                    </Link>
                </p>
            </div>
        </div>
    )
}