import React from 'react'
import {MaterialIcons} from '@expo/vector-icons' 
import { topButtonSize } from '../../styles'
import { Pressable } from 'react-native'
import { ButtonProps } from './ButtonProps'

export function HistoryButton({onPress}: ButtonProps) {
  return (
    <Pressable  onPress={onPress}>
      <MaterialIcons name="history" size={topButtonSize} color="black"/>
    </Pressable>
  )
}
