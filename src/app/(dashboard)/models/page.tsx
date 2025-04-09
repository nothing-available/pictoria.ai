import { fetchMOdel } from "@/actions/model-action";
import ModelsList from "@/components/models/ModelsList";

export default async function ModelsPage() {

  const data = await fetchMOdel();

  return (
    <section className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font bold">My Model</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage your models here. You can create, edit, and delete
        </p>
      </div>

      <ModelsList models={data} />
    </section>
  );
}