"use client";

import React, { useEffect, useState } from "react";
import { getEntities } from "@/action/get-entities";
import { getAllProjects } from "@/action/get-project";
import {
  getMasterPlanData,
  getMasterplanById,
} from "@/action/get-masterplan-by-id";
import type { Shape } from "@/app/[locale]/(site-plan)/site-plan-editor/component/toolbar";
import ViewOnlyCanvas from "./image-plan/components/image-map-view-viewonly";
import BasicCombobox from "../../forms/combobox/basic-combobox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const [entityCode, setEntityCode] = useState<string>("");
  const [projectCode, setProjectCode] = useState<string>("");
  const [masterplanCode, setMasterplanCode] = useState<string>("");

  const [entities, setEntities] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [masterplans, setMasterplans] = useState<any[]>([]);

  const [artboardShapes, setArtboardShapes] = useState<{
    [id: string]: Shape[];
  }>({});
  const [activeArtboardId, setActiveArtboardId] = useState<string>("");
  const [menuItems, setMenuItems] = useState<{ id: string; title: string }[]>(
    []
  );

  // Load Entities
  useEffect(() => {
    getEntities().then(setEntities);
  }, []);

  // Load Projects when Entity selected
  useEffect(() => {
    if (!entityCode) return;
    getAllProjects().then((allProjects) => {
      const filtered = allProjects.filter(
        (p) => p.entity_cd.trim() === entityCode.trim()
      );
      setProjects(filtered);
    });
  }, [entityCode]);

  // Load Masterplans when Project selected
  useEffect(() => {
    if (!entityCode || !projectCode) return;
    getMasterPlanData(entityCode, projectCode).then(setMasterplans);
  }, [entityCode, projectCode]);

  // Load Shapes when Masterplan selected
  useEffect(() => {
    if (!masterplanCode) return;

    getMasterplanById(masterplanCode).then((data) => {
      const artboards = Array.isArray(data?.artboards) ? data.artboards : [];
      const menuItems = artboards.map((ab: any) => ({
        id: ab.id,
        title: ab.title || ab.name || `Artboard ${ab.id}`,
      }));

      const shapeMap: { [id: string]: Shape[] } = {};
      artboards.forEach((ab: any) => {
        const shapes = Array.isArray(ab.shapes)
          ? ab.shapes
              .filter(
                (s: any) =>
                  s &&
                  typeof s.id === "string" &&
                  s.id !== "null-null-null" &&
                  s.type
              )
              .map((s: any) => ({
                ...s,
                lotId: s.lot_no || "",
                status: s.status || "A",
              }))
          : [];

        shapeMap[ab.id || "1"] = shapes;
      });

      setArtboardShapes(shapeMap);
      setMenuItems(menuItems);

      if (artboards.length > 0) {
        setActiveArtboardId(artboards[0].id || "1");
      }
    });
  }, [masterplanCode]);

  return (
    <>
      <div className="w-full flex flex-col items-center bg-gray-100">
        <div className="flex flex-row gap-4 max-w-6xl w-full justify-center items-center mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Entity, Project, and Masterplan</CardTitle>
            </CardHeader>
            <CardContent className="flex items-start justify-center gap-2">
              <BasicCombobox
                options={entities.map((e) => ({
                  label: e.entity_name,
                  value: e.entity_cd,
                }))}
                placeholder="Select Entity"
                value={entityCode}
                onChange={(val) => {
                  setEntityCode(val);
                  setProjectCode("");
                  setMasterplanCode("");
                  setProjects([]);
                  setMasterplans([]);
                  setArtboardShapes({});
                  setActiveArtboardId("");
                }}
              />

              <BasicCombobox
                options={projects.map((p) => ({
                  label: p.project_name,
                  value: p.project_no,
                }))}
                placeholder="Select Project"
                value={projectCode}
                onChange={(val) => {
                  setProjectCode(val);
                  setMasterplanCode("");
                  setArtboardShapes({});
                  setActiveArtboardId("");
                }}
                disabled={!entityCode}
              />

              <BasicCombobox
                options={masterplans.map((m: any) => ({
                  label: m.name,
                  value: m.id,
                }))}
                placeholder="Select Masterplan"
                value={masterplanCode}
                onChange={setMasterplanCode}
                disabled={!projectCode}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      {masterplanCode && (
        <BasicCombobox
          className="mb-4 w-1/4 bg-white"
          buttonClassName="mb-4 w-1/4 bg-white"
          options={menuItems.map((item) => ({
            label: item.title,
            value: item.id,
          }))}
          placeholder="Select Artboard"
          value={activeArtboardId}
          onChange={setActiveArtboardId}
          disabled={!menuItems.length}
        />
      )}

      {/* Canvas View */}
      <div className="w-full bg-white h-auto">
        {activeArtboardId && artboardShapes[activeArtboardId] && (
          <ViewOnlyCanvas
            shapes={artboardShapes[activeArtboardId]}
            onShapeClick={(shape) => {
              if (
                shape.linkToArtboard &&
                artboardShapes[shape.linkToArtboard]
              ) {
                setActiveArtboardId(shape.linkToArtboard);
              }
            }}
            menuItems={menuItems}
            activeArtboardId={activeArtboardId}
            setActiveArtboardId={setActiveArtboardId}
          />
        )}
      </div>
    </>
  );
}
