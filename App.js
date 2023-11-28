import { StyleSheet, View, StatusBar } from 'react-native'
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
      <View style={styles.container}>
        {/* <View style={styles.tools}>
            <AntDesign name="pluscircleo" size={36} color="black" onPress={() => setSize(size+1)}/>
            <AntDesign name="minuscircleo" size={36} color="black" onPress={() => setSize(size-1)}/>
        </View> */}
        <SefariaTextPage
          currentBook={currentBook}
          goToLibrary={goToLibrary}
          setCurrentBook={setCurrentBook}
        />
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <Library setCurrentBook={setCurrentBook} />
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
