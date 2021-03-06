import React from 'react'
import {centerLayoutDecorator} from '../.storybook/decorators'
import {PlaceholderInput} from './placeholderInput'

export default {
  component: PlaceholderInput,
  title: 'Input|PlaceholderInput',
  decorators: [centerLayoutDecorator()]
}

export const Standard = () => <PlaceholderInput></PlaceholderInput>
