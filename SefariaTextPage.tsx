import React, { useEffect, useState } from 'react'
import { SectionList, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons' 

import { SefariaTextItem, SefariaTextItemProps } from './SefariaTextItem'
import { BookText, getBookText } from './data/bookAPI'
import { BookInfo } from './data/types'
import { Commentary } from './Commentary'

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
  useEffect(() => {
    // On initial load, load up the first page and set the first item as current.
    // ToDo: parameter of where we should start (from previous reading, or TOC) instead of always
    //       at the beginning.
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

  return (
    <View style={{flexDirection: 'column'}}>
      <View style={{height: 50, flex: 0.1, flexDirection:'row', justifyContent: 'space-between', margin: 5}}>
        <Ionicons name="library" size={24} color="black" onPress={goToLibrary} />
        <Text style={{fontWeight: 'bold', fontSize:24}}>{currentBook.title.he || currentBook.title.en}</Text>
        <Text></Text>
      </View>
      <SectionList
        style={{flex: 10, marginBottom: 2}}
        sections={sections}
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
          setCurrentItem(viewableItems[0].item)
        }}
      />
      {currentItem && 
        <Commentary verseKey={currentItem.key}/>
      }

    </View>
  )

}