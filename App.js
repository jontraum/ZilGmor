import { StyleSheet, View, StatusBar } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SefariaTextPage } from './SefariaTextPage'
import { LibrarySection } from './LibrarySection'
import { bavli } from './data/bookIndexes'
import { getHistory, initializeDB } from './data/settings'
import { SeferHistory } from './SeferHistory'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

export default function App () {
  const [currentBook, setCurrentBook] = useState()
  const [showingHistory, setShowingHistory] = useState(false)
  //const [size, setSize] = useState(12)
  //const textStyle = { fontSize: size }

  const showHistory = useCallback(() => {setShowingHistory(true)})
  const goToBook = useCallback((bookSlug) => {
    setCurrentBook({slug: bookSlug, title: {en: bookSlug}})
    setShowingHistory(false)
  })

  // On initial load of app, initialize the DB.
  useEffect(() => {
    initializeDB().then(() => {
      getHistory().then((historyList) =>{
        if (historyList && historyList.length > 0) {
          goToBook(historyList[0].bookSlug)
        }
        SplashScreen.hideAsync()
      })
    })
  }, [])

  if (showingHistory) {
    return (
      <View style={styles.container}>
        <SeferHistory loadBook={goToBook}/>
      </View>
    )
  }
  if (currentBook) {
    return (
      <View style={styles.container}>
        {/* <View style={styles.tools}>
            <AntDesign name="pluscircleo" size={36} color="black" onPress={() => setSize(size+1)}/>
            <AntDesign name="minuscircleo" size={36} color="black" onPress={() => setSize(size-1)}/>
        </View> */}
        <SefariaTextPage
          currentBook={currentBook}
          goToLibrary={() => { setCurrentBook(null) }}
          showHistory={showHistory}
        />
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <LibrarySection bookList={bavli} setCurrentBook={setCurrentBook} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight, // or maybe from Expo: Constants.statusBarHeight,
  },
  tools: {
    flex: 1,
    flexDirection: 'row',
    height: 16,
    marginTop: 10,
  },
})
