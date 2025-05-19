// File: app/modules/components/EditRoleDialog.tsx
'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Edit2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { editRole } from '@/action/system-admin-action'

export default function EditRoleDialog({
  role,
  moduleId
}: {
  role: { id: string; name: string },
  moduleId: string
}) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(role.name)
  const [isLoading, setIsLoading] = useState(false)

  const editRoleName = useMutation({
    mutationFn: async () => await editRole({ id: role.id, name }),
    onMutate: () => setIsLoading(true),
    onSuccess: (res) => {
      if ([200,201].includes(res.statusCode)) {
        toast.success('Role edited!')
        queryClient.invalidateQueries({
          queryKey: ["module-list"],
        });
      } else {
        toast.error(res.message)
      }
      setOpen(false)
    },
    onError: (err: any) => {
      toast.error(err.message)
    },
    onSettled: () => {
      setIsLoading(false);
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) editRoleName.mutate()
    else toast.error('Name required')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit2Icon size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            disabled={isLoading}
          />
          <DialogFooter className="space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
