import React, { useState } from 'react';
import { Container, Box, Tabs, Tab, Typography } from '@mui/material';
import Layout from '../components/Layout/Layout';
import BookSearch from '../components/Search/BookSearch';
import UserSearch from '../components/Search/UserSearch';

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index}>
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const SearchPage = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Layout>
            <Container maxWidth="lg">
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Search
                </Typography>
                
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="Books" />
                    <Tab label="Users" />
                </Tabs>
                
                <TabPanel value={tabValue} index={0}>
                    <BookSearch />
                </TabPanel>
                
                <TabPanel value={tabValue} index={1}>
                    <UserSearch />
                </TabPanel>
            </Container>
        </Layout>
    );
};

export default SearchPage;