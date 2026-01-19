/*
  InvoicePreview.jsx
  - Editable invoice preview used after invoice extraction completes.
  - Provides simple field editing and recalculation of totals.
  - Uses a small fallback `dummyInvoiceData` when backend data is missing.
*/
import { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, addDays, isAfter, isBefore } from "date-fns";

// ✅ Dummy fallback data
const dummyInvoiceData = {
  amount_in_words: "Seven Lakh Eight Thousand Only",
  delivery_date: "20/06/2025",
  invoice_date: "March 16, 2025",
  invoice_number: "INV-2023-0001",
  line_items: [
    { amount: 200000.0, description: "Training Charges", hsn_code: "1001", quantity: 1, sno: 1, unit_rate: 200000.0 },
    { amount: 300000.0, description: "Platform Licensing", hsn_code: "1002", quantity: 2, sno: 2, unit_rate: 150000.0 },
    { amount: 100000.0, description: "Custom Development", hsn_code: "1003", quantity: 1, sno: 3, unit_rate: 100000.0 }
  ],
  notes: [
    "Invoice will be processed for payment only after 'Receiver' at delivery point acknowledges and certifies that the material supplied is in good condition / service rendered satisfactorily.",
    "If the above order falls under Tax & Duties, please submit photocopy of registered certificates under respective department along with the invoice.",
    "Please mention this PO number in all the invoices related to this Purchase Order.",
    "Actual Material supplied / services rendered should not exceed PO value.",
    "Please attach Pan Card Copy along with the invoice to avoid 20% TDS on invoice value.",
    "Please notify immediately if you are unable to supply material / render services as committed.",
    "Request to take proper acknowledgement through seal and sign on invoice at delivery point.",
    "Product with manufacturing defect should be replaced free of cost.",
    "Payment Terms: 30 Days"
  ],
  po_number: "TLE-EIS-2425-999",
  ship_to: {
    address: "12th Floor, Innovate Tower, Whitefield, Bangalore, Karnataka, 560066",
    name: "Innovate Solutions Pvt Ltd"
  },
  sold_to: {
    address: "12th Floor, Innovate Tower, Whitefield, Bangalore, Karnataka, 560066",
    gstin: "29ABCDE1234F1Z6",
    name: "Innovate Solutions Pvt Ltd"
  },
  subtotal: 600000.0,
  taxes: {
    cgst: 54000.0,
    sgst: 54000.0
  },
  total_amount: 708000.0,
  vendor: {
    address: "10th Floor, WeTech Park, MG Road, Bangalore, Karnataka, 560001",
    gstin: "29XYZ1234L1Z8",
    name: "TechSolutions India Pvt Ltd"
  }
};

