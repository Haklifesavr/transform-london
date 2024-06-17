import { Box, SimpleGrid, HStack, Stack, Text } from '@chakra-ui/react';
import ComplexTable from "views/admin/default/components/ComplexTable"
import BarChartComponent from "../default/components/DailyTraffic";
import Card from "components/card/Card";


const TableBoxView = ({ values, ceo, title, width }) => {
    return (
        <Box
            spacing={10}
            width={width}
            gap="20px"
            key={`${title}-table`}
        >
            {values
                .filter((object) => object && object.type === "TABLE" && object.title === title)
                .map((object) => {
                    return (
                        <ComplexTable
                            key={`${title}-complextable`}
                            pageName={ceo.states.selectedDashboard.name}
                            columnsData={object.columns}
                            tableData={object.rows}
                        />
                    );
                })}
        </Box>
    )
}
const BarBoxView = ({ values, title, width }) => {
    return (
        <Box
            key={`${title}-bar`}
            width={width}>
            {values
                .filter((object) => object && object.type === "BAR" && object.title === title)
                .map((object) => {
                    return (
                        object.series[0].data.every(element => element === 0) ? <></> :
                            <BarChartComponent
                                key={`${title}-complexbar`}
                                chartData={object.series}
                                chartOptions={object.options}
                            />
                    );
                })}
        </Box>
    )
}

const CombineView = ({ values, ceo, title, description, isLarge }) => {
    return (
        <Card direction={"column"}
            overflow="hidden"
            variant="outline">
            <Text
                color="#422AFB"
                fontWeight={"bold"}
                fontSize={{ base: "18px", md: "24px" }}
            >
                {title}
            </Text>
            <Text color="#A3AED0" fontSize={"14px"}>
                {description}
            </Text>
            <SimpleGrid columns={1} spacing="40px">
                {isLarge ?
                    <HStack >
                        <TableBoxView key={`${title}-table`} values={values} ceo={ceo} title={title} width="22vw" />
                        <BarBoxView key={`${title}-bar`} values={values} title={title} width="55vw" />
                    </HStack> :
                    <Stack >
                        <TableBoxView key={`${title}-table`} values={values} ceo={ceo} title={title} width="100%" />
                        <BarBoxView key={`${title}-bar`} values={values} title={title} width="100%" />
                    </Stack>
                }
            </SimpleGrid>
        </Card>

    )
}

export default CombineView

