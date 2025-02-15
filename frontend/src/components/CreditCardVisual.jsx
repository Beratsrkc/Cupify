import React from 'react';

const CreditCardVisual = ({ cardNumber, holderName, expireMonth, expireYear, cvc, cvcFocused }) => {
    return (
        <div className="credit-card bg-gradient-to-r from-blue-500 to-blue-900 text-white p-6 rounded-lg shadow-lg w-full">
            <div className="flex justify-between items-center mb-6">
                <div className="text-xl font-semibold">Kredi Kartı</div>

            </div>
            <div className="mb-6">
                <div className="text-sm text-gray-300">Kart Numarası</div>
                <div className="text-xl font-mono tracking-wider">
                    {cardNumber || '**** **** **** ****'}
                </div>
            </div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="text-sm text-gray-300">Kart Sahibi</div>
                    <div className="text-lg font-semibold">
                        {holderName || 'KART SAHİBİ'}
                    </div>
                </div>
                <div>
                
                </div>
              
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <div className="text-sm text-gray-300">CVC</div>
                    <div className="text-lg font-semibold">
                        {cvcFocused ? cvc : '***'}
                    </div>
                </div>
                <div>
                    <div className="text-sm text-gray-300">Son Kullanma Tarihi</div>
                    <div className="text-lg font-semibold">
                        {expireMonth || 'AA'}/{expireYear || 'YY'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditCardVisual;