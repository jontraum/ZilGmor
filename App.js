import { StyleSheet, SafeAreaView, StatusBar } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SefariaTextPage } from './SefariaTextPage'
import { Library } from './Library'
import { getHistory, initializeDB } from './data/settings'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

export default function App () {
  const [currentBook, setCurrentBook] = useState()
  //const [size, setSize] = useState(12)
  //const textStyle = { fontSize: size }

  const goToLibrary = useCallback(() => {
    setCurrentBook(null)
  })
  
  const goToBook = useCallback((bookSlug) => {
    setCurrentBook({slug: bookSlug, title: {en: bookSlug}})
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

  if (currentBook) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={false} translucent={true} style="dark"/>
        <SefariaTextPage
          currentBook={currentBook}
          goToLibrary={goToLibrary}
          setCurrentBook={setCurrentBook}
        />
      </SafeAreaView>
    )
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={false} translucent={true} />
        <Library setCurrentBook={setCurrentBook} />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight,
  },
})
