import React from 'react';
import contohBenar from '../assets/img/contoh.jpg';

interface DocumentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentGuideModal: React.FC<DocumentGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900 bg-opacity-75 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all scale-100">
        
        {/* Header Warning */}
        <div className="bg-amber-500 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center">
            <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            PANDUAN UPLOAD DOKUMEN
          </h3>
          <button 
            onClick={onClose} 
            className="text-white hover:text-amber-100 transition-colors p-1 rounded-full hover:bg-amber-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <p className="text-gray-600 mb-6 text-center text-sm md:text-base">
            Mohon perhatikan panduan berikut agar verifikasi data Anda <strong>tidak ditolak</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* --- PERUBAHAN DI SINI: Kolom BENAR yang sudah dibersihkan --- */}
            <div className="flex flex-col">
              {/* Style Improvement: 
                1. Menambahkan 'shadow-md' agar sedikit lebih menonjol.
                2. Mengubah 'bg-emerald-50' menjadi sedikit lebih terang.
              */}
              <div className="bg-emerald-50/50 border-2 border-emerald-500 rounded-xl aspect-[4/3] mb-3 relative overflow-hidden shadow-md flex items-center justify-center p-1">

                {/* Gambar Contoh Benar - Bersih tanpa overlay */}
                <img 
                  src={contohBenar}
                  alt="Contoh Benar Dokumen"
                  // Menggunakan object-contain agar seluruh KTP terlihat utuh dalam kotak
                  className="w-full h-full object-contain rounded-lg"
                />
                
                {/* SEMUA OVERLAY TEKS DAN ICONS TELAH DIHAPUS DARI SINI */}

              </div>

              {/* Keterangan di bawah gambar diperjelas */}
              <p className="text-sm text-center text-emerald-700 font-semibold mb-1">
                ✓ CONTOH BENAR
              </p>
              <p className="text-xs text-center text-gray-500">
                Foto penuh, jelas, terbaca, dan tidak terpotong.
              </p>
            </div>
             {/* --- AKHIR PERUBAHAN --- */}


            {/* Kolom SALAH */}
            <div className="flex flex-col space-y-3">

              {/* Salah 1: Blur */}
              <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-r-lg flex items-center relative shadow-sm">
                <div className="flex-shrink-0 mr-3 opacity-50">
                  <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-rose-700 font-bold text-sm block">JANGAN BLUR / BURAM</span>
                  <span className="text-xs text-rose-600">Teks tidak bisa dibaca.</span>
                </div>
                <div className="absolute top-2 right-2 text-rose-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>

              {/* Salah 2: Terpotong */}
              <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-r-lg flex items-center relative shadow-sm">
                <div className="flex-shrink-0 mr-3 opacity-50">
                  <div className="w-8 h-6 border-2 border-dashed border-rose-400 rounded-sm"></div>
                </div>
                <div>
                  <span className="text-rose-700 font-bold text-sm block">JANGAN TERPOTONG</span>
                  <span className="text-xs text-rose-600">Ada bagian KTP yang hilang.</span>
                </div>
                <div className="absolute top-2 right-2 text-rose-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>

              {/* Salah 3: Pantulan Cahaya */}
              <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-r-lg flex items-center relative shadow-sm">
                <div className="flex-shrink-0 mr-3 opacity-50">
                  <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                </div>
                <div>
                  <span className="text-rose-700 font-bold text-sm block">HINDARI PANTULAN CAHAYA</span>
                  <span className="text-xs text-rose-600">Flash menutupi data penting.</span>
                </div>
                <div className="absolute top-2 right-2 text-rose-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700 flex items-start">
            <svg className="w-5 h-5 text-slate-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              <strong>Tips:</strong> Letakkan KTP/Paspor di atas meja dengan latar belakang polos (bukan di tangan), lalu foto tegak lurus dari atas dengan pencahayaan yang terang.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
          <button 
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-8 rounded-xl shadow-lg transform active:scale-95 transition-all"
          >
            Saya Mengerti
          </button>
        </div>

      </div>
    </div>
  );
};