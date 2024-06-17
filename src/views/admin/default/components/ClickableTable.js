import {
  Flex,
  Table,
  Progress,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import React, { useMemo, useEffect } from "react";
import { usePagination, useSortBy, useTable } from "react-table";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@chakra-ui/icons";
// Custom components
import Card from "components/card/Card";
import { useApp } from "AppContext/AppProvider";

export default function ColumnsTable({
  pageName,
  columnsData,
  tableData,
  title,
  onClick,
}) {
  const ceo = useApp();

  // works for performance. make thsi function dynamic by bringing in page name as prop and writing logic accordingly for every
  // page.
  function rearrangeArray(arr) {
    if (pageName === "Performance") {
      const obj1p = arr.find((obj) => obj.Header === "Landing Page");
      const obj2p = arr.find((obj) => obj.Header === "Total Revenue");

      const filteredArrp = arr.filter(
        (obj) => obj.Header !== "Landing Page" && obj.Header !== "Total Revenue"
      );
      return [obj1p, ...filteredArrp, obj2p].filter(Boolean);
    } else if (pageName === "Technical") {
      const obj1t = arr.find((obj) => obj.Header === "url");
      const obj2t = arr.find((obj) => obj.Header === "score");
      const obj3t = arr.find((obj) => obj.Header === "status");

      const filteredArrt = arr.filter(
        (obj) =>
          obj.Header !== "url" &&
          obj.Header !== "score" &&
          obj.Header !== "status"
      );
      return [obj1t, ...filteredArrt, obj2t, obj3t].filter(Boolean);
    }
  }

  function fixColor(col) {
    if (pageName === "Technical") {
      if (tableData.status === "Good") {
        const color = "#38a169";
        return [color];
      } else if (tableData.status === "Needs Improvement") {
        const color = "#ecc94b";
        return [color];
      } else if (tableData.status === "Poor") {
        const color = "#e53e3e";
        return [color];
      }
    }
  }
  const handleClick = (cell) => {
    ceo.actions.setTransformedData(null);
    ceo.actions.setChartsData(null);
    ceo.actions.setTempState(ceo.states.selectedYear);
    ceo.actions.setSelectedYear(null);
    console.log("cell inside handleclick", cell, 
    Object.entries(
      ceo.states.chartsData.data[ceo.states.selectedYear]
    ).filter((obj) => obj[1].nested && obj[1])[0][1]["nested"])
    let nested_data = {};
    nested_data["data"] = {};
    nested_data["data"][cell] = {};
    // nested_data['data'][cell] = Object.entries(ceo.states.chartsData.data[ceo.states.selectedYear]).filter(obj => obj[1].nested)[0][1]['nested']
    nested_data["data"][cell] = Object.entries(
      ceo.states.chartsData.data[ceo.states.selectedYear]
    ).filter((obj) => obj[1].nested && obj[1])[0][1]["nested"];

    console.log("Nested debugg cell:", Object.entries(
      nested_data["data"][cell]
    ).filter((obj) => obj[1].URL === cell));
    
    if (Object.entries(
      nested_data["data"][cell]
    ).filter((obj) => obj[1].URL === cell).length === 0){
      ceo.actions.setTransformedData(0);
    }
    else{
      nested_data["data"][cell] = Object.entries(
        nested_data["data"][cell]
      ).filter((obj) => obj[1].URL === cell)[0][1];
      ceo.actions.setChartsData(nested_data);
      ceo.actions.setSelectedYear(cell);
    }
  };

  const columns = useMemo(() => rearrangeArray(columnsData), [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const {
    gotoPage,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    canPreviousPage,
    canNextPage,
    nextPage,
    pageCount,
    previousPage,
    page,
    pageOptions,
    prepareRow,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  const textColor = useColorModeValue("secondaryGray.900", "white");

  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px="25px" justify="space-between" mb="10px" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          {title}
        </Text>
      </Flex>
      <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th pe="10px" key={index} borderColor={borderColor}>
                  <Flex
                    justify="space-between"
                    align="center"
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color="gray.400"
                  >
                    {column.render("Header")}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  // console.log(cell.column.Header)

                  // console.log("DEBUG CELL VALUE",cell.value)

                  let data = "";
                  data =
                    cell.column.Header === "url" ? (
                      <Text
                        color="#0069C2"
                        fontSize="sm"
                        fontWeight="700"
                        _hover={{ cursor: "pointer" }}
                        onClick={() => handleClick(cell.value)}
                      >
                        {cell.value}
                      </Text>
                    ) : cell.column.Header === "status" ? (
                      <Text
                        color={
                          cell.value === "Good"
                            ? "#38a169"
                            : cell.value === "Needs Improvement"
                            ? "#ecc94b"
                            : "#e53c3e"
                        }
                        fontSize="sm"
                        fontWeight="700"
                      >
                        {cell.value}
                      </Text>
                    ) : (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {isNaN(cell.value)
                          ? cell.value
                          : Math.round(cell.value * 100000) / 100000}
                      </Text>
                    );
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: "14px" }}
                      maxH="30px !important"
                      py="8px"
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      borderColor="transparent"
                    >
                      {data}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Flex justifyContent="space-between" m={4} alignItems="center">
        <Flex>
          <Tooltip label="First Page">
            <IconButton
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>

        <Flex alignItems="center">
          <Text flexShrink="0" mr={8}>
            Page{" "}
            <Text fontWeight="bold" as="span">
              {pageIndex + 1}
            </Text>{" "}
            of{" "}
            <Text fontWeight="bold" as="span">
              {pageOptions.length}
            </Text>
          </Text>
        </Flex>

        <Flex>
          <Tooltip label="Next Page">
            <IconButton
              onClick={nextPage}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
              ml={4}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Card>
  );
}
