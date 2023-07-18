import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { useState } from 'react';
import { SefariaTextPage } from './SefariaTextPage';
import { LibrarySection } from './LibrarySection';
import { bavli } from './data/bavli';
// import Constants from 'expo-constants';

export default function App() {
  const [currentBook, setCurrentBook] = useState();
  const [size, setSize] = useState(12);
  const textStyle = {fontSize: size};
  if (currentBook) {
    console.debug("Reading a book", currentBook)
    return (
      <View style={styles.container}>
        {/* <View style={styles.tools}>
            <AntDesign name="pluscircleo" size={36} color="black" onPress={() => setSize(size+1)}/>
            <AntDesign name="minuscircleo" size={36} color="black" onPress={() => setSize(size-1)}/>
        </View> */}
        <SefariaTextPage
          currentBook={currentBook}
          goToLibrary={() => setCurrentBook(null)}
        />
      </View>
    )
  } else {
    console.debug("Viewing book list")
    return (
      <View style={styles.container}>
        <Text>Here are some books!</Text>
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
  }
});
