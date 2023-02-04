import { Form } from "@remix-run/react";

export const ExternalLogin = () => {
  return (<>
    <Form action="/auth/github" method="post">
      <button>Login with GitHub</button>
    </Form>
    <Form action="/auth/google" method="post">
      <button>Login with Google</button>
    </Form>
  </>);
}
