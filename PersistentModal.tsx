import React, { PropsWithChildren } from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons' 
import { defaultColorScheme } from './styles'

const modalStyles = StyleSheet.create({
  modalActive: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    zIndex: 99999,
    position: 'absolute',
    flex: 1,
    width: '100%',
    flexDirection: 'column',
  },
  modalHidden: {
    display: 'none',
    zIndex: 1,
  },
  internalView: {
    backgroundColor: defaultColorScheme.backgroundColor,
    borderWidth: 3,
    borderBottomWidth: 6,
    borderColor: defaultColorScheme.modalBorder,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    shadowColor: defaultColorScheme.shadow,
    shadowRadius: 3,
    elevation: 3,
  },
  closeBox: {
    top: 15,
    alignSelf: 'flex-end',
  },
})

interface PersistentModalProps {
  visible: boolean
  onClose?: () => void
}
/**
 * The regular React Native modal re-renders its content every time it is brought up. PersistentModal
 * just hides the content so it doesn't need to be re-rendered each time, giving better performance
 * for content that is slow to render
 */
export function PersistentModal({visible, onClose, children}: PropsWithChildren<PersistentModalProps>) {
  return (
    <View style={visible ? modalStyles.modalActive : modalStyles.modalHidden}>
      <View style={modalStyles.internalView}>
        {onClose && (
          <View style={modalStyles.closeBox}>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" size={24} color="red" />
            </Pressable>
          </View>
        )}
        {children}
      </View>
    </View>
  )
}