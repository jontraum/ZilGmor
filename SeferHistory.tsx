import React, { useEffect, useState } from 'react'
import {Pressable, StyleSheet, Text, View} from 'react-native'
import { BookSettings, getHistory } from './data/settings'
import { globalStyles } from './styles'
import { Dialog } from './UIComponents/Dialog'
import { BookInfo } from './data/types'

interface SeferHistoryProps {
  loadBook: (book: BookInfo) => void
  onClose: () => void
  visible: boolean
}

function historyItemToBookInfo(item: BookSettings) : BookInfo {
  return {
    slug: item.bookSlug,
    title: item.label,
  }
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'column',
  },
  historyList: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },
  historyItem: {
    flexDirection: 'row',
  },
})

export function SeferHistory({loadBook, onClose, visible}: SeferHistoryProps) {
  const [historyList, setHistoryList] = useState<BookSettings[] | null>()

  useEffect( () => {
    getHistory().then( (result) => {
      setHistoryList(result)
    })
  }, [visible])

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
      <Dialog visible={visible} onClose={onClose} title="History">
        <View style={styles.historyList}>
          { historyList.map( (item, itemNum) => {
            return (
              <View style={styles.historyItem}key={itemNum}>
                <Pressable onPress={() => loadBook(historyItemToBookInfo(item))} >
                  <Text style={globalStyles.bookButton}>{item.label.he || item.label.en}</Text>
                </Pressable>
              </View>
            )
          }) }
        </View>
      </Dialog>
    )
  }
}