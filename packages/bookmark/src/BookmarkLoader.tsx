/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import {
    classNames,
    LocalizationContext,
    SpecialZoomLevel,
    Spinner,
    TextDirection,
    ThemeContext,
} from '@react-pdf-viewer/core';
import type { LocalizationMap, PdfJs, Store } from '@react-pdf-viewer/core';

import { BookmarkListRoot } from './BookmarkListRoot';
import type { IsBookmarkExpanded } from './types/IsBookmarkExpanded';
import type { StoreProps } from './types/StoreProps';

interface BookmarkState {
    isLoaded: boolean;
    items: PdfJs.Outline[];
}

export const BookmarkLoader: React.FC<{
    doc: PdfJs.PdfDocument;
    isBookmarkExpanded?: IsBookmarkExpanded;
    store: Store<StoreProps>;
    onJumpToDest(pageIndex: number, bottomOffset: number, leftOffset: number, scaleTo: number | SpecialZoomLevel): void;
}> = ({ doc, isBookmarkExpanded, store, onJumpToDest }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const [bookmarks, setBookmarks] = React.useState<BookmarkState>({
        isLoaded: false,
        items: [],
    });

    React.useEffect(() => {
        setBookmarks({
            isLoaded: false,
            items: [],
        });
        doc.getOutline().then((outline) => {
            setBookmarks({
                isLoaded: true,
                items: outline || [],
            });
        });
    }, [doc]);

    return !bookmarks.isLoaded ? (
        <div className="rpv-bookmark__loader">
            <Spinner />
        </div>
    ) : bookmarks.items.length === 0 ? (
        <div
            data-testid="bookmark__empty"
            className={classNames({
                'rpv-bookmark__empty': true,
                'rpv-bookmark__empty--rtl': isRtl,
            })}
        >
            {l10n && l10n.bookmark ? ((l10n.bookmark as LocalizationMap).noBookmark as string) : 'There is no bookmark'}
        </div>
    ) : (
        <div
            data-testid="bookmark__container"
            className={classNames({
                'rpv-bookmark__container': true,
                'rpv-bookmark__container--rtl': isRtl,
            })}
        >
            <BookmarkListRoot
                bookmarks={bookmarks.items}
                doc={doc}
                isBookmarkExpanded={isBookmarkExpanded}
                store={store}
                onJumpToDest={onJumpToDest}
            />
        </div>
    );
};
