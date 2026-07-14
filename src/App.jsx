import React, { useState } from "react";

const today = () => new Date().toISOString().slice(0, 10);

export default function InvoiceBuilder() {
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("INV-001");
  const [date, setDate] = useState(today());
  const [items, setItems] = useState([{ id: 1, description: "", qty: 1, rate: 0 }]);
  const [tax, setTax] = useState(18);
  const [notes, setNotes] = useState("Thank you for your business!");

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", qty: 1, rate: 0 }]);
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    const sanitizedValue =
      field === "qty" || field === "rate"
        ? Math.max(0, Number(value) || 0)
        : value;

    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: sanitizedValue } : item
      )
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const taxAmount = (subtotal * tax) / 100;
  const grandTotal = subtotal + taxAmount;

  const fmt = (n) =>
    "₹" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Invoice Builder
        </h1>

        <div className="bg-white rounded shadow p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
            Client Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Client Name
              </label>
              <input
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Client Address
              </label>
              <input
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                placeholder="123 Street, City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Invoice Number
              </label>
              <input
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
            Line Items
          </h2>

          <div className="hidden md:grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase mb-2 px-1">
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-3 text-center">Rate (₹)</div>
            <div className="col-span-1 text-right">Amount</div>
            <div className="col-span-1"></div>
          </div>

          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 mb-2 items-center">
              <div className="col-span-12 md:col-span-5">
                <input
                  className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  placeholder="Item description"
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <input
                  type="number"
                  min={0}
                  step="1"
                  className="w-full border rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:border-blue-400"
                  value={item.qty}
                  onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                />
              </div>
              <div className="col-span-4 md:col-span-3">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className="w-full border rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:border-blue-400"
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                />
              </div>
              <div className="col-span-3 md:col-span-1 text-right text-sm font-medium text-gray-700">
                {fmt(item.qty * item.rate)}
              </div>
              <div className="col-span-1 text-center">
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-red-400 hover:text-red-600 font-bold text-lg leading-none"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addItem}
            className="mt-2 px-4 py-2 text-sm border border-dashed border-blue-400 text-blue-500 rounded hover:bg-blue-50"
          >
            + Add Item
          </button>
        </div>

        <div className="bg-white rounded shadow p-4 mb-4 flex flex-col items-end">
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm text-gray-600">Tax / GST %</label>
            <input
              type="number"
              min={0}
              max={100}
              className="w-20 border rounded px-2 py-1 text-sm text-center focus:outline-none focus:border-blue-400"
              value={tax}
              onChange={(e) => setTax(Number(e.target.value))}
            />
          </div>
          <div className="w-60 text-sm">
            <div className="flex justify-between py-1 border-b">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-gray-500">Tax ({tax}%)</span>
              <span className="font-medium">{fmt(taxAmount)}</span>
            </div>
            <div className="flex justify-between py-2 bg-blue-600 text-white rounded px-2 mt-2">
              <span className="font-semibold">Grand Total</span>
              <span className="font-bold">{fmt(grandTotal)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-2">Notes</h2>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mb-10 print:hidden">
          <button
            onClick={handlePrint}
            className="px-5 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            🖨 Print / Save PDF
          </button>
        </div>

        <div className="bg-white rounded shadow p-8 print:shadow-none print:p-0" id="invoice-preview">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-600">INVOICE</h2>
              <p className="text-sm text-gray-500 mt-1">#{invoiceNo}</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p><span className="font-medium">Date:</span> {date}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Bill To</p>
            <p className="font-semibold text-gray-800">{clientName || "—"}</p>
            <p className="text-sm text-gray-500">{clientAddress || ""}</p>
          </div>

          <table className="w-full text-sm mb-6 invoice-table">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="text-left py-2 px-3 rounded-tl">Description</th>
                <th className="text-center py-2 px-3">Qty</th>
                <th className="text-right py-2 px-3">Rate</th>
                <th className="text-right py-2 px-3 rounded-tr">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-2 px-3">{item.description || "—"}</td>
                  <td className="py-2 px-3 text-center">{item.qty}</td>
                  <td className="py-2 px-3 text-right">{fmt(item.rate)}</td>
                  <td className="py-2 px-3 text-right font-medium">{fmt(item.qty * item.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-6">
            <div className="w-56 text-sm">
              <div className="flex justify-between py-1 border-b text-gray-600">
                <span>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between py-1 border-b text-gray-600">
                <span>Tax ({tax}%)</span><span>{fmt(taxAmount)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-gray-800 text-base">
                <span>Total</span><span>{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>

          {notes && (
            <div className="border-t pt-4 text-sm text-gray-500">
              <p className="font-semibold text-gray-600 mb-1">Notes</p>
              <p>{notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
