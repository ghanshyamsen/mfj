import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { ToolbarSlot, TransformToolbarSlot, toolbarPlugin } from '@react-pdf-viewer/toolbar';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { useProfile } from '../../ProfileContext';



export default function PdfViewer({ link, title }) {

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: () => [],
    });

    const toolbarPluginInstance = toolbarPlugin();
    const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

    const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
        ...slot,
        // These slots will be empty
        Open: () => <></>,
        EnterFullScreen: () => <></>,
        //SwitchTheme: () => <></>,
    });

    const { theme } = useProfile();

    return (
        <div className='pdf_view' style={{ height: '98vh' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">

                <div
                    style={{
                        alignItems: 'center',
                        backgroundColor: '#eeeeee',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        padding: '4px',
                    }}
                >
                    <Toolbar >{renderDefaultToolbar(transform)}</Toolbar>
                </div>
                <Viewer
                    fileUrl={link}
                    plugins={[defaultLayoutPluginInstance],[toolbarPluginInstance]}
                    defaultScale={SpecialZoomLevel.PageFit}
                    theme={theme}
                />
            </Worker>
        </div>
    );
}
