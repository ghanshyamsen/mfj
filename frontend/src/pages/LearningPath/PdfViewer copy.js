import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import Left from '../../assets/images/simple-line-icons_left.png'
import Right from '../../assets/images/simple-line-icons_right.png'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


export default function PdfViewer({ link, title }) {
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0); // Zoom level

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    function goToPrevPage() {
        setPageNumber(prev => Math.max(prev - 1, 1));
    }

    function goToNextPage() {
        setPageNumber(prev => Math.min(prev + 1, numPages));
    }

    function zoomIn() {
        setScale(prev => Math.min(prev + 0.2, 3.0));
    }

    function zoomOut() {
        setScale(prev => Math.max(prev - 0.2, 0.5));
    }

    function downloadPdf() {
        fetch(link, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf',
            },
        })
        .then((response) => response.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const linkEl = document.createElement('a');
            linkEl.href = url;
            linkEl.setAttribute('download', `${window.strSlugify(title)}.pdf`); // 👈 desired file name
            document.body.appendChild(linkEl);
            linkEl.click();
            linkEl.parentNode.removeChild(linkEl);
        })
        .catch((error) => console.error('Download error:', error));
    }

    return (
        <div>
            <Document file={link} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber}  scale={scale} />
                <div className='pagging_row' style={{ marginTop: 20 }}>
                    <button  className="previous_btn_icon" onClick={goToPrevPage} disabled={pageNumber <= 1}>
                        <img src={Left} alt="" />
                    </button>
                    <span  className="pageNumber" style={{ margin: '0 10px' }}>
                        Page {pageNumber} of {numPages}
                    </span>
                    <button  className="next_btn_icon" onClick={goToNextPage} disabled={pageNumber >= numPages}>
                        <img src={Right} alt="" />
                    </button>
                    <div>
                        <button className="download_btn btn" onClick={downloadPdf}>Download PDF</button>
                    </div>
                    <div className='zoom_controls' style={{ marginTop: 10 }}>
                        <button className="btn" onClick={zoomOut}>- Zoom Out</button>
                        <span style={{ margin: '0 10px' }}>{(scale * 100).toFixed(0)}%</span>
                        <button className="btn" onClick={zoomIn}>+ Zoom In</button>
                    </div>
                </div>

            </Document>

            {/* <p>
                Page {pageNumber} of {numPages}
            </p> */}
        </div>
    );
}
