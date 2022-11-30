import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PrimaryButton } from './PrimaryButton';

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default {
  title: 'Components/PrimaryButton',
  component: PrimaryButton,
  argTypes: {
    onClick: { action: 'clicked' },
  },
} as ComponentMeta<typeof PrimaryButton>;

const Template: ComponentStory<typeof PrimaryButton> = (args) => (
  <PrimaryButton {...args} />
);

export const Success = Template.bind({});
Success.args = {
  children: 'Success',
};

export const Danger = Template.bind({});
Danger.args = {
  children: 'Danger',
};

export const Log = Template.bind({});
Log.args = {
  children: 'Log',
  onClick: () => console.log('button clicked'),
};

// export const Small = Template.bind({});
// Small.args = {};
