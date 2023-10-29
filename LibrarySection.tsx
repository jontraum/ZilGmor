import React from 'react'
import { BookInfo, BookSet } from './data/types'
import { Pressable, View, StyleSheet, Text } from 'react-native'

interface LibrarySectionArgs {
    bookSet: BookSet;
    setCurrentBook: (book: BookInfo) => void;
}
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    borderWidth: 2,
    borderColor: '#66152a',
    padding: 5,
    margin: 5,
  },
  bookSetTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  bookSetContainer: {
    flexDirection:'row-reverse',
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

export function LibrarySection({bookSet, setCurrentBook}: LibrarySectionArgs) {
  return (
    <View style={styles.mainContainer}>
      <View><Text style={styles.bookSetTitle}>{bookSet.title.he || bookSet.title.en}</Text></View>
      <View style={styles.bookSetContainer} >
        { bookSet.books.map( (book, idx) => {
          return (
            <Pressable key={idx} onPress={() => setCurrentBook(book)}>
              <Text style={styles.bookButton}>{book.title.he}</Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}