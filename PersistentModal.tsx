import React, { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import { defaultColorScheme, globalStyles } from './styles'
import { CloseDialogButton } from './UIComponents/buttons/CloseDialogButton'

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
      <View style={globalStyles.modalView}>
        {onClose && (
          <CloseDialogButton onPress={onClose} />
        )}
        {children}
      </View>
    </View>
  )
}