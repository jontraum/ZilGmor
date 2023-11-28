import React from 'react'
import { Ionicons } from '@expo/vector-icons' 
import { topButtonSize } from '../../styles'
import { Pressable } from 'react-native'
import { ButtonProps } from './ButtonProps'

export function LibraryButton({onPress}: ButtonProps) {
  return (
    <Pressable  onPress={onPress}>
      <Ionicons name="library" size={topButtonSize} color="black"/>
    </Pressable>
  )
}
