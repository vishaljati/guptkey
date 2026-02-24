import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { clearVault } from "@/features/vaultSlicer";
import { logout } from "@/features/authSlicer"
import { useNavigate } from "react-router-dom";
import { useVaultContext } from "@/components/vault/vaultProvider";

const DEFAULT_TIMEOUT_MINUTES = 5;
const STORAGE_KEY = "sessionTimeout";
const FORCE_LOCK_KEY = "guptkey_force_lock";

export const useSessionTimeout = () => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { keyRef } = useVaultContext();

  const lockVault = () => {
    // Wipe encryption key from memory
    keyRef.current = null;

    // Clear decrypted vault from Redux
    dispatch(clearVault());

    // Notify other tabs
    localStorage.setItem(FORCE_LOCK_KEY, Date.now().toString());

    // Redirect to unlock screen
    navigate("/unlock", { replace: true });
  };

  const getTimeoutDuration = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const minutes = stored ? Number(stored) : DEFAULT_TIMEOUT_MINUTES;

    if (isNaN(minutes) || minutes <= 0) {
      return DEFAULT_TIMEOUT_MINUTES * 60 * 1000;
    }

    return minutes * 60 * 1000;
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      lockVault();
    }, getTimeoutDuration());
  };

  useEffect(() => {
    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    // Reset timer on activity
    const activityHandler = () => {
      resetTimer();
    };

    activityEvents.forEach((event) =>
      window.addEventListener(event, activityHandler)
    );

    // Cross-tab lock sync
    const storageHandler = (event: StorageEvent) => {
      if (event.key === FORCE_LOCK_KEY) {
        lockVault();
      }
    };

    window.addEventListener("storage", storageHandler);

    // Start initial timer
    resetTimer();

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, activityHandler)
      );

      window.removeEventListener("storage", storageHandler);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
};