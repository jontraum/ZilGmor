import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, SectionList, StyleSheet, Text, View } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons' 

import { ShowTextItem } from './SefariaTextItem'
import { BookText, getBookContents, getBookText, getNamesOfLinksForBook, splitBookRef } from './data/bookAPI'
import { BookIndex, BookInfo, TextItem } from './data/types'
import { Commentary } from './Commentary'
import { BookContents } from './BookContents'
import { getBookSettings, saveBookSettings } from './data/settings'
import { globalStyles, topButtonSize } from './styles'
import { HistoryButton } from './buttons/HistoryButton'
import { PersistentModal } from './PersistentModal'

interface SefariaTextPageProps {
  currentBook: BookInfo;
  goToLibrary: () => void;
  showHistory: () => void;
}

interface ListSectionContent {
  title: string;
  heTitle: string;
  key: string;
  next: string | null;
  prev: string | null;
  data: TextItem[];
}

const textPageStyles =  StyleSheet.create({
  topContainer: {
    flexDirection: 'column',
  },
  mainPageContainer: {
    flex: 1,
  },
  tocActive: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    zIndex: 10,
    position: 'absolute',
    flex: 1,
    width: '100%',
    flexDirection: 'column',
  },
  tocHidden: {
    display: 'none',
    zIndex: 1,
  },
  primaryTextContainer: {
    flex: 5,
    marginBottom: 2,
    zIndex: 2,
  },
  linksContainer: {
    zIndex: 1,
    flex: 4, 
  },
})

function textSectionToListSection(section: BookText): ListSectionContent {
  // Sefaria book names can have spaces in them, and they are replaced with underlines when fetching
  // But the space between the book name and the chapter or amud identifier is replaced with a dot!
  return {
    title: section.sectionRef,
    heTitle: section.heSectionRef,
    key: section.title,
    next: section.next,
    prev: section.prev,
    data: section.he.map( (elementHE, idx): TextItem => {
      return {
        textHE: elementHE,
        textEN: section.text[idx],
        itemNumber: idx,
        key: `${section.sectionRef}:${(1 + idx).toString()}`,
      }
    }),
  }
}

