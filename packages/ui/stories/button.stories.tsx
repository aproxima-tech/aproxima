import type { Meta, StoryObj } from '@storybook/react';
import { Button, buttonVariants } from '../src/button';

const meta = {
  title: 'Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: Object.keys(buttonVariants.variants.variant),
      defaultValue: buttonVariants.defaultVariants.variant,
      control: { type: 'select' },
    },
    size: {
      options: Object.keys(buttonVariants.variants.size),
      defaultValue: buttonVariants.defaultVariants.size,
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultButton: Story = {
  args: {
    children: 'Click me',
  },
};

export const SecondaryButton: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const TertiaryButton: Story = {
  args: {
    children: 'Tertiary',
    variant: 'tertiary',
  },
};

export const SmallButton: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
};

export const LargeButton: Story = {
  args: {
    children: 'Large',
    size: 'lg',
  },
};

export const IconButton: Story = {
  args: {
    children: 'Icon',
    size: 'icon',
  },
};

export const DisabledButton: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const DisabledSecondaryButton: Story = {
  args: {
    children: 'Disabled Secondary',
    variant: 'secondary',
    disabled: true,
  },
};

export const DisabledTertiaryButton: Story = {
  args: {
    children: 'Disabled Tertiary',
    variant: 'tertiary',
    disabled: true,
  },
};
