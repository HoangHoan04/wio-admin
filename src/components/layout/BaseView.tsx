import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

type Tab = {
  key: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
};

interface BaseViewProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  tabs?: Tab[];
}

const BaseView: React.FC<BaseViewProps> = ({ children, isLoading, tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="base-view flex flex-col relative h-full p-3 justify-center items-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (tabs && tabs.length > 0) {
    return (
      <div className="base-view flex flex-col h-full overflow-hidden bg-background">
        <style>{`
          .base-view-tabs-nav {
            display: flex;
            align-items: flex-end;
            padding: 8px 12px 0 12px;
            gap: 4px;
            border-bottom: 1px solid var(--border);
            background-color: transparent;
            overflow-x: auto;
            white-space: nowrap; 
            user-select: none;
            scrollbar-width: none; 
            -ms-overflow-style: none; 
          }

          .base-view-tabs-nav::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }

          .base-view-tab-btn {
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 0 16px;
            height: 34px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 8px 8px 0 0;
            transition: all 0.15s ease-in-out;
            border: none;
            cursor: pointer;
            margin-bottom: -1px;
            z-index: 1;
            background: rgba(var(--muted), 0.3);
            color: var(--muted-foreground);
            flex-shrink: 0; 
          }

          .base-view-tab-btn:hover {
            background: var(--accent);
            color: var(--foreground);
          }

          .base-view-tab-btn.is-active {
            background: var(--card);
            color: var(--foreground);
            font-weight: 700;
            border-top: 2px solid var(--primary);
            z-index: 10;
          }

          .base-view-tab-btn.is-active::before,
          .base-view-tab-btn.is-active::after {
            content: '';
            position: absolute;
            bottom: 0;
            width: 12px;
            height: 12px;
            pointer-events: none;
          }

          .base-view-tab-btn.is-active::before {
            left: -12px;
            border-bottom-right-radius: 8px;
            box-shadow: 4px 4px 0 var(--card);
          }

          .base-view-tab-btn.is-active::after {
            right: -12px;
            border-bottom-left-radius: 8px;
            box-shadow: -4px 4px 0 var(--card);
          }
        `}</style>

        <div className="base-view-tabs-nav">
          {tabs.map((tab, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveIndex(idx)}
                className={`base-view-tab-btn ${isActive ? "is-active" : ""}`}
              >
                {tab.icon && (
                  <span className="flex items-center justify-center text-inherit">
                    {tab.icon}
                  </span>
                )}
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-hidden bg-card text-foreground">
          {tabs.map((tab, idx) => (
            <div
              key={tab.key}
              id={`base-view-scroll-container-${tab.key}`}
              className={cn(
                "h-full flex flex-col overflow-y-auto custom-scrollbar p-0",
                idx === activeIndex ? "block" : "hidden",
              )}
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="base-view flex flex-col h-full overflow-hidden bg-card text-foreground">
      <div
        id="base-view-scroll-container"
        className={cn("flex-1 overflow-y-auto custom-scrollbar p-4")}
      >
        {children}
      </div>
    </div>
  );
};

export default BaseView;
