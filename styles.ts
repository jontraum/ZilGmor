import { StyleSheet } from 'react-native'

export const defaultColorScheme = {
  backgroundColor: '#fff',
  color: '#000',
  shadow: '#444',
  modalBorder: '#777',
}

export const globalStyles = StyleSheet.create({
  pageHeaderContainer: {
    height: 50,
    // flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
  pageHeaderText: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  headerButtonBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 8,
  },
  bookButton: {
    fontSize: 20,
    fontFamily: 'serif',
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 3,
    margin: 5,
  },
})

export const topButtonSize = 30
