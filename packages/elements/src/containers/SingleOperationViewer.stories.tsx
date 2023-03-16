import { Story } from '@storybook/react';
import * as React from 'react';

import { SingleOperationViewer, SingleOperationViewerProps } from './SingleOperationViewer';

export default {
  title: 'Example',
  component: SingleOperationViewer,
  argTypes: {
    apiDescriptionDocument: { control: 'text', type: { required: false }, table: { category: 'Input' } },
    apiDescriptionUrl: { control: 'text', table: { category: 'Input' } },
    layout: {
      control: { type: 'inline-radio' },
      table: { category: 'UI' },
    },
    basePath: { table: { category: 'Routing' } },
    router: { table: { category: 'Routing' } },
  },
  args: {
    router: 'memory',
  },
};

const Template: Story<SingleOperationViewerProps> = args => <SingleOperationViewer {...args} />;

export const SingleOperationViewerExample = Template.bind({});
SingleOperationViewerExample.args = {
  apiDescriptionUrl: 'https://raw.githubusercontent.com/stoplightio/Public-APIs/master/reference/zoom/openapi.yaml',
  pathname: '/operations/accounts',
};
SingleOperationViewerExample.storyName = 'Example Single Operation';
