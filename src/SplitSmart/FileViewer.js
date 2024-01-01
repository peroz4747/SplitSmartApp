import React, { useState, useEffect } from "react";

const PDFJS = window.pdfjsLib;

export default function FileViewer({ costName, fileModal, setFileModal }) {
  const [images, setImages] = useState([]);
  const [pdfRendering, setPdfRendering] = useState("");
  const [pageRendering, setPageRendering] = useState("");

  useEffect(() => {
    renderPage();
  }, [fileModal]);

  async function addPdfUri(uri) {
    try {
      var pdfUris = JSON.parse(localStorage.getItem("pdf-uri"));
      pdfUris[costName.toLowerCase()] = uri;
      return JSON.stringify(pdfUris);
    } catch {
      var obj = new Object();
      obj[costName.toLowerCase()] = uri;
      return JSON.stringify(obj);
    }
  }

  async function retrievePdfUri() {
    try {
      var pdfUris = JSON.parse(localStorage.getItem("pdf-uri"));
      return pdfUris[costName.toLowerCase()];
    } catch {
      return false;
    }
  }

  async function showPdf(event) {
    try {
      setPdfRendering(true);
      const file = event.target.files[0];
      const uri = URL.createObjectURL(file);
      setPdfRendering(false);
      document.getElementById("file-to-upload").value = "";
      var addUri = await addPdfUri(uri);
      localStorage.setItem("pdf-uri", addUri);
      renderPage();
    } catch (error) {
      alert(error.message);
    }
  }

  async function renderPage() {
    setPageRendering(true);
    const imagesList = [];
    const canvas = document.createElement("canvas");
    canvas.setAttribute("className", "canv");
    var uri = await retrievePdfUri();
    if (uri) {
      var pdf = await PDFJS.getDocument({ url: uri });
      for (let i = 1; i <= pdf.numPages; i++) {
        var page = await pdf.getPage(i);
        var viewport = page.getViewport({ scale: 1 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        var render_context = {
          canvasContext: canvas.getContext("2d"),
          viewport: viewport,
        };
        await page.render(render_context).promise;
        let img = canvas.toDataURL("image/png");
        imagesList.push(img);
      }
      setImages(imagesList);
    }
    setPageRendering(false);
  }

  return (
    <div className="file-modal">
      <div className="file-modal-dismiss" onClick={() => setFileModal(false)}>
        X
      </div>
      <div className="file-reader-app">
        <button
          id="upload-button"
          onClick={() => document.getElementById("file-to-upload").click()}
        >
          Select PDF
        </button>
        <input
          type="file"
          id="file-to-upload"
          accept="application/pdf"
          hidden
          onChange={showPdf}
        />
        <div id="pdf-main-container">
          <div id="pdf-loader" hidden={!pdfRendering}>
            Loading document ...
          </div>
          <div id="pdf-contents">
            <div id="image-convas-row">
              <div>
                {images.map((image, idx) => (
                  <div key={idx}>
                    <img
                      id="image-generated"
                      src={image}
                      alt="pdfImage"
                      style={{
                        width: "100%",
                        height: "100%",
                        margin: "0",
                        border: "none",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div id="page-loader" hidden={!pageRendering}>
              Loading page ...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
