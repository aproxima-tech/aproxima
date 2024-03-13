import type { Meta, StoryObj } from '@storybook/react';
import { InlineError } from '../src/inline-error';

const meta = {
  title: 'InlineError',
  component: InlineError,
  tags: ['autodocs'],
} satisfies Meta<typeof InlineError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultInlineError: Story = {
  args: {
    children: 'Email or password is incorrect. Please try again.',
  },
};
