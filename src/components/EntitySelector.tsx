import { useState } from "react";

import { Drawer } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { RichTreeView, TreeItem, TreeViewBaseItem, treeItemClasses } from "@mui/x-tree-view";

import { useDispatch } from "react-redux";
import { setSelectedEntity } from "../store/appSlice";
import { useEntities } from "../models/model";

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

const NavDrawer = styled("nav")(() => ({
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

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  color:
    theme.palette.mode === 'light'
      ? theme.palette.grey[800]
      : theme.palette.grey[200],

  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.primary.main, 0.25)
        : theme.palette.primary.dark,
    color: theme.palette.mode === 'dark' && theme.palette.primary.contrastText,
    padding: theme.spacing(0, 1.2),
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

export default function EntitySelector() {
  const dispatch = useDispatch();
  const [data, setData] = useState<any[] | undefined>();
  let treeItems: TreeViewBaseItem[] = [];
  const { data: arrowTable, status } = useEntities();  
  if (status == "success" && data === undefined) {
    setData(arrowTable?.toArray());  
  }  

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
      data.forEach((station) => {
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
    _event: React.SyntheticEvent,
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
          slots={{ item: StyledTreeItem }}
          onItemSelectionToggle={handleItemSelectionToggle}
        />
      </DrawerDesktop>
    </NavDrawer>
  );
}
