import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Modal, SectionList, Text, View } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons' 

import { SefariaTextItem, SefariaTextItemProps } from './SefariaTextItem'
import { BookText, getBookText, getNamesOfLinksForBook } from './data/bookAPI'
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
  const [availableLinks, setAvailableLinks] = useState<Array<string>>([])
  const contentListRef = useRef<null | SectionList>()
  
  const addLinkNames = (book: string, chapter: string) => {
    getNamesOfLinksForBook(book, chapter)
      .then( linkNames => {
        if (!linkNames) {
          return
        }
        const newValues = []
        for (const linkName of linkNames) {
          if (!availableLinks.includes(linkName)) {
            newValues.push(linkName)
          }
        }
        if (newValues.length > 0) {
          setAvailableLinks([...availableLinks, ...newValues])
        }
      })
  }

  useEffect(() => {
    // On initial load, load up the first page and set the first item as current.
    // ToDo: parameter of where we should start (from previous reading, or TOC) instead of always
    //       at the beginning. Or maybe load it from book history once that is implemented.
    //       Probably want to use JumpToLocation
    const startingPage = '2a'
    getBookText(currentBook.slug, startingPage).then(result => {
      if (result) {
        const section = textSectionToListSection(result)
        setSections([section])
        setCurrentItem(section.data[0])
      }
    })
    addLinkNames(currentBook.slug, startingPage)
  }, [] )

  const appendNextSection = useCallback(() => {
    const lastSection = sections.at(-1)
    if(!lastSection) {
      console.warn('Could not find last current section!', currentBook)
      return
    }
    if (!lastSection.next) {
      // if there's no next, probably just means we are at the end of the book.
      console.debug('No next section found in current section', lastSection)
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
    addLinkNames(bookname, chapter)
  }, [sections])

  const jumpToLocation = (location: string) => {
    // ToDo: Put up spinner which will get cleared when promise completes.
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
              console.log('section is ', viewableItems[0]?.section.title)
            }
            else if (viewableItems[1]) {
              setCurrentItem(viewableItems[1].item)
            }
          }
        }}
      />
      {currentItem && 
        <Commentary verseKey={currentItem.key} bookLinks={availableLinks}/>
      }

    </View>
  )

}