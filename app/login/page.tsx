// ./app/page.tsx

import { login } from '../auth/action';

export default function Page() {
  return (
    <main>
      Login form
      <form action={login}>
        <label>
          E-mail
          <input name="email" type="email" />
        </label>
        <label>
          Password
          <input name="password" type="password" />
        </label>
        <button type="submit">Login</button>
      </form>
    </main>
  );
}