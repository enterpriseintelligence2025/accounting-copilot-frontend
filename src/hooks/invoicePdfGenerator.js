/*
  hooks/invoicePdfGenerator.js
  - Small hook that returns a `generatePDF` function configured with `jsPDF`.
  - Produces a printable invoice PDF from a provided invoice object.
  - Note: Fonts and bank details are optional and currently commented out.
*/
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

const useGenerateInvoicePDF = (invoiceData) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFont("helvetica", "bold");
    // If using custom fonts, add them to the VFS and call doc.addFont
    doc.setFont("NotoSans", "normal");
    
    doc.setFontSize(14);
    doc.text("TAX INVOICE", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: ${invoiceData.invoice_number}`, 14, 30);
    doc.text(
      `Invoice Date: ${format(
        new Date(invoiceData.invoice_date),
        "dd-MMM-yyyy"
      )}`,
      14,
      35
    );
    doc.text(`PO Number: ${invoiceData.po_number || "N/A"}`, 14, 40);

    // Vendor Details (Right-Aligned)
    const vendorInfoX = 196;
    doc.text("BILLED BY:", vendorInfoX, 30, { align: "right" });
    doc.text(`${invoiceData.vendor.name}`, vendorInfoX, 35, { align: "right" });
    doc.text(`${invoiceData.vendor.address}`, vendorInfoX, 40, {
      align: "right",
    });
    doc.text(`GSTIN: ${invoiceData.vendor.gstin}`, vendorInfoX, 45, {
      align: "right",
    });

    // Client Billing Address
    doc.setFont("helvetica", "bold");
    doc.text("Name of Client and Billing Address:", 14, 55);

    doc.setFont("helvetica", "normal");
    doc.text(`${invoiceData.sold_to.name}`, 14, 60);
    doc.text(`${invoiceData.sold_to.address}`, 14, 65);
    doc.text(`GSTIN: ${invoiceData.sold_to.gstin}`, 14, 70);

    // Table Columns & Rows
    const tableColumns = [
      { header: "Description", dataKey: "description" },
      { header: "Quantity", dataKey: "quantity" },
      { header: "Rate", dataKey: "unit_rate" },
      { header: "Base Amount", dataKey: "amount" },
    ];

    const tableRows = invoiceData.line_items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unit_rate: item.unit_rate.toFixed(2),
      amount: item.amount.toFixed(2),
    }));

    // Generate Table
    autoTable(doc, {
      head: [tableColumns.map((col) => col.header)],
      body: tableRows.map((row) => tableColumns.map((col) => row[col.dataKey])),
      startY: 80,
      theme: "grid",
      headStyles: { fillColor: [66, 66, 66], textColor: [255, 255, 255] },
    });

    // Get final Y position for next section
    const finalY = doc.lastAutoTable.finalY || 150;

    // Tax Summary
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal:", 150, finalY + 10, { align: "right" });

    doc.text(`INR. ${invoiceData.subtotal.toFixed(2)}`, 196, finalY + 10, {
      align: "right",
    });

    doc.text("CGST:", 150, finalY + 15, { align: "right" });
    doc.text(`INR. ${invoiceData.taxes.cgst.toFixed(2)}`, 196, finalY + 15, {
      align: "right",
    });

    doc.text("SGST:", 150, finalY + 20, { align: "right" });
    doc.text(`INR. ${invoiceData.taxes.sgst.toFixed(2)}`, 196, finalY + 20, {
      align: "right",
    });

    doc.text("Total Tax:", 150, finalY + 25, { align: "right" });
    doc.text(
      `INR. ${(invoiceData.taxes.cgst + invoiceData.taxes.sgst).toFixed(2)}`,
      196,
      finalY + 25,
      { align: "right" }
    );

    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", 150, finalY + 30, { align: "right" });
    doc.text(`INR. ${invoiceData.total_amount.toFixed(2)}`, 196, finalY + 30, {
      align: "right",
    });

    // Amount in Words
    doc.setFont("helvetica", "bold");
    doc.text("Amount in Words:", 14, finalY + 45);
    doc.setFont("helvetica", "normal");
    doc.text(invoiceData.amount_in_words, 50, finalY + 45);

    // Notes Section
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", 14, finalY + 55);
    doc.setFont("helvetica", "normal");

    let noteY = finalY + 60;
    const maxWidth = 180; // Set a reasonable width to ensure wrapping

    invoiceData.notes.forEach((note) => {
      const wrappedText = doc.splitTextToSize(`• ${note}`, maxWidth);
      doc.text(wrappedText, 14, noteY);
      noteY += wrappedText.length * 5; // Adjust spacing dynamically
    });

    // Footer & Signatures
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.text("Thank you for your business!", 105, pageHeight - 20, {
      align: "center",
    });

    doc.line(14, pageHeight - 40, 60, pageHeight - 40);
    doc.line(150, pageHeight - 40, 196, pageHeight - 40);
    doc.text("Authorized Signatory", 37, pageHeight - 35, { align: "center" });
    doc.text("Customer Signature", 173, pageHeight - 35, { align: "center" });

    doc.save(`Invoice_${invoiceData.invoice_number}.pdf`);
  };

  return generatePDF;
};

export default useGenerateInvoicePDF;
