import { useState, useEffect } from 'react';
import { getWinner } from '@/contract/Voting';

export default function GetResults() {
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState('');

  const fetchWinner = async () => {
    try {
      const winnerId = await getWinner();
      setWinner(winnerId);
    } catch (err) {
      setError('Erreur lors de la récupération des résultats.');
    }
  };

  useEffect(() => {
    fetchWinner();
  }, []);

  return (
    <div>
      <h2>Résultats des votes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {winner ? (
        <p>Le gagnant est la proposition avec l'ID : {winner}</p>
      ) : (
        <p>Les résultats ne sont pas encore disponibles.</p>
      )}
    </div>
  );
}
