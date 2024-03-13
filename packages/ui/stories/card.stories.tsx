import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardFooter, CardHeader } from '../src/card';

const meta = {
  title: 'Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

function ExampleContent() {
  return (
    <>
      <CardHeader>Header</CardHeader>
      <CardContent>Content</CardContent>
      <CardFooter>Footer</CardFooter>
    </>
  );
}

export const DefaultCard: Story = {
  args: {
    children: <ExampleContent />,
  },
};
