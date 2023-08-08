import React from 'react'
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
    flex: 1,
    justifyContent: 'space-between',
    padding,
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
})

export function SefariaTextItem ({ textHE, textEN, selected = false }: SefariaTextItemProps) {
  return (
    <View style={selected ? [styles.container, styles.selected] : styles.container}>
      <RenderHtml contentWidth={styles.textView.width} source={{ html: textHE }} />
      <RenderHtml contentWidth={styles.textView.width} source={{ html: textEN }} />
      {/* <AutoHeightWebView style={styles.textView} source={{html: textHE, baseUrl: "http://sefaria.org/"}} originWhitelist={['*']} />
            <AutoHeightWebView textZoom={100} style={styles.textView} source={{html: textEN, baseUrl: "http://sefaria.org/"}} originWhitelist={['*']} /> */}
    </View>
  )
}
