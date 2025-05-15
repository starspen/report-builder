'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { createRole } from '@/action/system-admin-action'

interface AddRoleDialogProps {
  moduleId: string
}

export default function AddRoleDialog({ moduleId }: AddRoleDialogProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const addRole = useMutation({
    mutationFn: async () => await createRole({ module_id: moduleId, name }),
    onMutate: () => setIsLoading(true),
    onSuccess: (res) => {
      if ([200,201].includes(res.statusCode)) {
        toast.success('Role added!')
        queryClient.invalidateQueries({
          queryKey: ["module-list"],
        });
      } else {
        toast.error(res.message)
      }
      setOpen(false)
      setName('')
    },
    onError: (err: any) => {
      toast.error(err.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return toast.error('Role name required')
    addRole.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center">
          <PlusIcon size={14} className="mr-1" />
          Add Role
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Role</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Role name"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={isLoading}
            required
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
