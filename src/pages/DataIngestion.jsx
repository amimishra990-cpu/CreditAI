import { useState } from 'react';
import { Upload, FileText, FileSpreadsheet, Scale, Newspaper, Building, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import { uploadedDocuments } from '../data/mockData';
import './DataIngestion.css';

const categories = [
    { label: 'GST Filing', icon: FileText },
    { label: 'Bank Statement', icon: FileSpreadsheet },
    { label: 'Financial Report', icon: FileSpreadsheet },
    { label: 'Annual Report', icon: FileText },
    { label: 'Legal Document', icon: Scale },
    { label: 'News / Media', icon: Newspaper },
    { label: 'Company Registration', icon: Building },
];

export default function DataIngestion() {
    const [dragActive, setDragActive] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('GST Filing');
    const [docs, setDocs] = useState(uploadedDocuments);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        // Simulated — just add a mock entry
        const newDoc = {
            id: Date.now(),
            name: 'New_Document_Upload.pdf',
            category: selectedCategory,
            size: '1.8 MB',
            status: 'processing',
            uploadedAt: new Date().toLocaleString(),
        };
        setDocs([newDoc, ...docs]);
    };

    return (
        <div className="data-ingestion page-enter">
            <div className="data-ingestion__header">
                <h1 className="data-ingestion__title">Data Ingestion</h1>
                <p className="data-ingestion__subtitle">Upload and manage company documents for AI analysis</p>
            </div>

            {/* Category Selector */}
            <div className="data-ingestion__categories">
                {categories.map((cat) => (
                    <button
                        key={cat.label}
                        className={`data-ingestion__cat-btn ${selectedCategory === cat.label ? 'data-ingestion__cat-btn--active' : ''}`}
                        onClick={() => setSelectedCategory(cat.label)}
                    >
                        <cat.icon size={16} />
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Upload zone */}
            <div
                className={`data-ingestion__upload glass-card ${dragActive ? 'data-ingestion__upload--active' : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
            >
                <div className="data-ingestion__upload-icon">
                    <Upload size={32} />
                </div>
                <h3 className="data-ingestion__upload-title">
                    {dragActive ? 'Drop files here' : 'Drag & drop files to upload'}
                </h3>
                <p className="data-ingestion__upload-desc">
                    Supports PDF, XLSX, CSV, DOCX — Max 50MB per file
                </p>
                <label className="data-ingestion__upload-btn">
                    Browse Files
                    <input type="file" hidden multiple />
                </label>
                <p className="data-ingestion__upload-category">
                    Category: <strong>{selectedCategory}</strong>
                </p>
            </div>

            {/* Documents List */}
            <div className="data-ingestion__docs glass-card">
                <div className="data-ingestion__docs-header">
                    <h3>Uploaded Documents</h3>
                    <span className="data-ingestion__docs-count">{docs.length} files</span>
                </div>
                <div className="data-ingestion__docs-list">
                    {docs.map((doc) => (
                        <div className="data-ingestion__doc-row" key={doc.id}>
                            <div className="data-ingestion__doc-icon">
                                <FileText size={18} />
                            </div>
                            <div className="data-ingestion__doc-info">
                                <span className="data-ingestion__doc-name">{doc.name}</span>
                                <span className="data-ingestion__doc-meta">{doc.category} · {doc.size}</span>
                            </div>
                            <StatusBadge status={doc.status} />
                            <span className="data-ingestion__doc-time">{doc.uploadedAt}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
