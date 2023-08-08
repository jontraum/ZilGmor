import React, { useState, useEffect } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import RenderHtml from 'react-native-render-html'
import { Link, LinkMap } from './data/types'
import { GetLinks } from './data/bookAPI'

interface CommentaryProps {
    verseKey: string
}

const styles = StyleSheet.create({
  mainBox: {
    borderTopWidth: 3,
    borderColor: '#111',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 2,
  },
  linkSelectorBox: {
    flexDirection: 'row',
    flexWrap:'wrap',
  },
  selectLinkButton: {
    padding: 2,
    margin: 2,
    borderWidth: 2,
  },
  selectLinkButtonUnselected: {
    borderColor: '#28f',
  },
  selectLinkButtonSelected: {
    borderColor: '#28f',
    color: '#ddd',
    backgroundColor: '#28f',
  },
  linkBar: {
    borderBottomWidth: 2,
    borderColor: '#ccccdd',
    flexDirection: 'row',
    height: 30,
  },
  showLink: {
    borderStyle: 'solid',
    borderRadius: 8,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 2,
    borderWidth: 2,
    color: '#404040',
    margin: 0,
    marginBottom: 0,
    padding: 6,
  },
  showLinkActive: {
    borderBottomWidth: 0,
    color: '#000',
    fontWeight: '800',
  },
  linkPane: {
    flex: 16,
    padding: 3,
  },
})

const rashi = {'en': 'Rashi', 'he': 'רש"י'}

export function Commentary({verseKey}: CommentaryProps) {
  const [linkMap, setLinkMap] = useState<LinkMap>()
  // Temporarily defaulting commentary to Rashi.
  const [currentCommentary, setCurrentCommentary] = useState<string>(rashi.en)
  // Selected commentaries. Initial implemenation in local state, but eventually settings based on book
  const [selectedCommentaries, setSelectedCommentaries] = useState<string[]>([rashi.en])
  const [selectingLinks, setSelectingLinks] = useState<boolean>(false)

  const dimensions = useWindowDimensions()

  useEffect( () => {
    GetLinks(verseKey)
      .then(result => {
        if (result) {
          setLinkMap(result)
        } else {
          console.warn('Could not find commentary for ', verseKey)
        }
      })
  }, [verseKey])

  function selectLink(linkName: string) {
    // Don't add it if it's already there.
    if (!selectedCommentaries.includes(linkName)) {
      setSelectedCommentaries([...selectedCommentaries, linkName])
    }
  }

  function unselectLink(linkName: string) {
    const idx = selectedCommentaries.indexOf(linkName)
    if (idx !== -1) {
      selectedCommentaries.splice(idx, 1)
      setSelectedCommentaries([...selectedCommentaries])
    }
  }

  function addCommentary():void {
    setSelectingLinks(true)
  }

  let currentLinks:Link[] = []
  if (linkMap && currentCommentary) {
    currentLinks = linkMap.get(currentCommentary)
    if (!currentLinks) {
      console.info('no commentary available for ', currentCommentary)
      currentLinks = []
    }
  }
  return (
    <View style={styles.mainBox}>
      <Modal 
        visible={selectingLinks}
        onRequestClose={()=>setSelectingLinks(false)}
                
      >
        <ScrollView>
          <Text>Add commentary</Text>
          <View style={styles.linkSelectorBox}>
            { linkMap  && Array.from(linkMap.keys()).map( (linkName, idx) => {
              if (selectedCommentaries.includes(linkName)) {
                return (
                  <Pressable key={idx} onPress={() => unselectLink(linkName)}>
                    <Text style={[styles.selectLinkButton, styles.selectLinkButtonSelected]}>{linkName}</Text>
                  </Pressable>
                )
              }
              return (
                <Pressable key={idx} onPress={() => selectLink(linkName)}>
                  <Text style={[styles.selectLinkButton, styles.selectLinkButtonUnselected]}>{linkName}</Text>
                </Pressable>
              )
            }) }
          </View>
        </ScrollView>

      </Modal>
      <View style={styles.linkBar} >
        {selectedCommentaries.map( (linkName) => {
          let numItems = 0
          if (linkMap) {
            numItems = (linkMap.get(linkName) || []).length
          }
          return (
            <Pressable key={linkName} onPress={()=>{
              setCurrentCommentary(linkName)
            }}>
              <Text style={ linkName === currentCommentary ? [styles.showLink, styles.showLinkActive] : styles.showLink}>
                {linkName} [{numItems}]
              </Text>
            </Pressable>
          )

        })}
        <MaterialCommunityIcons name="comment-plus-outline" size={24} color="black" onPress={addCommentary}/>
      </View>
      <ScrollView style={styles.linkPane}>
        {currentLinks.map( (linkItem, idx) => {
          return (
            <RenderHtml contentWidth={dimensions.width - 4} key={idx} source={{html: linkItem.he}} />
          )
        })}

      </ScrollView>
    </View>
  )
}