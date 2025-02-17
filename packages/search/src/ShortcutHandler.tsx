/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { isMac } from '@react-pdf-viewer/core';
import type { Store } from '@react-pdf-viewer/core';

import type { StoreProps } from './types/StoreProps';

export const ShortcutHandler: React.FC<{
    containerRef: React.RefObject<HTMLDivElement>;
    store: Store<StoreProps>;
}> = ({ containerRef, store }) => {
    // Indicate whether the mouse is inside the viewer container or not
    const [isMouseInside, setMouseInside] = React.useState(true);

    const handleMouseEnter = () => setMouseInside(true);
    const handleMouseLeave = () => setMouseInside(false);

    const handleKeydown = (e: KeyboardEvent) => {
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }

        if (e.shiftKey || e.altKey || e.key !== 'f') {
            return;
        }
        const isCommandPressed = isMac() ? e.metaKey && !e.ctrlKey : e.ctrlKey;
        if (!isCommandPressed) {
            return;
        }

        if (isMouseInside || (document.activeElement && containerEle.contains(document.activeElement))) {
            e.preventDefault();
            store.update('areShortcutsPressed', true);
        }
    };

    React.useEffect(() => {
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }

        document.addEventListener('keydown', handleKeydown);
        containerEle.addEventListener('mouseenter', handleMouseEnter);
        containerEle.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('keydown', handleKeydown);
            containerEle.removeEventListener('mouseenter', handleMouseEnter);
            containerEle.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [containerRef.current]);

    return <></>;
};
