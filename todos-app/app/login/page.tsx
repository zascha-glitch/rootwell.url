import Link from "next/link";
import { sendMagicLink, signIn, signUp } from "@/app/auth/actions";
import styles from "../page.module.css";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; info?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Login</h1>
      <p className={styles.muted}>
        Brukeren din er allerede opprettet hvis du har trykket «Opprett bruker»
        før. Da er det «Logg inn» eller magisk lenke som gjelder.
      </p>

      {params.error && <p className={styles.error}>{params.error}</p>}
      {params.info && <p className={styles.info}>{params.info}</p>}

      <form className={styles.authForm} action={signIn}>
        <label className={styles.label}>
          E-post
          <input
            className={styles.input}
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue="anders.fjuk.p@gmail.com"
          />
        </label>
        <label className={styles.label}>
          Passord
          <input
            className={styles.input}
            name="password"
            type="password"
            minLength={6}
            required
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
          <button
            className={styles.secondary}
            type="submit"
            formAction={sendMagicLink}
            formNoValidate
          >
            Send magisk lenke
          </button>
        </div>
      </form>

      <Link className={styles.link} href="/">
        Tilbake
      </Link>
    </main>
  );
}
