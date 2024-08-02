import React, { useState } from 'react';
import { Box, Paper, Typography,Button } from '@mui/material';

const TabButton = ({ tab, tabValue, handleClick, isActive }) => {
  const buttonStyle = {
    cursor: 'pointer',
    backgroundColor: isActive ? '#185aa6' : '#d3e7ff',
    color: isActive ? 'white' : 'black',
    border: 'none',
    // padding: '8px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '12px',
    borderRadius:"10px 10px 0px 0px",
    // transition: 'margin-left 0.5s ease', // Added transition property
    // marginLeft: isActive ? '0px' : '5px', // Added marginLeft for active and inactive tabs
  };

  return (
    <Button style={buttonStyle} sx={{px:2}} size='small' onClick={() => handleClick(tab.value)}>
      <Typography className="nunito_font_width" fontWeight={'bold'} fontSize={"12px"}> {tab?.name}</Typography>
    </Button>
  );
};

const TabContent = ({ tab }) => {
  return (
    <Paper sx={{p:2,border:"1px solid #185aa6 " }}>
      <Box className="nunito_font_width" sx={{fontSize:'12px'}}>{tab?.content}
      </Box>
    </Paper>
  );
};

const Tabs = ({ tabs }) => {
  const [tabValue, setTabValue] = useState(tabs[0]?.value);

  const handleClickTab = (value) => {
    setTabValue(value);
  };

  const currentTab = tabs.find(tab => tab?.value === tabValue);

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', gap: '5px' }}>
        {tabs.map((tab) => (
          <TabButton
            key={tab?.value}
            tab={tab}
            tabValue={tabValue}
            handleClick={handleClickTab}
            isActive={tabValue === tab?.value}
          />
        ))}
      </Box>

      <TabContent tab={currentTab} />
    </Box>
  );
};

export default Tabs;
