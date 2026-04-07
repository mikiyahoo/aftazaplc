"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Clock, RefreshCw } from "lucide-react";

interface SessionExpiryWarningProps {
  sessionTimeoutMinutes?: number;
  warningMinutes?: number;
}

export default function SessionExpiryWarning({ 
  sessionTimeoutMinutes = 24 * 60, // 24 hours default
  warningMinutes = 5 
}: SessionExpiryWarningProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExtending, setIsExtending] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      const sessionStart = sessionStorage.getItem('session_start');
      if (!sessionStart) {
        sessionStorage.setItem('session_start', Date.now().toString());
        return;
      }

      const sessionStartMs = parseInt(sessionStart);
      const now = Date.now();
      const sessionAge = now - sessionStartMs;
      const sessionTimeoutMs = sessionTimeoutMinutes * 60 * 1000;
      const warningThresholdMs = warningMinutes * 60 * 1000;

      // Check if we should show the warning
      if (sessionAge > (sessionTimeoutMs - warningThresholdMs) && sessionAge < sessionTimeoutMs) {
        setIsVisible(true);
        setTimeLeft(Math.ceil((sessionTimeoutMs - sessionAge) / 1000 / 60));
      } else if (sessionAge >= sessionTimeoutMs) {
        // Session expired
        handleSessionExpired();
      }
    };

    // Check immediately and then every 30 seconds
    checkSession();
    const interval = setInterval(checkSession, 30000);

    return () => clearInterval(interval);
  }, [sessionTimeoutMinutes, warningMinutes]);

  const handleExtendSession = async () => {
    setIsExtending(true);
    try {
      const response = await fetch('/api/admin/extend-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        sessionStorage.setItem('session_start', Date.now().toString());
        setIsVisible(false);
        setTimeLeft(0);
      } else {
        // If extension fails, redirect to login
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Failed to extend session:', error);
      window.location.href = '/admin/login';
    } finally {
      setIsExtending(false);
    }
  };

  const handleSessionExpired = () => {
    // Clear session data
    sessionStorage.removeItem('session_start');
    
    // Show expired message for 3 seconds before redirect
    setIsVisible(true);
    setTimeLeft(0);
    
    setTimeout(() => {
      window.location.href = '/admin/login?expired=true';
    }, 3000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 duration-300">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-80">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className={`h-6 w-6 ${timeLeft > 0 ? 'text-yellow-500' : 'text-red-500'}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">
              {timeLeft > 0 ? 'Session Expiring Soon' : 'Session Expired'}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {timeLeft > 0 ? (
                <>
                  Your session will expire in <span className="font-medium text-gray-900">{timeLeft} minutes</span>. 
                  Would you like to extend it?
                </>
              ) : (
                'Your session has expired. You will be redirected to the login page.'
              )}
            </p>
          </div>
        </div>
        
        {timeLeft > 0 && (
          <div className="mt-3 flex space-x-2">
            <button
              onClick={handleExtendSession}
              disabled={isExtending}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isExtending ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                  Extending...
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Extend Session
                </>
              )}
            </button>
            <button
              onClick={() => window.location.href = '/admin/login'}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}