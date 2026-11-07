"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useDemo } from "@/hooks/useDemoState";
import type { ScreenId } from "@/types";
import { StatusBar, BottomNav, PhoneToasts } from "./PhoneChrome";
import { PhoneOffOverlay } from "./PhoneOffOverlay";
import { OnboardingScreen } from "@/components/screens/OnboardingScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { RoutesScreen } from "@/components/screens/RoutesScreen";
import { RouteDetailsScreen } from "@/components/screens/RouteDetailsScreen";
import { HavensScreen } from "@/components/screens/HavensScreen";
import { JourneyScreen } from "@/components/screens/JourneyScreen";
import { HazardScreen } from "@/components/screens/HazardScreen";
import { BuddyScreen } from "@/components/screens/BuddyScreen";
import { CharmScreen } from "@/components/screens/CharmScreen";
import { LowBatteryScreen } from "@/components/screens/LowBatteryScreen";
import { SosScreen } from "@/components/screens/SosScreen";
import { ProfileScreen } from "@/components/screens/ProfileScreen";

const SCREENS: Record<ScreenId, () => React.ReactElement> = {
  onboarding: OnboardingScreen,
  home: () => (
    <div className="phone-scroll h-full overflow-y-auto">
      <HomeScreen />
    </div>
  ),
  routes: RoutesScreen,
  routeDetails: RouteDetailsScreen,
  havens: HavensScreen,
  journey: JourneyScreen,
  hazard: HazardScreen,
  buddy: BuddyScreen,
  charm: CharmScreen,
  lowBattery: LowBatteryScreen,
  sos: SosScreen,
  profile: ProfileScreen,
};

const FULL_BLEED: ScreenId[] = ["onboarding", "sos"];
const NO_NAV: ScreenId[] = ["onboarding", "sos"];

export function PhoneApp() {
  const { state } = useDemo();
  const Screen = SCREENS[state.screen];
  const fullBleed = FULL_BLEED.includes(state.screen);
  const showNav = !NO_NAV.includes(state.screen);

  return (
    <div className="absolute inset-0 overflow-hidden bg-bg text-fg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_50%_at_50%_0%,rgba(139,92,246,0.16),transparent)]" />
      <div className="absolute inset-0 flex flex-col">
        <div className="relative min-h-0 flex-1">
          <AnimatePresence initial={false}>
            <motion.div
              key={state.screen}
              className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {!fullBleed && <div className="h-[48px] shrink-0" />}
              <div className="relative min-h-0 flex-1">
                <div className="absolute inset-0">
                  <Screen />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence initial={false}>
          {showNav && (
            <motion.div key="nav" initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ duration: 0.3 }}>
              <BottomNav />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 top-0 z-50">
        <StatusBar tone={state.screen === "sos" ? "sos" : "default"} />
      </div>
      <PhoneToasts />
      <AnimatePresence>{state.phoneBattery === 0 && <PhoneOffOverlay key="off" />}</AnimatePresence>
    </div>
  );
}
