import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Table } from "../../components/Table/Table";
import styles from "./ScanResults.module.scss";
import { NodeTree, ScanResultItem, ScanResultResponse } from "../../types";
import {
  generateRandomString,
  getHeavyMockedData,
  parseResponseIntoTree,
} from "./utils";
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
  const [treeDataMap, setTreeDataMap] = useState(
    new Map<string, ScanResultItem[]>()
  );
  const [tableRows, setTableRows] = useState<GridRowsProp>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const updateTableRows = (dataAccessIds: string[], id: string) => {
    setTableRows(
      dataAccessIds.flatMap((key) =>
        (treeDataMap.get(key) ?? []).map((item) => ({
          ...item,
          id: generateRandomString(10),
          url: id,
          number: 1,
        }))
      )
    );
  };

  const handleTreeItemClick = (
    e: TreeItemMouseEvent,
    dataAccessIds: string[],
    id: string
  ) => {
    setSelectedItem(id);
    updateTableRows(dataAccessIds, id);
  };

  const handleTreeItemKeyDown = (
    e: TreeItemKeyboardEvent,
    dataAccessIds: string[],
    id: string
  ) => {
    if (e.key === "Enter") {
      setSelectedItem(id);
      updateTableRows(dataAccessIds, id);
    }
  };

  useEffect(() => {
    // Response imitation
    setTimeout(() => {
      const response: ScanResultResponse = { ...getHeavyMockedData() };

      setTreeDataMap(new Map(Object.entries(response)));

      const start = Date.now();
      const tree = parseResponseIntoTree(response);

      setTree(tree);

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
        selectedItem={selectedItem}
      />
      <Table rows={tableRows} />
    </div>
  );
};
