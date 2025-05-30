"use client";

import MasterTable from '@/components/advanced';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SectionMasterView() {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  const data = [
    {
      "section_cd": "HS",
      "descs": "HOUSEKEEPING"
    },
    {
      "section_cd": "EG",
      "descs": "ENGINEERING"
    }
  ];

  const handleNavigateToNew = () => {
    router.push('/customer-service/master-setup/section-master/new');
  };

  const handleNavigateToEdit = () => {
    if (selectedRows.length === 1) {
      router.push(`/customer-service/master-setup/section-master/edit/${selectedRows[0].section_cd}`);
    }
  };

  const handleDelete = async () => {
    try {
      // Implementasi delete API di sini
      console.log('Deleting sections:', selectedRows);
      // Refresh data setelah delete
      router.refresh();
    } catch (error) {
      console.error('Error deleting sections:', error);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const toolbarButtons = (
    <>
      <Button
        variant="default"
        size="sm"
        className="bg-primary/80 text-white hover:bg-primary/90"
        onClick={handleNavigateToNew}
      >
        <Plus className="h-4 w-4 mr-2" />
        New Section
      </Button>

      {selectedRows.length === 1 && (
        <Button
          variant="default"
          size="sm"
          className="bg-amber-500/80 text-white hover:bg-amber-500/90"
          onClick={handleNavigateToEdit}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit Section
        </Button>
      )}

      {selectedRows.length > 0 && (
        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="bg-destructive/80 text-white hover:bg-destructive/90"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Section
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Konfirmasi Hapus Section
              </AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus {selectedRows.length} section yang dipilih?
                Aksi ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );

  return (
    <div className="space-y-4">
      <MasterTable
        data={data}
      />
    </div>
  );
}
