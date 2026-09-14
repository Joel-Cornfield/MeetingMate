import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    'rounded-xl bg-violet-600 px-4 py-3 font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60',
  secondary:
    'rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 font-medium text-slate-100 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60',
  danger:
    'rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 font-medium text-red-200 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60',
  ghost:
    'rounded-xl px-3 py-2 text-sm text-violet-300 transition hover:bg-violet-500/10 hover:text-violet-200',
}

export function PageShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`min-h-screen bg-slate-950 px-4 py-8 text-slate-100 ${className}`}>
      {children}
    </div>
  )
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30 ${className}`}>
      {children}
    </div>
  )
}

export function PrimaryButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${buttonStyles.primary} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function SecondaryButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${buttonStyles.secondary} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function DangerButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${buttonStyles.danger} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function GhostLinkButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${buttonStyles.ghost} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function TextInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 ${className}`}
    />
  )
}

export function SectionHeader({ children, className = '' }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={`text-xl font-semibold text-white ${className}`}>{children}</h2>
}
