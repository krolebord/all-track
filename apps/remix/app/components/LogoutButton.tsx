import { Form } from "@remix-run/react";

export const LogoutButton = () => {
  return (
    <Form action="/auth/logout" method="post">
      <button type="submit">Logout</button>
    </Form>
  );
}
