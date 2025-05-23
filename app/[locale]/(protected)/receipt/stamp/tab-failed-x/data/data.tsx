import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CheckCircle2,
  XCircle,
  PauseCircle,
  CheckCircle,
} from "lucide-react";

export const status = [
  {
    value: "S",
    label: "Success",
    icon: CheckCircle2,
  },
  {
    value: "F",
    label: "Failed",
    icon: XCircle,
  },
  {
    value: "A",
    label: "Approved",
    icon: CheckCircle,
  },
  {
    value: null,
    label: "Pending",
    icon: PauseCircle,
  },
];
