import React, {ReactNode} from 'react'

import {styled} from '@karma.run/react'
import {themeMiddleware} from '../style/themeContext'
import {FontSize, pxToRem, Spacing} from '../style/helpers'

const DescriptionListWrapper = styled('dl', () => ({
  _className: process.env.NODE_ENV !== 'production' ? 'DescriptionList' : undefined,

  fontSize: pxToRem(FontSize.Small),
  marginTop: 0,
  marginBottom: 0
}))

export interface DescriptionItemProps {
  readonly children?: ReactNode
}

export function DescriptionList({children}: DescriptionListItemProps) {
  return <DescriptionListWrapper>{children}</DescriptionListWrapper>
}

const DescriptionListItemWrapper = styled('div', () => ({
  _className: process.env.NODE_ENV !== 'production' ? 'DescriptionListItem' : undefined,

  display: 'flex',
  marginBottom: pxToRem(Spacing.ExtraSmall),

  ':last-child': {
    marginBottom: 0
  }
}))

const DescriptionListItemTerm = styled(
  'dt',
  ({theme}) => ({
    _className: process.env.NODE_ENV !== 'production' ? 'DescriptionListItemTerm' : undefined,

    color: theme.colors.gray,
    flexGrow: 1
  }),
  themeMiddleware
)

const DescriptionListItemDetail = styled('dd', () => ({
  _className: process.env.NODE_ENV !== 'production' ? 'DescriptionListItemDetail' : undefined,
  marginLeft: pxToRem(Spacing.Small)
}))

export interface DescriptionListItemProps {
  readonly label?: ReactNode
  readonly children?: ReactNode
}

export function DescriptionListItem({label, children}: DescriptionListItemProps) {
  return (
    <DescriptionListItemWrapper>
      <DescriptionListItemTerm>{label}</DescriptionListItemTerm>
      <DescriptionListItemDetail>{children}</DescriptionListItemDetail>
    </DescriptionListItemWrapper>
  )
}
