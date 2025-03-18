import { TreeViewCancellableEvent } from "@mui/x-tree-view";
import { NodeTree } from "../../types";

export type TreeItemMouseEvent = React.MouseEvent<HTMLLIElement, MouseEvent>;
export type TreeItemKeyboardEvent = React.KeyboardEvent<HTMLLIElement> &
  TreeViewCancellableEvent;

export type RenderTreeParams = {
  tree: NodeTree;
  handleClick: (
    e: TreeItemMouseEvent,
    dataAccessIds: string[],
    id: string
  ) => void;
  handleKeyDown: (
    e: TreeItemKeyboardEvent,
    dataAccessIds: string[],
    id: string
  ) => void;
  nodsCount: number;
  increeceNodesCount: () => void;
  parentId?: string;
};
