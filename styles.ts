import { StyleSheet } from 'react-native'

export const defaultColorScheme = {
  backgroundColor: '#fff',
  color: '#000',
  shadow: '#444',
  modalBorder: '#777',
  modalBackground: '#f5faff',
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
  dialogHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: defaultColorScheme.modalBackground,
    borderWidth: 2,
    borderColor: defaultColorScheme.modalBorder,
    borderRadius: 20,
    padding: 30,
    paddingTop: 2,
    alignItems: 'center',
    shadowColor: defaultColorScheme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})

export const topButtonSize = 30
