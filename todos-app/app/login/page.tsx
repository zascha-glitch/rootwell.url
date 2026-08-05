import Link from "next/link";
import { signIn, signUp } from "@/app/auth/actions";
import styles from "../page.module.css";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Login</h1>
      <p className={styles.muted}>
        Opprett bruker eller logg inn for å bruke todos.
      </p>

      {params.error && <p className={styles.error}>{params.error}</p>}

      <form className={styles.authForm} action={signIn}>
        <label className={styles.label}>
          E-post
          <input
            className={styles.input}
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </label>
        <label className={styles.label}>
          Passord
          <input
            className={styles.input}
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
          />
        </label>
        <div className={styles.actions}>
          <button className={styles.button} type="submit">
            Logg inn
          </button>
          <button
            className={styles.secondary}
            type="submit"
            formAction={signUp}
          >
            Opprett bruker
          </button>
        </div>
      </form>

      <Link className={styles.link} href="/">
        Tilbake
      </Link>
    </main>
  );
}
