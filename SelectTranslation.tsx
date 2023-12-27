import React from 'react'
import { Text, ScrollView, StyleSheet, Pressable } from 'react-native'

import { Dialog } from './UIComponents/Dialog'
import { TextVersion } from './data/types'
import { defaultColorScheme } from './styles'

const styles = StyleSheet.create({
  main: {
    flexGrow: 0,
    flexDirection: 'column',
    maxHeight: 400,
  },
  translationItem: {
    fontSize: 20,
    borderWidth: 2,
    padding: 5,
  },
  selected: {
    color: defaultColorScheme.backgroundColor,
    backgroundColor: defaultColorScheme.color,
  },
  unSelected: {
    color: defaultColorScheme.color,
    backgroundColor: defaultColorScheme.backgroundColor,
  },
})

interface SelectTranslationProps {
  availableTranslations: TextVersion[]
  visible: boolean
  onClose: () => void
  curentTranslation: string
  setCurrentTranslation: (newValue: string|null) => void
}

export function SelectTranslation({availableTranslations, visible, onClose, curentTranslation, setCurrentTranslation}: SelectTranslationProps) {

  return (
    <Dialog visible={visible} onClose={onClose} title="Select Translation">
      <ScrollView style={styles.main} persistentScrollbar={true}>
        <Pressable  key={null} onPress={() => setCurrentTranslation(null)}>
          <Text style={[styles.translationItem,  null === curentTranslation ? styles.selected : styles.unSelected]}>Sefaria Default</Text>
        </Pressable>
        {availableTranslations.filter(trans => trans.language === 'en').map( (translation, itemnum) => {
          return (
            <Pressable  key={itemnum} onPress={() => setCurrentTranslation(translation.versionTitle)}>
              <Text style={[styles.translationItem,  translation.versionTitle === curentTranslation ? styles.selected : styles.unSelected]}>{translation.versionTitle}</Text>
            </Pressable>
          )
        })}
      </ScrollView>
    </Dialog>
  )
}