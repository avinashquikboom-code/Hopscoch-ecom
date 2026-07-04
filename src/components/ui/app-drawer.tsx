"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export interface AppDrawerProps {
  title: string
  subtitle?: string
  open: boolean
  onClose: (open: boolean) => void
  children: React.ReactNode
  footer?: React.ReactNode
  loading?: boolean
  size?: "default" | "large" | "small"
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

export function AppDrawer({
  title,
  subtitle,
  open,
  onClose,
  children,
  footer,
  loading = false,
  size = "default",
  onSubmit,
}: AppDrawerProps) {
  const sizeClasses = {
    small: "w-full sm:max-w-[480px]",
    default: "w-full sm:max-w-[620px] xl:max-w-[680px]",
    large: "w-full sm:max-w-[760px] xl:max-w-[840px]",
  }[size]

  const FormOrDiv = onSubmit ? "form" : "div"

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className={cn(
          "p-0 overflow-hidden flex flex-col h-full bg-card border-l border-border/30 backdrop-blur-xl transition-all duration-300 ease-in-out shadow-2xl",
          sizeClasses
        )}
      >
        <SheetHeader className="p-6 border-b border-border/20 flex flex-col gap-1.5 shrink-0 bg-card z-10">
          <SheetTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            {title}
          </SheetTitle>
          {subtitle && (
            <SheetDescription className="text-sm text-primary font-light">
              {subtitle}
            </SheetDescription>
          )}
        </SheetHeader>

        {/* @ts-ignore */}
        <FormOrDiv
          {...(onSubmit ? { onSubmit } : {})}
          className="flex flex-col flex-1 overflow-hidden h-full"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {children}
          </div>

          {footer !== undefined ? (
            footer && (
              <div className="p-6 bg-muted/15 border-t border-border/20 flex gap-3 justify-end shrink-0 z-10">
                {footer}
              </div>
            )
          ) : (
            <div className="p-6 bg-muted/15 border-t border-border/20 flex gap-3 justify-end shrink-0 z-10">
              <button
                type="button"
                onClick={() => onClose(false)}
                className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-11 px-6 text-muted-foreground cursor-pointer bg-transparent border border-transparent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/10 h-11 px-6 cursor-pointer border border-transparent font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2 font-semibold">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          )}
        </FormOrDiv>
      </SheetContent>
    </Sheet>
  )
}
