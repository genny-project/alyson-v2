import './pdfViewer.scss';
import React, { Component } from 'react';
import { string, number, func } from 'prop-types';
const pdfjsLib = window['pdfjs-dist/build/pdf'];
const pdfjsViewer = window['pdfjs-dist/web/pdf_viewer'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.489/build/pdf.worker.min.js';

class PDFViewer extends Component {

    static propTypes = {
        file: string.isRequired,
        page: number,
        onDocumentComplete: func,
    }

    static defaultProps = {
        page: 1,
        onDocumentComplete: null,
    }

    state = {
        pdf: null,
    };

    componentDidMount() {

//        if (!this.props.file) return;

        var container = this.viewerContainer;
        var pdfViewer = new pdfjsViewer.PDFViewer({
            container: container,
        });

        const CMAP_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.489/cmaps/';
        const CMAP_PACKED = true;

        container.addEventListener('pagesinit', function () {
            // We can use pdfViewer now, e.g. let's change default scale.
            pdfViewer.currentScaleValue = 'page-width';        
        });

        pdfjsLib.getDocument({
            url: this.props.file,
            cMapUrl: CMAP_URL,
            cMapPacked: CMAP_PACKED,
        }).then(function (pdfDocument) {
            // Document loaded, specifying document for the viewer and
            // the (optional) linkService.
            pdfViewer.setDocument(pdfDocument);
        });

        // loadingTask.promise.then(pdf => {
        //     console.log('PDF loaded');

        //     // Fetch the first page
        //     var pageNumber = 1;
        //     pdf.getPage(pageNumber).then(page => {
        //         console.log('Page loaded');

        //         var scale = 1.5;
        //         var viewport = page.getViewport(scale);

        //         // Prepare canvas using PDF page dimensions
        //         var canvas = this.canvas;
        //         var context = canvas.getContext('2d');
        //         canvas.height = viewport.height;
        //         canvas.width = viewport.width;

        //         // Render PDF page into canvas context
        //         var renderContext = {
        //             canvasContext: context,
        //             viewport: viewport
        //         };
        //         var renderTask = page.render(renderContext);
        //         renderTask.then(function () {
        //             console.log('Page rendered');
        //         });
        //     });
        // }, function (reason) {
        //     // PDF loading error
        //     console.error(reason);
        // });
    }

    

    render() {

        const { className, style } = this.props;

        const componentStyle = {
            ...style,
        };
        return (
            <div className={`pdf-viewer scrollbar-dark ${className}`} style={componentStyle} ref={r => this.viewerContainer = r} id="viewerContainer">
                <div id="viewer" className="pdfViewer" ref={r => this.viewer = r} />
                {/* <canvas ref={(canvas) => { this.canvas = canvas; }} /> */}
            </div>
        );
    }
}

export default PDFViewer;
