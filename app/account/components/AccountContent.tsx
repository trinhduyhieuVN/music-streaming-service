"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FiFileText, FiCheck, FiClock, FiX, FiDownload } from "react-icons/fi";
import { RiVipCrownFill } from "react-icons/ri";

import { useUser } from "@/hooks/useUser";
import Button from "@/components/Button";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { postData } from "@/libs/helpers";
import { Song } from "@/types";
import MySongsContent from "./MySongsContent";
import PremiumBadge from "@/components/PremiumBadge";

interface Payment {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'expired';
  transaction_code: string;
  sepay_transaction_id?: string;
  sepay_reference_code?: string;
  paid_amount?: number;
  paid_at?: string;
  expires_at: string;
  created_at: string;
  note?: string;
}

interface AccountContentProps {
  songs?: Song[];
}

const AccountContent: React.FC<AccountContentProps> = ({ songs = [] }) => {
  const router = useRouter();
  const subscribeModal = useSubscribeModal();
  const { isLoading, subscription, user } = useUser();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'subscription' | 'invoices' | 'my-songs'>('subscription');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  // Fetch payment history when invoices tab is active
  useEffect(() => {
    if (activeTab === 'invoices' && user) {
      fetchPaymentHistory();
    }
  }, [activeTab, user]);

  const fetchPaymentHistory = async () => {
    setLoadingPayments(true);
    try {
      const res = await fetch('/api/payments/history');
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
    }
    setLoadingPayments(false);
  };

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link'
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status: Payment['status']) => {
    const badges = {
      completed: { icon: FiCheck, text: 'Thành công', color: 'bg-green-500/20 text-green-400' },
      pending: { icon: FiClock, text: 'Chờ thanh toán', color: 'bg-yellow-500/20 text-yellow-400' },
      failed: { icon: FiX, text: 'Thất bại', color: 'bg-red-500/20 text-red-400' },
      cancelled: { icon: FiX, text: 'Đã hủy', color: 'bg-neutral-500/20 text-neutral-400' },
      expired: { icon: FiClock, text: 'Hết hạn', color: 'bg-orange-500/20 text-orange-400' }
    };
    const badge = badges[status];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  const getPlanName = (planId: string) => {
    return planId === 'yearly' ? 'Premium Yearly' : 'Premium Monthly';
  };

  // Invoice Modal
  const InvoiceModal = ({ payment, onClose }: { payment: Payment; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-xl max-w-md w-full p-6 relative border border-neutral-700">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <FiFileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">Payment Invoice</h2>
          <p className="text-neutral-400 text-sm mt-1">#{payment.transaction_code}</p>
        </div>

        {/* Invoice Details */}
        <div className="space-y-4 bg-neutral-800 rounded-lg p-4">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-700">
            <span className="text-neutral-400">Status</span>
            {getStatusBadge(payment.status)}
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-400">Service Plan</span>
            <span className="text-white font-medium flex items-center gap-2">
              {getPlanName(payment.plan_id)}
              <PremiumBadge planId={payment.plan_id} size="sm" />
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-400">Amount</span>
            <span className="text-green-400 font-bold">{formatCurrency(payment.amount)}</span>
          </div>

          {payment.paid_amount && (
            <div className="flex justify-between">
              <span className="text-neutral-400">Paid Amount</span>
              <span className="text-white">{formatCurrency(payment.paid_amount)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-neutral-400">Created Date</span>
            <span className="text-white">
              {format(new Date(payment.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
            </span>
          </div>

          {payment.paid_at && (
            <div className="flex justify-between">
              <span className="text-neutral-400">Payment Date</span>
              <span className="text-white">
                {format(new Date(payment.paid_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
              </span>
            </div>
          )}

          {payment.sepay_reference_code && (
            <div className="flex justify-between">
              <span className="text-neutral-400">Reference Code</span>
              <span className="text-white font-mono text-sm">{payment.sepay_reference_code}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-neutral-500 text-xs">
          <p>Spotify Premium - Music Streaming Service</p>
          <p>Thank you for using our service!</p>
        </div>
      </div>
    </div>
  );

  return ( 
    <div className="mb-7 px-6">
      {/* Tabs */}
      <div className="flex items-center gap-x-4 mb-6">
        <button
          onClick={() => setActiveTab('subscription')}
          className={`
            px-4 
            py-2 
            rounded-full 
            text-sm 
            font-medium
            transition
            ${activeTab === 'subscription' 
              ? 'bg-white text-black' 
              : 'bg-neutral-700 text-white hover:bg-neutral-600'
            }
          `}
        >
          Subscription
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`
            px-4 
            py-2 
            rounded-full 
            text-sm 
            font-medium
            transition
            flex items-center gap-2
            ${activeTab === 'invoices' 
              ? 'bg-white text-black' 
              : 'bg-neutral-700 text-white hover:bg-neutral-600'
            }
          `}
        >
          <FiFileText className="w-4 h-4" />
          Invoices
        </button>
        <button
          onClick={() => setActiveTab('my-songs')}
          className={`
            px-4 
            py-2 
            rounded-full 
            text-sm 
            font-medium
            transition
            ${activeTab === 'my-songs' 
              ? 'bg-green-500 text-black' 
              : 'bg-neutral-700 text-white hover:bg-neutral-600'
            }
          `}
        >
          My Songs
        </button>
      </div>

      {/* Subscription Tab */}
      {activeTab === 'subscription' && (
        <>
          {!subscription && (
            <div className="flex flex-col gap-y-4">
              <p>No active plan.</p>
              <Button 
                onClick={subscribeModal.onOpen}
                className="w-[300px]"
              >
                Subscribe
              </Button>
            </div>
          )}
          {subscription && (
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-3">
                <p>You are currently on the 
                  <b> {(subscription as any)?.plan_id === 'yearly' ? 'Premium Yearly' : 'Premium Monthly'} </b> 
                  plan.
                </p>
                <PremiumBadge planId={(subscription as any)?.plan_id} size="md" showLabel />
              </div>
              
              {/* Subscription Details Card */}
              <div className="bg-neutral-800 rounded-lg p-4 max-w-md">
                <div className="flex items-center gap-3 mb-4">
                  <RiVipCrownFill className={`w-8 h-8 ${(subscription as any)?.plan_id === 'yearly' ? 'text-yellow-400' : 'text-slate-400'}`} />
                  <div>
                    <h3 className="text-white font-semibold">
                      {(subscription as any)?.plan_id === 'yearly' ? 'VIP Member' : 'Premium Member'}
                    </h3>
                    <p className="text-neutral-400 text-sm">
                      Hết hạn: {subscription.current_period_end 
                        ? format(new Date(subscription.current_period_end), 'dd/MM/yyyy', { locale: vi })
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Trạng thái</span>
                    <span className="text-green-400 font-medium">Đang hoạt động</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Ngày bắt đầu</span>
                    <span className="text-white">
                      {subscription.current_period_start 
                        ? format(new Date(subscription.current_period_start), 'dd/MM/yyyy', { locale: vi })
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>

              <Button
                disabled={loading || isLoading}
                onClick={subscribeModal.onOpen}
                className="w-[300px]"
              >
                Gia hạn gói Premium
              </Button>
            </div>
          )}
        </>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Lịch sử thanh toán</h3>
          
          {loadingPayments ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-neutral-400">
              <FiFileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có giao dịch nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  onClick={() => setSelectedPayment(payment)}
                  className="bg-neutral-800 hover:bg-neutral-700 rounded-lg p-4 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${payment.status === 'completed' ? 'bg-green-500/20' : 'bg-neutral-700'}
                      `}>
                        <FiFileText className={`w-5 h-5 ${payment.status === 'completed' ? 'text-green-400' : 'text-neutral-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">{getPlanName(payment.plan_id)}</p>
                          <PremiumBadge planId={payment.plan_id} size="sm" />
                        </div>
                        <p className="text-neutral-400 text-sm">
                          {format(new Date(payment.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{formatCurrency(payment.amount)}</p>
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Songs Tab */}
      {activeTab === 'my-songs' && (
        <MySongsContent songs={songs} />
      )}

      {/* Invoice Modal */}
      {selectedPayment && (
        <InvoiceModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
      )}
    </div>
  );
}
 
export default AccountContent;