const InvoiceForm = ({ formData, setFormData }) => {
  const invoiceGeneration = useSelector((state) => state.invoiceGeneration);
  const { loading, error, invoiceInfo } = invoiceGeneration;

  const [editableFields] = useState({
    invoice_number: false,
    invoice_date: true,
    po_number: true,
    sold_to: { name: false, address: true, gstin: false },
    ship_to: { name: false, address: true },
    vendor: { name: false, address: false, gstin: false },
    line_items: true,
    notes: true
  });

  const today = new Date();
  const maxDate = addDays(today, 7);

  useEffect(() => {
    // ✅ If data is missing or fetch failed, use fallback dummy data
    const sourceData = invoiceInfo && Object.keys(invoiceInfo).length ? invoiceInfo : dummyInvoiceData;

    setFormData({
      ...dummyInvoiceData, // baseline to ensure full structure
      ...sourceData, // override with real data if available
      invoice_date: sourceData.invoice_date ? new Date(sourceData.invoice_date) : today
    });
  }, [invoiceInfo]);

  // Convert amount to words (unchanged)
  const convertToWords = (amount) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const scales = ['', 'Thousand', 'Lakh', 'Crore'];
    if (amount === 0) return 'Zero Rupees Only';
    const convertGroup = (num) => {
      let result = '';
      if (num >= 100) {
        result += ones[Math.floor(num / 100)] + ' Hundred ';
        num %= 100;
      }
      if (num >= 20) {
        result += tens[Math.floor(num / 10)] + ' ';
        num %= 10;
      }
      if (num > 0) result += ones[num] + ' ';
      return result;
    };
    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);
    let words = '';
    if (rupees >= 10000000) {
      const crores = Math.floor(rupees / 10000000);
      words += convertGroup(crores) + scales[3] + ' ';
    }
    const remaining = rupees % 10000000;
    if (remaining >= 100000) {
      const lakhs = Math.floor(remaining / 100000);
      words += convertGroup(lakhs) + scales[2] + ' ';
    }
    const afterLakhs = remaining % 100000;
    if (afterLakhs >= 1000) {
      const thousands = Math.floor(afterLakhs / 1000);
      words += convertGroup(thousands) + scales[1] + ' ';
    }
    const hundreds = afterLakhs % 1000;
    if (hundreds > 0) words += convertGroup(hundreds);
    words += 'Rupees';
    if (paise > 0) words += ' and ' + convertGroup(paise) + 'Paise';
    return words + ' Only';
  };

  const handleInputChange = (field, value) => setFormData({ ...formData, [field]: value });

  const handleNestedInputChange = (parent, field, value) => {
    setFormData({
      ...formData,
      [parent]: { ...formData[parent], [field]: value }
    });
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = [...formData.line_items];
    updatedLineItems[index] = {
      ...updatedLineItems[index],
      [field]: field === "unit_rate" || field === "quantity" ? parseFloat(value) : value
    };
    if (field === "unit_rate" || field === "quantity") {
      updatedLineItems[index].amount = updatedLineItems[index].quantity * updatedLineItems[index].unit_rate;
    }
    setFormData({ ...formData, line_items: updatedLineItems });
    recalculateTotals(updatedLineItems);
  };

  const recalculateTotals = (lineItems) => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const cgst = subtotal * 0.09;
    const sgst = subtotal * 0.09;
    const totalAmount = subtotal + cgst + sgst;
    const amountInWords = convertToWords(totalAmount);

    setFormData((prev) => ({
      ...prev,
      subtotal,
      taxes: { cgst, sgst },
      total_amount: totalAmount,
      amount_in_words: amountInWords
    }));
  };

  const handleDateSelect = (date) => {
    if ((isAfter(date, today) && isBefore(date, maxDate)) || date.toDateString() === today.toDateString()) {
      handleInputChange("invoice_date", date);
    }
  };

  if (!formData) return null;

  return (
    <CardContent>
      {/* General Information */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Label className="text-xs text-muted-foreground">Invoice Number</Label>
          <Input 
            value={formData.invoice_number || ""} 
            className="mt-1" 
            readOnly={!editableFields.invoice_number}
            onChange={(e) => handleInputChange('invoice_number', e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Invoice Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full mt-1 justify-start text-left font-normal ${!editableFields.invoice_date ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!editableFields.invoice_date}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.invoice_date ? format(formData.invoice_date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.invoice_date}
                onSelect={handleDateSelect}
                disabled={(date) => isBefore(date, today) || isAfter(date, maxDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">PO Number</Label>
          <Input 
            value={formData.po_number || ""} 
            className="mt-1" 
            readOnly={!editableFields.po_number}
            onChange={(e) => handleInputChange('po_number', e.target.value)}
          />
        </div>
      </div>

      {/* Sold To and Ship To */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Sold To */}
        <div>
          <Label className="text-xs text-muted-foreground">Sold To</Label>
          <div className="mt-1 space-y-1">
            <Input 
              value={formData.sold_to.name || ""} 
              readOnly={!editableFields.sold_to.name}
              onChange={(e) => handleNestedInputChange('sold_to', 'name', e.target.value)}
            />
            <Input 
              value={formData.sold_to.address || ""} 
              readOnly={!editableFields.sold_to.address}
              onChange={(e) => handleNestedInputChange('sold_to', 'address', e.target.value)}
            />
            <Input 
              value={`GSTIN: ${formData.sold_to.gstin || ""}`} 
              readOnly={!editableFields.sold_to.gstin}
              onChange={(e) => handleNestedInputChange('sold_to', 'gstin', e.target.value.replace('GSTIN: ', ''))}
            />
          </div>
        </div>
        {/* Ship To */}
        <div>
          <Label className="text-xs text-muted-foreground">Ship To</Label>
          <div className="mt-1 space-y-1">
            <Input 
              value={formData.ship_to.name || ""} 
              readOnly={!editableFields.ship_to.name}
              onChange={(e) => handleNestedInputChange('ship_to', 'name', e.target.value)}
            />
            <Input 
              value={formData.ship_to.address || ""} 
              readOnly={!editableFields.ship_to.address}
              onChange={(e) => handleNestedInputChange('ship_to', 'address', e.target.value)}
            />
          </div>
        </div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Vendor</Label>
        <div className="mt-1 space-y-1">
          <Input 
            value={formData.vendor.name || ""} 
            readOnly={!editableFields.vendor.name}
            onChange={(e) => handleNestedInputChange('vendor', 'name', e.target.value)}
          />
          <Input 
            value={formData.vendor.address || ""} 
            readOnly={!editableFields.vendor.address}
            onChange={(e) => handleNestedInputChange('vendor', 'address', e.target.value)}
          />
          <Input 
            value={`GSTIN: ${formData.vendor.gstin || ""}`} 
            readOnly={!editableFields.vendor.gstin}
            onChange={(e) => handleNestedInputChange('vendor', 'gstin', e.target.value.replace('GSTIN: ', ''))}
          />
        </div>
      </div>

      {/* Line Items */}
      <Label className="text-xs text-muted-foreground mb-2 block">Line Items</Label>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formData.line_items.map((item, index) => (
            <TableRow key={`${index}${item.hsn_code}`}>
              <TableCell>
                <Input 
                  value={item.description} 
                  readOnly={!editableFields.line_items}
                  onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                />
              </TableCell>
              <TableCell className="text-right">
                <Input 
                  value={item.quantity} 
                  type="number"
                  className="text-right"
                  readOnly={!editableFields.line_items}
                  onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                />
              </TableCell>
              <TableCell className="text-right">
                <Input 
                  value={item.unit_rate} 
                  type="number"
                  className="text-right"
                  readOnly={!editableFields.line_items}
                  onChange={(e) => handleLineItemChange(index, 'unit_rate', e.target.value)}
                  prefix="₹"
                />
              </TableCell>
              <TableCell className="text-right">₹{item.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
            <TableCell className="text-right">₹{formData.subtotal.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className="text-right font-medium">CGST</TableCell>
            <TableCell className="text-right">₹{formData.taxes.cgst.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className="text-right font-medium">SGST</TableCell>
            <TableCell className="text-right">₹{formData.taxes.sgst.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className="text-right font-medium">Total Tax</TableCell>
            <TableCell className="text-right">₹{(formData.taxes.cgst + formData.taxes.sgst).toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
            <TableCell className="text-right font-bold">₹{formData.total_amount.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Amount in Words */}
      <div className="mt-4">
        <Label className="text-xs text-muted-foreground">Amount in Words</Label>
        <Input 
          value={formData.amount_in_words || ""} 
          className="mt-1" 
          readOnly
        />
      </div>

      {/* Notes */}
      <div className="mt-4">
        <Label className="text-xs text-muted-foreground">Notes</Label>
        <div className="mt-1 space-y-1">
          {formData.notes.map((note, index) => (
            <Input 
              key={index} 
              value={note} 
              readOnly={!editableFields.notes}
              className="text-sm"
              onChange={(e) => {
                const updatedNotes = [...formData.notes];
                updatedNotes[index] = e.target.value;
                handleInputChange('notes', updatedNotes);
              }}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <AlertCircle className="inline-block mr-2 h-4 w-4" />
          Please verify all fields before proceeding. Editable fields have been enabled for modification.
        </p>
      </div>
    </CardContent>
  );
};

export default InvoiceForm;