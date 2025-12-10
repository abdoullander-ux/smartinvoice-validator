import React from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (validTypes.includes(file.type)) {
      onFileSelect(file);
    } else {
      alert("Format non supporté. Veuillez utiliser JPG, PNG ou PDF.");
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer p-10 flex flex-col items-center justify-center text-center h-full min-h-[300px]"
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={handleChange}
      />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
        <div className="bg-brand-100 text-brand-600 p-4 rounded-full mb-4">
          <UploadCloud size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Charger une facture</h3>
        <p className="text-slate-500 mt-2 text-sm">
          Glissez-déposez ou cliquez pour parcourir <br />
          (PDF, JPG, PNG)
        </p>
      </label>
    </div>
  );
};

export default FileUpload;
