import React from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ReusableTable = (props) => {
  var [count, setCount] = useState(0);
  const myData = props.data;
  var headers = [];
  var temp = [];
  var vals = [];
  for (let i = 0; i < myData.length; i++) {
    Object.entries(myData[i]).forEach(([key, value]) => {
      temp.push(value);
    });
    vals.push(temp);
    temp = [];
  }
  Object.entries(myData[0]).forEach(([key, value]) => {
    headers.push(key);
  });

  useEffect(() => {
    console.log(count);
    var divToPrint = document.getElementById("reusabletable");
    var tbody = divToPrint.children;
    var rows = tbody[1].children;

    for (let i = 0; i < rows.length; i++) {
      var row_i = rows[i].children;
      for (let i = 0; i < row_i.length; i++) {
        row_i[i].style.display="none"
      }
    }

    for (let i = 0; i < rows.length; i++) {
      var row_i = rows[i].children;
      if (i < count) {
        for (let j = 0; j < row_i.length; j++) {
          row_i[j].style.display = "done";
        }
      }
      else if (i > count +5) {
        for (let j = 0; j < row_i.length; j++) {
          row_i[j].style.display = "done";
        }
      }
      else{
        for (let j = 0; j < row_i.length; j++) {
          row_i[j].style.display = "";
        }
      }
    }
  }, [count]);

  return (
    <div>
      <TableContainer>
        <Table id="reusabletable" variant="simple">
          {/* <TableCaption>Data Table</TableCaption> */}
          <Thead>
            <Tr>
              {headers.map((listValue, index) => {
                return <Th className="reusablechakrahead">{listValue}</Th>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            {vals.map((listValue, index) => {
              return (
                <Tr key={index}>
                  {listValue.map((item, i) => {
                    if (item.includes("http")) {
                      return (
                        <Td>
                          <Link to="/" className="chakrareusabletablebody">
                            {item}
                          </Link>
                        </Td>
                      );
                    } else {
                      return <Td>{item}</Td>;
                    }
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <button onClick={() => {
        if(count<6){
          setCount(0)
        }
        else{
          setCount(count - 5)
        }
      }}>back</button>
      <button onClick={() => {
        if(count>myData.length-5){
          // setCount(myData.length-5)
        }
        else{
          setCount(count + 5)
          // console.log('er')
          // if(count>myData.length-4){
          //   // console.log("erer")
          //   setCount(myData.length-5)
          // }
        }
      }}>forward</button>
    </div>
  );
};

export default ReusableTable;
