import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { Box, Tab, Tabs, Typography } from '@mui/material';

import PropTypes from 'prop-types';
import AdditionalBenefitsTable from '../../components/Table/Employee/AdditionalBenefitsTable';
import AdditionalLoansTable from '../../components/Table/Employee/AdditionalLoansTable';
import EmployeeContribution from '../../components/Table/Employee/EmployeeContribution';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
 }
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const HrEmployeesBenefits = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Layout title={"Employees Calendar"}>
            
            <div className="block" >
                <div className="block-content">
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Additional Benefits" {...a11yProps(0)} />
                                    <Tab label="Addtional Loans" {...a11yProps(1)} />
                                    <Tab label="Employee Contribution" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={value} index={0}>
                                <AdditionalBenefitsTable />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                            <AdditionalLoansTable />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                            <EmployeeContribution />
                            </TabPanel>
                        </Box>
                </div>
            </div>
        </Layout>
    )
}

export default HrEmployeesBenefits