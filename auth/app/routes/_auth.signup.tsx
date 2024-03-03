import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { useActionData, useNavigation } from '@remix-run/react';
import { useForm, getFormProps } from '@conform-to/react';
import { parseWithZod, getZodConstraint } from '@conform-to/zod';
import { maxLengths, minLengths } from '@aproxima/core-db/constraints';
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
import { z } from 'zod';
import { createUserSession, getUserId, signupWithPassword } from '~/modules/user-session/session.server';

export const meta: MetaFunction = () => {
  return [{ title: 'Sign Up | Aproxima' }, { name: 'description', content: 'Sign up for an Aproxima account.' }];
};

const schema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Email is invalid')
    .max(maxLengths.email, 'Email is too long')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(minLengths.password, 'Password is too short')
    .max(maxLengths.password, 'Password is too long'),
  displayName: z
    .string({ required_error: 'Display name is required' })
    .max(maxLengths.displayName, 'Display name is too long')
    .trim(),
});

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });
  if (submission.status !== 'success') {
    return submission.reply();
  }
  try {
    const sessionData = await signupWithPassword(submission.value, context.db);
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
  const isSubmitting = navigation.state !== 'idle' && navigation.formAction === '/signup';
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
      <Form method="POST" action="/signup" {...getFormProps(form)}>
        <CardHeader>
          <H1>Sign Up</H1>
        </CardHeader>
        <CardContent>
          <Fieldset>
            <FormInput label="Display name:" fieldData={fields.displayName} type="text" autoComplete="on" required />
            <FormInput label="Email:" fieldData={fields.email} type="email" autoComplete="on" />
            <FormInput label="Password:" fieldData={fields.password} type="password" autoComplete="new-password" />
          </Fieldset>
        </CardContent>
        <CardFooter>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Signing you up...' : 'Sign up!'}
          </Button>
        </CardFooter>
        <InlineError>{actionData?.error?.['']}</InlineError>
      </Form>
    </Card>
  );
}
