import React, { useEffect, useState } from 'react';
import { BookInfo } from './data/types';
import { ScrollView, Text } from 'react-native';

interface LibrarySectionArgs {
    bookList: BookInfo[];
    setCurrentBook: (book: BookInfo) => void;
}

export function LibrarySection({bookList, setCurrentBook}: LibrarySectionArgs) {
    return (
        <ScrollView style={{flex: 1, flexDirection:'column'}} >
            { bookList.map( (book, idx) => {
                return (
                    <Text key={idx} onPress={() => setCurrentBook(book)}>{book.title.en} - {book.title.he}</Text>
                )
            })}
        </ScrollView>
    )
}