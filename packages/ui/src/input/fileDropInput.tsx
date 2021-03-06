import React, {useState, useRef} from 'react'

import {FontSize, Spacing, BorderWidth} from '../style/helpers'
import {useThemeStyle, cssRuleWithTheme} from '../style/themeContext'
import {Icon, IconScale, IconElement} from '../data/icon'
import {cssRule} from '@karma.run/react'

const FileDropInputStyle = cssRuleWithTheme<{dragging: boolean; disabled: boolean}>(
  ({dragging, disabled, theme}) => ({
    _className: process.env.NODE_ENV !== 'production' ? 'FileDropInput' : undefined,

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    width: '100%',
    height: '100%',

    paddingTop: Spacing.Small,
    paddingBottom: Spacing.Small,
    paddingLeft: Spacing.Small,
    paddingRight: Spacing.Small,

    borderRadius: 3,

    borderStyle: 'dashed',
    borderWidth: BorderWidth.Small,
    borderColor: dragging ? theme.colors.action : theme.colors.actionDark,

    position: 'relative',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: FontSize.Small,
    textAlign: 'center',

    opacity: disabled ? 0.5 : 1,

    color: dragging ? theme.colors.action : theme.colors.actionDark,
    fill: dragging ? theme.colors.action : theme.colors.actionDark
  })
)

const FileDropInputInputStyle = cssRule(() => ({
  _className: process.env.NODE_ENV !== 'production' ? 'FileDropInputInput' : undefined,

  position: 'absolute',
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  opacity: 0
}))

export interface FileDropInputProps {
  disabled?: boolean

  icon?: IconElement
  text?: string

  onDrop: (fileList: File[]) => void
}

export function FileDropInput({disabled = false, onDrop, icon, text}: FileDropInputProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const css = useThemeStyle({dragging, disabled})

  function handleDragIn(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()

    setDragging(true)
  }

  function handleDragOut(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()

    setDragging(false)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()

    setDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDrop(Array.from(e.dataTransfer.files))
      e.dataTransfer.clearData()
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      onDrop(Array.from(e.target.files))
    }
  }

  return (
    <div
      className={css(FileDropInputStyle)}
      onDrop={!disabled ? handleDrop : undefined}
      onDragOver={!disabled ? handleDragIn : undefined}
      onDragLeave={!disabled ? handleDragOut : undefined}
      onClick={() => inputRef.current!.click()}>
      {icon && <Icon element={icon} scale={IconScale.Double} />}
      <div>{text}</div>
      <input
        className={css(FileDropInputInputStyle)}
        ref={inputRef}
        type="file"
        value={''}
        onChange={handleInputChange}
        disabled={disabled}
      />
    </div>
  )
}
