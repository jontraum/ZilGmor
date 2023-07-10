import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

import { SefariaTextItem } from './SefariaTextItem';
import { getBookText } from './data/bookAPI';
import { BookInfo } from './data/types';

const nullResult = {he: ['לא מצא תקסט'], text: ["No text found"]}

interface SefariaTextPageProps {
  currentBook: BookInfo;
  goToLibrary: () => void;
}

export function SefariaTextPage({currentBook, goToLibrary}: SefariaTextPageProps) {
  const [pageInfo, setPageInfo] = useState(nullResult)
  useEffect(() => {
    getBookText(currentBook.slug, "2a").then(result => {
      console.log("got result", result)
      setPageInfo(result ? result : nullResult)
    })
  }, [] )

    return (
      <View>
        <View style={{height: 50, flexDirection:'row', justifyContent: 'space-between', margin: 5,}}>
          <Ionicons name="library" size={24} color="black" onPress={goToLibrary} />
          <Text style={{fontWeight: 'bold', fontSize:24}}>{currentBook.title.he || currentBook.title.en}</Text>
          <Text></Text>
        </View>
        <ScrollView style={{flex: 1, flexDirection:'column'}} persistentScrollbar={true}>
            { pageInfo.he.map((elementHE, idx) => {
                return (
                        <SefariaTextItem
                            textHE={elementHE}
                            textEN={pageInfo.text[idx]}
                            itemNumber={idx}
                            key={idx}
                        />
                )
            })}
        </ScrollView>
      </View>
    )

}