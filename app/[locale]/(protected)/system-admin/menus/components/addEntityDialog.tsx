// components/AddEntityDialog.tsx
'use client'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'

export default function AddEntityDialog({
  label,
  onSubmit,
}: {
  label: 'Role' | 'Menu'
  onSubmit: (name: string) => Promise<void> | void
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const handle = async () => {
    await onSubmit(name)
    setName('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-1"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add {label}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <h3 className="text-lg font-semibold mb-4">New {label}</h3>
        <Input
          placeholder={`${label} name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handle}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
