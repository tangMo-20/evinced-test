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

export type NodeMeta = {
  id: string;
  dataAccessIds: string[];
  count: number;
  percent: number;
};

export type NodeTree = {
  [key: string]: NodeTree;
} & {
  [metaFieldName]?: NodeMeta;
};
