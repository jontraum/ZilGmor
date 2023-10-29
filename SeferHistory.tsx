import React, { useEffect, useState } from 'react'
import {Pressable, ScrollView, Text, View} from 'react-native'
import { BookSettings, getHistory } from './data/settings'
import { globalStyles } from './styles'
import { LibraryButton } from './buttons/LibraryButton'

interface SeferHistoryProps {
  loadBook: (bookSlug: string) => void;
  goToLibrary: () => void;
}

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
      <View  style={{flexDirection: 'column'}}>
        <View style={globalStyles.pageHeaderContainer}>
          <LibraryButton onPress={goToLibrary} />
          <Text style={globalStyles.pageHeaderText}>History</Text>
        </View>
        <ScrollView>
          { historyList.map( (item, itemNum) => {
            return (
              <View style={{flexDirection: 'column' }}key={itemNum}>
                <Pressable onPress={() => loadBook(item.bookSlug)} >
                  <Text style={globalStyles.bookButton}>{item.bookSlug} {item.location}</Text>
                </Pressable>
              </View>
            )
          }) }
        </ScrollView>
      </View>
    )
  }
}