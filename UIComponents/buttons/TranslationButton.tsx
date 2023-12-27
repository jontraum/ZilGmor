import React from 'react'
import { ButtonProps } from './ButtonProps'
import { Pressable, StyleSheet, Text } from 'react-native'

const styles =  StyleSheet.create({
  button: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 25,
    fontWeight: '900',
    fontFamily: 'serif',
    top: -3,
  },
})

export function TranslationButton({onPress}: ButtonProps) {
  return (
    <Pressable onPress={onPress}><Text style={styles.button}>A&#9666;&#8202;א</Text></Pressable>
  )
}