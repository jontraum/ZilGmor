import React from 'react'
import { Ionicons } from '@expo/vector-icons' 
import { topButtonSize } from '../styles'
import { Pressable } from 'react-native'

interface LibraryButtonProps {
  onPress: () => void;
}

export function LibraryButton({onPress}: LibraryButtonProps) {
  return (
    <Pressable  onPress={onPress}>
      <Ionicons name="library" size={topButtonSize} color="black"/>
    </Pressable>
  )
}
