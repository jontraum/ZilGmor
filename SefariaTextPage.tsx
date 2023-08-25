import React, { useEffect, useRef, useState } from 'react'
import { Modal, SectionList, Text, View } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons' 

import { SefariaTextItem, SefariaTextItemProps } from './SefariaTextItem'
import { BookText, getBookText } from './data/bookAPI'
import { BookInfo } from './data/types'
import { Commentary } from './Commentary'
import { BookContents } from './BookContents'

interface SefariaTextPageProps {
  currentBook: BookInfo;
  goToLibrary: () => void;
}

interface ListSectionContent {
  title: string;
  heTitle: string;
  key: string;
  next: string | null;
  data: SefariaTextItemProps[];
}

function textSectionToListSection(section: BookText): ListSectionContent {
  // Sefaria book names can have spaces in them, and they are replaced with underlines when fetching
  // But the space between the book name and the chapter or amud identifier is replaced with a dot!
  return {
    title: section.title,
    heTitle: section.heTitle,
    key: section.title,
    next: section.next,
    data: section.he.map( (elementHE, idx): SefariaTextItemProps => {
      return {
        textHE: elementHE,
        textEN: section.text[idx],
        itemNumber: idx,
        key: `${section.sectionRef}.${(1 + idx).toString()}`,
      }
    }),
  }
}

export function SefariaTextPage({currentBook, goToLibrary}: SefariaTextPageProps) {
  const [sections, setSections] = useState<ListSectionContent[]>([])
  const [currentItem, setCurrentItem] = useState<SefariaTextItemProps | null>()
  const [showTOC, setShowTOC] = useState<boolean>(false)
  const contentListRef = useRef<null | SectionList>()
  
  useEffect(() => {
    // On initial load, load up the first page and set the first item as current.
    // ToDo: parameter of where we should start (from previous reading, or TOC) instead of always
    //       at the beginning.
    //       Probably want to use JumpToLocation
    getBookText(currentBook.slug, '2a').then(result => {
      if (result) {
        const section = textSectionToListSection(result)
        setSections([section])
        setCurrentItem(section.data[0])
      }
    })
  }, [] )

  const appendNextSection = () => {
    const lastSection = sections.at(-1)
    if(!lastSection) {
      console.warn('Could not find last current section!', currentBook)
      return
    }
    if (!lastSection.next) {
      console.info('No next section found in current section', lastSection)
      return
    }
    const bookparts = lastSection.next.split(' ')
    const chapter = bookparts.pop()
    const bookname = bookparts.join(' ')
    getBookText(bookname, chapter).then( (result) => {
      if (result) {
        setSections([...sections, textSectionToListSection(result)])
      }
    })
  }

  const jumpToLocation = (location: string) => {
    getBookText(currentBook.slug, location).then((result) => {
      const section = textSectionToListSection(result)
      setSections([section])
      setCurrentItem(section.data[0])
      if (contentListRef) {
        contentListRef.current?.scrollToLocation({
          animated: false,
          itemIndex: 0,
          sectionIndex: 0,
          viewPosition: 0,
        })
      }
    })
  }

  const contentsJumpAndClose = (location: string) => {
    console.debug('jump to ', location)
    jumpToLocation(location)
    setShowTOC(false)
  }

  return (
    <View style={{flexDirection: 'column'}}>
      <View style={{height: 50, flex: 0.1, flexDirection:'row', justifyContent: 'space-between', margin: 5}}>
        <Ionicons name="library" size={24} color="black" onPress={goToLibrary} />
        <Text style={{fontWeight: 'bold', fontSize:24}}>{currentBook.title.he || currentBook.title.en}</Text>
        <MaterialIcons name="toc" size={24} color="black" onPress={() => setShowTOC(true)} />
      </View>
      <Modal visible={showTOC} onRequestClose={() => setShowTOC(false)}>
        <BookContents bookInfo={currentBook} jumpAndClose={contentsJumpAndClose} />
      </Modal>
      <SectionList
        style={{flex: 10, marginBottom: 2}}
        sections={sections}
        ref={contentListRef}
        renderItem={ ({item}) => (
          <SefariaTextItem selected={item.key === currentItem?.key} {...item} />
        )}
        renderSectionHeader={({section}) => {
          return (
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>{(section).title}</Text>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>{(section).heTitle}</Text>
            </View>
          )}}
        onEndReached={appendNextSection}
        onEndReachedThreshold={1.5}
        viewabilityConfig={{itemVisiblePercentThreshold: 90}}
        onViewableItemsChanged={({viewableItems} ) => {
          if (viewableItems && viewableItems[0]?.item) {
            const item = viewableItems[0].item
            if (item.textEN || item.textHE) {
              // ignore section headers - only set if it is a text node
              setCurrentItem(viewableItems[0].item)
            }
            else if (viewableItems[1]) {
              setCurrentItem(viewableItems[1].item)
            }
          }
        }}
      />
      {currentItem && 
        <Commentary verseKey={currentItem.key}/>
      }

    </View>
  )

}