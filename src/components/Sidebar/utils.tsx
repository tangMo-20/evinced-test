import { metaFieldName } from "../../screens/ScanResults/utils";
import { NodeTree } from "../../types";
import {
  RenderTreeParams,
  TreeItemKeyboardEvent,
  TreeItemMouseEvent,
} from "./types";
import { TreeItem } from "@mui/x-tree-view";

export const filterTree = (tree: NodeTree, filter: string): NodeTree | null => {
  let hasMatch = false;

  const filteredNodes = Object.entries(tree).reduce<NodeTree>(
    (acc, [key, children]) => {
      const filteredChildren = filterTree(children as NodeTree, filter);

      if (
        key.toLowerCase().includes(filter.toLowerCase()) ||
        filteredChildren
      ) {
        acc[key] = (filteredChildren ?? children) as NodeTree;
        hasMatch = true;
      }

      return acc;
    },
    {}
  );

  return hasMatch ? filteredNodes : null;
};

const getItemLabel = ({
  key,
  count,
  percent,
}: {
  key: string;
  count?: number;
  percent?: number;
}) => {
  if (!count || !percent) {
    return key;
  }

  const percentDisplayValue =
    Math.floor(percent) < 1 ? "<1%" : `${Math.floor(percent)}%`;

  return `${key} (${count}) ${percentDisplayValue}`;
};

// Required to add virtualization here as if there would be a lot of nodes, UI might become unresponsive
export const renderTree = ({
  tree,
  handleClick,
  handleKeyDown,
  parentId = "root",
}: RenderTreeParams) => {
  return Object.entries(tree).map(([key, children]) => {
    const { dataAccessId, count, percent } =
      (children as NodeTree)[metaFieldName] || {};
    const label = getItemLabel({
      key,
      count,
      percent,
    });

    const handleItemClick = (e: TreeItemMouseEvent) => {
      if (dataAccessId) {
        handleClick(e, dataAccessId);
      }
    };

    const handleItemKeyDown = (e: TreeItemKeyboardEvent) => {
      if (dataAccessId) {
        handleKeyDown(e, dataAccessId);
      }
    };

    return (
      <TreeItem
        key={`${parentId}-${key}`}
        itemId={dataAccessId ?? `${parentId}-${key}`}
        label={label}
        onClick={handleItemClick}
        onKeyDown={handleItemKeyDown}
      >
        {children &&
          renderTree({
            tree: children as NodeTree,
            handleClick,
            handleKeyDown,
            parentId: `${parentId}-${key}`,
          })}
      </TreeItem>
    );
  });
};
