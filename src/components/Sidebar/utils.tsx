import { Button } from "@mui/material";
import { metaFieldName } from "../../screens/ScanResults/utils";
import { NodeTree } from "../../types";
import {
  RenderTreeParams,
  TreeItemKeyboardEvent,
  TreeItemMouseEvent,
} from "./types";
import { TreeItem2 } from "@mui/x-tree-view";

export const filterTree = (tree: NodeTree, filter: string): NodeTree | null => {
  let hasMatch = false;

  const filteredNodes = Object.entries(tree).reduce<NodeTree>(
    (acc, [key, children]) => {
      const childrenNode = children as NodeTree;
      const filteredChildren = filterTree(childrenNode, filter);
      const nodeHasMatch = key.toLowerCase().includes(filter.toLowerCase());

      if (nodeHasMatch || filteredChildren) {
        const currentNode = { ...(filteredChildren ?? childrenNode) };

        if (childrenNode[metaFieldName]) {
          Object.defineProperty(currentNode, metaFieldName, {
            enumerable: false,
            configurable: true,
            value: childrenNode[metaFieldName],
          });
        }

        acc[key] = currentNode;
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

export const defaultNodesCountToShow = 20;

export const renderTree = ({
  tree,
  handleClick,
  handleKeyDown,
  parentId = "root",
  nodsCount = defaultNodesCountToShow,
  increeceNodesCount,
}: RenderTreeParams) => {
  const entries = Object.entries(tree).slice(0, nodsCount);
  const loadMoreSlots = { content: () => <Button fullWidth>Load More</Button> };

  const handleKeyboardLoadMore = (e: TreeItemKeyboardEvent) => {
    if (e.key === "Enter") {
      increeceNodesCount?.();
    }
  };

  const items = entries.map(([key, children]) => {
    const itemKey = `${parentId}-${key}`;
    const loadMoreId = `${itemKey}-load-more`;
    const { id, dataAccessIds, count, percent } =
      (children as NodeTree)[metaFieldName] || {};
    const label = getItemLabel({ key, count, percent });

    const handleItemClick = (e: TreeItemMouseEvent) => {
      const excludeTags = ["svg", "path"];
      const target = (e.target as any).nodeName;

      e.stopPropagation();

      if (dataAccessIds && id && !excludeTags.includes(target)) {
        handleClick(e, dataAccessIds, id);
      }
    };

    const handleItemKeyDown = (e: TreeItemKeyboardEvent) => {
      e.stopPropagation();

      if (dataAccessIds && id) {
        handleKeyDown(e, dataAccessIds, id);
      }
    };

    return (
      <TreeItem2
        key={itemKey}
        itemId={id ?? itemKey}
        label={label}
        onClick={handleItemClick}
        onKeyDown={handleItemKeyDown}
      >
        {renderTree({
          tree: children as NodeTree,
          handleClick,
          handleKeyDown,
          parentId: itemKey,
          nodsCount,
          increeceNodesCount,
        })}
        {Object.keys(children).length > nodsCount && (
          <TreeItem2
            itemId={loadMoreId}
            slots={loadMoreSlots}
            onClick={increeceNodesCount}
            onKeyDown={handleKeyboardLoadMore}
          />
        )}
      </TreeItem2>
    );
  });

  return items;
};
