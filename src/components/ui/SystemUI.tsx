import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatusLedProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: "gold" | "green";
  pulse?: boolean;
}

export const StatusLed = React.forwardRef<HTMLSpanElement, StatusLedProps>(
  ({ className, color = "gold", pulse = true, ...props }, ref) => {
    const dotColorClass = color === "green" ? "bg-green-500" : "bg-[#c8a34d]";
    const ringColorClass = color === "green" ? "border-green-500/40" : "border-[#c8a34d]/40";

    return (
      <span ref={ref} className={cn("relative inline-flex items-center justify-center", className)} {...props}>
        {pulse ? <span className={cn("absolute h-3 w-3 rounded-full animate-ping border", ringColorClass)} /> : null}
        <span className={cn("relative h-2 w-2 rounded-full", dotColorClass)} />
      </span>
    );
  }
);
StatusLed.displayName = "StatusLed";

export interface LedgerProps extends React.HTMLAttributes<HTMLDivElement> {
  nodeLabel?: React.ReactNode;
  hashLabel?: React.ReactNode;
  hashValue: React.ReactNode;
  statusLabel?: React.ReactNode;
  statusValue?: React.ReactNode;
}

export const Ledger = React.forwardRef<HTMLDivElement, LedgerProps>(
  (
    {
      className,
      nodeLabel = "ACTIVE PROTOCOL",
      hashLabel = "Registry Hash",
      hashValue,
      statusLabel = "Status",
      statusValue = "VERIFIED",
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("ledger-container", className)} {...props}>
        <div className="ledger-node-badge">{nodeLabel}</div>
        <div className="flex items-center justify-between font-mono">
          <div className="space-y-1">
            <div className="text-[9px] text-slate-500 uppercase">{hashLabel}</div>
            <div className="ledger-hash text-[10px]">{hashValue}</div>
          </div>
          <div className="h-6 w-px bg-[#c8a34d]/20" />
          <div className="space-y-1 text-right">
            <div className="text-[9px] text-slate-500 uppercase">{statusLabel}</div>
            <div className="text-white text-[10px]">{statusValue}</div>
          </div>
        </div>
      </div>
    );
  }
);
Ledger.displayName = "Ledger";

export interface ComplianceBarProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  tone?: "gold" | "green";
  rightSlot?: React.ReactNode;
}

export const ComplianceBar = React.forwardRef<HTMLDivElement, ComplianceBarProps>(
  ({ className, label, tone = "gold", rightSlot, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("compliance-status", className)} {...props}>
        <div className="flex items-center gap-3">
          <StatusLed color={tone} />
          <span className="compliance-label">{label}</span>
        </div>
        {rightSlot ? <div>{rightSlot}</div> : null}
      </div>
    );
  }
);
ComplianceBar.displayName = "ComplianceBar";

export interface TrustIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  protocol: React.ReactNode;
  version: React.ReactNode;
}

export const TrustIndicator = React.forwardRef<HTMLDivElement, TrustIndicatorProps>(
  ({ className, protocol, version, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("trust-indicator", className)} {...props}>
        <span className="protocol">{protocol}</span>
        <span className="divider w-px h-4 bg-[#c8a34d]/20" />
        <span className="version">{version}</span>
      </div>
    );
  }
);
TrustIndicator.displayName = "TrustIndicator";
