"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Skema validasi untuk form
const schema = z.object({
  projectNo: z.string().min(1, { message: "Project No harus diisi." }),
  docType: z.string().min(1, { message: "Doc Type harus diisi." }),
  docTypeForTenant: z.string().min(1, { message: "Doc Type For Tenant harus diisi." }),
  docTypeForBuilding: z.string().min(1, { message: "Doc Type For Building harus diisi." }),
  reportSequenceNo: z.string().min(1, { message: "Report Sequence No harus diisi." }),
  linkToIC: z.boolean(),
  trxTypeIC: z.string().optional(),
  complainSource: z.string().min(1, { message: "Complain Source harus diisi." }),
  requestBy: z.string().min(1, { message: "Request By harus diisi." }),
  age1: z.string().optional(),
  age2: z.string().optional(),
  age3: z.string().optional(),
  age4: z.string().optional(),
  age5: z.string().optional(),
  age6: z.string().optional(),
});

export default function SvspecView() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      linkToIC: false,
    },
  });

  const linkToIC = watch("linkToIC");

  function onSubmit(data: z.infer<typeof schema>) {
    toast.success("Data berhasil disimpan");
    console.log(data);
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project No */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="projectNo"
              className={cn("", {
                "text-destructive": errors.projectNo,
              })}
            >
              Project No <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(value) => setValue("projectNo", value)}
              defaultValue=""
            >
              <SelectTrigger
                className={cn("", {
                  "border-destructive focus:border-destructive": errors.projectNo,
                })}
              >
                <SelectValue placeholder="Choose Project No" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project1">Project 1</SelectItem>
                <SelectItem value="project2">Project 2</SelectItem>
                <SelectItem value="project3">Project 3</SelectItem>
              </SelectContent>
            </Select>
            {errors.projectNo && (
              <p className="text-xs text-destructive">{errors.projectNo.message}</p>
            )}
          </div>

          {/* Doc Type */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="docType"
              className={cn("", {
                "text-destructive": errors.docType,
              })}
            >
              Doc Type <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(value) => setValue("docType", value)}
              defaultValue=""
            >
              <SelectTrigger
                className={cn("", {
                  "border-destructive focus:border-destructive": errors.docType,
                })}
              >
                <SelectValue placeholder="Choose Doc Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="type1">Type 1</SelectItem>
                <SelectItem value="type2">Type 2</SelectItem>
                <SelectItem value="type3">Type 3</SelectItem>
              </SelectContent>
            </Select>
            {errors.docType && (
              <p className="text-xs text-destructive">{errors.docType.message}</p>
            )}
          </div>

          {/* Doc Type For Tenant */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="docTypeForTenant"
              className={cn("", {
                "text-destructive": errors.docTypeForTenant,
              })}
            >
              Doc Type For Tenant <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(value) => setValue("docTypeForTenant", value)}
              defaultValue=""
            >
              <SelectTrigger
                className={cn("", {
                  "border-destructive focus:border-destructive": errors.docTypeForTenant,
                })}
              >
                <SelectValue placeholder="Choose Doc Type For Tenant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tenant1">Tenant Type 1</SelectItem>
                <SelectItem value="tenant2">Tenant Type 2</SelectItem>
                <SelectItem value="tenant3">Tenant Type 3</SelectItem>
              </SelectContent>
            </Select>
            {errors.docTypeForTenant && (
              <p className="text-xs text-destructive">{errors.docTypeForTenant.message}</p>
            )}
          </div>

          {/* Doc Type For Building */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="docTypeForBuilding"
              className={cn("", {
                "text-destructive": errors.docTypeForBuilding,
              })}
            >
              Doc Type For Building <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(value) => setValue("docTypeForBuilding", value)}
              defaultValue=""
            >
              <SelectTrigger
                className={cn("", {
                  "border-destructive focus:border-destructive": errors.docTypeForBuilding,
                })}
              >
                <SelectValue placeholder="Choose Doc Type For Building" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="building1">Building Type 1</SelectItem>
                <SelectItem value="building2">Building Type 2</SelectItem>
                <SelectItem value="building3">Building Type 3</SelectItem>
              </SelectContent>
            </Select>
            {errors.docTypeForBuilding && (
              <p className="text-xs text-destructive">{errors.docTypeForBuilding.message}</p>
            )}
          </div>

          {/* Report Sequence No */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="reportSequenceNo"
              className={cn("", {
                "text-destructive": errors.reportSequenceNo,
              })}
            >
              Report Sequence No <span className="text-destructive">*</span>
            </Label>
            <Input
              type="text"
              {...register("reportSequenceNo")}
              placeholder="Enter Report Sequence No"
              className={cn("", {
                "border-destructive focus:border-destructive": errors.reportSequenceNo,
              })}
            />
            {errors.reportSequenceNo && (
              <p className="text-xs text-destructive">{errors.reportSequenceNo.message}</p>
            )}
          </div>

          {/* Link To IC */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="linkToIC">Link To IC</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="linkToIC"
                checked={linkToIC}
                onCheckedChange={(checked) => setValue("linkToIC", checked)}
              />
              <span className="text-sm text-default-500">
                {linkToIC ? "Yes" : "No"}
              </span>
            </div>
          </div>

          {/* Trx Type IC (conditional) */}
          {linkToIC && (
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="trxTypeIC"
                className={cn("", {
                  "text-destructive": errors.trxTypeIC,
                })}
              >
                Trx Type IC
              </Label>
              <Select
                onValueChange={(value) => setValue("trxTypeIC", value)}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose Trx Type IC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trx1">Trx Type 1</SelectItem>
                  <SelectItem value="trx2">Trx Type 2</SelectItem>
                  <SelectItem value="trx3">Trx Type 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Complain Source */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="complainSource"
              className={cn("", {
                "text-destructive": errors.complainSource,
              })}
            >
              Complain Source <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(value) => setValue("complainSource", value)}
              defaultValue=""
            >
              <SelectTrigger
                className={cn("", {
                  "border-destructive focus:border-destructive": errors.complainSource,
                })}
              >
                <SelectValue placeholder="Choose Complain Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="source1">Source 1</SelectItem>
                <SelectItem value="source2">Source 2</SelectItem>
                <SelectItem value="source3">Source 3</SelectItem>
              </SelectContent>
            </Select>
            {errors.complainSource && (
              <p className="text-xs text-destructive">{errors.complainSource.message}</p>
            )}
          </div>

          {/* Request By */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="requestBy"
              className={cn("", {
                "text-destructive": errors.requestBy,
              })}
            >
              Request By <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(value) => setValue("requestBy", value)}
              defaultValue=""
            >
              <SelectTrigger
                className={cn("", {
                  "border-destructive focus:border-destructive": errors.requestBy,
                })}
              >
                <SelectValue placeholder="Choose Request By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user1">User 1</SelectItem>
                <SelectItem value="user2">User 2</SelectItem>
                <SelectItem value="user3">User 3</SelectItem>
              </SelectContent>
            </Select>
            {errors.requestBy && (
              <p className="text-xs text-destructive">{errors.requestBy.message}</p>
            )}
          </div>
        </div>

        {/* Customer Service Aging */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Customer Service Aging</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Age 1 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="age1">Age 1</Label>
              <Input
                type="text"
                {...register("age1")}
                placeholder="Age 1"
              />
            </div>

            {/* Age 2 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="age2">Age 2</Label>
              <Input
                type="text"
                {...register("age2")}
                placeholder="Age 2"
              />
            </div>

            {/* Age 3 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="age3">Age 3</Label>
              <Input
                type="text"
                {...register("age3")}
                placeholder="Age 3"
              />
            </div>

            {/* Age 4 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="age4">Age 4</Label>
              <Input
                type="text"
                {...register("age4")}
                placeholder="Age 4"
              />
            </div>

            {/* Age 5 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="age5">Age 5</Label>
              <Input
                type="text"
                {...register("age5")}
                placeholder="Age 5"
              />
            </div>

            {/* Age 6 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="age6">Age 6</Label>
              <Input
                type="text"
                {...register("age6")}
                placeholder="Age 6"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Save
          </Button>
          <Button type="button" variant="outline">
            Back
          </Button>
        </div>
      </form>
    </div>
  );
}
