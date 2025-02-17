/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createStore } from '@react-pdf-viewer/core';
import type {
    Plugin,
    PluginFunctions,
    PluginOnAnnotationLayerRender,
    PluginOnDocumentLoad,
} from '@react-pdf-viewer/core';

import { BookmarkListWithStore } from './BookmarkListWithStore';
import type { IsBookmarkExpanded } from './types/IsBookmarkExpanded';
import type { StoreProps } from './types/StoreProps';

export interface BookmarksProps {
    isBookmarkExpanded?: IsBookmarkExpanded;
}

export interface BookmarkPlugin extends Plugin {
    Bookmarks: (props?: BookmarksProps) => React.ReactElement;
}

export const bookmarkPlugin = (): BookmarkPlugin => {
    const store = React.useMemo(
        () =>
            createStore<StoreProps>({
                linkAnnotations: {},
            }),
        []
    );

    const BookmarksDecorator = (props?: BookmarksProps) => (
        <BookmarkListWithStore isBookmarkExpanded={props?.isBookmarkExpanded} store={store} />
    );

    const onAnnotationLayerRender = (e: PluginOnAnnotationLayerRender) => {
        if (!e.annotations.length) {
            return;
        }
        const links = e.annotations.filter((annotation) => annotation.subtype === 'Link');
        if (!links.length) {
            return;
        }

        // Filter link annotations
        const linkAnnotations = store.get('linkAnnotations') || {};

        links.forEach((annotation) => (linkAnnotations[annotation.dest] = e.container));
        store.update('linkAnnotations', linkAnnotations);
    };

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('jumpToDestination', pluginFunctions.jumpToDestination);
        },
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            store.update('doc', props.doc);
        },
        Bookmarks: BookmarksDecorator,
        onAnnotationLayerRender,
    };
};
