"use server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateWatch(formData) {
  console.log('formData ==>', formData)
  const id = formData.get('id');
  const model = formData.get("model");
  const brand = formData.get("brand");
  const referenceNumber = formData.get("referenceNumber");

  const cookiesStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookiesStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    console.ereror("User is not authenticated within updateWatch server action");
    return;
  }

  //update the watch attribute for the watch with matching id for the logged in user
  const { data, error } = await supabase.from("watches").update(
    {
      model,
      brand,
      reference_number: referenceNumber,
    },
  ).match({id, user_id: user.id});

  if (error) {
    console.error("Error updating data", error);
    return;
  }

  revalidatePath("/watch-list");
  
  return { message: "Success" };
}