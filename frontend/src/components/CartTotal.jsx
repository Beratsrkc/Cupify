import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
const CartTotal = ({
  total = 0,
  subtotalExcludingVAT,
  vatAmount,
  kdvDahil
}) => {
  const { currency } = useContext(ShopContext);

  return (
    <div className="w-full">
      <div className="text-2xl mb-3">
        <Title text1={'TOPLAM'} text2={'FİYAT'} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <hr />
        <div className="flex justify-between">
          <p>Ara Toplam (KDV Hariç)</p>
          <p>{currency}{subtotalExcludingVAT.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>KDV (%20)</p>
          <p>{currency}{vatAmount.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>KDV Dahil</p>
          <p>{currency}{kdvDahil.toFixed(2)}</p>
        </div>
        <hr />
        <div className="flex justify-between lg:flex ">
          <b>Toplam</b>
          <b>{currency}{total.toFixed(2)}</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;