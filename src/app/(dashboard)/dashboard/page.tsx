import requireUser from "@/lib/authHook";

export default async function Page() {
    const session = await requireUser()
    
  return (
    <div>
        Dashboard
    </div>
  );
}
