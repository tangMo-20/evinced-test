import { NodeTree } from "../../types";
import { ChangeEvent, useMemo, useState } from "react";
import { SimpleTreeView } from "@mui/x-tree-view";
import { TextField } from "@mui/material";
import { filterTree, renderTree } from "./utils";
import { TreeItemKeyboardEvent, TreeItemMouseEvent } from "./types";
import styles from "./Sidebar.module.scss";

type Props = {
  tree: NodeTree;
  handleTreeItemClick: (e: TreeItemMouseEvent) => void;
  handleTreeItemKeyDown: (e: TreeItemKeyboardEvent) => void;
};

export const Sidebar = ({
  tree,
  handleTreeItemClick,
  handleTreeItemKeyDown,
}: Props) => {
  const [filter, setFilter] = useState("");

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
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredTree]
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
      <SimpleTreeView>{renderedTree}</SimpleTreeView>
    </div>
  );
};
