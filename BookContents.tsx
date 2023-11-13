import React, { memo, useCallback } from 'react'
import { BookIndex } from './data/types'
import { Dimensions, ActivityIndicator, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, TextInput, TextInputSubmitEditingEventData, View } from 'react-native'

const styles = StyleSheet.create({
  topContainer: {
    padding: 10,
  },
  subContainer: {
    flex: 1,
  },
  mainHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    marginBottom: 10,
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

// This is how much less than the full screen height the scrollview containing alt contents links should be.
// FixMe: currently hardcoded, but probably could be calculated? Add up the heights of the StatusBar, the
//        page header (from SefariaTextPage), the header for the contents box in this component, plus whatever margins are around them. 
const altViewMargin = 300

// Regular expression to pull chapter or daf out of a reference
const refRegEx = /(\d+[ab]?(?::[\d-]+)?)/

interface BookContentsProps {
  jumpAndClose: (location:string) => void
  index: BookIndex | null
}

export const BookContents = memo(function BookContents({jumpAndClose, index}: BookContentsProps) {
  if (!index) {
    return (
      <View>
        <ActivityIndicator size={'large'} />
      </View>
    )
  }

  const onGotoChapter = useCallback( ({nativeEvent}: NativeSyntheticEvent<TextInputSubmitEditingEventData>): void => {
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
  }, [index.schema.lengths, jumpAndClose])

  const svHeight = Math.round(Dimensions.get('window').height) - altViewMargin
  console.debug('height is ', svHeight)
  // FixMe: Add a close button, either here or in the container defined in SefariaTextPage. Or maybe that container should be defined here?
  return(
    <View style={styles.topContainer}>
      {/* <View style={styles.subContainer}> */}
      <Text style={styles.mainHeader}>Contents</Text>
      {/* Jump to a chapter if that's how we navigate */}
      { !(index.exclude_structs && index.exclude_structs.includes('schema')) && (
        <View style={styles.chapterContainer}>
          <Text style={styles.chapterPrompt}>Go to {index.schema.sectionNames[0]} (1-{index.schema.lengths[0]})</Text>
          <TextInput
            style={styles.chapterInput}
            keyboardType='number-pad'
            returnKeyType='go'
            maxLength={3}
            onSubmitEditing={onGotoChapter}
          />
        </View>
      ) }
      {/* index.alts contains information for finding parshayos and aliyos in Chumash, and amudim in Gemara */}
      { index.alts && (
        <ScrollView style={[styles.contentContainer, {maxHeight: svHeight}]}>
          {Object.keys(index.alts).map(entry => {
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
      )}
    </View>
  )
})