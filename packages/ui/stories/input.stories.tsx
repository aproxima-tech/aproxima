import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../src/input';

const meta = {
  title: 'Input',
  component: Input,
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeText: Story = {
  args: {
    value: 'Hello, world!',
    type: 'text',
  },
};

export const TypeEmail: Story = {
  args: {
    value: 'andre@aproxima.io',
    type: 'email',
  },
};

export const TypePassword: Story = {
  args: {
    value: '12345678',
    type: 'password',
  },
};
