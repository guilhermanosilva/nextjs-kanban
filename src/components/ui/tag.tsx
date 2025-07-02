import { cn } from '@/lib/utils'
import { getContrastColor } from '@/lib/utils'

type TagProps = {
  color?: string;
  className?: string;
  ref?: React.RefObject<HTMLInputElement | null>
} & React.InputHTMLAttributes<HTMLInputElement>


export function Tag({ color = '#333333', className, ref, ...props }: TagProps) {
  return (
    <input
      {...props}
      ref={ref}
      className={cn(
        'border border-black/10 w-32 text-xs text-center font-medium p-1 h-7 bg-accent rounded-lg transition-all',
        'placeholder:font-normal',
        'focus:border-muted-foreground focus:read-only:border-black/10',
        'active:outline-none active:border-inherit read-only:outline-none', className)}
      placeholder="Nome da tag"
      style={{
        backgroundColor: color,
        color: getContrastColor(color),
      }}
    />
  )
}
