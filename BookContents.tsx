import React, { useEffect, useState } from 'react'
import { BookIndex, BookInfo } from './data/types'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { getBookContents } from './data/bookAPI'

const styles = StyleSheet.create({
  mainHeader: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection:'row',
    flexWrap: 'wrap',
  },
  link: {
    backgroundColor: '#eef',
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 3,
  },
})

// Regular expression to find the particular amud of a Gemara reference
const dafRegEx = /(\d+[ab])$/

interface BookContentsProps {
  bookInfo: BookInfo
  jumpAndClose: (location:string) => void
}

export function BookContents({bookInfo, jumpAndClose}: BookContentsProps) {
  const [index, setIndex] = useState<BookIndex | null>()
  useEffect(() => {
    getBookContents(bookInfo.slug).then((result) => {
      if (result) {
        setIndex(result)
      }
    })
  }, [])

  if (!index) {
    return (
      <View>
        <Text>LOADING... (ToDo: replace with spinner)</Text>
      </View>
    )
  }
  
  return(
    <View>
      <Text style={styles.mainHeader}>Contents {bookInfo.title.en} {bookInfo.title.he}</Text>
      { index.alts ? Object.keys(index.alts).map(entry => {
        return index.alts[entry].nodes.map( (indexNode, indexNumber) => (
          // FixMe Why does this not scroll?
          <ScrollView key={indexNumber}>
            <Text style={styles.sectionHeader}>{indexNode.title} {indexNode.heTitle}</Text>
            <View style={styles.linkContainer}>
              {indexNode.refs.map( (ref, refIndex) => {
                // FixMe: For Gemara, The first ref of chapter 1 and the last ref of any chapter has
                //    a range of "lines" instead of just loading the whole amud. Use regex to find it and filter the range.
                // FixMe: For an amud ref, create a label that filters out the name of the massechta and only display the amud
                //    e.g. instead of "Rosh Hashana 2a: 1-8" just show "2a"
                const amudMatch = ref.match(dafRegEx)
                const cleanedRef = amudMatch ? amudMatch[1] : ref
                return (
                  <Pressable key={refIndex} onPress={() => jumpAndClose(cleanedRef)}>
                    <Text style={styles.link}> {cleanedRef} </Text>
                  </Pressable>
                )}) }
            </View>
          </ScrollView>
        ) )
      } ) : (
        <View><Text>No alts.  Do the chapter thing!</Text></View>
      )
      }
    </View>
  )
}