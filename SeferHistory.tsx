import React, { useEffect, useState } from 'react'
import {Pressable, Text, View} from 'react-native'
import { BookSettings, getHistory } from './data/settings'
import { globalStyles } from './styles'

interface SeferHistoryProps {
  loadBook: (bookSlug: string) => void;
}

export function SeferHistory({loadBook}: SeferHistoryProps) {
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
          <Text style={globalStyles.pageHeaderText}>History</Text>
        </View>
        <View style={{flex: 10, marginBottom: 2}}>
          { historyList.map( (item, itemNum) => {
            return (
              <Pressable key={itemNum} onPress={() => loadBook(item.bookSlug)} >
                <Text style={globalStyles.bookButton}>{item.bookSlug} {item.location}</Text>
              </Pressable>
            )
          }) }
        </View>
      </View>
    )
  }
}