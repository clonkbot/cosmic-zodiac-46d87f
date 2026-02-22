import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";

import { wagmiConfig } from "./lib/wagmiConfig";
import { CONTRACT_ADDRESS, CONTRACT_ABI, getElementName } from "./lib/contract";
import { StarField } from "./components/StarField";
import { AuthGate } from "./components/AuthGate";
import { WalletConnect } from "./components/WalletConnect";
import { ProfileCard } from "./components/ProfileCard";
import { CreateProfileButton } from "./components/CreateProfileButton";
import { FortuneButton } from "./components/FortuneButton";
import { MatchPanel } from "./components/MatchPanel";
import { EventToast } from "./components/EventToast";
import { useToast } from "./hooks/useToast";

const queryClient = new QueryClient();

function AppContent() {
  const { address, isConnected } = useAccount();
  const { signOut } = useAuthActions();
  const { toasts, addToast, dismissToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Convex mutations
  const saveProfile = useMutation(api.profiles.saveProfile);
  const saveMatch = useMutation(api.profiles.saveMatch);
  const matchHistory = useQuery(api.profiles.getMatchHistory) || [];

  // Contract reads
  const { data: hasProfileData, refetch: refetchHasProfile } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "hasProfile",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: profileData, refetch: refetchProfile } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getProfile",
    args: address ? [address] : undefined,
    query: { enabled: !!address && hasProfileData === true },
  });

  const { data: canGetFortuneData, refetch: refetchCanFortune } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "canGetFortune",
    args: address ? [address] : undefined,
    query: { enabled: !!address && hasProfileData === true },
  });

  // Contract writes
  const { writeContract, data: txHash, isPending: isWritePending, reset } = useWriteContract();

  const { isLoading: isTxPending, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Parse profile data
  const hasProfile = hasProfileData === true;
  const canGetFortune = canGetFortuneData === true;

  const profile = profileData
    ? {
        element: getElementName(Number(profileData[0])),
        level: Number(profileData[1]),
        xp: Number(profileData[2]),
        energy: Number(profileData[3]),
        luckyNumber: Number(profileData[4]),
        winStreak: Number(profileData[5]),
        lastFortuneTime: Number(profileData[6]),
      }
    : null;

  // Sync profile to Convex when it changes
  useEffect(() => {
    if (profile && address) {
      saveProfile({
        walletAddress: address,
        hasProfile: true,
        element: profile.element,
        level: profile.level,
        xp: profile.xp,
        energy: profile.energy,
        luckyNumber: profile.luckyNumber,
        winStreak: profile.winStreak,
        lastFortuneTime: profile.lastFortuneTime,
      }).catch(console.error);
    }
  }, [profile, address, saveProfile]);

  // Refetch data on successful transaction
  useEffect(() => {
    if (isTxSuccess) {
      refetchHasProfile();
      refetchProfile();
      refetchCanFortune();
      reset();
    }
  }, [isTxSuccess, refetchHasProfile, refetchProfile, refetchCanFortune, reset]);

  // Action handlers
  const handleCreateProfile = useCallback(async () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "createProfile",
      });
      addToast("success", "Profile Created!", "Your cosmic journey begins now.");
    } catch (error) {
      addToast("error", "Transaction Failed", "Could not create profile. Please try again.");
    }
  }, [writeContract, addToast]);

  const handleGetFortune = useCallback(async () => {
    if (!hasProfile || !canGetFortune) return;

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getDailyFortune",
      });
      addToast("fortune", "Fortune Revealed!", "The stars have spoken.");
    } catch (error) {
      addToast("error", "Transaction Failed", "Could not get fortune. Please try again.");
    }
  }, [hasProfile, canGetFortune, writeContract, addToast]);

  const handleMatch = useCallback(
    async (partnerAddress: string) => {
      if (!hasProfile || !address) return;

      try {
        writeContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "matchWith",
          args: [partnerAddress as `0x${string}`],
        });

        // Save to Convex (with placeholder values - real values come from events)
        await saveMatch({
          walletAddress: address,
          partnerAddress: partnerAddress,
          compatibilityScore: Math.floor(Math.random() * 50) + 50, // Placeholder
          matchType: "Cosmic Connection", // Placeholder
        });

        addToast("match", "Match Complete!", `Compatibility revealed with ${partnerAddress.slice(0, 8)}...`);
      } catch (error) {
        addToast("error", "Match Failed", "Could not complete match. Please try again.");
      }
    },
    [hasProfile, address, writeContract, saveMatch, addToast]
  );

  const isLoading = isWritePending || isTxPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950 text-amber-100 relative overflow-x-hidden">
      <StarField />

      {/* Header */}
      <header className="relative z-10 border-b border-amber-500/10 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 md:gap-3"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <span className="text-lg md:text-xl">✨</span>
            </div>
            <h1 className="font-display text-xl md:text-2xl text-amber-100">Cosmic Zodiac</h1>
          </motion.div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <WalletConnect />
            <motion.button
              onClick={() => signOut()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 text-amber-200/50 hover:text-amber-200 rounded-lg hover:bg-amber-500/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-amber-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-amber-500/10 p-4 flex flex-col gap-3"
          >
            <WalletConnect />
            <button
              onClick={() => {
                signOut();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-amber-200/70 hover:text-amber-200 rounded-lg hover:bg-amber-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign out</span>
            </button>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-12">
        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 md:py-20"
          >
            <h2 className="font-display text-3xl md:text-5xl text-amber-100 mb-4 md:mb-6">
              Welcome to Cosmic Zodiac
            </h2>
            <p className="text-amber-200/60 text-base md:text-lg mb-8 max-w-lg mx-auto px-4">
              Connect your wallet to discover your elemental destiny and unlock celestial powers on
              the Base network.
            </p>
            <WalletConnect />
          </motion.div>
        ) : !hasProfile ? (
          <div className="max-w-md mx-auto">
            <CreateProfileButton onCreateProfile={handleCreateProfile} isLoading={isLoading} />
          </div>
        ) : profile ? (
          <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
            {/* Left Column */}
            <div className="space-y-4 md:space-y-6">
              <ProfileCard
                element={profile.element}
                level={profile.level}
                xp={profile.xp}
                energy={profile.energy}
                luckyNumber={profile.luckyNumber}
                winStreak={profile.winStreak}
                walletAddress={address || ""}
              />
              <FortuneButton
                onGetFortune={handleGetFortune}
                isLoading={isLoading}
                canGetFortune={canGetFortune}
                lastFortuneTime={profile.lastFortuneTime}
                hasProfile={hasProfile}
              />
            </div>

            {/* Right Column */}
            <div>
              <MatchPanel
                onMatch={handleMatch}
                isMatching={isLoading}
                matchHistory={matchHistory.map((m: { partnerAddress: string; compatibilityScore: number; matchType: string; timestamp: number }) => ({
                  partnerAddress: m.partnerAddress,
                  compatibilityScore: m.compatibilityScore,
                  matchType: m.matchType,
                  timestamp: m.timestamp,
                }))}
                userElement={profile.element}
                hasProfile={hasProfile}
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full"
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-amber-500/10 mt-12 md:mt-20">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 text-center">
          <p className="text-amber-200/30 text-xs md:text-sm">
            Requested by{" "}
            <a
              href="https://x.com/jianke2"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-200/50 transition-colors"
            >
              @jianke2
            </a>{" "}
            · Built by{" "}
            <a
              href="https://x.com/clonkbot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-200/50 transition-colors"
            >
              @clonkbot
            </a>
          </p>
        </div>
      </footer>

      {/* Toast notifications */}
      <EventToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function AstrologyDApp() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AuthGate>
          <AppContent />
        </AuthGate>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default AstrologyDApp;
