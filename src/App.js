import './App.css';
import {useState, useEffect} from "react";
import Spinner from "./Components/Spinner";
import WeatherCards from "./Components/WeatherCards";
import {
    Alert,
    Snackbar,
    Container,
    Grid,
    Typography,
    CssBaseline,
    IconButton,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    Box,
    Skeleton
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
    const API_KEY = '404dcc2f1c8087d835711166d14ca85b';
    const [cityName, setCityName] = useState('');
    const [unit, setUnit] = useState('metric');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [chartData, setChartData] = useState([]);
    const [sliderIndex, setSliderIndex] = useState(0);
    const resultsGroupedByDay = [];

    function groupResultsByDay(results){
        let secondaryIndex = 0;
        results.map((result) => {
            if (resultsGroupedByDay.filter(e => e.date.split(" ")[0] === result.dt_txt.split(" ")[0]).length > 0) {
                resultsGroupedByDay[secondaryIndex - 1].icons.push(result.weather[0].icon);
                resultsGroupedByDay[secondaryIndex - 1].temperatures.push(result.main.feels_like);
                resultsGroupedByDay[secondaryIndex - 1].hours.push(result.dt_txt.split(" ")[1].split(":")[0]);
            }
            else{
                resultsGroupedByDay.push({
                    date: result.dt_txt.split(" ")[0],
                    icons: [result.weather[0].icon],
                    hours: [result.dt_txt.split(" ")[1].split(":")[0]],
                    temperatures: [result.main.feels_like],
                    result: result
                })
                secondaryIndex++;
            }
        })

        setResults(resultsGroupedByDay);
    }

    function getPosition() {
        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(res, rej);
        });
    }

    const refresh = async () => {
        try{
            //let position = await getPosition();
            //fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=${unit}`)
            // You can uncomment upper two lines of code and comment the fetch line below to get user geolocation for more precise results
                fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Munich,de&appid=${API_KEY}&units=${unit}`)
                .then(response => response.json())
                .then(data => {
                    if(parseInt(data.cod) !== 200){
                        setLoading(false);
                        setSnackbarMessage(data.message);
                        setSnackbarSeverity("error");
                        setShowSnackbar(true);
                    }
                    else{
                        setCityName(data.city.name);
                        setLoading(false);
                        setSnackbarMessage('Data successfully fetched!');
                        setSnackbarSeverity("success");
                        setShowSnackbar(true);
                        setChartData([]);
                        groupResultsByDay(data.list);
                    }
                })
                .catch((error) => {
                    setSnackbarMessage(error);
                    setSnackbarSeverity("error");
                    setChartData([]);
                    setShowSnackbar(true);
                });
        }
        catch (error){
            setSnackbarMessage(error.message);
            setSnackbarSeverity("error");
            setChartData([]);
            setShowSnackbar(true);
        }

    }
    useEffect(refresh, [unit])

    return (
      <>
          <div id="increment" onClick={() => {
              setChartData([]);
              setSliderIndex(prevState => prevState + 1);
          }}>+</div>

          <div id="decrement" onClick={() => {
              setChartData([]);
              setSliderIndex(prevState => prevState -1)
          }}>+</div>
          {
              loading ? <Spinner /> : <></>
          }
          <CssBaseline />
          <Snackbar
              open={showSnackbar}
              autoHideDuration={5000}
              message={snackbarMessage}
              severity={snackbarSeverity}
              onClose={() => setShowSnackbar(false)}
          >
              <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
                  {snackbarMessage}
              </Alert>
          </Snackbar>

          <Container maxWidth="lg">
              <Box mt={2} mb={2}>
                  {
                      loading ? <Skeleton /> :
                          <Grid id="header" container spacing={4}>
                              <Grid item xs={12}>
                                  <Typography variant="h5">
                                      Displaying results for {cityName}
                                      <IconButton onClick={() => {
                                          setLoading(true)
                                          refresh()
                                      }} color="primary" aria-label="refresh">
                                          <RefreshIcon />
                                      </IconButton>
                                  </Typography>
                                  <FormControl component="fieldset">
                                      <RadioGroup row
                                                  aria-label="unit"
                                                  name="row-radio-buttons-group"
                                                  value={unit}
                                                  onChange={(event) => {
                                                      setLoading(true);
                                                      setChartData([]);
                                                      setUnit(event.target.value);
                                                  }}
                                      >
                                          <FormControlLabel value="metric" control={<Radio />} label="Celsius" />
                                          <FormControlLabel value="imperial" control={<Radio />} label="Fahrenheit" />
                                      </RadioGroup>
                                  </FormControl>
                              </Grid>
                          </Grid>
                  }
              </Box>

              <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="center"
                  spacing={4}>
                  {results.slice(3 * sliderIndex,(3 * sliderIndex) + 3).map((card) =>
                      <WeatherCards
                          card={card}
                          loading={loading}
                          unit={unit}
                          showChart={(card) => {
                              let tempArray = [];
                              for(let i=0; i<card.temperatures.length; i++){
                                  tempArray.push({
                                      hour: `${card.hours[i]}:00`,
                                      temperature: Math.round(card.temperatures[i])
                                  })
                              }
                              setChartData(tempArray);
                              setTimeout(function (){
                                  window.scrollTo(0,document.body.scrollHeight);
                              }, 100)
                          }}
                      />)}
              </Grid>
              {
                  chartData.length === 0 ? <></> :
                      <Box mt={5} pt={3}>
                          <Grid container spacing={4}>
                              <ResponsiveContainer width="100%" height={400}>
                                  <BarChart margin={{ top: 30, right: 0, bottom: 5, left: -20}}  data={chartData}>
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="hour" />
                                      <YAxis dataKey="temperature"/>
                                      <Tooltip />
                                      <Legend wrapperStyle={{top: 0, left: 25}}/>
                                      <Bar name={`Temperature (${unit === "metric" ? "℃" : "℉"})`} type="monotone" dataKey="temperature" fill="#1976d2" />
                                  </BarChart>
                              </ResponsiveContainer>
                          </Grid>
                      </Box>
              }
          </Container>
      </>
  );
}
export default App;
