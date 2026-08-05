import Link from "next/link";
import { addTodo, signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

type Todo = {
  id: number;
  name: string;
  completed: boolean;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Todos</h1>
        <p className={styles.muted}>
          Logg inn for å se og legge til todos (RLS krever autentisering).
        </p>
        <Link className={styles.button} href="/login">
          Gå til login
        </Link>
      </main>
    );
  }

  const { data: todos, error } = await supabase
    .from("todos")
    .select("id, name, completed")
    .order("inserted_at", { ascending: false });

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Todos</h1>
          <p className={styles.muted}>{user.email}</p>
        </div>
        <form action={signOut}>
          <button className={styles.secondary} type="submit">
            Logg ut
          </button>
        </form>
      </header>

      {(params.error || error) && (
        <p className={styles.error}>{params.error || error?.message}</p>
      )}

      <form className={styles.form} action={addTodo}>
        <input
          className={styles.input}
          name="name"
          type="text"
          placeholder="Ny todo"
          required
        />
        <button className={styles.button} type="submit">
          Legg til
        </button>
      </form>

      <ul className={styles.list}>
        {(todos as Todo[] | null)?.map((todo) => (
          <li key={todo.id} className={styles.item}>
            {todo.name}
          </li>
        ))}
      </ul>

      {!todos?.length && !error && (
        <p className={styles.muted}>Ingen todos ennå. Legg til den første.</p>
      )}
    </main>
  );
}
