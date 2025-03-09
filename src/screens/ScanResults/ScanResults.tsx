import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Table } from "../../components/Table/Table";
import styles from "./ScanResults.module.scss";
import { NodeTree, ScanResultItem, ScanResultResponse } from "../../types";
import { getHeavyMockedData, parseResponseIntoTree } from "./utils";
import {
  TreeItemKeyboardEvent,
  TreeItemMouseEvent,
} from "../../components/Sidebar/types";
import { GridRowsProp } from "@mui/x-data-grid";

export const ScanResults = () => {
  // Storing tree, treeDataMap and table data state should be moved to state manager,
  // so this data would be accessible anywhere and there won't be any props drilling.
  // Tree should be used only for sidebar display. Every end node must have a hidden field with id to access it's data
  const [tree, setTree] = useState<NodeTree>({});
  const [treeDataMap, setTreeDataMap] = useState<Map<string, ScanResultItem[]>>(
    new Map()
  );
  const [tableRows, setTableRows] = useState<GridRowsProp>([]);

  const updateTableRows = (dataAccessId?: string) => {
    if (dataAccessId) {
      const items = treeDataMap.get(dataAccessId);

      if (items) {
        setTableRows(
          items.map((item, index) => ({
            ...item,
            id: index,
            url: dataAccessId,
            number: 1,
          }))
        );
      }
    }
  };

  const handleTreeItemClick = (
    e: TreeItemMouseEvent,
    dataAccessId?: string
  ) => {
    updateTableRows(dataAccessId);
  };

  const handleTreeItemKeyDown = (
    e: TreeItemKeyboardEvent,
    dataAccessId?: string
  ) => {
    if (e.key === "Enter" || e.key === "ArrowRight") {
      updateTableRows(dataAccessId);
    }
  };

  useEffect(() => {
    // Response imitation
    setTimeout(() => {
      const response: ScanResultResponse = { ...getHeavyMockedData() };

      setTreeDataMap(new Map(Object.entries(response)));

      const start = Date.now();
      const tree = parseResponseIntoTree(response);

      setTree({ root: tree });

      const end = Date.now();
      // Tree building algorithm performance test
      console.log(end - start, { start, end });
    }, 0);
  }, []);

  console.log({ tree });

  return (
    <div className={styles.root}>
      <Sidebar
        tree={tree}
        handleTreeItemClick={handleTreeItemClick}
        handleTreeItemKeyDown={handleTreeItemKeyDown}
      />
      <Table rows={tableRows} />
    </div>
  );
};
