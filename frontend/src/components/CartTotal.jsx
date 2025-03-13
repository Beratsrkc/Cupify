import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = ({
  total = 0,
  subtotal = 0,
  vatAmount = 0,
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
          <p>Ara Toplam</p>
          <p>{currency}{subtotal}</p>
        </div>
        <div className="flex justify-between">
          <p>KDV (%20)</p>
          <p>{currency}{vatAmount}</p>
        </div>
        <hr />
        <div className="flex justify-between lg:flex ">
          <b>Toplam</b>
          <b>{currency}{total}</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;