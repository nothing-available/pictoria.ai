import Configuration from "@/components/image-generation/Configuration";
import GeneratedImage from "@/components/image-generation/GeneratedImage";

export default function ImageGenerationPage() {
    return (
        <section className="container mx-auto flex-1 grid gap-4 grid-cols-3 overflow-hidden">
            <Configuration />
            <div className="col-span-2 p-4 rounded-xl flex items-center justify-center h-fit">
                <GeneratedImage />
            </div>
        </section>
    );
}