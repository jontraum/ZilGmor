import React from 'react'
import {MaterialIcons} from '@expo/vector-icons' 
import { Pressable, StyleSheet, View } from 'react-native'
import { ButtonProps } from './ButtonProps'

const styles = StyleSheet.create({
  closeBox: {
    top: 10,
    alignSelf: 'flex-end',
  },
})

export function CloseDialogButton({onPress}: ButtonProps) {
  return (
    <View style={styles.closeBox}>
      <Pressable onPress={onPress}>
        <MaterialIcons name="close" size={24} color="red" />
      </Pressable>
    </View>
  )
}