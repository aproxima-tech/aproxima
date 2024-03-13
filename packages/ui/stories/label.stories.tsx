import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '../src/label';

const meta = {
  title: 'Label',
  component: Label,
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultLabel: Story = {
  args: {
    children: 'Email:',
  },
};
