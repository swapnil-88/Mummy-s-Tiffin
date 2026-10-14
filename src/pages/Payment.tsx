import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, QrCode, CreditCard, Banknote, ShieldCheck, Lock, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, addOrder, user, openTrackingModal } = useAppStore();

  const navState = location.state || {};
  const deliveryAddress = navState.deliveryAddress || user?.address || 'Hostel No. 4, MSU Fatehgunj';
  const area = navState.selectedArea || user?.area || 'Fatehgunj';
  const hasSubscription =
    navState.hasSubscription ?? cart.some((i) => i.planType === 'weekly' || i.isSubscription);
  const subtotal = navState.subtotal || cart.reduce((s, i) => s + i.itemPrice * i.quantity, 0);
  const deliveryFee = navState.deliveryFee ?? (hasSubscription ? 0 : 15);
  const packagingFee = navState.packagingFee ?? (hasSubscription ? 0 : 5);
  const discountAmount = navState.discountAmount || 0;
  const totalAmount =
    navState.totalAmount || Math.max(0, subtotal + deliveryFee + packagingFee - discountAmount);

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card'>('upi');
  const [upiApp, setUpiApp] = useState('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate 1.8 second payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const motherId = cart[0]?.motherId || 'mother-1';
      const motherName = cart[0]?.motherName || 'Lina Patel';

      const createdOrder = addOrder({
        userId: user?.id || 'user-demo-1',
        userName: user?.name || 'Karan Mehta',
        userPhone: user?.phone || '+91 98765 43210',
        motherId,
        motherName,
        items: [...cart],
        totalAmount,
        deliveryAddress,
        area,
        deliveryDate: cart[0]?.deliveryDate || new Date().toISOString().split('T')[0],
        timeSlot: cart[0]?.deliveryTimeSlot || '12:30 PM - 1:30 PM',
        paymentMethod: paymentMethod === 'upi' ? `UPI (${upiApp.toUpperCase()})` : paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card',
      });

      // Redirect after 1.2s to history and open live tracking
      setTimeout(() => {
        navigate('/history');
        openTrackingModal(createdOrder);
      }, 1200);
    }, 1800);
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="font-rozha text-3xl text-[#2C1810]">Payment Successful!</h2>
          <p className="text-xs text-[#8C6B53]">
            Your order has been sent to the Mother Kitchen. Redirecting to live tracking...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <button
        onClick={() => navigate('/cart')}
        className="flex items-center gap-1.5 text-xs font-bold text-[#8C6B53] hover:text-[#2C1810]"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Basket
      </button>

      <div className="text-center space-y-1">
        <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">
          Secure Vadodara Payment Gateway
        </span>
        <h1 className="font-rozha text-3xl text-[#2C1810]">
          Pay ₹{totalAmount} for Homestyle Tiffin
        </h1>
        <p className="text-xs text-[#8C6B53]">
          Delivering to <strong className="text-[#2C1810]">{deliveryAddress}</strong> ({area})
        </p>
      </div>

      {/* Transparent Fee & Subscription Summary Bar */}
      <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E5C3A6] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold text-lg">
            🍱
          </div>
          <div>
            <span className="font-bold text-[#2C1810] block">
              {cart.length} item{cart.length > 1 ? 's' : ''} from {cart[0]?.motherName || "Mother's Kitchen"}
            </span>
            <div className="flex items-center gap-2 text-[11px] text-[#8C6B53]">
              <span>Subtotal: ₹{subtotal}</span>
              <span>•</span>
              <span className={deliveryFee === 0 ? 'text-emerald-700 font-bold' : ''}>
                Delivery: {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
              <span>•</span>
              <span className={packagingFee === 0 ? 'text-emerald-700 font-bold' : ''}>
                Packaging: {packagingFee === 0 ? 'FREE' : `₹${packagingFee}`}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-[#8C6B53] block uppercase font-bold">Total Amount</span>
          <span className="font-rozha text-2xl text-[#D97706]">₹{totalAmount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payment Methods Sidebar */}
        <div className="space-y-2">
          <button
            onClick={() => setPaymentMethod('upi')}
            className={`w-full p-4 rounded-2xl border text-left text-xs font-bold flex items-center gap-3 transition-all ${
              paymentMethod === 'upi'
                ? 'bg-[#2C1810] text-amber-200 border-[#2C1810] shadow-md'
                : 'bg-[#FFFDF9] text-[#2C1810] border-[#E5C3A6]'
            }`}
          >
            <QrCode className="w-5 h-5 text-[#D97706]" />
            <div>
              <span>UPI Instant Pay</span>
              <span className="block text-[10px] opacity-75 font-normal">GPay / PhonePe / Paytm</span>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod('cod')}
            className={`w-full p-4 rounded-2xl border text-left text-xs font-bold flex items-center gap-3 transition-all ${
              paymentMethod === 'cod'
                ? 'bg-[#2C1810] text-amber-200 border-[#2C1810] shadow-md'
                : 'bg-[#FFFDF9] text-[#2C1810] border-[#E5C3A6]'
            }`}
          >
            <Banknote className="w-5 h-5 text-[#D97706]" />
            <div>
              <span>Cash on Delivery (COD)</span>
              <span className="block text-[10px] opacity-75 font-normal">Pay cash upon delivery</span>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod('card')}
            className={`w-full p-4 rounded-2xl border text-left text-xs font-bold flex items-center gap-3 transition-all ${
              paymentMethod === 'card'
                ? 'bg-[#2C1810] text-amber-200 border-[#2C1810] shadow-md'
                : 'bg-[#FFFDF9] text-[#2C1810] border-[#E5C3A6]'
            }`}
          >
            <CreditCard className="w-5 h-5 text-[#D97706]" />
            <div>
              <span>Debit / Credit Card</span>
              <span className="block text-[10px] opacity-75 font-normal">Visa / MasterCard / RuPay</span>
            </div>
          </button>
        </div>

        {/* Payment Method Details */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-[#FFFDF9] border border-[#E5C3A6] shadow-md space-y-6">
          {paymentMethod === 'upi' && (
            <div className="space-y-4">
              <h3 className="font-rozha text-lg text-[#2C1810]">Select Your UPI App</h3>
              <div className="grid grid-cols-3 gap-3">
                {['gpay', 'phonepe', 'paytm'].map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setUpiApp(app)}
                    className={`p-3 rounded-2xl border text-xs font-bold uppercase transition-all ${
                      upiApp === app
                        ? 'bg-[#D97706] text-white border-[#D97706] shadow-sm'
                        : 'bg-[#FBF6EE] text-[#2C1810] border-[#E5C3A6]'
                    }`}
                  >
                    {app}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#FBF6EE] border border-[#E5C3A6] text-center space-y-2">
                <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl border border-[#E5C3A6] flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-[#2C1810]" />
                </div>
                <p className="text-[11px] text-[#8C6B53]">
                  Scan QR with any UPI App or click "Pay ₹{totalAmount}" to open app
                </p>
              </div>
            </div>
          )}

          {paymentMethod === 'cod' && (
            <div className="p-4 rounded-2xl bg-[#FBF6EE] border border-[#E5C3A6] space-y-2 text-xs">
              <h3 className="font-bold text-[#2C1810] text-sm">Cash on Delivery Notice</h3>
              <p className="text-[#6B3A19]">
                Please keep exact change of <strong>₹{totalAmount}</strong> ready at time of delivery at{' '}
                <span className="font-bold text-[#2C1810]">{deliveryAddress}</span> ({area}, Vadodara).
              </p>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="4111 2222 3333 4444"
                  className="w-full px-3 py-2 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    className="w-full px-3 py-2 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-1">CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    className="w-full px-3 py-2 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handlePayNow}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] hover:to-[#C05621] text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Order with Mother Kitchen...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ₹{totalAmount} & Confirm Order</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-[#8C6B53] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            256-bit Encrypted Transaction • Mummy's Tiffin Vadodara
          </p>
        </div>
      </div>
    </div>
  );
};
