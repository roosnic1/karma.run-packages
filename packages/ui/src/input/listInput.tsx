import React from 'react'
import nanoid from 'nanoid'
import {SortableHandle, SortableContainer, SortableElement} from 'react-sortable-hoc'
import arrayMove from 'array-move'

import {isFunctionalUpdate, cssRule, useStyle} from '@karma.run/react'
import {MaterialIconDeleteOutlined, MaterialIconDragIndicator} from '@karma.run/icons'
import {IconButton} from '../buttons/iconButton'
import {Box} from '../layout/box'
import {Spacing, ZIndex} from '../style/helpers'
import {Card} from '../data/card'
import {AddBlockButton} from '../buttons/addBlockButton'

export interface FieldProps<V = any> {
  readonly value: V
  readonly onChange: React.Dispatch<React.SetStateAction<V>>
}

export type FieldConstructorFn<V = any> = (props: FieldProps<V>) => JSX.Element

export interface ListFieldProps<T = any> extends FieldProps<ListValue<T>[]> {
  readonly label?: string
  readonly defaultValue: T | (() => T)
  readonly disabled?: boolean
  readonly children: (props: FieldProps<T>) => JSX.Element
}

export interface ListValue<T = any> {
  readonly id: string
  readonly value: T
}

export interface ListItemProps<T = any> {
  readonly value: ListValue<T>
  readonly itemIndex: number
  readonly itemDisabled?: boolean
  readonly onChange: (index: number, value: React.SetStateAction<ListValue<T>>) => void
  readonly onRemove: (index: number) => void
  readonly children: (props: FieldProps<T>) => JSX.Element
}

const DragHandle = SortableHandle(({disabled}: {disabled?: boolean}) => (
  <IconButton title="Move" icon={MaterialIconDragIndicator} disabled={disabled} />
))

const ListItem = SortableElement(
  ({value, itemIndex, itemDisabled, onChange, onRemove, children}: ListItemProps) => {
    function handleValueChange(fieldValue: React.SetStateAction<any>) {
      onChange(itemIndex, value => ({
        ...value,
        value: isFunctionalUpdate(fieldValue) ? fieldValue(value.value) : fieldValue
      }))
    }

    function handleRemove() {
      onRemove(itemIndex)
    }

    return (
      <Box marginBottom={Spacing.ExtraSmall} display="flex" flexDirection="row">
        <Box marginRight={Spacing.ExtraSmall}>
          <DragHandle disabled={itemDisabled} />
        </Box>
        <Card width="100%">
          <Box padding={Spacing.ExtraSmall} minHeight="100%">
            {children({value: value.value, onChange: handleValueChange})}
          </Box>
        </Card>
        <Box marginLeft={Spacing.ExtraSmall}>
          <IconButton
            title="Delete"
            icon={MaterialIconDeleteOutlined}
            onClick={handleRemove}
            disabled={itemDisabled}
          />
        </Box>
      </Box>
    )
  }
)

const SortableList = SortableContainer(
  ({value, defaultValue, disabled, children, onChange}: ListFieldProps) => {
    function handleItemChange(itemIndex: number, itemValue: React.SetStateAction<ListValue>) {
      onChange(value =>
        Object.assign([], value, {
          [itemIndex]: isFunctionalUpdate(itemValue) ? itemValue(value[itemIndex]) : itemValue
        })
      )
    }

    function handleAdd() {
      onChange(value => [...value, {id: nanoid(), value: defaultValue}])
    }

    function handleRemove(itemIndex: number) {
      onChange(value => value.filter((_, index) => index !== itemIndex))
    }

    return (
      <Box>
        {value.map((value: any, index: number) => (
          <ListItem
            key={value.id}
            itemIndex={index}
            index={index}
            value={value}
            itemDisabled={disabled}
            onChange={handleItemChange}
            onRemove={handleRemove}>
            {children}
          </ListItem>
        ))}
        <AddBlockButton onClick={handleAdd} disabled={disabled} />
      </Box>
    )
  }
)

const ListItemHelperStyle = cssRule({
  zIndex: ZIndex.DragHelper
})

export function ListInput<T>({
  value,
  label,
  defaultValue,
  disabled,
  children,
  onChange
}: ListFieldProps<T>) {
  const css = useStyle()
  const onSortEnd = ({oldIndex, newIndex}: {oldIndex: number; newIndex: number}) => {
    onChange(arrayMove(value, oldIndex, newIndex))
  }

  return (
    <Box>
      {label && <label>{label}</label>}
      <SortableList
        helperClass={css(ListItemHelperStyle)}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        children={children}
        onChange={onChange}
        onSortEnd={onSortEnd}
        useDragHandle
      />
    </Box>
  )
}
