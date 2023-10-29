import React from 'react'
import {MaterialIcons} from '@expo/vector-icons' 
import { topButtonSize } from '../styles'
import { Pressable } from 'react-native'

interface LibraryButtonProps {
  onPress: () => void;
}

export function LibraryButton({onPress}: LibraryButtonProps) {
  return (
    <Pressable  onPress={onPress}>
      <MaterialIcons name="toc" size={topButtonSize} color="black"/>
    </Pressable>
  )
}
