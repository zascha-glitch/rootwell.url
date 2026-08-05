"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function messageForAuthError(message: string) {
  if (/email not confirmed/i.test(message)) {
    return "E-posten er ikke bekreftet ennå. Sjekk innboksen (og spam) for bekreftelseslenken, så prøv Logg inn igjen.";
  }
  if (/invalid login credentials/i.test(message)) {
    return "Feil e-post eller passord. Bruk samme passord som da du trykket Opprett bruker — eller send magisk lenke under.";
  }
  if (/user already registered/i.test(message)) {
    return "Brukeren finnes allerede. Trykk Logg inn, eller send magisk lenke.";
  }
  return message;
}

async function siteOrigin() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "http";
  if (host) {
    return `${proto}://${host}`;
  }
  return "http://localhost:3000";
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const origin = await siteOrigin();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/login`,
    },
  });

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(messageForAuthError(error.message))}`,
    );
  }

  if (!data.session) {
    redirect(
      `/login?info=${encodeURIComponent(
        "Bruker opprettet. Bekreft e-posten via lenken i innboksen, deretter Logg inn med samme passord.",
      )}`,
    );
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(messageForAuthError(error.message))}`,
    );
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function sendMagicLink(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const origin = await siteOrigin();

  if (!email) {
    redirect(
      `/login?error=${encodeURIComponent("Skriv inn e-post før du sender magisk lenke.")}`,
    );
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(messageForAuthError(error.message))}`,
    );
  }

  redirect(
    `/login?info=${encodeURIComponent(
      "Magisk lenke sendt. Sjekk e-posten og åpne lenken for å logge inn.",
    )}`,
  );
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function addTodo(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect("/?error=Todo%20trenger%20et%20navn");
  }

  const { error } = await supabase.from("todos").insert({
    name,
    user_id: user.id,
  });

  if (error) {
    redirect(`/?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  redirect("/");
}
