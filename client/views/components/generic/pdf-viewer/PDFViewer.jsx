import './pdfViewer.scss';
import React, { Component } from 'react';
import { string, object, bool, number, func } from 'prop-types';
import PdfJsLib from 'pdfjs-dist';
import { IconSmall } from 'views/components';

class PDFViewer extends Component {

    static propTypes = {
        file: string.isRequired,
        page: number,
        onDocumentComplete: func,
    }

    static defaultProps = {
        page: 1,
        onDocumentComplete: null,
        file: 'https://s3.ap-southeast-2.amazonaws.com/internmatch-uploads/ESH1HwKh6SF8toJcDldsYfkwdZBqIwhJ'
    }

    state = {
        pdf: null,
    };

    componentDidMount() {
        //PdfJsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.489/pdf.worker.js';
        PdfJsLib.getDocument(this.props.file).then((pdf) => {
            console.log({pdf});
            this.setState({ pdf });
            if (this.props.onDocumentComplete) {
                this.props.onDocumentComplete(pdf.pdfInfo.numPages);
            }
            pdf.getPage(this.props.page).then((page) => {
                const scale = 1.5;
                const viewport = page.getViewport(scale);

                const { canvas } = this;
                const canvasContext = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext,
                    viewport,
                };

            });
        });
    }

    componentWillReceiveProps(newProps) {
        if (newProps.page !== this.props.page) {
            this.state.pdf.getPage(newProps.page).then((page) => {
                const scale = 1.5;
                const viewport = page.getViewport(scale);

                const { canvas } = this;
                const canvasContext = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext,
                    viewport,
                };
                page.render(renderContext);
            });
        }
    }

    render() {

        const { className, style, file } = this.props;
        const { pageNumber, numPages } = this.state;

        const componentStyle = {
            ...style,
        };
        console.log('VIEWER', pageNumber, numPages);
        return (
            <div className={`pdf-viewer ${className}`} style={componentStyle}>
                <canvas ref={(canvas) => { this.canvas = canvas; }} />
                <span>PDF</span>
            </div>
        );
    }
}

export default PDFViewer;
