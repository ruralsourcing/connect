import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import User from '../components/User';
import { MockAuthProvider } from '../context/MockAuthenticationContext/MockAuthProvider';

export default {
  title: 'Connect/User',
  component: User
} as Meta;

const Template: Story = () => <MockAuthProvider><User /></MockAuthProvider>;

export const Primary = Template.bind({});

// export const Secondary = Template.bind({});
// Secondary.args = {
//   label: 'Button',
// };

// export const Large = Template.bind({});
// Large.args = {
//   size: 'large',
//   label: 'Button',
// };

// export const Small = Template.bind({});
// Small.args = {
//   size: 'small',
//   label: 'Button',
// };
