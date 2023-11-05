import React, { memo } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import RenderHtml from 'react-native-render-html'
// Keeping these old imports to remember these alternatives, in case I want to go back to them later
// If you're still reading this after the end of 2023, should probably just get rid of these!
// import {WebView} from 'react-native-webview';
// import AutoHeightWebView from 'react-native-autoheight-webview';

export interface SefariaTextItemProps {
  textHE: string
  textEN: string
  itemNumber: number
  key: string
  selected?: boolean
}

const padding = 1

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'space-between',
    padding,
    fontSize: 20,
  },
  textView: {
    flex: 1,
    // height: 60,
    width: Dimensions.get('window').width - (padding * 2),
    fontSize: 16,
  },
  wvContainer: {
    fontSize: 30,
  },
  selected: {
    borderWidth: 2,
    backgroundColor: '#c7e2e2',
    borderColor: '#28f',
  },
  english: {
    fontSize: 14,
    fontFamily: 'serif',
  },
  hebrew: {
    fontSize: 18,
    fontFamily: 'serif',
  },
})

// Using React's memo function here to prevent the warning:
//   "VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc."
export const SefariaTextItem = memo(function SefariaTextItem ({ textHE, textEN, selected = false }: SefariaTextItemProps) {
  return (
    <View style={selected ? [styles.container, styles.selected] : styles.container}>
      { textHE && (
        <RenderHtml baseStyle={styles.hebrew} contentWidth={styles.textView.width} source={{ html: textHE }} />
      )}
      { textEN && (
        <RenderHtml baseStyle={styles.english} contentWidth={styles.textView.width} source={{ html: textEN }} />
      )}
    </View>
  )
})
