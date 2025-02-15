import React, { useState } from 'react';

const EditDeliveryInfoDialog = ({ isOpen, onClose, userDetails, onSave }) => {
    const [formData, setFormData] = useState({
        addressInput: userDetails.addressInput,
        city: userDetails.city,
        district: userDetails.district,
        phone: userDetails.phone,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Teslimat Bilgilerini Düzenle</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            placeholder="Adres"
                            type="text"
                            name="addressInput"
                            value={formData.addressInput}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            placeholder="Şehir"
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            placeholder="İlçe"
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            placeholder="Telefon"
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded"
                        >
                            Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDeliveryInfoDialog; 