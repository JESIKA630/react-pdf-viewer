/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { PdfJs, Plugin } from '@react-pdf-viewer/core';

// Plugin
export type IsBookmarkExpanded = ({
    bookmark,
    depth,
    doc,
    index,
}: {
    bookmark: PdfJs.Outline;
    depth: number;
    doc: PdfJs.PdfDocument;
    index: number;
}) => boolean;

export interface BookmarksProps {
    isBookmarkExpanded?: IsBookmarkExpanded;
}

export interface BookmarkPlugin extends Plugin {
    Bookmarks: (props?: BookmarksProps) => React.ReactElement;
}

export function bookmarkPlugin(): BookmarkPlugin;

// Components
export class DownArrowIcon extends React.Component {}
export class RightArrowIcon extends React.Component {}
