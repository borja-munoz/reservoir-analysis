import { useEffect, useState } from "react";

import { Drawer, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { RichTreeView, TreeViewBaseItem } from "@mui/x-tree-view";

import { executeQuery } from "../db/duckdb";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setSelectedEntity } from "../store/appSlice";

export const DRAWER_WIDTH = 350;

export enum EntityType {
  Basin = "Basin",
  Province = "Province",
  Station = "Station",
}

export type SelectedEntity = {
  type: EntityType;
  id: string;
  idBasin: number;
};

const NavDrawer = styled("nav")(({ theme }: { theme: Theme }) => ({
  flex: "0 0 auto",
  position: "relative",
  width: DRAWER_WIDTH,
  flexShrink: 0,
}));

const DrawerDesktop = styled(Drawer)(() => ({
  "& .MuiPaper-root": {
    width: DRAWER_WIDTH,
    position: "absolute",
    height: "100vh",
    padding: "20px",
    borderWidth: "0px",
  },
}));

export default function EntitySelector() {
  const dispatch = useDispatch();
  const dbInitialized = useSelector(
    (state: RootState) => state.app.dbInitialized
  );
  const [data, setData] = useState<any[] | undefined>();
  let treeItems: TreeViewBaseItem[] = [];

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        SELECT id AS station_id,
               name AS station_name,
               province
        FROM stations
        ORDER BY province, name
      `;
      const arrowTable = await executeQuery(query);
      setData(arrowTable?.toArray());
    };

    if (dbInitialized) {
      fetchData();
    }
  }, [dbInitialized]);

  const createTreeItems = () => {
    if (data !== undefined) {
      treeItems.push({
        id: "basin|1",
        label: "Hidrosur",
      });
      let currentIndexProvince = 0;
      treeItems[0].children = [
        {
          id: `basin|1|province|${data[0].province}`,
          label: data[0].province,
          children: [],
        },
      ];
      data.forEach((station, index) => {
        if (
          station.province !==
          treeItems[0].children![currentIndexProvince].label
        ) {
          treeItems[0].children?.push({
            id: `basin|1|province|${station.province}`,
            label: station.province,
            children: [],
          });
          currentIndexProvince += 1;
        }
        treeItems[0].children![currentIndexProvince].children!.push({
          id: `basin|1|station|${station.station_id}`,
          label: station.station_name,
        });
      });
    }
  };

  if (data !== undefined) {
    createTreeItems();
  }

  const handleItemSelectionToggle = (
    event: React.SyntheticEvent,
    itemId: string,
    isSelected: boolean
  ) => {
    if (isSelected) {
      let itemElements = itemId.split("|");
      let selectedEntity;
      selectedEntity =
        itemElements.length == 2
          ? {
              type: EntityType.Basin,
              id: itemElements[1],
              idBasin: parseInt(itemElements[1]),
            }
          : {
              type:
                itemElements[2] === "province"
                  ? EntityType.Province
                  : EntityType.Station,
              id: itemElements[3],
              idBasin: parseInt(itemElements[1]),
            };
      dispatch(setSelectedEntity(selectedEntity));
    }
  };

  return (
    <NavDrawer>
      <DrawerDesktop variant="permanent" anchor="left" open>
        <RichTreeView
          items={treeItems}
          defaultSelectedItems={'basin|1'}
          defaultExpandedItems={['basin|1']}
          aria-label="Entity Selector"
          sx={{ height: 200, flexGrow: 1, maxWidth: 350, overflowY: "auto" }}
          onItemSelectionToggle={handleItemSelectionToggle}
        />
      </DrawerDesktop>
    </NavDrawer>
  );
}
