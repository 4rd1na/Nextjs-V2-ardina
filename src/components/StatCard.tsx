import { ReactNode } from "react";

interface StatCardProps {
    title?: string;
    children?: ReactNode;
    fullWidth?: boolean;
    classname?: string;
}

export default function StatCard({
    title,
    children,
    fullWidth = false,
    classname = ""
}: StatCardProps) {
    return (
        <div className={`bg-white p-6 rounded shadow ${fullWidth ? "w-full" : "w-auto"} ${classname}`}>
            {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
            {children}
        </div>
    )
}