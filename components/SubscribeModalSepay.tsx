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
        toast.error('Payment time has expired');
        setStep('select-plan');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [paymentData, step]);

  // Check payment status
  const checkPaymentStatus = useCallback(async (showPendingMessage = false) => {
    if (!paymentData) return;

    try {
      // Nếu người dùng click button, gọi verify-payment API để kiểm tra trực tiếp từ SePay
      if (showPendingMessage) {
        const verifyRes = await fetch('/api/sepay/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId: paymentData.id })
        });
        const verifyData = await verifyRes.json();

        if (verifyData.status === 'completed') {
          setStep('success');
          toast.success('Payment successful! 🎉');
          setTimeout(() => {
            window.location.reload();
          }, 3000);
          return;
        } else if (verifyData.status === 'expired') {
          toast.error('Payment time has expired');
          setStep('select-plan');
          return;
        } else {
          toast.error('Payment not successful. Please transfer the correct amount and content.');
          return;
        }
      }

      // Auto-check: chỉ kiểm tra status trong database
      const res = await fetch(`/api/sepay/check-status?paymentId=${paymentData.id}`);
      const data = await res.json();

      if (data.payment?.status === 'completed') {
        setStep('success');
        toast.success('Payment successful! 🎉');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if (data.payment?.status === 'expired') {
        toast.error('Đã hết thời gian thanh toán');
        setStep('select-plan');
      }
    } catch (error) {
      console.error('Check status error:', error);
      if (showPendingMessage) {
        toast.error('Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại.');
      }
    }
  }, [paymentData]);

  // Auto check payment status every 5 seconds (không hiển thị thông báo pending)
  useEffect(() => {
    if (step !== 'payment' || !paymentData) return;

    const interval = setInterval(() => checkPaymentStatus(false), 5000);
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
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`Copied ${label}`);
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
        Choose the Premium plan that suits you
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
              POPULAR
            </span>
          )}
          
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-white font-semibold text-lg">{plan.name}</h3>
              <p className="text-neutral-400 text-sm mt-1">{plan.description}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-xl">{plan.priceFormatted}</p>
              <p className="text-neutral-400 text-sm">/{plan.interval === 'month' ? 'month' : 'year'}</p>
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
      <div className="space-y-3">
        {/* Timer - moved to top and more prominent */}
        <div className="flex items-center justify-center gap-2 text-yellow-400 bg-yellow-400/10 py-2 px-3 rounded-lg">
          <FiClock className="text-lg" />
          <span className="font-semibold">Time remaining: {formatTime(timeLeft)}</span>
        </div>

        {/* QR Code - smaller */}
        <div className="flex justify-center">
          <div className="bg-white p-3 rounded-lg">
            <Image
              src={qrUrl}
              alt="Payment QR Code"
              width={180}
              height={180}
              className="rounded"
            />
          </div>
        </div>

        {/* Bank info */}
        <div className="bg-neutral-800 rounded-lg p-3 space-y-2">
          <h4 className="text-white font-semibold flex items-center gap-2 text-sm">
            <BsBank /> Bank Transfer Information
          </h4>
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Bank</span>
              <span className="text-white font-medium">{BANK_CONFIG.bankName}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Account Number</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{BANK_CONFIG.accountNumber}</span>
                <button
                  onClick={() => copyToClipboard(BANK_CONFIG.accountNumber, 'account number')}
                  className="text-green-400 hover:text-green-300"
                >
                  <FiCopy />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Amount</span>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">{formatVND(paymentData.amount)}</span>
                <button
                  onClick={() => copyToClipboard(paymentData.amount.toString(), 'amount')}
                  className="text-green-400 hover:text-green-300"
                >
                  <FiCopy />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center bg-yellow-400/10 -mx-3 px-3 py-2">
              <span className="text-yellow-400 font-medium text-sm">Transfer Content</span>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 font-mono font-bold">{paymentData.transactionCode}</span>
                <button
                  onClick={() => copyToClipboard(paymentData.transactionCode, 'content')}
                  className="text-yellow-300 hover:text-yellow-200"
                >
                  <FiCopy />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Warning - more compact */}
        <p className="text-orange-400 text-xs text-center">
          ⚠️ Enter the correct transfer content for automatic activation
        </p>

        {/* Check status button */}
        <Button
          onClick={() => checkPaymentStatus(true)}
          className="w-full flex items-center justify-center gap-2"
        >
          <FiRefreshCw /> Check Payment Status
        </Button>

        {/* Back button */}
        <button
          onClick={() => setStep('select-plan')}
          className="w-full text-neutral-400 hover:text-white text-sm"
        >
          ← Choose another plan
        </button>
      </div>
    );
  };

  // Render success
  const renderSuccess = () => (
    <div className="text-center space-y-4">
      <div className="text-6xl">🎉</div>
      <h3 className="text-white text-xl font-bold">Payment Successful!</h3>
      <p className="text-neutral-400">
        You have upgraded to {selectedPlan?.name}. Enjoy unlimited music!
      </p>
      <p className="text-sm text-neutral-500">Page will automatically refresh...</p>
    </div>
  );

  // Check if already subscribed
  if (subscription) {
    return (
      <Modal
        title="Spotify Premium"
        description="You are already a Premium member"
        isOpen={subscribeModal.isOpen}
        onChange={onChange}
      >
        <div className="text-center space-y-4">
          <div className="text-4xl">👑</div>
          <p className="text-neutral-400">
            Thank you for subscribing to Premium!
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={step === 'success' ? '✨ Success!' : '🎵 Upgrade Premium'}
      description={
        step === 'select-plan' 
          ? 'Unlimited music, ad-free listening' 
          : step === 'payment'
          ? 'Scan QR code or transfer according to the information below'
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
