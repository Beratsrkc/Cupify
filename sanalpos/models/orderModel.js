import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    items: [
        {
            name: String,
            price: Number,
            quantity: Number,
            kapak:String,
            baski:String,
            selectedQuantity:Number,
            size:String,
        }
    ],
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Sipariş Verildi'
    },
    payment: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const orderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default orderModel;
