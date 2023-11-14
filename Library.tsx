import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { HistoryButton } from './buttons/HistoryButton'
import { globalStyles } from './styles'
import { fullIndex } from './data/bookIndexes'
import { LibrarySection } from './LibrarySection'
import { BookInfo } from './data/types'

interface LibraryArgs {
  showHistory: () => void;
  setCurrentBook: (book: BookInfo) => void;
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
  },
})

export function Library({showHistory, setCurrentBook}: LibraryArgs) {
  return (
    <View style={styles.mainContainer}>
      <View style={globalStyles.pageHeaderContainer}>
        <View>{/* Is there a button to go here? Maybe help or info? */}</View>
        <Text style={globalStyles.pageHeaderText}>ZilGmor Library</Text>
        <HistoryButton onPress={showHistory} />
      </View>
      <ScrollView>
        { fullIndex.map( (section, num) => {
          return (
            <LibrarySection key={num} bookSet={section} setCurrentBook={setCurrentBook} />
          )
        })}
      </ScrollView>
    </View>
  )
}