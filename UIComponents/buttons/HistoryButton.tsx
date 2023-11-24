import React from 'react'
import {MaterialIcons} from '@expo/vector-icons' 
import { topButtonSize } from '../../styles'
import { Pressable } from 'react-native'

interface HistoryButtonProps {
  onPress: () => void;
}

export function HistoryButton({onPress}: HistoryButtonProps) {
  return (
    <Pressable  onPress={onPress}>
      <MaterialIcons name="history" size={topButtonSize} color="black"/>
    </Pressable>
  )
}
