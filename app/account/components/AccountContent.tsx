"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/hooks/useUser";
import Button from "@/components/Button";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { postData } from "@/libs/helpers";
import { Song } from "@/types";
import MySongsContent from "./MySongsContent";

interface AccountContentProps {
  songs?: Song[];
}

const AccountContent: React.FC<AccountContentProps> = ({ songs = [] }) => {
  const router = useRouter();
  const subscribeModal = useSubscribeModal();
  const { isLoading, subscription, user } = useUser();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'subscription' | 'my-songs'>('subscription');

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

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
              <p>You are currently on the 
                <b> {subscription?.prices?.products?.name} </b> 
                plan.
              </p>
              <Button
                disabled={loading || isLoading}
                onClick={redirectToCustomerPortal}
                className="w-[300px]"
              >
                Open customer portal
              </Button>
            </div>
          )}
        </>
      )}

      {/* My Songs Tab */}
      {activeTab === 'my-songs' && (
        <MySongsContent songs={songs} />
      )}
    </div>
  );
}
 
export default AccountContent;
