'use client'
import '/styles/global.css';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

import AdminDashboard from '@/admin/AdminDashboard';
import Header from '@/shared/Header';
import Footer from '@/shared/Footer';
import Notification from '@/shared/Notification';

import { getAdmin } from '@/contract/Voting';

export default function Home() {
  const [notification, setNotification] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const { address, isConnected } = useAccount();

  const checkIfAdmin = async () => {
    if (isConnected && address) {
      try {
        const adminAddress = await getAdmin();
        setIsAdmin(address.toLowerCase() === adminAddress.toLowerCase());
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    }
  }

  // hook: look to separate in other file
  useEffect(() => {
    if (isConnected && address) {
      checkIfAdmin();
    }
  }, [address, isConnected]);

  return (
    <div>
      <Header />
      
      {notification && <Notification message={notification.message} type={notification.type} />}
      
      {isAdmin ? (
        <AdminDashboard setNotification={setNotification} />
      ) : (
        <div>
          <h3>Bienvenue sur l'application de vote !</h3>
          <p>Connectez-vous pour participer au vote.</p>
        </div>
      )}

      {
        isConnected ? (
          <div>
            <p>Vous êtes connecté avec l'adresse {address}.</p>
          </div>
        ) : (
          <div>
            <p>Vous n'êtes pas connecté.</p>
          </div>
        )
      }

      <Footer />
    </div>
  );
}
