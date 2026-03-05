import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as xlsx from 'xlsx';
import { Download, FileText } from 'lucide-react';

export default function ExportButtons({ data, columns, filename }) {
    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text(`${filename} Report`, 14, 15);

        const tableColumn = columns.map(c => c.header);
        const tableRows = data.map(row => columns.map(c => row[c.key]));

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save(`${filename}.pdf`);
    };

    const handleExportExcel = () => {
        // Transform data based on columns
        const exportData = data.map(row => {
            const obj = {};
            columns.forEach(col => {
                obj[col.header] = row[col.key];
            });
            return obj;
        });

        const worksheet = xlsx.utils.json_to_sheet(exportData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        xlsx.writeFile(workbook, `${filename}.xlsx`);
    };

    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={handleExportPDF} title="Download PDF">
                <FileText size={18} /> PDF
            </button>
            <button className="btn btn-secondary" onClick={handleExportExcel} title="Download Excel">
                <Download size={18} /> Excel
            </button>
        </div>
    );
}
