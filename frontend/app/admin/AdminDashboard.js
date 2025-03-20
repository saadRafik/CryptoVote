import StartProposalRegistration from './StartProposalRegistration';
import EndProposalRegistration from './EndProposalRegistration';
import StartVotingSession from './StartVotingSession';
import EndVotingSession from './EndVotingSession';
import TallyVotes from './TallyVotes';
import GetResults from './GetResults';
import RegisterVoter from './RegisterVoter';

export default function AdminDashboard() {
  return (
    <div>
      <h1>Tableau de bord de l'Administrateur</h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <RegisterVoter />
        <StartProposalRegistration />
        <EndProposalRegistration />
        <StartVotingSession />
        <EndVotingSession />
        <TallyVotes />
        <GetResults />
      </div>
    </div>
  );
}
