import Image from "next/image";

export default function MediaSection() {
    return (
        <section className="mt-8 space-y-8">
            {/* Judul Section */}
            <h3 className="text-2xl font-bold">Galeri Media Responsive</h3>

            {/* Single Image dengan next/image */}
            <div className="space-y-4">
                <h4 className="text-2xl font-semibold">Gambar Optimasi</h4>
                <Image 
                    src="/image.png"
                    alt="Gambar Optimasi Otomatis"
                    width={800}
                    height={500}
                    className="w-full h-auto rounded-lg shadow-xl"
                />
                <p className="text-gray-600 text-sm">
                    Gambar otomatis di lazy load, dikonversi jadi WebP, dan ukurannya disesuaikan
                </p>
            </div>

            {/* Grid 2: Di Mobile bertumpuk */}
            <div className="space-y-4">
                <h4 className="text-xl font-semibold">Galeri Responsive</h4>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <Image 
                    src="/image.png"
                    alt="Gambar pertama"
                    width={800}
                    height={500}
                    className="w-full h-auto rounded-lg shadow-lg"
                    />
                    <Image
                    src="/image2.png"
                    alt="Gambar kedua"
                    width={800}
                    height={500}
                    className="w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
            </div>

            {/* Grid 2: Gambar bertumpuk di mobile, bersampingan di desktop */}
            <div className="space-y-4">
                <h4 className="text-xl font-semibold">Galeri Responsive</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Image  
                    src="/image.png"
                    alt="Gambar pertama"
                    width={800}
                    height={500}
                    className="w-full h-auto rounded-lg shadow-lg"
                />
                <Image
                    src="/image2.png"
                    alt="Gambar kedua"
                    width={800}
                    height={500}
                    className="w-full h-auto rounded-lg shadow-lg"
                />
                </div>
            </div>

            {/* Video Responsive Youtube */}
            <div className="space-y-4">
                <h4 className="text-xl font-semibold">Video Responsive Youtube</h4>
                <div className="aspect-video w-full">
                    <iframe
                        src="https://youtube.com/embed/dQw4w9WgXcQ"
                        allowFullScreen
                        className="w-full h-full rounded-lg shadow-xl"
                    ></iframe>
                </div>
                <p className="text-gray-600 text-sm">
                    Video Selalu menjaga rasio 16:9 dan responsif disemua layar
                </p>
            </div>

            {/* Video Lokal Opsional */}
            <div className="space-y-4">
                <h4 className="text-xl font-semibold">Video Lokal</h4>
                <div className="aspect-video w-full">
                    <video
                        src="/sample-video.mp4"
                        controls
                        className="w-full h-full rounded-lg shadow-xl"
                    ></video>
                </div>
                <p className="text-gray-600 text-sm">
                    Video Lokal Juga Bisa Responsif dengan cara yang sama
                </p>
            </div>
        </section>
    )
}