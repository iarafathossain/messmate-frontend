"use server";

import { redirect } from "next/navigation";
import { deleteCookie } from "@/utils/token-handler";

export async function logoutAction() {
  await deleteCookie("access-token");
  redirect("/signin");
}
