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
import square from "assets/img/layout/orange_square.png";
import circle from "assets/img/layout/green_circle.png";
import triangle from "assets/img/layout/red_triangle.png";
import gray_circle from "assets/img/layout/gray_circle.png";
import { render } from "@testing-library/react";

export default function ColumnsTable({
  pageName,
  columnsData,
  tableData,
  title,
  heading1,
  heading2,
  renderTitle,
  pageNamesmall,
}) {
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
      if (["LCP", "CLS", "TBT", "FCP"].includes(title)) {
        const obj1t = arr.find((obj) => obj.Header === "score");
        const obj2t = arr.find((obj) => obj.Header === "title");
        const obj3t = arr.find((obj) => obj.Header === "estimated_value");
        let filterList;
        if (obj3t) {
          const filteredArrt = arr.filter(
            (obj) =>
              obj.Header !== "score" &&
              obj.Header !== "title" &&
              obj.Header !== "estimated_value"
          );
          filterList = [obj1t, obj2t, obj3t, ...filteredArrt];
          obj3t["Header"] = "Estimated Savings";
        } else {
          const filteredArrt = arr.filter(
            (obj) => obj.Header !== "score" && obj.Header !== "title"
          );
          filterList = [obj1t, obj2t, ...filteredArrt];
        }
        obj1t["Header"] = "";
        // obj3t["Header"] = ""
        return filterList.filter(Boolean);
      }
      else if (pageName === "CLTV") {
        console.log("inside CLTV")
        return arr
      }
      else {
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
    } else if (pageName === "CLTV") {
      const obj1p = arr.find((obj) => obj.Header === "Product Id");
      const filteredArrp = arr.filter(
        (obj) => obj.Header !== "Product Id"
      );
      return [obj1p, ...filteredArrp].filter(Boolean);
    }
  }

  // const columns = useMemo(() => rearrangeArray(columnsData), [columnsData]);
  const columns = useMemo(() => rearrangeArray(columnsData), [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  // console.log("debug inside complex table", columns, data, pageName)
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
    // setPageSize,
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


  ColumnsTable.defaultProps = {
    renderTitle: true,
  };
  let i = 0;
  return (
    <Card
      direction="column"
      w="100%"
      p={pageName === "CLTV" ? "0px 0px 0px 0px" :"25px 0px 0px 0px"}
      pb="-10px"
      // px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      {renderTitle && (
        <Flex px="25px" mb="5px" justify="space-between" align="center">
          <Text
            as="i"
            color={"#A3AED0"}
            fontSize="11px"
            // fontWeight='700'
            lineHeight="100%"
          >
            {heading1}
          </Text>
        </Flex>
      )}
      {renderTitle && (
        <Flex px="25px" justify="space-between" mb="15px" align="center">
          {title && (
            <Text
              as="b"
              color={"#7551ff"}
              fontSize="22px"
              // fontWeight="700"
              lineHeight="100%"
            >
              {title}
            </Text>
          )}
        </Flex>
      )}
      {/* {renderTitle && (
        <> */}
      <Flex
        px="25px"
        // justify="space-between"
        align="center"
      >
        <Flex
          align="center"
          mt="10px"
          style={{ borderLeft: "5px solid #422afb" }}
        >
          <Flex ml="5px">
            <Text
              as="b"
              color={textColor}
              fontSize="16px"
              // fontWeight='700'
              lineHeight="100%"
            >
              {heading2}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      {/* </>
      )} */}
      <Flex px="25px" justify="space-between" mb="10px" align="center">
        <Text
          color={textColor}
          fontSize="16px"
          fontWeight="600"
          // lineHeight='100%'
        >
          {pageNamesmall}
        </Text>
      </Flex>
      <Table {...getTableProps()} variant="simple" style={{ tableLayout: "auto" }} color="gray.500" mb="30px">
        {String(heading2).toUpperCase() != "DIAGNOSTICS" && (
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th key={index} borderColor={"transparent"}>
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400"
                    >
                      {["LCP", "CLS", "TBT", "FCP"].includes(title)
                        ? column["Header"] == "Estimated Savings" &&
                          column.render("Header")
                        : column.render("Header")}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
        )}
        <Tbody whiteSpace="nowrap" {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr
                style={{ maxWidth: "50px" }}
                {...row.getRowProps()}
                key={index}
              >
                {row.cells.map((cell, index) => {
                  let data = "";
                  data =
                    cell.column.Header === "status" ? (
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
                    ) : cell.column.Header === "" && heading1 ? (
                      <Text
                        color={
                          cell.value >= 0.9
                            ? "#38a169"
                            : cell.value < 0.9 && cell.value >= 0.5
                            ? "#ecc94b"
                            : cell.value === -1
                            ? "white"
                            : "#e53c3e"
                        }
                        fontSize="sm"
                        fontWeight="700"
                      >
                        {cell.value >= 0.9 ? (
                          <img
                            id="scorechart_shapes"
                            src={circle}
                            alt="green"
                          />
                        ) : cell.value < 0.9 && cell.value >= 0.5 ? (
                          <img
                            id="scorechart_shapes"
                            src={square}
                            alt="yellow"
                          />
                        ) : cell.value === -1 ? (
                          <img
                            id="scorechart_shapes"
                            src={gray_circle}
                            alt="gray"
                          />
                        ) : (
                          <img
                            id="scorechart_shapes"
                            src={triangle}
                            alt="red"
                          />
                        )}
                      </Text>
                    ) : (
                      // cell.column.Header === "ESTIMATED_VALUE" ?
                      //   <Text color={textColor} fontSize='sm' fontWeight='700' >
                      //     {cell.value === '-1' ? "" : (isNaN(cell.value) ? cell.value : Math.round(cell.value * 100000) / 100000)}
                      //   </Text>
                      // :
                      //   <Text color={textColor} fontSize='sm' fontWeight='700' >
                      //      {(isNaN(cell.value) ? cell.value : Math.round(cell.value * 100000) / 100000)}
                      // </Text>
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {["-1", -1].includes(cell.value)
                          ? ""
                          : isNaN(cell.value)
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
                      maxW="none"
                      w={cell.column.Header === "" && "110px" }
                      py="8px"
                      // w={{ sm: "50px", md: "50px", lg: "50px" }}
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
      {pageName === "Performance" || title === "URLs tracking Table" ? (
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
      ) : (
        <></>
      )}
    </Card>
  );
}
ColumnsTable.defaultProps = {
  renderTitle: true,
};
