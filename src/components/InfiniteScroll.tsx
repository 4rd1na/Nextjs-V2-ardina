"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface FeedItem {
  id: number;
  title: string;
  description: string;
  page: number;
}

export default function InfiniteScrollFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async (pageNum: number): Promise<FeedItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (pageNum > 5) return [];

    return Array.from({ length: 10 }, (_, i) => ({
      id: (pageNum - 1) * 10 + i + 1,
      title: `Item ${(pageNum - 1) * 10 + i + 1}`,
      description: `Deskripsi untuk item ${(pageNum - 1) * 10 + i + 1}`,
      page: pageNum,
    }));
  };

  const loadMoreItems = useCallback(async () => {
    // 1. Tambahkan pengecekan ketat agar tidak double fetch
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newItems = await fetchData(page);
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prevItems) => {
          // 2. Opsi tambahan: Filter untuk memastikan ID benar-benar unik sebelum masuk state
          const newUniqueItems = newItems.filter(
            (newItem) => !prevItems.some((prev) => prev.id === newItem.id)
          );
          return [...prevItems, ...newUniqueItems];
        });
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Trigger hanya jika menyentuh dasar dan sedang tidak loading
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems();
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreItems, hasMore]); // Pastikan hasMore ada di dependency

  // HAPUS useEffect yang memanggil loadMoreItems() secara manual di sini!
  // Biarkan IntersectionObserver yang menangani fetch pertama kali.

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Infinite Scroll Feed</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h4 className="font-semibold text-lg text-indigo-600 mb-2">{item.title}</h4>
            <p className="text-gray-600">{item.description}</p>
            <span className="inline-block mt-2 text-xs text-gray-400">
              Halaman {item.page} # ID: {item.id}
            </span>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-4 mt-4">
          {[1, 2, 3].map((n) => <SkeletonLoader key={n} />)}
        </div>
      )}

      <div ref={sentinelRef} className="h-10 flex items-center justify-center mt-4">
        {!hasMore && <p className="text-gray-500 text-sm">Anda sudah mencapai akhir feed.</p>}
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
}