try {
  const { PDFDocument } = require("pdf-lib");
  const fs = require("fs");
  const { isExact } = require("../../test/isExist");
  const { savePDF } = require("../savePDF");

  let splitNumber = (source, out, secondPart) => {
    work(source, out, secondPart).catch((err) => {
      console.log(err);
    });
  };

  async function work(source, out, lastPageFirstPart) {
    let path = `${source}`;

    isExact(source);

    const mainPDF = await PDFDocument.load(fs.readFileSync(path));

    try {
      if (mainPDF.getPages().length <= lastPageFirstPart)
        throw new Error("А number is too large");
      if (lastPageFirstPart < 1) throw new Error("A number is too small");
    } catch {
      console.log(err.message);
      process.exit(-1);
    }

    var pageIndices = mainPDF.getPageIndices();

    await savePDF(
      mainPDF,
      `${out}firstPart.pdf`,
      pageIndices.slice(0, lastPageFirstPart)
    );
    await savePDF(
      mainPDF,
      `${out}secondPart.pdf`,
      pageIndices.slice(lastPageFirstPart + 1)
    );
  }

  module.exports = { splitNumber };
} catch {
  console.log(err);
  process.exit(-1);
}