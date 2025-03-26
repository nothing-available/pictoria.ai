import { getImage } from "@/actions/image-actions";
import GalleryComponent from "@/components/gallery/GalleryComponents";

export default async function GalleryPage() {
    const { data: image } = await getImage();
    return (
        <section className="container mx-auto">
            <h1 className="text-3xl font-semibold mb-2">My Images</h1>
            <p className="text-muted-foreground mb-6">
                Here you can see all the images you have generated. Click on an image for more details.
            </p>

            <GalleryComponent images={image || []} />
        </section>
    );
}