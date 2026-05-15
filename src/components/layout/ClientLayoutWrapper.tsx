"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

import RegisterSW from "../PWARegister";
import PWAInstallButton from "../PWAButton";

import { NotificationProvider, useNotification } from "../NotificationComponent";
import { supabase } from "@/lib/supabase";
import PWARegister from "../PWARegister";

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    created_at: string;
}

function LayoutContent({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { sendNotification } = useNotification();

    //Setup Supabase realtime
    useEffect(() => {
        const channel = supabase
            .channel('layout-notifications')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' },
                async (payload) => {
                    console.log('Change received in layout:', payload);

                    //Kirim notifikasi jika eventnya adalah INSERT
                    if (payload.eventType === 'INSERT' && payload.new) {
                        const todo = payload.new as Todo;
                        await sendNotification({
                            title: 'New Todo Added',
                            body: `${todo.text}`,
                            redirectUrl: '/realtime-db',
                        });
                    } else if (payload.eventType === 'UPDATE' && payload.new) {
                        const todo = payload.new as Todo;
                        await sendNotification({
                            title: todo.completed ? 'Todo Completed' : 'Todo Updated',
                            body: `${todo.text}`,
                            redirectUrl: '/realtime-db',
                        });
                    } else if (payload.eventType === 'DELETE' && payload.old) {
                        const todo = payload.old as Todo;
                        await sendNotification({
                            title: 'Todo Deleted',
                            body: todo.text ? `${todo.text}` : 'A todo item was deleted',
                            redirectUrl: '/realtime-db',
                        });
                    }
                }
            )
            .on('system', {}, (payload) => {
                if (payload.extension === 'postgres-changes' && payload.status === 'ok') {
                    sendNotification({
                        title: 'Realtime DB Connected',
                        body: 'Connected to Supabase Realtime Database Successfully',
                        redirectUrl: '/realtime-db',
                    });

                    setTimeout(() => {

                    }, 3000)
                }
            })
            .subscribe();

        // Cleanup subscription saat komponen unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [sendNotification]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="flex min-h-screen">
            <PWARegister />
            <PWAInstallButton />
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            <div className="flex flex-col flex-1">
                <Header brandName="MyApp" onBrandClick={toggleSidebar} />
                <main className="flex-1 p-4 md:p-6 bg-gray-50">{children}</main>
                <Footer />
            </div>
        </div>
    );
}

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <LayoutContent>{children}</LayoutContent>
        </NotificationProvider>
    );
}