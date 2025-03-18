import { NodeTree } from "../../types";
import { ChangeEvent, useMemo, useState } from "react";
import { SimpleTreeView } from "@mui/x-tree-view";
import { TextField } from "@mui/material";
import { defaultNodesCountToShow, filterTree, renderTree } from "./utils";
import { TreeItemKeyboardEvent, TreeItemMouseEvent } from "./types";
import styles from "./Sidebar.module.scss";

type Props = {
  tree: NodeTree;
  handleTreeItemClick: (
    e: TreeItemMouseEvent,
    dataAccessIds: string[],
    id: string
  ) => void;
  handleTreeItemKeyDown: (
    e: TreeItemKeyboardEvent,
    dataAccessIds: string[],
    id: string
  ) => void;
  selectedItem: string | null;
};

export const Sidebar = ({
  tree,
  handleTreeItemClick,
  handleTreeItemKeyDown,
  selectedItem,
}: Props) => {
  // Filter debouncing could be added to improve performance - filtering will be executed after a small delay
  const [filter, setFilter] = useState("");
  const [nodesCountToShow, setNodesCountToShow] = useState(
    defaultNodesCountToShow
  );

  const handleIncreeceNodesCount = () => {
    setNodesCountToShow(nodesCountToShow + defaultNodesCountToShow);
  };

  const filteredTree = useMemo(
    () => (filter ? filterTree(tree, filter) || {} : tree),
    [tree, filter]
  );

  const renderedTree = useMemo(
    () =>
      renderTree({
        tree: filteredTree,
        handleClick: handleTreeItemClick,
        handleKeyDown: handleTreeItemKeyDown,
        nodsCount: nodesCountToShow,
        increeceNodesCount: handleIncreeceNodesCount,
      }),
    [filteredTree, nodesCountToShow]
  );

  const handleChangeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <div className={styles.root}>
      <TextField
        label="Filter"
        variant="outlined"
        size="small"
        onChange={handleChangeFilter}
      />
      <SimpleTreeView
        expansionTrigger="iconContainer"
        selectedItems={selectedItem}
      >
        {renderedTree}
      </SimpleTreeView>
    </div>
  );
};
