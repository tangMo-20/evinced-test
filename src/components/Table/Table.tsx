import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import styles from "./Table.module.scss";

type Props = {
  rows: GridRowsProp;
};

const columns: GridColDef[] = [
  { field: "url", headerName: "Url", width: 300 },
  { field: "severity", headerName: "Severity", width: 150 },
  { field: "type", headerName: "Type", width: 250 },
  { field: "number", headerName: "Number", width: 150 },
  { field: "component", headerName: "Component", width: 150 },
];

// There are a lot of improvements that could be made to a table and data display.
// E.g to add more controls for sorting and filtering. Also, the styling could be significantly improved
export const Table = ({ rows }: Props) => {
  return (
    <div className={styles.root}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};
