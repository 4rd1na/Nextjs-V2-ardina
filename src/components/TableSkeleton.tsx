"use client";

export default function TableSkeleton() {
    const rows = Array.from({ length: 5 });

    return (
        <>
            {rows.map((_, index) => (
                <tr key={index} className="animate-pulse border-b last:border-0">
                    <td className="p-4">
                        <div className="h-4 w-8 bg-gray-200 rounded"></div>
                    </td>
                    <td className="p-4">
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </td>
                    <td className="p-4">
                        <div className="h-4 w-26 bg-gray-200 rounded"></div>
                    </td>
                    <td className="p-4">
                        <div className="h-4 w-26 bg-gray-200 rounded-full"></div>
                    </td>
                </tr>
            ))}
        </>
    )
}