import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function getPreSignedStorageUrl(){

    const supabase = await createClient();
    const {data:{user}} = await supabase.auth.getUser()

    const {} = await supabaseAdmin.storage.from('training-data').createSignedUploadUrl(`${user?.id}/${new Date().getTime()}_${filePath}`)
}