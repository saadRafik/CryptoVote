import { Wallet, ClipboardCheck, Vote, CheckCircle } from "lucide-react"

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Voting with CryptoVote is simple, secure, and transparent.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mt-8">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">1</div>
            <Wallet className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-bold">Connect Wallet</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Connect your Ethereum wallet to authenticate your identity.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">2</div>
            <ClipboardCheck className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-bold">Browse Proposals</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              View active proposals and read detailed information about each one.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">3</div>
            <Vote className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-bold">Cast Your Vote</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Select your choice and confirm your vote through your wallet.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">4</div>
            <CheckCircle className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-bold">Verify Results</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              View real-time results and verify your vote on the blockchain.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

