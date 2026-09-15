const pdfUrl = "./pdf/buku-profil-proklim-lestari.pdf";

// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

let pdfDoc = null;
let pageFlip = null;

const flipbook = document.getElementById("flipbook");
const pageNumber = document.getElementById("pageNumber");
const prevButton = document.getElementById("prevPage");
const nextButton = document.getElementById("nextPage");

async function loadPDF() {
  try {
    console.log("Memuat PDF...");

    const loadingTask = pdfjsLib.getDocument({
      url: pdfUrl
    });

    pdfDoc = await loadingTask.promise;

    console.log(`PDF berhasil dimuat: ${pdfDoc.numPages} halaman`);

    await renderPages();

  } catch (error) {
    console.error("Gagal memuat PDF:", error);
  }
}

async function renderPages() {

  const pages = [];

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {

    console.log(`Merender halaman ${pageNum}...`);

    const page = await pdfDoc.getPage(pageNum);

    const viewport = page.getViewport({
      scale: 1.5
    });

    const canvas = document.createElement("canvas");

    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

    pages.push(canvas);
  }

  createFlipbook(pages);
}

function createFlipbook(pages) {

  pageFlip = new St.PageFlip(flipbook, {

    width: 500,
    height: 700,

    size: "stretch",

    minWidth: 280,
    maxWidth: 500,

    minHeight: 390,
    maxHeight: 700,

    showCover: true,

    mobileScrollSupport: true,

    drawShadow: true,

    flippingTime: 700
  });

  const pageElements = pages.map((canvas) => {

    const pageElement = document.createElement("div");

    pageElement.classList.add("page");

    pageElement.appendChild(canvas);

    return pageElement;

  });

  pageFlip.loadFromHTML(pageElements);

  pageFlip.on("flip", (event) => {

    const currentPage = event.data + 1;

    pageNumber.textContent = `Halaman ${currentPage}`;

  });
}

prevButton.addEventListener("click", () => {

  if (pageFlip) {
    pageFlip.flipPrev();
  }

});

nextButton.addEventListener("click", () => {

  if (pageFlip) {
    pageFlip.flipNext();
  }

});

window.addEventListener("load", () => {
  loadPDF();
});