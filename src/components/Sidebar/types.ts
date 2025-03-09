import { TreeViewCancellableEvent } from "@mui/x-tree-view";
import { NodeTree } from "../../types";

export type TreeItemMouseEvent = React.MouseEvent<HTMLLIElement, MouseEvent>;
export type TreeItemKeyboardEvent = React.KeyboardEvent<HTMLLIElement> &
  TreeViewCancellableEvent;

export type RenderTreeParams = {
  tree: NodeTree;
  handleClick: (e: TreeItemMouseEvent, dataAccessId?: string) => void;
  handleKeyDown: (e: TreeItemKeyboardEvent, dataAccessId?: string) => void;
  parentId?: string;
};
