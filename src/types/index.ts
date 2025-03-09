import { metaFieldName } from "../screens/ScanResults/utils";

export type ScanResultResponse = {
  [key: string]: ScanResultItem[];
};

export type ScanResultItem = {
  type: string;
  severity: string;
  component: string;
  selector: string;
};

// dataAccessId is optional for intermediate nodes
// as they don't have any associated data and are used only for display
export type NodeMeta = {
  dataAccessId?: string;
  count: number;
  percent: number;
};

export type NodeTree = {
  [key: string]: NodeTree;
} & {
  [metaFieldName]?: NodeMeta;
};
