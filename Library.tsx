import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { HistoryButton } from './UIComponents/buttons/HistoryButton'
import { globalStyles } from './styles'
import { fullIndex } from './data/bookIndexes'
import { LibrarySection } from './LibrarySection'
import { BookInfo } from './data/types'
import { SeferHistory } from './SeferHistory'

interface LibraryArgs {
  setCurrentBook: (book: BookInfo) => void;
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
  },
})

export function Library({setCurrentBook}: LibraryArgs) {
  const [showingHistory, setShowingHistory] = useState(false)
  const showHistory = () => setShowingHistory(true)
  const hideHistory = () => setShowingHistory(false)

  return (
    <View style={styles.mainContainer}>
      <View style={globalStyles.pageHeaderContainer}>
        <View>{/* Is there a button to go here? Maybe help or info? */}</View>
        <Text style={globalStyles.pageHeaderText}>ZilGmor Library</Text>
        <HistoryButton onPress={showHistory} />
      </View>
      <SeferHistory loadBook={setCurrentBook} visible={showingHistory} onClose={hideHistory} />
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