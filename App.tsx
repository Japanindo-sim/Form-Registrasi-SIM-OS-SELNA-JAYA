import React, { useState, useEffect } from 'react';
import { InputField } from './components/InputField';
import { FileUpload } from './components/FileUpload';
import { DocumentGuideModal } from './components/DocumentGuideModal';
import { FormData, FormErrors, PACKAGES } from './types';

// IMPORT GAMBAR HEADER DI SINI
import headerImg from './assets/img/header.png';

// Replace with your actual Google Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzsJewvWkt7E4QhiKDI76tspoATnGzOlVki5HkQa4XMQUQNnzxmr6yoJkLpzAVZNjNTfA/exec';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    birthDate: '',
    whatsapp: '',
    email: '',
    tiktokUsername: '',
    socialPlatform: '',
    socialUsername: '',
    nik: '',
    address: '',
    departureDate: '',
    activationDate: '',
    companyName: '',
    trainingCenter: '',
    deviceModel: '',
    paymentMethod: '',
    selectedPackage: '',
    ktpFile: null,
    passportFile: null,
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [availablePackages, setAvailablePackages] = useState(PACKAGES);
  
  // State untuk Modal Panduan
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Filter packages based on payment method
  useEffect(() => {
    if (formData.paymentMethod === 'Dana Talangan OS SELNA JAYA') {
      setAvailablePackages(PACKAGES.filter(p => p.type === 'call'));
      if (formData.selectedPackage && !formData.selectedPackage.includes('Call Sim')) {
        setFormData(prev => ({ ...prev, selectedPackage: '' }));
      }
    } else {
      setAvailablePackages(PACKAGES);
    }
  }, [formData.paymentMethod, formData.selectedPackage]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName) newErrors.fullName = "Nama lengkap wajib diisi";
    if (!formData.birthDate) newErrors.birthDate = "Tanggal lahir wajib diisi";
    if (!formData.whatsapp) newErrors.whatsapp = "Nomor WhatsApp wajib diisi";
    if (!formData.email) newErrors.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Format email tidak valid";
    
    // Validasi field baru
    if (!formData.tiktokUsername) newErrors.tiktokUsername = "Username TikTok wajib diisi";
    if (!formData.socialPlatform) newErrors.socialPlatform = "Pilih salah satu platform media sosial";
    if (!formData.socialUsername) newErrors.socialUsername = "Username media sosial wajib diisi";

    if (!formData.nik) newErrors.nik = "NIK wajib diisi";
    else if (!/^\d{16}$/.test(formData.nik)) newErrors.nik = "NIK harus terdiri dari 16 digit angka";
    
    if (!formData.address) newErrors.address = "Alamat wajib diisi";
    if (!formData.departureDate) newErrors.departureDate = "Tanggal keberangkatan wajib diisi";
    if (!formData.activationDate) newErrors.activationDate = "Tanggal aktivasi wajib diisi";
    if (!formData.companyName) newErrors.companyName = "Nama perusahaan wajib diisi";
    if (!formData.trainingCenter) newErrors.trainingCenter = "Training center wajib diisi";
    if (!formData.deviceModel) newErrors.deviceModel = "Tipe HP wajib diisi";
    if (!formData.paymentMethod) newErrors.paymentMethod = "Metode pembayaran wajib dipilih";
    if (!formData.selectedPackage) newErrors.selectedPackage = "Paket wajib dipilih";
    if (!formData.ktpFile) newErrors.ktpFile = "Foto KTP wajib diupload";
    if (!formData.agreedToTerms) newErrors.agreedToTerms = "Anda harus menyetujui syarat & ketentuan";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'fullName' || name === 'companyName' ? value.toUpperCase() : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
        const firstError = document.querySelector('[class*="text-red-500"]');
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    setIsSubmitting(true);

    try {
      const payload: any = {
        'Nama Lengkap': formData.fullName,
        'Tanggal Lahir': formData.birthDate,
        'No WhatsApp': formData.whatsapp,
        'Email': formData.email,
        'Username TikTok': formData.tiktokUsername, 
        'Platform Sosmed': formData.socialPlatform, 
        'Username Sosmed': formData.socialUsername, 
        'NIK': formData.nik,
        'Alamat': formData.address,
        'Tanggal Keberangkatan': formData.departureDate,
        'Tanggal Aktivasi': formData.activationDate,
        'Nama Perusahaan': formData.companyName,
        'Training Center': formData.trainingCenter,
        'Merk HP': formData.deviceModel,
        'Biaya Belajar Melalui': formData.paymentMethod,
        'Pilihan Paket': formData.selectedPackage,
        'Persetujuan': 'Setuju',
        'Foto KTP': {},
        'Foto Paspor': {}
      };

      if (formData.ktpFile) {
        const base64 = await readFileAsBase64(formData.ktpFile);
        payload['Foto KTP'] = {
          fileName: formData.ktpFile.name,
          mimeType: formData.ktpFile.type,
          data: base64.split(',')[1]
        };
      }

      if (formData.passportFile) {
        const base64 = await readFileAsBase64(formData.passportFile);
        payload['Foto Paspor'] = {
          fileName: formData.passportFile.name,
          mimeType: formData.passportFile.type,
          data: base64.split(',')[1]
        };
      }

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setSubmitSuccess(true);
      window.scrollTo(0, 0);

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border-t-4 border-green-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-gray-600 mb-6">
            Terima kasih telah mendaftar. Data Anda telah kami terima dan sedang diproses oleh tim kami.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-brand-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-700 transition-colors"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      
      {/* GUIDE MODAL */}
      <DocumentGuideModal isOpen={showGuideModal} onClose={() => setShowGuideModal(false)} />

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* --- MODIFIKASI HEADER DIMULAI DARI SINI --- */}
        <div className="bg-brand-900 text-center relative overflow-hidden">
           
           {/* Bagian Gambar Header (Full Width) */}
           <div className="w-full relative z-20">
             <img 
                src={headerImg} 
                alt="Header Banner" 
                className="w-full h-auto object-cover"
             />
           </div>

    </div>
        {/* --- AKHIR MODIFIKASI HEADER --- */}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Section 1: Data Diri */}
          <section>
            <h3 className="text-lg font-bold text-brand-900 uppercase tracking-wide border-b border-gray-200 pb-2 mb-6 flex items-center">
              <span className="bg-brand-100 text-brand-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
              Informasi Pribadi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Nama Lengkap"
                name="fullName"
                placeholder="SESUAI KTP"
                value={formData.fullName}
                onChange={handleInputChange}
                error={errors.fullName}
                note="Gunakan HURUF KAPITAL"
                required
              />
              <InputField
                label="Tanggal Lahir"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleInputChange}
                error={errors.birthDate}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Email Aktif"
                name="email"
                type="email"
                placeholder="contoh@email.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                note="Untuk tagihan e-billing"
                required
              />
              <InputField
                label="Nomor WhatsApp"
                name="whatsapp"
                type="tel"
                placeholder="0812..."
                value={formData.whatsapp}
                onChange={handleInputChange}
                error={errors.whatsapp}
                required
              />
            </div>

            {/* NEW FIELDS: Social Media */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mt-2 mb-5">
                <h4 className="text-sm font-bold text-gray-700 mb-4">Akun Media Sosial</h4>
                
                <InputField
                  label="Username TikTok"
                  name="tiktokUsername"
                  placeholder="@username_tiktok"
                  value={formData.tiktokUsername}
                  onChange={handleInputChange}
                  error={errors.tiktokUsername}
                  required
                  className="bg-white"
                />

                <div className="mb-5">
                   <label className="block text-sm font-bold text-gray-700 mb-2">
                     Social Media Lain <span className="text-red-500">*</span>
                   </label>
                   <div className="flex space-x-4 mb-3">
                      <label className={`flex items-center p-3 border rounded-lg cursor-pointer flex-1 transition-all ${formData.socialPlatform === 'Instagram' ? 'border-brand-500 bg-white shadow-sm ring-1 ring-brand-500' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                        <input 
                          type="radio" 
                          name="socialPlatform" 
                          value="Instagram" 
                          checked={formData.socialPlatform === 'Instagram'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="ml-2 text-sm font-medium">Instagram</span>
                      </label>
                      <label className={`flex items-center p-3 border rounded-lg cursor-pointer flex-1 transition-all ${formData.socialPlatform === 'Facebook' ? 'border-brand-500 bg-white shadow-sm ring-1 ring-brand-500' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                        <input 
                          type="radio" 
                          name="socialPlatform" 
                          value="Facebook" 
                          checked={formData.socialPlatform === 'Facebook'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="ml-2 text-sm font-medium">Facebook</span>
                      </label>
                   </div>
                   {errors.socialPlatform && <p className="text-xs text-red-500 mt-1 mb-2 font-medium">{errors.socialPlatform}</p>}

                   <InputField
                      label={formData.socialPlatform ? `Username ${formData.socialPlatform}` : "Username Sosmed"}
                      name="socialUsername"
                      placeholder={formData.socialPlatform === 'Facebook' ? "Nama Profil Facebook" : "@username_instagram"}
                      value={formData.socialUsername}
                      onChange={handleInputChange}
                      error={errors.socialUsername}
                      disabled={!formData.socialPlatform}
                      required
                      className="bg-white"
                   />
                </div>
            </div>

            <InputField
                label="NIK (Nomor Induk Kependudukan)"
                name="nik"
                placeholder="16 digit angka sesuai KTP"
                value={formData.nik}
                onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setFormData({...formData, nik: val});
                    if (errors.nik) setErrors({...errors, nik: ''});
                }}
                maxLength={16}
                error={errors.nik}
                required
            />

            <InputField
                label="Alamat Lengkap (Indonesia)"
                name="address"
                isTextArea
                rows={3}
                placeholder="Nama Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kab"
                value={formData.address}
                onChange={handleInputChange}
                error={errors.address}
                required
            />
          </section>

          {/* Section 2: Pekerjaan */}
          <section>
            <h3 className="text-lg font-bold text-brand-900 uppercase tracking-wide border-b border-gray-200 pb-2 mb-6 flex items-center">
              <span className="bg-brand-100 text-brand-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
              Detail Keberangkatan
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputField
                    label="Nama Perusahaan (Program)"
                    name="companyName"
                    placeholder="Contoh: MITSUBISHI..."
                    value={formData.companyName}
                    onChange={handleInputChange}
                    error={errors.companyName}
                    note="Gunakan HURUF KAPITAL"
                    required
                />
                 <InputField
                    label="Training Center"
                    name="trainingCenter"
                    placeholder="Contoh: TC Cileungsi"
                    value={formData.trainingCenter}
                    onChange={handleInputChange}
                    error={errors.trainingCenter}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputField
                    label="Tanggal Keberangkatan"
                    name="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={handleInputChange}
                    error={errors.departureDate}
                    required
                />
                 <InputField
                    label="Tanggal Aktivasi SIM"
                    name="activationDate"
                    type="date"
                    value={formData.activationDate}
                    onChange={handleInputChange}
                    error={errors.activationDate}
                    note="Tanggal mulai kartu bisa digunakan"
                    required
                />
            </div>
          </section>

          {/* Section 3: Paket */}
          <section>
            <h3 className="text-lg font-bold text-brand-900 uppercase tracking-wide border-b border-gray-200 pb-2 mb-6 flex items-center">
              <span className="bg-brand-100 text-brand-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
              Pilihan Paket & Perangkat
            </h3>

            <InputField
                label="Merk & Tipe HP"
                name="deviceModel"
                placeholder="Contoh: Samsung A54, iPhone 11"
                value={formData.deviceModel}
                onChange={handleInputChange}
                error={errors.deviceModel}
                required
            />

            <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                    Metode Pembiayaan <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                    {['Dana Talangan OS SELNA JAYA', 'BUKAN Dana Talangan OS SELNA JAYA'].map((option) => (
                        <label key={option} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === option ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={option}
                                checked={formData.paymentMethod === option}
                                onChange={handleInputChange}
                                className="w-5 h-5 text-brand-600 border-gray-300 focus:ring-brand-500"
                            />
                            <span className="ml-3 font-medium text-gray-800">{option}</span>
                        </label>
                    ))}
                </div>
                {errors.paymentMethod && <p className="text-xs text-red-500 mt-1 font-medium">{errors.paymentMethod}</p>}
            </div>

            <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                    Pilihan Paket Bulanan <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">Harga ¥3300 (termasuk simcard + free kuota 2 bulan)</p>
                
                <div className="relative">
                    <select
                        name="selectedPackage"
                        value={formData.selectedPackage}
                        onChange={handleInputChange}
                        disabled={!formData.paymentMethod}
                        className={`w-full px-4 py-3 rounded-lg border appearance-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none ${errors.selectedPackage ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
                    >
                        <option value="">-- Pilih Paket --</option>
                        {availablePackages.map((pkg) => (
                            <option key={pkg.value} value={pkg.value}>{pkg.text}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
                {!formData.paymentMethod && (
                    <p className="text-xs text-orange-500 mt-2 italic">Pilih metode pembayaran terlebih dahulu untuk melihat paket.</p>
                )}
                {errors.selectedPackage && <p className="text-xs text-red-500 mt-1 font-medium">{errors.selectedPackage}</p>}
            </div>
          </section>

          {/* Section 4: Dokumen */}
          <section>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-6">
                 <h3 className="text-lg font-bold text-brand-900 uppercase tracking-wide flex items-center">
                    <span className="bg-brand-100 text-brand-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
                    Upload Dokumen
                </h3>
            </div>
            
            {/* Warning Trigger Button */}
            <div className="mb-6">
                <button 
                  type="button" 
                  onClick={() => setShowGuideModal(true)}
                  className="w-full bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-amber-100 transition-colors shadow-sm group"
                >
                    <div className="bg-amber-100 p-2 rounded-full group-hover:bg-white transition-colors">
                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <span className="block font-bold">PENTING: Lihat Contoh Foto Dokumen</span>
                        <span className="text-xs">Klik di sini untuk melihat panduan foto yang Benar vs Salah</span>
                    </div>
                    <svg className="w-5 h-5 ml-auto text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload
                    label="Foto KTP"
                    fileName={formData.ktpFile?.name}
                    onChange={(file) => {
                        setFormData({...formData, ktpFile: file});
                        if(file && errors.ktpFile) setErrors({...errors, ktpFile: ''});
                    }}
                    error={errors.ktpFile}
                    note="Foto jelas, tidak blur, tidak terpotong"
                    accept="image/*"
                    required
                />
                <FileUpload
                    label="Foto Paspor (Opsional)"
                    fileName={formData.passportFile?.name}
                    onChange={(file) => setFormData({...formData, passportFile: file})}
                    note="Jika sudah memiliki paspor"
                    accept="image/*"
                />
            </div>
          </section>

          {/* Terms */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
             <label className="flex items-start cursor-pointer">
                 <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) => {
                        setFormData({...formData, agreedToTerms: e.target.checked});
                        if(e.target.checked && errors.agreedToTerms) setErrors({...errors, agreedToTerms: ''});
                    }}
                    className="mt-1 w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                 />
                 <span className="ml-3 text-sm text-gray-700">
                    Saya menyatakan bahwa seluruh data yang saya isi adalah benar, valid, dan saya menyetujui syarat & ketentuan yang berlaku di JP-SMART OS SELNA JAYA.
                 </span>
             </label>
             {errors.agreedToTerms && <p className="text-xs text-red-500 mt-2 ml-8 font-medium">{errors.agreedToTerms}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all duration-200 
                ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 hover:-translate-y-1 hover:shadow-xl'}`}
          >
            {isSubmitting ? (
                <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses Data...
                </span>
            ) : "Kirim Pendaftaran"}
          </button>
        </form>
      </div>
      
      <div className="text-center mt-6 text-gray-400 text-xs">
         &copy; {new Date().getFullYear()} JP-SMART OS SELNA JAYA Registration.
      </div>
    </div>
  );
};

export default App;