export function SefariaTextPage({currentBook, goToLibrary, showHistory}: SefariaTextPageProps) {
  const [sections, setSections] = useState<ListSectionContent[]>([])
  const [currentItem, setCurrentItem] = useState<TextItem | null>()
  const [showTOC, setShowTOC] = useState<boolean>(false)
  const [availableLinks, setAvailableLinks] = useState<Array<string>>([])
  const [loadingPrevious, setLoadingPrevious] = useState(false)
  // Commentaries that the user selects, stored in local state, and saved to settings via a UseEffect
  const [selectedCommentaries, setSelectedCommentaries] = useState<string[]>([])
  const contentListRef = useRef<null | SectionList>()
  const [index, setIndex] = useState<BookIndex | null>()
  
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
    let startingPage = '2a' // ToDo: better logic for default start. 2a works for Gemara, probably not much else.
    getBookSettings(currentBook.slug)
      .then((settings) => {
        if (settings?.location) {
          startingPage = settings.location
          setSelectedCommentaries(settings.commentaries)
          jumpToLocation(startingPage)
        } else {
          setShowTOC(true)
        }
      })
  }, [] )

  useEffect(() => {
    getBookContents(currentBook.slug).then((result) => {
      if (result) {
        setIndex(result)
      }
    })
  }, [currentBook.slug])

  const appendNextSection = useCallback(() => {
    const lastSection = sections.at(-1)
    if(!lastSection) {
      console.warn('Could not find last current section!', currentBook)
      return
    }
    if (!lastSection.next) {
      // if there's no next, probably just means we are at the end of the book.
      return
    }
    const {bookname, chapter} = splitBookRef(lastSection.next)
    getBookText(bookname, chapter).then( (result) => {
      if (result) {
        setSections([...sections, textSectionToListSection(result)])
      }
    })
    addLinkNames(bookname, chapter)
  }, [sections, setSections])

  const jumpToLocation = (location: string) => {
    // ToDo: Put up spinner which will get cleared when promise completes.
    if (!location) {
      console.warn('No location given to jumpToLocation')
      return
    }
    const [chapter, verses] = location.split(':')
    const [firstVerse] = verses ? verses.split('-') : ['1']
    getBookText(currentBook.slug, chapter).then((result) => {
      const section = textSectionToListSection(result)
      setSections([section])
      let goToVerse = parseInt(firstVerse)
      if (isNaN(goToVerse)) {
        goToVerse = 0
      }
      setCurrentItem(section.data[goToVerse-1])
      if (contentListRef) {
        setTimeout(() => {
          contentListRef.current?.scrollToLocation({
            animated: false,
            itemIndex: goToVerse,
            sectionIndex: 0,
            viewPosition: 0,
          })
        }, 300)
      }
    })
    addLinkNames(currentBook.slug, location)
  }

  // Save settings when stuff changes
  useEffect(() => {
    if (currentBook && currentItem?.key) {
      const location = currentItem.key.replace(currentBook.slug + ' ', '')
      saveBookSettings({
        bookSlug: currentBook.slug,
        location,
        commentaries: selectedCommentaries,
        lastRead: new Date(),
      })
    }
  }, [currentBook?.slug, currentItem?.key, selectedCommentaries])

  const contentsJumpAndClose = (location: string) => {
    jumpToLocation(location)
    setShowTOC(false)
  }

  const loadPrevious = useCallback(() => {
    const prev = sections[0]?.prev
    if (!prev) {
      console.info('no previous section')
      return
    }
    setLoadingPrevious(true)
    const {bookname, chapter} = splitBookRef(prev)
    getBookText(bookname, chapter).then( (result) => {
      if (result) {
        const newSections = textSectionToListSection(result)
        setSections([newSections, ...sections])
        // When this callback was called, we must have been at the zeroth item of the zeroth section.
        // Now that we've prepended a new section, we want to be at the last item of the previous section
        setTimeout(() => {
          contentListRef.current?.scrollToLocation({
            animated: false,
            itemIndex: newSections.data.length,
            sectionIndex: 0,
            viewPosition: 0,
          })
        }, 300)
      }
      else {
        console.warn('No result when loading previous section')
      }
      setLoadingPrevious(false)
    })
  }, [sections, setSections, setLoadingPrevious])

  const onScrollToIndexFailed = (failInfo: {index: number, averageItemLength: number}) => {
    // Note: the error that this handler gives us tells us the index, but not the sectionIndex.
    // Probably this is an oversight by the React Native folks. In any case, our code currently
    // only ever jumps to sectionIndex 0, so we are ok for now.
    setTimeout(() => {
      contentListRef.current?.scrollToLocation({
        animated: true,
        itemIndex: failInfo.index,
        sectionIndex: 0,
        viewPosition: 0,
      })
    }, 100)
  }

  const onTOCClose = useCallback(() => {
    if (!currentItem && sections.length == 0) {
      // Contents closed, and it looks like we had no prev content. Back to library.
      goToLibrary()
    }
    setShowTOC(false)
  }, [currentItem, sections])

  const contents = useMemo( () => {
    return (
      <BookContents jumpAndClose={contentsJumpAndClose} index={index} />
    )
  }, [currentBook.slug, index])

  return (
    <>
      <PersistentModal visible={showTOC} onClose={onTOCClose}>
        {contents}
      </PersistentModal>
      <View style={textPageStyles.topContainer}>
        <View style={globalStyles.pageHeaderContainer}>
          <Ionicons name="library" size={topButtonSize} color="black" onPress={goToLibrary} />
          <Text style={globalStyles.pageHeaderText}>{currentItem?.key}</Text>
          <View style={globalStyles.headerButtonBox}>
            <HistoryButton onPress={showHistory} />
            <MaterialIcons name="toc" size={topButtonSize} color="black" onPress={() => setShowTOC(!showTOC)} />
          </View>
        </View>
        <View style={textPageStyles.mainPageContainer}>

          <View style={textPageStyles.primaryTextContainer}>
            { sections.length > 0 ? (
              <SectionList
                sections={sections}
                ref={contentListRef}
                renderItem={ ({item}) => (
                  <ShowTextItem selected={(item.key === currentItem?.key)} item={item} onSelect={setCurrentItem} />
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
                onRefresh={loadPrevious}
                onScrollToIndexFailed={onScrollToIndexFailed}
                refreshing={loadingPrevious}
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
              /> ) : (
              <ActivityIndicator size='large' />
            ) }
          </View>
          {currentItem && 
        <View style={textPageStyles.linksContainer}>
          <Commentary verseKey={currentItem.key} bookLinks={availableLinks} selectedCommentaries={selectedCommentaries} setSelectedCommentaries={setSelectedCommentaries}/>
        </View>
          }
        </View>
      </View>
    </>  
  )

}