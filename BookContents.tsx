import React, { useEffect, useState } from 'react'
import { BookIndex, BookInfo } from './data/types'
import { ActivityIndicator, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, TextInput, TextInputSubmitEditingEventData, View } from 'react-native'
import { getBookContents } from './data/bookAPI'

const styles = StyleSheet.create({
  mainHeader: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  mainContainer: {
    marginBottom: 30,
  },
  sectionContainer: {
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    marginBottom: 10,
    paddingBottom: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  linkContainer: {
    flexDirection:'row-reverse',
    flexWrap: 'wrap',
  },
  link: {
    backgroundColor: '#eef',
    borderStyle: 'solid',
    borderWidth: 2,
    padding: 3,
    fontSize: 16,
  },
  chapterInput: {
    borderWidth: 1,
    fontSize: 14,
    padding: 2,
  },
  chapterPrompt: {
    fontSize: 16,
    fontWeight: '800',
    margin: 4,
  },
  chapterContainer: {
    flexDirection: 'row-reverse',
    borderWidth: 3,
    borderColor: '#11c',
    padding: 5,
  },
})

// Regular expression to pull chapter or daf out of a reference
const refRegEx = /(\d+[ab]?(?::[\d-]+)?)/

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
        <ActivityIndicator size={'large'} />
      </View>
    )
  }

  const onGotoChapter = ({nativeEvent}: NativeSyntheticEvent<TextInputSubmitEditingEventData>): void => {
    const chapterNum = Number.parseInt(nativeEvent.text)
    if (Number.isNaN(chapterNum)) {
      // FixMe: Proper error display
      console.warn(`${nativeEvent.text} is not a number`)
      return
    }
    if (chapterNum > index.schema.lengths[0]) {
      // FixMe: Proper error display
      console.warn(`Maximum chapter number is ${index.schema.lengths[0]}`)
      return
    }
    jumpAndClose(nativeEvent.text)
  }
  
  return(
    <View>
      <Text style={styles.mainHeader}>Contents {bookInfo.title.en} {bookInfo.title.he}</Text>
      <ScrollView style={styles.mainContainer}>
        {/* Jump to a chapter if that's how we navigate */}
        { !(index.exclude_structs && index.exclude_structs.includes('schema')) && (
          <View style={styles.chapterContainer}>
            <Text style={styles.chapterPrompt}>Go to {index.schema.sectionNames[0]} (1-{index.schema.lengths[0]})</Text>
            <TextInput
              autoFocus={!index.alts}
              style={styles.chapterInput}
              keyboardType='number-pad'
              returnKeyType='go'
              maxLength={3}
              onSubmitEditing={onGotoChapter}
            />
          </View>
        ) }
        {/* index.alts contains information for finding parshayos and aliyos in Chumash, and amudim in Gemara */}
        { index.alts && Object.keys(index.alts).map(entry => {
          return index.alts[entry].nodes.map( (indexNode, indexNumber) => (
            <View style={styles.sectionContainer} key={indexNumber}>
              <Text style={styles.sectionHeader}>{indexNode.title} {indexNode.heTitle}</Text>
              <View style={styles.linkContainer}>
                {indexNode.refs.map( (ref, refIndex) => {
                  const amudMatch = ref.match(refRegEx)
                  const cleanedRef = amudMatch ? amudMatch[1] : ref
                  const label = entry === 'Parasha' ? (refIndex + 1).toString() : cleanedRef
                  return (
                    <Pressable key={refIndex} onPress={() => jumpAndClose(cleanedRef)}>
                      <Text style={styles.link}> {label} </Text>
                    </Pressable>
                  )}) }
              </View>
            </View>
          ) )
        } )
        }
      </ScrollView>
    </View>
  )
}