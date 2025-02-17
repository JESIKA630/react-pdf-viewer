import * as React from 'react';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { Viewer } from '../src/Viewer';
import { SpecialZoomLevel } from '../src/structs/SpecialZoomLevel';

const TestDefaultScaleSpecialZoomLevel: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <Viewer fileUrl={fileUrl} defaultScale={SpecialZoomLevel.PageWidth} plugins={[defaultLayoutPluginInstance]} />
    );
};

test('defaultScale option', async () => {
    const App = () => (
        <div style={{ height: '720px', width: '600px' }}>
            <Viewer fileUrl={global['__SAMPLE_PDF__']} defaultScale={1.5} />
        </div>
    );
    const { getByTestId, findByTestId } = render(<App />);
    mockIsIntersecting(getByTestId('core__viewer'), true);

    const firstPage = await findByTestId('core__page-layer-0');
    expect(parseInt(firstPage.style.width, 10)).toEqual(892);
    expect(parseInt(firstPage.style.height, 10)).toEqual(1263);
});

test('Set defaultScale as a special zoom level', async () => {
    const App = () => (
        <div style={{ height: '50rem', width: '50rem' }}>
            <TestDefaultScaleSpecialZoomLevel fileUrl={global['__OPEN_PARAMS_PDF__']} />
        </div>
    );
    const { findByTestId, getByTestId } = render(<App />);

    const rootEle = getByTestId('core__viewer');
    mockIsIntersecting(rootEle, true);
    rootEle['__jsdomMockClientHeight'] = 800;
    rootEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    const layoutBody = await findByTestId('core__inner-pages');
    layoutBody['__jsdomMockClientHeight'] = 753;
    layoutBody['__jsdomMockClientWidth'] = 758;

    mockResize(layoutBody);

    await findByTestId('core__text-layer-3');

    // Users shouldn't see a scrollbar
    // See the issue #698
    const currentScale = await findByTestId('zoom__popover-target-scale');
    expect(currentScale.innerHTML).toEqual('125%');
});

test('Keep special defaultScale after resizing', async () => {
    const App = () => (
        <div style={{ height: '50rem', width: '50rem' }}>
            <Viewer defaultScale={SpecialZoomLevel.PageWidth} fileUrl={global['__OPEN_PARAMS_PDF__']} />
        </div>
    );
    const { findByTestId, getByTestId } = render(<App />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    let firstPage = await findByTestId('core__page-layer-0');
    const w1 = parseInt(firstPage.style.width, 10);
    const h1 = parseInt(firstPage.style.height, 10);
    expect(w1).toEqual(783);
    expect(h1).toEqual(1044);

    const pagesContainer = await findByTestId('core__inner-pages');

    // Resize
    pagesContainer['__jsdomMockClientHeight'] = 800;
    pagesContainer['__jsdomMockClientWidth'] = 640;
    mockResize(pagesContainer);

    // Scroll to the 4th page
    fireEvent.scroll(pagesContainer, {
        target: {
            scrollTop: 2250,
        },
    });

    await findByTestId('core__text-layer-3');
    const fourthPage = await findByTestId('core__page-layer-3');
    const w2 = parseInt(fourthPage.style.width, 10);
    const h2 = parseInt(fourthPage.style.height, 10);
    expect(w2).toEqual(623);
    expect(h2).toEqual(830);
});
