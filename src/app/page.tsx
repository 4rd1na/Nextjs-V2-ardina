import MediaSection from "@/components/MediaSection";
import InfiniteScrollFeed from "@/components/InfiniteScroll";
import StatCard from "@/components/StatCard";

export default function HomePage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Selamat Datang</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="Statistik 1" />
        <StatCard title="Statistik 2" />
        <StatCard title="Statistik Full" fullWidth />
      </div>

      <MediaSection />

      <InfiniteScrollFeed />
    </div>
  )
}