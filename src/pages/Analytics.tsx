import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';

// Mock data for charts
const callVolumeData = [
  {
    id: 'calls',
    data: [
      { x: 'Mon', y: 45 },
      { x: 'Tue', y: 52 },
      { x: 'Wed', y: 48 },
      { x: 'Thu', y: 61 },
      { x: 'Fri', y: 55 },
      { x: 'Sat', y: 32 },
      { x: 'Sun', y: 28 },
    ],
  },
];

const callTypeData = [
  { id: 'Inbound', value: 65, color: '#2196F3' },
  { id: 'Outbound', value: 35, color: '#FF4081' },
];

const trialUsageData = [
  { month: 'Jan', B2B: 45, B2C: 30 },
  { month: 'Feb', B2B: 52, B2C: 35 },
  { month: 'Mar', B2B: 48, B2C: 38 },
  { month: 'Apr', B2B: 61, B2C: 42 },
  { month: 'May', B2B: 55, B2C: 45 },
];

export default function Analytics() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Analytics Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select label="Time Range" defaultValue="7d">
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" sx={{ borderRadius: 2 }}>
            Export Report
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Call Volume Trend */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Call Volume Trend
              </Typography>
              <Box sx={{ height: 320 }}>
                <ResponsiveLine
                  data={callVolumeData}
                  margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                  xScale={{ type: 'point' }}
                  yScale={{ type: 'linear', min: 0, max: 'auto' }}
                  curve="cardinal"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                  }}
                  pointSize={10}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  pointLabelYOffset={-12}
                  enableArea={true}
                  areaOpacity={0.1}
                  useMesh={true}
                  colors={['#2196F3']}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Call Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Call Distribution
              </Typography>
              <Box sx={{ height: 320 }}>
                <ResponsivePie
                  data={callTypeData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  innerRadius={0.6}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ datum: 'data.color' }}
                  borderWidth={1}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                  enableArcLinkLabels={true}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor="#ffffff"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Trial Usage by Customer Type */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trial Usage by Customer Type
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveBar
                  data={trialUsageData}
                  keys={['B2B', 'B2C']}
                  indexBy="month"
                  margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
                  padding={0.3}
                  groupMode="grouped"
                  colors={['#2196F3', '#FF4081']}
                  borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  legends={[
                    {
                      dataFrom: 'keys',
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: false,
                      translateX: 120,
                      translateY: 0,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: 'left-to-right',
                      itemOpacity: 0.85,
                      symbolSize: 20,
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
