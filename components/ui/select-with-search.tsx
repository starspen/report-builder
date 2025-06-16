"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { InputColor, size } from "@/lib/type"

// Constants
const FOCUS_DELAY = 150
const MAX_OPTIONS_HEIGHT = "max-h-60"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const selectVariants = cva(
  " w-full  px-3 h-10 text-sm flex [&>svg]:h-5 [&>svg]:w-5 rounded-md border border-input   justify-between items-center  read-only:bg-background  disabled:cursor-not-allowed disabled:opacity-50  transition duration-300 ",
  {
    variants: {
      color: {
        default:
          "border-default-200 text-default-500 focus:outline-none focus:border-default-500/50 disabled:bg-default-200  placeholder:text-accent-foreground/50 [&>svg]:stroke-default-600",
        primary:
          "border-primary text-primary focus:outline-none focus:border-primary/70 disabled:bg-primary/30 disabled:placeholder:text-primary  placeholder:text-primary/70 [&>svg]:stroke-primary",
        secondary:
          "border-secondary text-secondary focus:outline-none focus:border-secondary/70 disabled:bg-primary/30 disabled:placeholder:text-primary  placeholder:text-primary/70 [&>svg]:stroke-primary",
        info: "border-info/50 text-info focus:outline-none focus:border-info/70 disabled:bg-info/30 disabled:placeholder:text-info  placeholder:text-info/70",
        warning:
          "border-warning/50 text-warning focus:outline-none focus:border-warning/70 disabled:bg-warning/30 disabled:placeholder:text-info  placeholder:text-warning/70",
        success:
          "border-success/50 text-success focus:outline-none focus:border-success/70 disabled:bg-success/30 disabled:placeholder:text-info  placeholder:text-success/70",
        destructive:
          "border-destructive/50 text-destructive focus:outline-none focus:border-destructive/70 disabled:bg-destructive/30 disabled:placeholder:text-destructive  placeholder:text-destructive/70",
      },

      size: {
        sm: "h-8 text-xs",
        default: "h-9 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      }
    },

    defaultVariants: {
      color: "default",
      size: "default",
    },
  }
);

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
  VariantProps<typeof selectVariants> {
  size?: size
  color?: InputColor
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(
  (
    {
      className,
      children,
      color,
      size,
      ...props
    },
    ref
  ) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        selectVariants({ color, size }),
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 " />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4 " />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
          "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 ps-4 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 ps-4 pe-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// Search Input Component - Updated untuk sticky positioning
const SelectSearch = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <div className="sticky top-0 z-10 bg-popover border-b border-border px-2">
    <div className="flex items-center">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <input
        ref={ref}
        className={cn(
          "flex h-8 w-full rounded-md bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  </div>
))
SelectSearch.displayName = "SelectSearch"

// Memoized SelectItem untuk performance dengan dataset besar
const MemoizedSelectItem = React.memo(({ option }: { option: { value: string; label: string } }) => (
  <SelectItem value={option.value}>
    {option.label}
  </SelectItem>
));
MemoizedSelectItem.displayName = "MemoizedSelectItem";

// Utility function untuk filter options dengan debouncing internal
const filterOptions = (options: Array<{ value: string; label: string }>, searchTerm: string) => {
  if (!searchTerm.trim()) return options
  const lowerSearchTerm = searchTerm.toLowerCase()
  return options.filter(option =>
    option.label.toLowerCase().includes(lowerSearchTerm) ||
    option.value.toLowerCase().includes(lowerSearchTerm)
  )
}

// Optimized rendering function untuk dataset besar
const renderLargeOptionsList = (
  filteredOptions: Array<{ value: string; label: string }>,
  searchTerm: string
) => {
  // Jika dataset kecil (<50), gunakan rendering normal
  if (filteredOptions.length <= 50) {
    return filteredOptions.map((option) => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ));
  }

  // Untuk dataset besar, gunakan chunking dan memoization
  const MAX_INITIAL_RENDER = 50;
  const [initialItems, remainingItems] = [
    filteredOptions.slice(0, MAX_INITIAL_RENDER),
    filteredOptions.slice(MAX_INITIAL_RENDER)
  ];

  return (
    <>
      {/* Render initial items langsung */}
      {initialItems.map((option) => (
        <MemoizedSelectItem key={option.value} option={option} />
      ))}
      
      {/* Render remaining items hanya jika ada search atau user scroll */}
      {(searchTerm || remainingItems.length < 100) && 
        remainingItems.map((option) => (
          <MemoizedSelectItem key={option.value} option={option} />
        ))
      }
      
      {/* Info jika masih ada data tersisa */}
      {!searchTerm && remainingItems.length >= 100 && (
        <div className="py-2 px-4 text-xs text-muted-foreground border-t">
          +{remainingItems.length - 100} more items. Use search to find specific items.
        </div>
      )}
    </>
  );
};

// Select with Search Component
interface SelectWithSearchProps {
  options: Array<{ value: string; label: string }>
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  color?: InputColor
  size?: size
  disabled?: boolean
  className?: string
  optimizeForLargeDataset?: boolean // New prop for large datasets
}

const SelectWithSearch = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectWithSearchProps
>(({
  options,
  value,
  onValueChange,
  placeholder = "Pilih opsi...",
  searchPlaceholder = "Cari...",
  emptyMessage = "Tidak ada data ditemukan",
  color = "default",
  size = "default",
  disabled = false,
  className,
  optimizeForLargeDataset = false,
  ...props
}, ref) => {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  // Auto-detect large dataset
  const isLargeDataset = optimizeForLargeDataset || options.length > 100;

  // Memoized filtered options dengan callback yang stable
  const filteredOptions = React.useMemo(() => 
    filterOptions(options, searchTerm), 
    [options, searchTerm]
  )

  // Memoized selected option
  const selectedOption = React.useMemo(() => 
    options.find(option => option.value === value), 
    [options, value]
  )

  // Callback handlers dengan useCallback untuk performance
  const handleOpenChange = React.useCallback((isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setSearchTerm("")
    } else {
      // Focus ke search input ketika dropdown dibuka
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, FOCUS_DELAY)
    }
  }, [])

  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setSearchTerm(e.target.value)
  }, [])

  const handleSearchKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent select dari menutup ketika mengetik
    e.stopPropagation()
    
    // Jika tekan Escape, tutup dropdown
    if (e.key === "Escape") {
      setOpen(false)
    }
  }, [])

  const handleValueChange = React.useCallback((selectedValue: string) => {
    onValueChange?.(selectedValue)
    setSearchTerm("")
  }, [onValueChange])

  // Prevent auto focus callback
  const handleCloseAutoFocus = React.useCallback((e: Event) => {
    e.preventDefault()
  }, [])

  const handleSearchContainerClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <Select 
      value={value} 
      onValueChange={handleValueChange} 
      open={open} 
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger
        ref={ref}
        color={color}
        size={size}
        disabled={disabled}
        className={className}
        {...props}
      >
        <SelectValue placeholder={placeholder}>
          {selectedOption?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent onCloseAutoFocus={handleCloseAutoFocus}>
        <div onClick={handleSearchContainerClick}>
          <SelectSearch
            ref={searchInputRef}
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        <div className={cn("overflow-y-auto", MAX_OPTIONS_HEIGHT)}>
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : isLargeDataset ? (
            renderLargeOptionsList(filteredOptions, searchTerm)
          ) : (
            filteredOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))
          )}
        </div>
      </SelectContent>
    </Select>
  )
})
SelectWithSearch.displayName = "SelectWithSearch"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectSearch,
  SelectWithSearch,
}
