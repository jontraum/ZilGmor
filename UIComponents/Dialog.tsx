import React, { PropsWithChildren } from 'react'
import {Modal, View, Text} from 'react-native'
import { globalStyles } from '../styles'
import { CloseDialogButton } from './buttons/CloseDialogButton'

interface DialogProps {
  visible: boolean
  onClose?: () => void
  title?: string
}

export function Dialog({visible, onClose, title, children}: PropsWithChildren<DialogProps>) {
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
    >
      <View style={globalStyles.centeredView}>
        <View style={globalStyles.modalView}>
          {onClose && (
            <CloseDialogButton onPress={onClose} />
          )}
          {title && (
            <Text style={globalStyles.dialogHeaderText}>{title}</Text>
          )}
          {children}
        </View>
      </View>
    </Modal>
  )
}