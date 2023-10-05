import React from 'react'
import { BookInfo } from './data/types'
import { Pressable, View, StyleSheet, Text } from 'react-native'

interface LibrarySectionArgs {
    bookList: BookInfo[];
    setCurrentBook: (book: BookInfo) => void;
}
const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    flexWrap: 'wrap',
  },
  bookButton: {
    fontSize: 20,
    fontFamily: 'serif',
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 3,
    margin: 5,
  },
})

export function LibrarySection({bookList, setCurrentBook}: LibrarySectionArgs) {
  return (
    <View style={styles.container} >
      { bookList.map( (book, idx) => {
        return (
          <Pressable key={idx} onPress={() => setCurrentBook(book)}>
            <Text style={styles.bookButton}>{book.title.en} - {book.title.he}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}