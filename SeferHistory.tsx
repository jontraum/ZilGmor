import React, { useEffect, useState } from 'react'
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native'
import { BookSettings, getHistory } from './data/settings'
import { globalStyles, topButtonSize } from './styles'
import { LibraryButton } from './UIComponents/buttons/LibraryButton'
import { MaterialIcons } from '@expo/vector-icons' 

interface SeferHistoryProps {
  loadBook: (bookSlug: string) => void;
  goToLibrary: () => void;
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'column',
  },
  historyList: {
    flexDirection: 'row',
  },
  historyItem: {
    flexDirection: 'row',
  },
})

export function SeferHistory({loadBook, goToLibrary}: SeferHistoryProps) {
  const [historyList, setHistoryList] = useState<BookSettings[] | null>()

  useEffect( () => {
    getHistory().then( (result) => {
      setHistoryList(result)
    })
  }, [])

  if (!historyList) {
    return (
      <View><Text>Loading...</Text></View>
    )
  }
  else if (historyList.length === 0) {
    return (
      <View><Text>No history available</Text></View>
    )
  }
  else {
    return (
      <View  style={styles.mainView}>
        <View style={globalStyles.pageHeaderContainer}>
          <LibraryButton onPress={goToLibrary} />
          <Text style={globalStyles.pageHeaderText}>History</Text>
          <View style={globalStyles.headerButtonBox}>
            <MaterialIcons name="toc" size={topButtonSize} color="black" onPress={() => console.debug('toc') }/>
          </View>
        </View>
        <ScrollView style={styles.historyList}>
          { historyList.map( (item, itemNum) => {
            return (
              <View style={styles.historyItem}key={itemNum}>
                <Pressable onPress={() => loadBook(item.bookSlug)} >
                  <Text style={globalStyles.bookButton}>{item.label.he || item.label.en}</Text>
                </Pressable>
              </View>
            )
          }) }
        </ScrollView>
      </View>
    )
  }
}