import {Button, Card, CardContent, Grid, Skeleton, Typography} from "@mui/material";
import InnerTemperatures from "./InnerTemperatures";

function WeatherCards(props){
    const {
        card,
        loading,
        unit,
        showChart
    } = props;

    return(
        <Grid item key={card.dt} xs={12} sm={6} md={4}>
            <Card>
                <CardContent sx={{ flexGrow: 1 }}>
                    {
                        loading ? <Skeleton height={100} /> :
                            <Typography className="weather-average" variant="h4" component="div">
                                {
                                    `${Math.round(card.temperatures.reduce((a, b) => a + b) / card.temperatures.length)} ${unit === "metric" ? "℃" : "℉"} `
                                }
                                <span>(average)</span>
                            </Typography>
                    }

                    <Typography component="div" gutterBottom>
                        <Grid container>
                            {
                                card.icons.map((icon, idx) => {
                                    return (
                                        <InnerTemperatures
                                            key={idx}
                                            loading={loading}
                                            card={card}
                                            idx={idx}
                                            icon={icon}
                                            unit={unit}
                                        />
                                    )
                                })
                            }
                        </Grid>
                    </Typography>

                    {
                        loading ? <Skeleton height={40} /> :
                            <Typography gutterBottom variant="h5" component="div" marginTop className="text-center">
                                {new Date(card.result.dt_txt).toLocaleDateString("en-GB")}
                            </Typography>
                    }
                    {
                        loading ? <Skeleton height={40} /> :
                            <Button onClick={()=> showChart(card)} fullWidth variant="outlined">Select Me!</Button>
                    }

                </CardContent>
            </Card>
        </Grid>
    )

}
export default WeatherCards;