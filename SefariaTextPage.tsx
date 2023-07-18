import React, { useEffect, useState } from 'react';
import { SectionList, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

import { SefariaTextItem, SefariaTextItemProps } from './SefariaTextItem';
import { BookText, getBookText } from './data/bookAPI';
import { BookInfo } from './data/types';

const nullResult = {he: ['לא מצא תקסט'], text: ["No text found"]}

interface SefariaTextPageProps {
  currentBook: BookInfo;
  goToLibrary: () => void;
}

interface ListSectionContent {
  title: string;
  key: string;
  next: string;
  data: SefariaTextItemProps[];
}

function textSectionToListSection(section: BookText): ListSectionContent {
  return {
    title: section.title,
    key: section.title,
    next: section.next,
    data: section.he.map( (elementHE, idx): SefariaTextItemProps => {
      return {
        textHE: elementHE,
        textEN: section.text[idx],
        itemNumber: idx,
        key: `${section.title} ${idx.toString()}`,
      }
    }),
  }
}

export function SefariaTextPage({currentBook, goToLibrary}: SefariaTextPageProps) {
  const [sections, setSections] = useState([])
  useEffect(() => {
    getBookText(currentBook.slug, "2a").then(result => {
      console.debug("got result", result)
      if (result) {
        setSections([textSectionToListSection(result)])
      }
    })
  }, [] )

  const appendNextSection = () => {
    const lastSection = sections.at(-1)
    if(!lastSection) {
      console.warn("Could not find last current section!", currentBook)
      return
    }
    if (!lastSection.next) {
      console.info("No next section found in current section", lastSection)
      return
    }
    console.debug("We need to load the next section: ", lastSection.next)
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
    <View>
      <View style={{height: 50, flexDirection:'row', justifyContent: 'space-between', margin: 5,}}>
        <Ionicons name="library" size={24} color="black" onPress={goToLibrary} />
        <Text style={{fontWeight: 'bold', fontSize:24}}>{currentBook.title.he || currentBook.title.en}</Text>
        <Text></Text>
      </View>
      <SectionList
        sections={sections}
        renderItem={ ({item}) => (
          <SefariaTextItem {...item } />
        )}
        renderSectionHeader={({section}) => {
          return (
          <View>
            <Text>Section {(section).title}</Text>
          </View>
        )}}
        onEndReached={appendNextSection}
        onEndReachedThreshold={1.5}
      />

    </View>
  )

}