import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { useActionData, useNavigation } from '@remix-run/react';
import {
  H1,
  Button,
  Card,
  Form,
  InlineError,
  FormInput,
  CardHeader,
  CardContent,
  CardFooter,
  Fieldset,
} from '@aproxima/ui';
import { createUserSession, getUserId, loginUser } from '~/modules/user-session/session.server';
import { maxLengths } from '@aproxima/core-db/constraints';
import { useForm, getFormProps } from '@conform-to/react';
import { parseWithZod, getZodConstraint } from '@conform-to/zod';
import { z } from 'zod';

export const meta: MetaFunction = () => {
  return [{ title: 'Log In | Aproxima' }, { name: 'description', content: 'Log into your Aproxima account.' }];
};

const schema = z.object({
  email: z.string().email().max(maxLengths.email, 'Email is too long').toLowerCase().trim(),
  password: z.string().max(maxLengths.password, 'Password is too long'),
});

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });
  if (submission.status !== 'success') {
    return submission.reply();
  }
  try {
    const sessionData = await loginUser(submission.value, context.db);
    return redirect(`${context.env.PROTOCOL}//${context.env.HOME_HOST}`, {
      headers: await createUserSession(sessionData, context.userSessionStorage),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Something went wrong.';
    return submission.reply({
      formErrors: [message],
    });
  }
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const userId = await getUserId(request, context.userSessionStorage);
  if (userId) {
    return redirect(`${context.env.PROTOCOL}//${context.env.HOME_HOST}`);
  }
  return {};
}

export default function Component() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle' && navigation.formAction === '/login';
  const actionData = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult: actionData,
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });
  return (
    <Card>
      <Form method="POST" action="/login" {...getFormProps(form)}>
        <CardHeader>
          <H1>Log In</H1>
        </CardHeader>
        <CardContent>
          <Fieldset>
            <FormInput label="Email:" fieldData={fields['email']} type="email" autoComplete="on" />
            <FormInput label="Password:" fieldData={fields['password']} type="password" autoComplete="new-password" />
          </Fieldset>
        </CardContent>
        <CardFooter>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Logging you in...' : 'Log in!'}
          </Button>
        </CardFooter>
        <InlineError>{actionData?.error?.['']}</InlineError>
      </Form>
    </Card>
  );
}
