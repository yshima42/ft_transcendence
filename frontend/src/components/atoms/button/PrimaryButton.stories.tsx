import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PrimaryButton } from './PrimaryButton';

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default {
  title: 'PrimaryButton',
  component: PrimaryButton,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof PrimaryButton>;

const Template: ComponentStory<typeof PrimaryButton> = (args) => (
  <PrimaryButton {...args} />
);

export const Hello = Template.bind({});
Hello.args = {
  children: 'hello',
};

// export const Secondary = Template.bind({});
// Secondary.args = {};

// export const Large = Template.bind({});
// Large.args = {};

// export const Small = Template.bind({});
// Small.args = {};
