import { ShieldCheck, Lock, Eye, Clock, UserCheck, BarChart3 } from "lucide-react"

export function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Key Features</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              CryptoVote provides a secure and transparent voting experience with these powerful features.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <ShieldCheck className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Secure Voting</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Your vote is secured by blockchain technology, making it impossible to tamper with.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Lock className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Private Ballots</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Your identity remains private while ensuring your vote is counted.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Eye className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Transparent Results</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              All votes are publicly verifiable on the blockchain, ensuring complete transparency.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Clock className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Real-time Updates</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              See voting results in real-time as they happen on the blockchain.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <UserCheck className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Voter Verification</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Ensure only eligible voters can participate in the voting process.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <BarChart3 className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Detailed Analytics</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Access comprehensive voting statistics and analytics.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

