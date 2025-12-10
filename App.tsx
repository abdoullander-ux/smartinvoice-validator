import React, { useState, useCallback } from 'react';
import { Loader2, ArrowLeft, FileText } from 'lucide-react';
import FileUpload from './components/FileUpload';
import DataPanel from './components/DataPanel';
import { InvoiceData } from './types';
import { extractInvoiceData } from './services/geminiService';
import { generateUBLXML } from './services/ublGenerator';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setIsProcessing(true);

    // Create preview URL
    const previewUrl = URL.createObjectURL(selectedFile);
    setFilePreview(previewUrl);

    try {
      // Convert to Base64 for API
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
          const result = reader.result as string;
          // Remove Data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = error => reject(error);
      });

      // Call Gemini API
      const data = await extractInvoiceData(base64, selectedFile.type);
      setInvoiceData(data);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'analyse du document. Veuillez réessayer.");
      setInvoiceData(null);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleDataChange = (key: keyof InvoiceData, value: any) => {
    if (invoiceData) {
      setInvoiceData({ ...invoiceData, [key]: value });
    }
  };

  const reset = () => {
    setFile(null);
    setFilePreview(null);
    setInvoiceData(null);
    setError(null);
  };

  const handleDownloadUBL = () => {
    if (!invoiceData) return;

    try {
      const xmlContent = generateUBLXML(invoiceData);
      const blob = new Blob([xmlContent], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Nom du fichier : invoice_NUMERO.xml ou invoice_DATE.xml
      const fileName = `invoice_${invoiceData.invoiceNumber || Date.now()}.xml`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Erreur lors de la génération UBL", e);
      alert("Erreur lors de la génération du fichier XML.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-brand-600 p-2 rounded-lg text-white">
            <FileText size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">SmartInvoice <span className="text-brand-600 font-light">Validator</span></h1>
        </div>
        {file && (
          <button 
            onClick={reset}
            className="text-sm text-slate-500 hover:text-brand-600 flex items-center transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Charger un autre document
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full">
        
        {!file && (
          <div className="max-w-2xl mx-auto mt-20">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">Commencer l'extraction</h2>
              <p className="text-center text-slate-500 mb-8">Téléchargez votre facture pour extraire et valider automatiquement les données.</p>
              <FileUpload onFileSelect={handleFileSelect} />
            </div>
          </div>
        )}

        {file && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
            
            {/* Left Column: Document Preview */}
            <div className="bg-slate-200 rounded-xl overflow-hidden shadow-inner border border-slate-300 relative flex flex-col">
              <div className="bg-slate-800 text-white text-xs py-1 px-4 flex justify-between items-center">
                <span>Aperçu du document</span>
                <span>{file.name}</span>
              </div>
              <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                {file.type === 'application/pdf' ? (
                   <object data={filePreview!} type="application/pdf" className="w-full h-full min-h-[500px] rounded-lg">
                      <p>Votre navigateur ne peut pas afficher ce PDF.</p>
                   </object>
                ) : (
                  <img 
                    src={filePreview!} 
                    alt="Invoice Preview" 
                    className="max-w-full max-h-full object-contain shadow-lg" 
                  />
                )}
              </div>
            </div>

            {/* Right Column: Data Extraction Panel */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col p-6">
              
              {isProcessing ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="animate-spin mb-4 text-brand-500" size={48} />
                  <h3 className="text-lg font-medium text-slate-700">Analyse du document en cours...</h3>
                  <p className="text-sm">Notre IA extrait les données obligatoires.</p>
                </div>
              ) : error ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                   <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4">
                     <ArrowLeft size={32} className="rotate-45"/> 
                   </div>
                   <h3 className="text-lg font-bold text-red-800 mb-2">Erreur d'analyse</h3>
                   <p className="text-slate-600 mb-6">{error}</p>
                   <button onClick={reset} className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700">Réessayer</button>
                </div>
              ) : invoiceData ? (
                <DataPanel 
                  data={invoiceData} 
                  onChange={handleDataChange}
                  onConfirm={handleDownloadUBL}
                />
              ) : null}

            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
