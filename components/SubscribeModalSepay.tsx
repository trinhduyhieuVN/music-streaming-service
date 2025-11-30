"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { FiCheck, FiCopy, FiClock, FiRefreshCw } from 'react-icons/fi';
import { BsBank, BsQrCode } from 'react-icons/bs';

import useSubscribeModal from '@/hooks/useSubscribeModal';
import { useUser } from '@/hooks/useUser';
import { PREMIUM_PLANS, BANK_CONFIG, generateVietQRUrl, formatVND, TRANSACTION_EXPIRY_MINUTES } from '@/constants/sepay';

import Modal from './Modal';
import Button from './Button';

type PaymentStep = 'select-plan' | 'payment' | 'checking' | 'success';

interface PaymentData {
  id: string;
  transactionCode: string;
  amount: number;
  planName: string;
  expiresAt: string;
}

const SubscribeModal = () => {
  const subscribeModal = useSubscribeModal();
  const { user, subscription } = useUser();

  const [step, setStep] = useState<PaymentStep>('select-plan');
  const [selectedPlan, setSelectedPlan] = useState<typeof PREMIUM_PLANS[number] | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [copied, setCopied] = useState(false);

  // Reset state when modal closes
  const onChange = (open: boolean) => {
    if (!open) {
      setStep('select-plan');
      setSelectedPlan(null);
      setPaymentData(null);
      subscribeModal.onClose();
    }
  };

  // Countdown timer
  useEffect(() => {
    if (!paymentData?.expiresAt || step !== 'payment') return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(paymentData.expiresAt).getTime();
      const diff = Math.max(0, Math.floor((expires - now) / 1000));
      setTimeLeft(diff);

      if (diff === 0) {
        toast.error('Đã hết thời gian thanh toán');
        setStep('select-plan');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [paymentData, step]);

  // Check payment status
  const checkPaymentStatus = useCallback(async () => {
    if (!paymentData) return;

    try {
      const res = await fetch(`/api/sepay/check-status?paymentId=${paymentData.id}`);
      const data = await res.json();

      if (data.payment?.status === 'completed') {
        setStep('success');
        toast.success('Thanh toán thành công! 🎉');
        // Refresh page sau 3s
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if (data.payment?.status === 'expired') {
        toast.error('Đã hết thời gian thanh toán');
        setStep('select-plan');
      }
    } catch (error) {
      console.error('Check status error:', error);
    }
  }, [paymentData]);

  // Auto check payment status every 5 seconds
  useEffect(() => {
    if (step !== 'payment' || !paymentData) return;

    const interval = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(interval);
  }, [step, paymentData, checkPaymentStatus]);

  // Handle plan selection
  const handleSelectPlan = async (plan: typeof PREMIUM_PLANS[number]) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập');
      return;
    }

    setIsLoading(true);
    setSelectedPlan(plan);

    try {
      const res = await fetch('/api/sepay/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id }),
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setPaymentData(data.payment);
      setStep('payment');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`Đã sao chép ${label}`);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render plan selection
  const renderPlanSelection = () => (
    <div className="space-y-4">
      <p className="text-neutral-400 text-center mb-6">
        Chọn gói Premium phù hợp với bạn
      </p>
      
      {PREMIUM_PLANS.map((plan) => (
        <div
          key={plan.id}
          className={`
            relative p-4 rounded-lg border-2 cursor-pointer transition-all
            ${'popular' in plan && plan.popular
              ? 'border-green-500 bg-green-500/10' 
              : 'border-neutral-700 hover:border-neutral-500'
            }
          `}
          onClick={() => handleSelectPlan(plan)}
        >
          {'popular' in plan && plan.popular && (
            <span className="absolute -top-3 left-4 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded">
              PHỔ BIẾN
            </span>
          )}
          
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-white font-semibold text-lg">{plan.name}</h3>
              <p className="text-neutral-400 text-sm mt-1">{plan.description}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-xl">{plan.priceFormatted}</p>
              <p className="text-neutral-400 text-sm">/{plan.interval === 'month' ? 'tháng' : 'năm'}</p>
              {'saveText' in plan && (
                <p className="text-green-400 text-xs mt-1">{plan.saveText}</p>
              )}
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-neutral-300">
                <FiCheck className="text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  // Render payment QR
  const renderPayment = () => {
    if (!paymentData || !selectedPlan) return null;

    const qrUrl = generateVietQRUrl(
      paymentData.amount,
      paymentData.transactionCode,
      paymentData.transactionCode
    );

    return (
      <div className="space-y-4">
        {/* Timer */}
        <div className="flex items-center justify-center gap-2 text-yellow-400">
          <FiClock />
          <span>Còn lại: {formatTime(timeLeft)}</span>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg">
            <Image
              src={qrUrl}
              alt="QR Code thanh toán"
              width={200}
              height={200}
              className="rounded"
            />
          </div>
        </div>

        {/* Bank info */}
        <div className="bg-neutral-800 rounded-lg p-4 space-y-3">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <BsBank /> Thông tin chuyển khoản
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Ngân hàng</span>
              <span className="text-white font-medium">{BANK_CONFIG.bankName}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Số tài khoản</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{BANK_CONFIG.accountNumber}</span>
                <button
                  onClick={() => copyToClipboard(BANK_CONFIG.accountNumber, 'số tài khoản')}
                  className="text-green-400 hover:text-green-300"
                >
                  <FiCopy />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Số tiền</span>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">{formatVND(paymentData.amount)}</span>
                <button
                  onClick={() => copyToClipboard(paymentData.amount.toString(), 'số tiền')}
                  className="text-green-400 hover:text-green-300"
                >
                  <FiCopy />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Nội dung CK</span>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 font-mono text-sm">{paymentData.transactionCode}</span>
                <button
                  onClick={() => copyToClipboard(paymentData.transactionCode, 'nội dung')}
                  className="text-green-400 hover:text-green-300"
                >
                  <FiCopy />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <p className="text-orange-400 text-sm text-center">
          ⚠️ Vui lòng nhập đúng nội dung chuyển khoản để được kích hoạt tự động
        </p>

        {/* Check status button */}
        <Button
          onClick={checkPaymentStatus}
          className="w-full flex items-center justify-center gap-2"
        >
          <FiRefreshCw /> Kiểm tra thanh toán
        </Button>

        {/* Back button */}
        <button
          onClick={() => setStep('select-plan')}
          className="w-full text-neutral-400 hover:text-white text-sm"
        >
          ← Chọn gói khác
        </button>
      </div>
    );
  };

  // Render success
  const renderSuccess = () => (
    <div className="text-center space-y-4">
      <div className="text-6xl">🎉</div>
      <h3 className="text-white text-xl font-bold">Thanh toán thành công!</h3>
      <p className="text-neutral-400">
        Bạn đã nâng cấp lên {selectedPlan?.name}. Hãy tận hưởng âm nhạc không giới hạn!
      </p>
      <p className="text-sm text-neutral-500">Trang sẽ tự động làm mới...</p>
    </div>
  );

  // Check if already subscribed
  if (subscription) {
    return (
      <Modal
        title="Spotify Premium"
        description="Bạn đã là thành viên Premium"
        isOpen={subscribeModal.isOpen}
        onChange={onChange}
      >
        <div className="text-center space-y-4">
          <div className="text-4xl">👑</div>
          <p className="text-neutral-400">
            Cảm ơn bạn đã đăng ký Premium!
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={step === 'success' ? '✨ Thành công!' : '🎵 Nâng cấp Premium'}
      description={
        step === 'select-plan' 
          ? 'Nghe nhạc không giới hạn, không quảng cáo' 
          : step === 'payment'
          ? 'Quét mã QR hoặc chuyển khoản theo thông tin bên dưới'
          : ''
      }
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          {step === 'select-plan' && renderPlanSelection()}
          {step === 'payment' && renderPayment()}
          {step === 'success' && renderSuccess()}
        </>
      )}
    </Modal>
  );
};

export default SubscribeModal;
